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

        if player_id in players:
            return False, "Player is already in the game."

        if len(players) >= MAX_PLAYERS:
            return False, "Game is full."

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


    def remove_player(self, player_id):

        state = self.get_state()

        player_id = str(player_id)

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
                        "a correct unanimous decision. "
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

        self.save_state(state)

        return state


    # ==================================================================
    # VOTING
    # ==================================================================

    def submit_vote(
        self,
        player_id,
        vote
    ):

        state = self.get_state()

        player_id = str(player_id)

        if player_id not in state["players"]:
            return False, "Player does not exist."

        if vote not in [
            "FLAG",
            "CONTINUE_INVESTIGATION",
        ]:
            return False, "Invalid vote."

        state["votes"][player_id] = vote

        self.save_state(state)

        return True, state


    def check_consensus(self):

        state = self.get_state()

        players = state["players"]

        votes = state["votes"]

        if len(votes) != len(players):
            return {
                "complete": False,
                "unanimous": False,
            }

        unanimous_flag = all(
            vote == "FLAG"
            for vote in votes.values()
        )

        return {
            "complete": True,
            "unanimous": unanimous_flag,
            "votes": votes,
        }


    # ==================================================================
    # END ROUND
    # ==================================================================

    def finish_round(self):

        state = self.get_state()

        consensus = self.check_consensus()

        if not consensus["complete"]:
            return False, "Not all players have voted."

        announcement = state[
            "announcement"
        ]

        correct_classification = (
            announcement["classification"]
        )

        # For the MVP, any unanimous FLAG
        # is considered a successful investigation.

        successful = (
            consensus["unanimous"]
        )

        result = {
            "round": state["round"],

            "successful": successful,

            "classification":
                correct_classification,

            "explanation":
                announcement["explanation"],

            "votes":
                state["votes"],
        }

        state["round_results"].append(
            result
        )

        # --------------------------------------------------------------
        # Score investigators
        # --------------------------------------------------------------

        if successful:

            for player_id, player in (
                state["players"].items()
            ):

                if player["role"] != "Imposter":

                    player["score"] += 1

                    state["scores"][
                        player_id
                    ] += 1

        self.save_state(state)

        return True, result


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