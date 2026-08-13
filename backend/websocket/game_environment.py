import random
from django.core.cache import cache


MAX_PLAYERS = 7
GAME_CACHE_TIMEOUT = 60 * 60


class GameEnvironment:

    INVESTIGATOR_ROLES = [
        "Detective",
        "Researcher",
        "Source Investigator",
        "Image Investigator",
        "Data Analyst",
        "Media Literacy Analyst",
    ]

    ROLE_CHALLENGES = {
        "Detective": [
            "Check the dates mentioned in the announcement.",
            "Check whether the names and organizations are correct.",
            "Look for inconsistencies in locations and events.",
            "Identify contradictions between different parts of the announcement.",
        ],

        "Researcher": [
            "Verify the main claim using reliable sources.",
            "Look for confirmation from an official organization.",
            "Determine whether credible sources support the announcement.",
            "Compare the claim with information from trusted sources.",
        ],

        "Source Investigator": [
            "Determine where the information originally came from.",
            "Trace the source of the announcement.",
            "Check whether the cited source actually exists.",
            "Determine whether the source is credible and authoritative.",
        ],

        "Image Investigator": [
            "Determine whether the image matches the announcement.",
            "Look for signs that the image is edited or manipulated.",
            "Check whether the image is being used out of context.",
            "Investigate whether the image originated from another event.",
        ],

        "Data Analyst": [
            "Check whether the statistics are accurate.",
            "Look for misleading graphs or numerical claims.",
            "Determine whether the numbers have enough context.",
            "Compare the presented statistics with reliable data.",
        ],

        "Media Literacy Analyst": [
            "Identify emotional or manipulative language.",
            "Look for clickbait or sensational wording.",
            "Identify false urgency or pressure to share.",
            "Check whether the wording attempts to influence the reader.",
        ],
    }

    ANNOUNCEMENTS = [
        {
            "id": 1,
            "title": "Class Suspension Announcement",
            "content": (
                "IMPORTANT ANNOUNCEMENT: Due to severe weather "
                "conditions, all classes in the municipality are "
                "suspended tomorrow. This announcement has been "
                "confirmed by the Department of Education. "
                "Please share this information with your classmates."
            ),
            "classification": "MISLEADING",
            "explanation": (
                "The announcement uses an official-sounding claim "
                "but does not provide a verifiable official source."
            ),
        },

        {
            "id": 2,
            "title": "Viral Health Announcement",
            "content": (
                "BREAKING: Experts confirm that drinking a special "
                "mixture every morning can completely prevent illness. "
                "Share this with everyone immediately!"
            ),
            "classification": "FALSE/HOAX",
            "explanation": (
                "The claim provides no credible evidence and uses "
                "sensational language to encourage sharing."
            ),
        },

        {
            "id": 3,
            "title": "Government Announcement",
            "content": (
                "The government has announced a new public service "
                "program beginning next month."
            ),
            "classification": "TRUE",
            "explanation": (
                "The announcement is supported by reliable official "
                "sources."
            ),
        },

        {
            "id": 4,
            "title": "Flood Photo Announcement",
            "content": (
                "SHARE THIS NOW: Photo shows the town plaza already "
                "underwater because of today's heavy rain. Evacuate "
                "while you still can!"
            ),
            "classification": "OUT_OF_CONTEXT",
            "explanation": (
                "The photo is real, but it was taken during a flood "
                "in a different province three years ago and has "
                "nothing to do with today's weather."
            ),
        },

        {
            "id": 5,
            "title": "Crime Rate Announcement",
            "content": (
                "Crime in our town has skyrocketed by 300% this year, "
                "according to a new report. Our streets are no longer "
                "safe."
            ),
            "classification": "MISLEADING",
            "explanation": (
                "The '300%' figure is technically correct but "
                "compares a very small baseline (2 incidents to 8), "
                "and ignores that overall crime for the year is flat. "
                "The statistic is accurate but presented without "
                "context to appear alarming."
            ),
        },
    ]

    def __init__(self, lobby_id):

        self.lobby_id = str(lobby_id)

        self.cache_key = (
            f"game_environment_{self.lobby_id}"
        )


    # ==================================================================
    # STATE
    # ==================================================================

    def get_state(self):

        return cache.get(
            self.cache_key,
            self.default_state()
        )


    def save_state(self, state):

        cache.set(
            self.cache_key,
            state,
            timeout=GAME_CACHE_TIMEOUT
        )


    @staticmethod
    def default_state():

        return {
            "status": "waiting",

            "round": 0,

            "max_rounds": 5,

            "phase": "waiting",

            "players": {},

            "imposter_id": None,

            "announcement": None,

            "roles_assigned": False,

            "challenges": {},

            "evidence": {},

            "votes": {},

            "ready_players": [],

            "round_results": [],

            "scores": {},

        }


    # ==================================================================
    # PLAYERS
    # ==================================================================

    def add_player(self, player):

        state = self.get_state()

        players = state["players"]

        player_id = str(player["id"])

        # --------------------------------------------------------------
        # Reconnect case: player already exists in the GameEnvironment
        # (e.g. game is in progress and they refreshed the page). Don't
        # clobber their role/score — just update their display info.
        # --------------------------------------------------------------

        if player_id in players:

            existing = players[player_id]

            existing["name"] = player["name"]

            existing["location"] = player.get(
                "location",
                existing.get(
                    "location",
                    {"x": 0, "y": 0},
                )
            )

            self.save_state(state)

            return True, state

        if len(players) >= MAX_PLAYERS:
            return False, "Game is full."

        if state["status"] == "playing":
            # Game already started — no seats for brand new players.
            return False, "Game has already started."

        players[player_id] = {
            "id": player_id,
            "user_id": player.get(
                "user_id",
                player_id
            ),
            "name": player["name"],
            "location": player.get(
                "location",
                {
                    "x": 0,
                    "y": 0,
                }
            ),
            "role": None,
            "score": 0,
        }

        state["scores"][player_id] = 0

        self.save_state(state)

        return True, state


    def remove_player(self, player_id, force=False):
        """
        Remove a player from the game.

        During an active game (status == "playing"), a disconnect is
        very likely just a page reload / dropped socket — not the
        player quitting. Wiping their role and score in that case is
        what causes "reload = lost your role" bugs. So while a game is
        playing, we keep their seat intact unless `force=True` is
        passed explicitly (e.g. a genuine "leave game" action).

        While still in the lobby ("waiting"), disconnecting really
        does mean they're gone, so we remove them normally.
        """

        state = self.get_state()

        player_id = str(player_id)

        if state["status"] == "playing" and not force:
            # Keep player/role/score. Nothing to do.
            return state

        state["players"].pop(
            player_id,
            None
        )

        state["scores"].pop(
            player_id,
            None
        )

        if state["imposter_id"] == player_id:
            state["imposter_id"] = None

        self.save_state(state)

        return state


    def player_count(self):

        state = self.get_state()

        return len(
            state["players"]
        )


    # ==================================================================
    # SCORE SNAPSHOT (for live scoreboard, not just the final screen)
    # ==================================================================

    def get_score_snapshot(self):
        """
        Current investigator score vs. the score needed to win, usable
        at any point mid-game — not just once the game has finished.
        Only investigators ever accumulate points; the imposter's "win"
        condition is investigators failing to reach `required` by the
        time max_rounds runs out, not points of their own.
        """

        state = self.get_state()

        investigator_scores = [
            player["score"]
            for player in state["players"].values()
            if player["role"] != "Imposter"
        ]

        investigator_score = sum(investigator_scores)

        required = (
            state["max_rounds"] // 2
        ) + 1

        return investigator_score, required


    # ==================================================================
    # RESUME (for reconnects mid-game)
    # ==================================================================

    def get_resume_payload(self, player_id):
        """
        Build the payload a reconnecting client needs to rebuild its
        UI without waiting for the next broadcast event. Returns None
        if there's nothing to resume (no game started yet, or the
        player has no record — e.g. they were never actually seated).
        """

        state = self.get_state()

        player_id = str(player_id)

        player = state["players"].get(player_id)

        if not player or state["status"] == "waiting":
            return None

        votes = state["votes"]

        investigator_score, required_score = (
            self.get_score_snapshot()
        )

        return {
            "status": state["status"],

            "round": state["round"],

            "phase": state["phase"],

            "announcement": state["announcement"],

            "role": player["role"],

            "challenge": state["challenges"].get(player_id),

            "evidence": state["evidence"],

            "votes": votes,

            "votes_cast": len(votes),

            "player_count": len(state["players"]),

            "investigator_score": investigator_score,

            "required_score": required_score,

            "last_round_result": (
                state["round_results"][-1]
                if state["round_results"]
                else None
            ),

            "final_result": (
                self.get_final_result()
                if state["status"] == "finished"
                else None
            ),
        }


    # ==================================================================
    # START GAME
    # ==================================================================

    def start_game(self):

        state = self.get_state()

        players = list(
            state["players"].values()
        )

        player_count = len(players)

        if player_count < 2:
            return False, (
                "At least 2 players are required "
                "to start the game."
            )

        if state["status"] == "playing":
            return False, "Game has already started."

        # --------------------------------------------------------------
        # Randomize Imposter
        # --------------------------------------------------------------

        imposter = random.choice(
            players
        )

        state["imposter_id"] = (
            imposter["id"]
        )

        # --------------------------------------------------------------
        # Assign investigator roles
        # --------------------------------------------------------------

        investigator_players = [
            player
            for player in players
            if player["id"] != imposter["id"]
        ]

        roles = self.get_roles_for_player_count(
            len(investigator_players)
        )

        random.shuffle(roles)

        for player, role in zip(
            investigator_players,
            roles
        ):

            player["role"] = role

        # Assign Imposter role

        imposter["role"] = "Imposter"

        # --------------------------------------------------------------
        # Generate challenges
        # --------------------------------------------------------------

        state["challenges"] = {}

        for player in players:

            if player["role"] == "Imposter":

                state["challenges"][
                    player["id"]
                ] = {
                    "title": "Disrupt the investigation",
                    "instructions": (
                        "Prevent the group from reaching "
                        "a correct majority decision. "
                        "Question valid evidence and "
                        "defend questionable information."
                    ),
                }

            else:

                state["challenges"][
                    player["id"]
                ] = self.generate_challenge(
                    player["role"]
                )

        state["roles_assigned"] = True

        state["status"] = "playing"

        state["round"] = 1

        state["phase"] = "investigation"

        state["announcement"] = (
            self.get_random_announcement()
        )

        state["votes"] = {}

        state["ready_players"] = []

        state["evidence"] = {}

        self.save_state(state)

        return True, state


    # ==================================================================
    # ROLE SELECTION
    # ==================================================================

    def get_roles_for_player_count(
        self,
        investigator_count
    ):

        roles = self.INVESTIGATOR_ROLES.copy()

        random.shuffle(roles)

        # If there are fewer investigators than
        # available roles, only use what we need.

        return roles[
            :investigator_count
        ]


    # ==================================================================
    # CHALLENGE
    # ==================================================================

    def generate_challenge(
        self,
        role
    ):

        challenges = self.ROLE_CHALLENGES.get(
            role,
            []
        )

        if not challenges:
            return {
                "title": "Investigate the information",
                "instructions": (
                    "Look for evidence that helps "
                    "determine whether the information "
                    "is trustworthy."
                ),
            }

        return {
            "title": f"{role} Challenge",

            "instructions": random.choice(
                challenges
            ),
        }


    # ==================================================================
    # ANNOUNCEMENT
    # ==================================================================

    def get_random_announcement(self):

        return random.choice(
            self.ANNOUNCEMENTS
        )


    # ==================================================================
    # ROUND
    # ==================================================================

    def start_round(self):

        state = self.get_state()

        state["phase"] = "investigation"

        state["announcement"] = (
            self.get_random_announcement()
        )

        state["evidence"] = {}

        state["votes"] = {}

        self.save_state(state)

        return state


    # ==================================================================
    # EVIDENCE
    # ==================================================================

    def add_evidence(
        self,
        player_id,
        evidence
    ):

        state = self.get_state()

        player_id = str(player_id)

        if player_id not in state["players"]:
            return False

        if player_id not in state["evidence"]:
            state["evidence"][player_id] = []

        state["evidence"][player_id].append(
            evidence
        )

        self.save_state(state)

        return True


    # ==================================================================
    # PHASE
    # ==================================================================

    def set_phase(self, phase):

        state = self.get_state()

        state["phase"] = phase

        # Entering the consensus/voting phase should start with a
        # clean ballot, in case this round's votes were somehow
        # already populated (e.g. a phase re-trigger).
        if phase == "consensus":
            state["votes"] = {}

        self.save_state(state)

        return state


    # ==================================================================
    # VOTING
    # ==================================================================

    # These must match the "classification" values used in ANNOUNCEMENTS
    # exactly, since a round is scored by checking verdict == classification.
    VALID_VOTES = [
        "TRUE",
        "MISLEADING",
        "FALSE/HOAX",
        "OUT_OF_CONTEXT",
        "CONTINUE_INVESTIGATION",
    ]

    def submit_vote(
        self,
        player_id,
        vote
    ):

        state = self.get_state()

        player_id = str(player_id)

        if player_id not in state["players"]:
            return False, "Player does not exist."

        if state["phase"] != "consensus":
            return False, "Voting is not open right now."

        if vote not in self.VALID_VOTES:
            return False, "Invalid vote."

        state["votes"][player_id] = vote

        self.save_state(state)

        return True, state


    def check_consensus(self):
        """
        Five-way vote: TRUE / MISLEADING / FALSE/HOAX / OUT_OF_CONTEXT /
        CONTINUE_INVESTIGATION.

        The round only RESOLVES if one of the four real classification
        options has a strict majority (> half of all players).
        CONTINUE_INVESTIGATION winning, a tie, or a plurality that isn't
        a majority all count as INCONCLUSIVE.
        """

        state = self.get_state()

        players = state["players"]

        votes = state["votes"]

        total = len(players)

        votes_cast = len(votes)

        if votes_cast != total:
            return {
                "complete": False,
                "resolved": False,
                "verdict": None,
                "tally": None,
                "votes_cast": votes_cast,
                "total": total,
            }

        tally = {option: 0 for option in self.VALID_VOTES}

        for vote in votes.values():
            if vote in tally:
                tally[vote] += 1

        leading_option, leading_count = max(
            tally.items(), key=lambda kv: kv[1]
        )

        has_majority = leading_count > (total / 2)

        resolved = (
            has_majority
            and leading_option != "CONTINUE_INVESTIGATION"
        )

        return {
            "complete": True,
            "resolved": resolved,
            "verdict": leading_option if resolved else None,
            "tally": tally,
            "votes_cast": votes_cast,
            "total": total,
        }


    # ==================================================================
    # END ROUND
    # ==================================================================

    def finish_round(self):
        """
        Called automatically the instant the last vote comes in.

        Returns (True, payload) on success, where payload is either:
          {"inconclusive": True, "tally": {...}}
          {"inconclusive": False, "result": {...}}
        """

        state = self.get_state()

        consensus = self.check_consensus()

        if not consensus["complete"]:
            return False, "Not all players have voted."

        # ----------------------------------------------------------------
        # INCONCLUSIVE: no strict majority for a real classification.
        # Clear the ballot and drop back into investigation so players
        # can gather more evidence and call another vote.
        # ----------------------------------------------------------------

        if not consensus["resolved"]:

            state["votes"] = {}

            state["phase"] = "investigation"

            self.save_state(state)

            return True, {
                "inconclusive": True,
                "tally": consensus["tally"],
            }

        # ----------------------------------------------------------------
        # RESOLVED: verdict is one of the four real classifications, so
        # scoring is a direct match against the announcement's truth.
        # ----------------------------------------------------------------

        announcement = state["announcement"]

        correct_classification = announcement["classification"]

        verdict = consensus["verdict"]

        successful = verdict == correct_classification

        result = {
            "round": state["round"],

            "successful": successful,

            "verdict": verdict,

            "classification": correct_classification,

            "explanation": announcement["explanation"],

            "votes": state["votes"],

            "tally": consensus["tally"],
        }

        state["round_results"].append(result)

        if successful:

            for player_id, player in state["players"].items():

                if player["role"] != "Imposter":

                    player["score"] += 1

                    state["scores"][player_id] += 1

        state["phase"] = "result"

        self.save_state(state)

        investigator_score, required_score = (
            self.get_score_snapshot()
        )

        result["investigator_score"] = investigator_score

        result["required_score"] = required_score

        return True, {
            "inconclusive": False,
            "result": result,
        }


    # ==================================================================
    # NEXT ROUND
    # ==================================================================

    def next_round(self):

        state = self.get_state()

        if state["round"] >= state["max_rounds"]:

            state["status"] = "finished"

            state["phase"] = "finished"

            self.save_state(state)

            return state

        state["round"] += 1

        state["phase"] = "investigation"

        state["announcement"] = (
            self.get_random_announcement()
        )

        state["evidence"] = {}

        state["votes"] = {}

        self.save_state(state)

        return state


    # ==================================================================
    # FINAL RESULT
    # ==================================================================

    def get_final_result(self):

        state = self.get_state()

        investigator_scores = [
            player["score"]
            for player in
            state["players"].values()
            if player["role"] != "Imposter"
        ]

        investigator_score = sum(
            investigator_scores
        )

        required = (
            state["max_rounds"] // 2
        ) + 1

        investigators_win = (
            investigator_score >= required
        )

        return {
            "winner": (
                "investigators"
                if investigators_win
                else "imposter"
            ),

            "investigator_score":
                investigator_score,

            "required_score":
                required,

            "rounds":
                state["round_results"],

            "imposter_id":
                state["imposter_id"],

            "players":
                state["players"],
        }