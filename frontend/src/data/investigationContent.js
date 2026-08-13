/**
 * Per-announcement investigation content.
 *
 * The backend (GameEnvironment.ANNOUNCEMENTS) keeps `classification` and
 * `explanation` secret until the round ends. This file only holds *flavor*
 * clues the player can dig up in-world — enough to reason about the
 * announcement, never the answer outright.
 *
 * Keyed by the announcement `id` sent from the backend inside
 * `game_started.announcement` / `next_round.announcement`.
 */

const investigationContent = {
    1: {
        // "Class Suspension Announcement" (MISLEADING)
        library: {
            title: "Reference Shelf — Verifying Advisories",
            passage:
                "Official class-suspension advisories in this region are " +
                "always mirrored on the Department of Education's verified " +
                "social media accounts and the local government's official " +
                "page within minutes of being issued. A copy circulating " +
                "only in group chats, with no matching post on an official " +
                "channel, is a common pattern in misleading advisories.",
        },
        tv: {
            title: "Channel 4 — Local News Ticker",
            broadcast:
                "BREAKING: Our newsroom has not received any severe " +
                "weather bulletin for this municipality as of this hour. " +
                "Viewers are advised to confirm any suspension notice " +
                "directly with their school before staying home.",
        },
        computer: {
            searchResults: [
                {
                    title: "DepEd Regional Office — Official Facebook Page",
                    snippet:
                        "No advisory matching this announcement has been " +
                        "posted on the official page in the last 24 hours.",
                    verdictHint: "no-match",
                },
                {
                    title: "Class Suspension Checker (unofficial app)",
                    snippet:
                        "No listing found for this municipality today. " +
                        "Note: this app is community-run and not official.",
                    verdictHint: "no-match",
                },
                {
                    title: "PAGASA-style Weather Bulletin",
                    snippet:
                        "No severe weather warning currently in effect for " +
                        "this area.",
                    verdictHint: "no-match",
                },
                {
                    title: "Random forum post",
                    snippet:
                        "'My cousin said classes are suspended too, so it " +
                        "must be true!' — unverified, anecdotal.",
                    verdictHint: "weak-support",
                },
            ],
        },
    },

    2: {
        // "Viral Health Announcement" (FALSE / HOAX)
        library: {
            title: "Reference Shelf — Evaluating Health Claims",
            passage:
                "Credible health claims are backed by peer-reviewed " +
                "studies or statements from recognized medical bodies, and " +
                "they rarely promise a single remedy 'completely prevents' " +
                "illness. Urgent language pushing you to share immediately, " +
                "without citing a source, is a hallmark of health " +
                "misinformation.",
        },
        tv: {
            title: "Channel 4 — Health Desk",
            broadcast:
                "Our health correspondent notes that no medical " +
                "association has endorsed the 'morning mixture' claim " +
                "currently spreading online. Viewers are urged not to " +
                "self-medicate based on unverified posts.",
        },
        computer: {
            searchResults: [
                {
                    title: "Department of Health — Mythbusters Page",
                    snippet:
                        "No single food or drink mixture has been shown to " +
                        "'completely prevent' illness. Claims like this " +
                        "should be treated as misinformation.",
                    verdictHint: "no-match",
                },
                {
                    title: "Fact-check aggregator",
                    snippet:
                        "This exact claim has circulated in several " +
                        "variations since last year, each time debunked.",
                    verdictHint: "no-match",
                },
                {
                    title: "Personal wellness blog",
                    snippet:
                        "'I tried it and I feel great!' — a single " +
                        "anecdote, not clinical evidence.",
                    verdictHint: "weak-support",
                },
                {
                    title: "Reposted copy of the same announcement",
                    snippet:
                        "Identical wording to the original post, shared by " +
                        "a different account claiming to be 'independent " +
                        "confirmation.'",
                    verdictHint: "false-corroboration",
                },
            ],
        },
    },

    3: {
        // "Government Announcement" (TRUE)
        library: {
            title: "Reference Shelf — Official Gazette",
            passage:
                "Programs of this kind are typically pre-announced in " +
                "budget documents or agency work plans well before a " +
                "public rollout, and are logged in the official gazette " +
                "once approved.",
        },
        tv: {
            title: "Channel 4 — Government Affairs",
            broadcast:
                "A press briefing confirming this program was held this " +
                "morning, with the agency spokesperson answering " +
                "questions from accredited reporters.",
        },
        computer: {
            searchResults: [
                {
                    title: "Official Gazette — Program Listing",
                    snippet:
                        "Entry matches the announcement, filed under this " +
                        "quarter's approved public programs.",
                    verdictHint: "match",
                },
                {
                    title: "Agency Press Release",
                    snippet:
                        "Full press release with launch date, budget, and " +
                        "named officials, matching the announcement.",
                    verdictHint: "match",
                },
                {
                    title: "Independent news coverage",
                    snippet:
                        "Two separate outlets cover the same briefing with " +
                        "consistent details.",
                    verdictHint: "match",
                },
            ],
        },
    },
};

export default investigationContent;