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
 *
 * Each object entry may include:
 *  - bestFor: roles this object's content is most directly written for
 *             (used only as a soft in-world hint, never a verdict)
 *
 * Design intent per object type — kept consistent across ALL announcements,
 * true or false, so players learn to read the *type* of source rather than
 * memorize which building is "the correct one":
 *  - library:  reference material, generally reliable and neutral
 *  - tv:       official broadcast desk, generally reliable, low drama
 *  - bulletin: physical noticeboard / official postings, most reliable,
 *              driest in tone
 *  - radio:    tabloid drive-time show, ALWAYS sensational — great for
 *              spotting manipulative language, risky if taken at face value
 *  - computer: open web search, a genuine mix of solid sources, weak
 *              anecdotes, and outright false corroboration
 */

const investigationContent = {
    1: {
        // "Class Suspension Announcement" (MISLEADING)
        library: {
            title: "Reference Shelf — Verifying Advisories",
            bestFor: ["Researcher", "Source Investigator"],
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
            bestFor: ["Detective", "Researcher"],
            broadcast:
                "BREAKING: Our newsroom has not received any severe " +
                "weather bulletin for this municipality as of this hour. " +
                "Viewers are advised to confirm any suspension notice " +
                "directly with their school before staying home.",
        },
        bulletin: {
            title: "Municipal Noticeboard",
            bestFor: ["Detective", "Source Investigator"],
            notice:
                "No class-suspension notice has been posted on this board " +
                "today. The most recent posting is a road-closure notice " +
                "from last week, dated and signed by the barangay office.",
        },
        radio: {
            title: "Radyo Bayan — Drive-Time Show",
            bestFor: ["Media Literacy Analyst"],
            broadcast:
                "\"Better safe than sorry, mga kaibigan! A LOT of people " +
                "are saying classes are suspended, so huwag na kayong " +
                "magpaalam pa, wag na pumasok! Share this NOW so no one " +
                "gets left out!\" — the host cites no source, just what " +
                "'a lot of people are saying.'",
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
            bestFor: ["Researcher"],
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
            bestFor: ["Detective", "Researcher"],
            broadcast:
                "Our health correspondent notes that no medical " +
                "association has endorsed the 'morning mixture' claim " +
                "currently spreading online. Viewers are urged not to " +
                "self-medicate based on unverified posts.",
        },
        bulletin: {
            title: "Barangay Health Center Noticeboard",
            bestFor: ["Detective", "Source Investigator"],
            notice:
                "No flyer endorsing this mixture is posted here. The " +
                "center's own flyer instead reminds residents to consult a " +
                "doctor before trying any home remedy shared online.",
        },
        radio: {
            title: "Radyo Bayan — Wellness Segment",
            bestFor: ["Media Literacy Analyst"],
            broadcast:
                "\"I know SO many people who swear by this, and honestly, " +
                "what's the harm in trying? My tita drinks it every " +
                "morning and she hasn't been sick in years!\" — the host " +
                "offers personal anecdotes, not evidence.",
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
            bestFor: ["Researcher", "Source Investigator"],
            passage:
                "Programs of this kind are typically pre-announced in " +
                "budget documents or agency work plans well before a " +
                "public rollout, and are logged in the official gazette " +
                "once approved.",
        },
        tv: {
            title: "Channel 4 — Government Affairs",
            bestFor: ["Detective", "Researcher"],
            broadcast:
                "A press briefing confirming this program was held this " +
                "morning, with the agency spokesperson answering " +
                "questions from accredited reporters.",
        },
        bulletin: {
            title: "Municipal Noticeboard",
            bestFor: ["Detective", "Source Investigator"],
            notice:
                "An official notice matching this announcement is posted " +
                "here, dated and signed by the mayor's office, with a " +
                "program start date matching what was announced.",
        },
        radio: {
            title: "Radyo Bayan — Morning Show",
            bestFor: ["Media Literacy Analyst"],
            broadcast:
                "\"This is going to change EVERYTHING for our town, " +
                "folks — the biggest program we've ever seen!\" — the " +
                "host's tone is exaggerated, but the underlying facts " +
                "match what's posted officially. Sensational delivery " +
                "doesn't automatically mean a claim is false.",
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

    4: {
        // "Flood Photo Announcement" (OUT_OF_CONTEXT)
        library: {
            title: "Reference Shelf — Checking Viral Photos",
            bestFor: ["Image Investigator"],
            passage:
                "A quick way to check a viral photo is to search for that " +
                "exact image elsewhere online. If the same photo turns up " +
                "in older, unrelated articles, it's likely being reused " +
                "out of context rather than showing a current event.",
        },
        tv: {
            title: "Channel 4 — Weather Desk",
            bestFor: ["Detective", "Image Investigator"],
            broadcast:
                "Our meteorologist confirms today is a normal rain day for " +
                "the season — no flooding has been reported in the town " +
                "plaza as of this hour.",
        },
        bulletin: {
            title: "Municipal Flood Watch Board",
            bestFor: ["Detective", "Source Investigator"],
            notice:
                "No flood watch or evacuation order has been posted here " +
                "today. This board is updated by municipal workers " +
                "whenever a watch is issued.",
        },
        radio: {
            title: "Radyo Bayan — Caller-In Segment",
            bestFor: ["Media Literacy Analyst"],
            broadcast:
                "\"A caller just told us the WHOLE plaza is underwater, " +
                "everyone needs to evacuate NOW!\" — the host repeats an " +
                "unverified caller's claim on air without checking it " +
                "first.",
        },
        computer: {
            searchResults: [
                {
                    title: "Reverse Image Search — Match Found",
                    snippet:
                        "The exact same photo appears in a news article " +
                        "from three years ago, covering a flood in a " +
                        "different province.",
                    verdictHint: "no-match",
                },
                {
                    title: "Local Facebook group repost",
                    snippet:
                        "The same uncredited photo, reposted as if it were " +
                        "taken 'today', with no original source linked.",
                    verdictHint: "false-corroboration",
                },
                {
                    title: "Municipal weather station log",
                    snippet:
                        "Rainfall levels logged today are within normal " +
                        "range for this time of year; no flood alert " +
                        "triggered.",
                    verdictHint: "no-match",
                },
            ],
        },
    },

    5: {
        // "Crime Rate Announcement" (MISLEADING — technically-true statistic)
        library: {
            title: "Reference Shelf — Reading Statistics",
            bestFor: ["Data Analyst"],
            passage:
                "Percentages can look dramatic without context. A jump " +
                "from 2 incidents to 8 is a 300% increase, but against a " +
                "population of tens of thousands, that's still a very low " +
                "base rate. Always ask what the original numbers were " +
                "before trusting a percentage on its own.",
        },
        tv: {
            title: "Channel 4 — Public Safety Desk",
            bestFor: ["Detective", "Data Analyst"],
            broadcast:
                "The full police blotter for the year, which we obtained " +
                "in full, shows overall crime trending flat — the cited " +
                "figure was for one specific, minor category, not crime " +
                "overall.",
        },
        bulletin: {
            title: "Police Station Public Notice Board",
            bestFor: ["Detective", "Data Analyst"],
            notice:
                "The full statistics report is posted here, including the " +
                "raw incident counts by category, not just the headline " +
                "percentage.",
        },
        radio: {
            title: "Radyo Bayan — Talk Segment",
            bestFor: ["Media Literacy Analyst"],
            broadcast:
                "\"Crime is OUT OF CONTROL, folks — 300%! It's time to " +
                "demand action NOW before it's too late!\" — the host " +
                "repeats the raw percentage with no mention of the " +
                "underlying incident counts.",
        },
        computer: {
            searchResults: [
                {
                    title: "Official Police Report (full PDF)",
                    snippet:
                        "Raw numbers: 2 incidents last year, 8 this year, " +
                        "in one specific minor category. Overall crime " +
                        "count for the town is roughly flat year-over-year.",
                    verdictHint: "match",
                },
                {
                    title: "Social post repeating the headline",
                    snippet:
                        "'300% crime increase!!' shared without the " +
                        "original report or any raw numbers attached.",
                    verdictHint: "false-corroboration",
                },
                {
                    title: "Comment thread",
                    snippet:
                        "'This stat is completely made up, don't believe " +
                        "any of it.' — an equally unverified claim in the " +
                        "opposite direction; the original report is real, " +
                        "just missing context.",
                    verdictHint: "weak-support",
                },
            ],
        },
    },
};

export default investigationContent;