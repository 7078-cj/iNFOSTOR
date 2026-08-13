/**
 * Per-announcement dialogue for each NPC.
 * Some testimony helps investigators; others spread rumors.
 */

const npcDialogue = {
    1: {
        "npc-maria": {
            bestFor: ["Researcher", "Source Investigator"],
            greeting: "Can I help you verify something?",
            lines: [
                "I've checked our reference shelf — no official DepEd advisory matches what's circulating.",
                "Real suspension notices always appear on verified government pages within minutes.",
            ],
            testimony:
                "Maria (Librarian): No official suspension advisory found in reference materials or government channels.",
        },
        "npc-jun": {
            bestFor: ["Detective", "Researcher"],
            greeting: "The newsroom is buzzing about that post.",
            lines: [
                "Our wire desk hasn't received any confirmation from the regional education office.",
                "I'd hold off reporting until someone gets an on-record statement.",
            ],
            testimony:
                "Jun (Reporter): Regional press desk has not confirmed any class suspension order.",
        },
        "npc-rosa": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Ay, everyone's talking about classes!",
            lines: [
                "My customers say their kids already heard — must be true, no?",
                "I forwarded the message too, just to be safe!",
            ],
            testimony:
                "Aling Rosa (Vendor): Claims she heard from customers that classes are suspended — cites no official source, admits she reshared the message.",
        },
        "npc-santos": {
            bestFor: ["Detective"],
            greeting: "In my thirty years teaching, we always waited for official word.",
            lines: [
                "Schools never rely on group chat screenshots alone.",
                "Call the school directly — that's what we always told parents.",
            ],
            testimony:
                "Mr. Santos (Retired Teacher): Advises verifying suspension notices through schools, not group chats.",
        },
        "npc-kyle": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Bro, my whole class group chat is going crazy.",
            lines: [
                "Like five people said their cousin confirmed it…",
                "I haven't checked the DepEd page though.",
            ],
            testimony:
                "Kyle (Student): Heard suspension rumors from classmates — admits he has not checked official sources.",
        },
        "npc-pat": {
            bestFor: ["Researcher"],
            greeting: "I ran it through the fact-check kiosk for fun.",
            lines: [
                "Zero matches on verified DepEd accounts in the last 48 hours.",
                "The letterhead in the screenshot looks recycled from an old memo.",
            ],
            testimony:
                "Pat (Tech Intern): Fact-check kiosk shows no matching DepEd advisory; letterhead may be reused.",
        },
        "npc-ana": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "People keep showing me that post over coffee.",
            lines: [
                "One customer said 'better safe than sorry' and shared it with everyone.",
                "Nobody actually read past the headline.",
            ],
            testimony:
                "Ana (Barista): Overheard customers sharing suspension post without reading or verifying it.",
        },
        "npc-ben": {
            bestFor: ["Detective"],
            greeting: "Nothing unusual out here today.",
            lines: [
                "School buses passed on schedule this morning.",
                "No emergency vehicles, no crowd of parents picking up kids.",
            ],
            testimony:
                "Ben (Guard): Observed normal school bus traffic — no signs of emergency suspension activity.",
        },
        "npc-cruz": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "I'm NOT taking any chances with my children!",
            lines: [
                "If even one person says classes are off, I'm keeping them home!",
                "Why wait for official confirmation when you can protect your kids now?",
            ],
            testimony:
                "Mrs. Cruz (Parent): Plans to keep children home based on unverified rumors — emotional reasoning, no official confirmation.",
        },
        "npc-marco": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "The phones are lighting up!",
            lines: [
                "Listeners are CALLING IN saying they heard it's true!",
                "We haven't verified yet but the energy is HUGE!",
            ],
            testimony:
                "Marco (Radio Host): Repeating unverified caller claims on air — admits nothing has been confirmed.",
        },
        "npc-elena": {
            bestFor: ["Source Investigator"],
            greeting: "I handle the official filings.",
            lines: [
                "No emergency proclamation related to schools was logged today.",
                "If classes were suspended, we'd have a document within the hour.",
            ],
            testimony:
                "Elena (Records Clerk): No school or weather emergency filing logged in municipal records today.",
        },
        "npc-dex": {
            bestFor: ["Detective"],
            greeting: "I drive past three schools every morning.",
            lines: [
                "All gates were open, kids walking in like normal.",
                "Nobody mentioned any suspension on my route.",
            ],
            testimony:
                "Dex (Driver): Saw normal school activity this morning — no indication of suspension.",
        },
    },

    2: {
        "npc-maria": {
            bestFor: ["Researcher"],
            greeting: "We have a whole folder on health hoaxes.",
            lines: [
                "Claims that one drink 'completely prevents illness' come up every few months.",
                "None have ever been backed by DOH or peer-reviewed studies.",
            ],
            testimony:
                "Maria (Librarian): Health hoax archive shows no credible evidence for miracle prevention claims.",
        },
        "npc-jun": {
            bestFor: ["Researcher"],
            greeting: "Our health desk looked into it.",
            lines: [
                "DOH has no advisory on this mixture — we're treating it as misinformation.",
                "Sensational posts like this spread faster than facts.",
            ],
            testimony:
                "Jun (Reporter): Health desk found no DOH endorsement — classifying claim as misinformation.",
        },
        "npc-rosa": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "My neighbor swears by it!",
            lines: [
                "She says her whole family drinks it every morning!",
                "What harm could it do to try, right?",
            ],
            testimony:
                "Aling Rosa (Vendor): Cites neighbor's anecdote as proof — no medical evidence mentioned.",
        },
        "npc-santos": {
            bestFor: ["Researcher"],
            greeting: "Science doesn't work through chain messages.",
            lines: [
                "Real medical advice comes from doctors and published research.",
                "Urgent 'share immediately' language is a red flag.",
            ],
            testimony:
                "Mr. Santos (Retired Teacher): Warns that urgent share-now health claims lack scientific backing.",
        },
        "npc-kyle": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "It's all over my feed.",
            lines: [
                "An influencer reposted it with 'doctors HATE this' in the caption.",
                "Sounds sketchy but people are sharing like crazy.",
            ],
            testimony:
                "Kyle (Student): Saw influencer repost with clickbait language — no named medical experts cited.",
        },
        "npc-pat": {
            bestFor: ["Researcher"],
            greeting: "DOH mythbusters page is clear on this.",
            lines: [
                "Rated FALSE — no evidence for complete illness prevention.",
                "Same claim recycled with different wording since last year.",
            ],
            testimony:
                "Pat (Tech Intern): DOH mythbusters rates the claim FALSE with no supporting evidence.",
        },
        "npc-ana": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Someone left a printed copy of the post here.",
            lines: [
                "It says 'share before they delete this' — classic scare tactic.",
                "No author, no source, just bold claims.",
            ],
            testimony:
                "Ana (Barista): Found printed viral post using conspiracy-style 'share before deleted' language.",
        },
        "npc-ben": {
            bestFor: ["Detective"],
            greeting: "The health clinic next door hasn't mentioned it.",
            lines: [
                "Their official board still says consult a doctor for remedies.",
                "No new flyer about any miracle mixture.",
            ],
            testimony:
                "Ben (Guard): Local health clinic has not posted any advisory about the viral mixture.",
        },
        "npc-cruz": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "I'm giving this to my whole family!",
            lines: [
                "If it might help, why not? Big pharma doesn't want us to know!",
                "My friend forwarded it so it must have some truth.",
            ],
            testimony:
                "Mrs. Cruz (Parent): Believes conspiracy framing — trusts forwarded message over medical sources.",
        },
        "npc-marco": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Listeners are LOVING this story!",
            lines: [
                "Callers sharing personal testimonials — 'it worked for me!'",
                "We haven't checked with any doctor but the phones won't stop!",
            ],
            testimony:
                "Marco (Radio Host): Airs anecdotal caller testimonials without medical verification.",
        },
        "npc-elena": {
            bestFor: ["Source Investigator"],
            greeting: "No health advisory on file.",
            lines: [
                "Registered health notices go through our office — nothing on this mixture.",
            ],
            testimony:
                "Elena (Records Clerk): No registered municipal health advisory about the viral mixture.",
        },
        "npc-dex": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "A passenger showed me the post.",
            lines: [
                "Looked like an ad disguised as news — sponsored content vibe.",
                "Definitely not from any hospital I know.",
            ],
            testimony:
                "Dex (Driver): Describes viral post as ad-like content, not from any credible health institution.",
        },
    },

    3: {
        "npc-maria": {
            bestFor: ["Researcher", "Source Investigator"],
            greeting: "This one appears in the official gazette.",
            lines: [
                "Programs like this are listed in budget documents before public launch.",
                "The entry matches what's being announced.",
            ],
            testimony:
                "Maria (Librarian): Gazette entry confirms program authorization matching the announcement.",
        },
        "npc-jun": {
            bestFor: ["Detective", "Researcher"],
            greeting: "We covered the briefing this morning.",
            lines: [
                "Spokesperson gave specific dates and budget figures on record.",
                "Multiple accredited reporters attended — details are consistent.",
            ],
            testimony:
                "Jun (Reporter): Attended official briefing — dates and figures match announcement.",
        },
        "npc-rosa": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Finally, good news!",
            lines: [
                "They say it's the BIGGEST program ever — probably exaggerating.",
                "But the mayor's office posted the same thing, so maybe it's real?",
            ],
            testimony:
                "Rosa (Vendor): Hears exaggerated claims but notes mayor's office posted matching information.",
        },
        "npc-santos": {
            bestFor: ["Source Investigator"],
            greeting: "I saw the signed notice at town hall.",
            lines: [
                "Dated, signed, with a program start month — looks legitimate.",
                "Matches what the press reported.",
            ],
            testimony:
                "Mr. Santos (Retired Teacher): Saw signed official notice at town hall matching press reports.",
        },
        "npc-kyle": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "People are hyping it online.",
            lines: [
                "Posts say it'll 'change everything' — dramatic but the core facts check out.",
                "Official page has the same start date.",
            ],
            testimony:
                "Kyle (Student): Notes sensational social posts but confirms official page matches core facts.",
        },
        "npc-pat": {
            bestFor: ["Researcher"],
            greeting: "Cross-referenced the gazette listing.",
            lines: [
                "Authorization number matches. Program is registered.",
            ],
            testimony:
                "Pat (Tech Intern): Gazette cross-check confirms registered program with matching authorization.",
        },
        "npc-ana": {
            bestFor: ["Detective"],
            greeting: "Town hall staff were celebrating.",
            lines: [
                "They had a copy of the official notice at the counter.",
                "Seemed like a normal rollout, not a surprise.",
            ],
            testimony:
                "Ana (Barista): Town hall staff displayed official notice — appeared to be standard program rollout.",
        },
        "npc-ben": {
            bestFor: ["Detective"],
            greeting: "Saw the mayor's convoy this morning.",
            lines: [
                "Press vans were at town hall — looked like a scheduled briefing.",
            ],
            testimony:
                "Ben (Guard): Observed scheduled press activity at town hall consistent with official briefing.",
        },
        "npc-cruz": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "I hope this is real!",
            lines: [
                "Someone online said it might be 'too good to be true.'",
                "Skepticism alone doesn't mean it's false though — I checked the official page myself.",
            ],
            testimony:
                "Mrs. Cruz (Parent): Initially skeptical but verified against official municipal page — details match.",
        },
        "npc-marco": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "BIGGEST PROGRAM EVER, folks!",
            lines: [
                "Dramatic intro, but I read the press release — facts line up.",
                "Sensational delivery doesn't always mean false news.",
            ],
            testimony:
                "Marco (Radio Host): Uses hype language but confirms press release facts match announcement.",
        },
        "npc-elena": {
            bestFor: ["Source Investigator"],
            greeting: "It's in the registry.",
            lines: [
                "Program registered with authorization number and start date on file.",
            ],
            testimony:
                "Elena (Records Clerk): Program officially registered in municipal records with matching details.",
        },
        "npc-dex": {
            bestFor: ["Detective"],
            greeting: "Town hall was busy today.",
            lines: [
                "Normal weekday activity — people picking up official forms.",
                "Nothing felt secretive or rushed.",
            ],
            testimony:
                "Dex (Driver): Normal town hall activity observed — consistent with routine official program launch.",
        },
    },

    4: {
        "npc-maria": {
            bestFor: ["Image Investigator"],
            greeting: "We teach reverse image search in our media literacy corner.",
            lines: [
                "That flood photo appeared in our archive from a 2023 article — different province.",
                "Same image, new caption claiming it's from today.",
            ],
            testimony:
                "Maria (Librarian): Archive shows viral flood photo is from 2023, different location.",
        },
        "npc-jun": {
            bestFor: ["Detective", "Image Investigator"],
            greeting: "Our photo desk rejected that image.",
            lines: [
                "Metadata shows 2023 capture date — not today.",
                "No flooding reported in the plaza as of this hour.",
            ],
            testimony:
                "Jun (Reporter): Photo desk rejected image — wrong date, no current flooding confirmed.",
        },
        "npc-rosa": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Someone showed me — the plaza is underwater!",
            lines: [
                "The photo looks real to me!",
                "My cousin sent it saying evacuate now!",
            ],
            testimony:
                "Aling Rosa (Vendor): Believes viral flood photo is current — received via cousin, unverified.",
        },
        "npc-santos": {
            bestFor: ["Detective"],
            greeting: "I walked through the plaza an hour ago.",
            lines: [
                "Ground was dry. Light rain, nothing more.",
                "Don't trust every dramatic photo you see online.",
            ],
            testimony:
                "Mr. Santos (Retired Teacher): Personally observed dry plaza — contradicts viral flood photo claim.",
        },
        "npc-kyle": {
            bestFor: ["Image Investigator"],
            greeting: "Someone did a reverse search in our group chat.",
            lines: [
                "Same photo from three years ago, different province.",
                "People are still sharing it as 'happening now' though.",
            ],
            testimony:
                "Kyle (Student): Group chat reverse search found photo from 2023 — still shared as current.",
        },
        "npc-pat": {
            bestFor: ["Image Investigator"],
            greeting: "Ran it through the image verification tool.",
            lines: [
                "Exact match in a 2023 news article about a flood elsewhere.",
                "Rain sensors show normal levels today.",
            ],
            testimony:
                "Pat (Tech Intern): Image verification confirms 2023 origin; rain sensors show normal levels today.",
        },
        "npc-ana": {
            bestFor: ["Detective"],
            greeting: "Customers came in soaked from light rain, not flooding.",
            lines: [
                "Nobody mentioned the plaza being underwater.",
                "Just regular umbrellas, regular day.",
            ],
            testimony:
                "Ana (Barista): Customers reported light rain only — no flooding observed locally.",
        },
        "npc-ben": {
            bestFor: ["Detective"],
            greeting: "I've been patrolling the plaza all morning.",
            lines: [
                "Dry ground. Normal foot traffic. No evacuation.",
                "That photo doesn't match what I see.",
            ],
            testimony:
                "Ben (Guard): Plaza patrol confirms dry conditions — contradicts viral evacuation photo.",
        },
        "npc-cruz": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "EVACUATE THE CHILDREN!",
            lines: [
                "Better safe than sorry — what if the photo is real?!",
                "I'm not waiting for official confirmation!",
            ],
            testimony:
                "Mrs. Cruz (Parent): Urges evacuation based on unverified photo — emotional response without verification.",
        },
        "npc-marco": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "A caller says the plaza is FLOODING!",
            lines: [
                "We put it on air before checking!",
                "Turns out nobody verified it yet…",
            ],
            testimony:
                "Marco (Radio Host): Aired unverified caller flood claim before fact-checking.",
        },
        "npc-elena": {
            bestFor: ["Data Analyst"],
            greeting: "Sensor logs are on file.",
            lines: [
                "River gauge and rain station show normal levels for this hour.",
                "No flood watch entry created today.",
            ],
            testimony:
                "Elena (Records Clerk): Official sensor logs show normal rainfall — no flood watch filed.",
        },
        "npc-dex": {
            bestFor: ["Detective"],
            greeting: "I drove through the plaza 20 minutes ago.",
            lines: [
                "Completely dry. Kids playing near the fountain.",
                "No water, no panic.",
            ],
            testimony:
                "Dex (Driver): Drove through plaza recently — dry conditions, normal activity.",
        },
    },

    5: {
        "npc-maria": {
            bestFor: ["Data Analyst"],
            greeting: "We have a statistics literacy workbook.",
            lines: [
                "300% sounds huge — but it can mean 2 incidents became 8.",
                "Always ask for the raw numbers behind a percentage.",
            ],
            testimony:
                "Maria (Librarian): Statistics guide warns that large percentages can hide small base counts.",
        },
        "npc-jun": {
            bestFor: ["Data Analyst"],
            greeting: "We obtained the full police report.",
            lines: [
                "The 300% is for one minor category — 2 to 8 incidents.",
                "Overall crime for the year is essentially flat.",
            ],
            testimony:
                "Jun (Reporter): Full report shows 300% is one category only (2→8); total crime trend flat.",
        },
        "npc-rosa": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Crime is out of control!",
            lines: [
                "I saw the 300% headline — terrifying!",
                "I didn't read the rest of the article though.",
            ],
            testimony:
                "Aling Rosa (Vendor): Reacts to headline percentage only — did not read full report context.",
        },
        "npc-santos": {
            bestFor: ["Data Analyst"],
            greeting: "Numbers need context.",
            lines: [
                "I pulled the summary chart from the police board.",
                "Raw counts are posted — the headline alone is misleading.",
            ],
            testimony:
                "Mr. Santos (Retired Teacher): Full chart with raw counts available — headline lacks context.",
        },
        "npc-kyle": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "My feed is full of panic posts.",
            lines: [
                "One post says '300%!!' another says 'completely made up!'",
                "Both are sharing screenshots without the actual report.",
            ],
            testimony:
                "Kyle (Student): Sees opposing unsourced social posts — neither links to full police report.",
        },
        "npc-pat": {
            bestFor: ["Data Analyst"],
            greeting: "I downloaded the CSV from the open data portal.",
            lines: [
                "142 vs 138 total incidents year-over-year — basically flat.",
                "The 300% is technically true for a tiny subset.",
            ],
            testimony:
                "Pat (Tech Intern): Open data shows flat overall crime; 300% applies to small category only.",
        },
        "npc-ana": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Customers are arguing about the stat at my counter.",
            lines: [
                "One says we're unsafe, another says it's exaggerated.",
                "Nobody has actually read the full PDF.",
            ],
            testimony:
                "Ana (Barista): Local debate based on headlines — no one citing full report.",
        },
        "npc-ben": {
            bestFor: ["Detective"],
            greeting: "I patrol this area daily.",
            lines: [
                "Nothing feels dramatically different from last year.",
                "Headline stats don't match daily experience, but I'm not a data analyst.",
            ],
            testimony:
                "Ben (Guard): Anecdotal observation of normal patrol conditions — suggests checking official data.",
        },
        "npc-cruz": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "I'm scared for my children!",
            lines: [
                "300% means it's THREE TIMES worse! We need to move!",
                "I don't care about 'context' — the number speaks for itself!",
            ],
            testimony:
                "Mrs. Cruz (Parent): Interprets 300% headline literally without context — emotional reaction.",
        },
        "npc-marco": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "CRIME EXPLOSION — 300 PERCENT!",
            lines: [
                "I'm repeating the headline every segment!",
                "Haven't mentioned it's 2 to 8 incidents though…",
            ],
            testimony:
                "Marco (Radio Host): Repeats alarming headline without explaining base counts of 2 to 8.",
        },
        "npc-elena": {
            bestFor: ["Data Analyst"],
            greeting: "The full report is public record.",
            lines: [
                "PDF includes raw tables — headline percentage omits them.",
                "Report is authentic; presentation in social posts is the issue.",
            ],
            testimony:
                "Elena (Records Clerk): Authentic full report available with raw data — social posts omit context.",
        },
        "npc-dex": {
            bestFor: ["Media Literacy Analyst"],
            greeting: "Someone gave me a flyer with just '300%!' in huge letters.",
            lines: [
                "No fine print, no source link, no date.",
                "Classic fear flyer.",
            ],
            testimony:
                "Dex (Driver): Received alarmist flyer citing 300% with no source or context.",
        },
    },
};

export default npcDialogue;

export function getNpcDialogue(announcementId, npcId) {
    return npcDialogue[announcementId]?.[npcId] || null;
}
