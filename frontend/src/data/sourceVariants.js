/**
 * Extra per-source clues — unique text per interactable.
 * Some help investigators; others mislead.
 */

const sourceVariants = {
    1: {
        "archive-shelf": {
            title: "Archive — Past Suspension Hoaxes",
            bestFor: ["Researcher"],
            passage:
                "A binder documents three prior years when fake class-suspension messages circulated. Each hoax used DepEd letterhead styling but lacked an official portal link.",
        },
        "newspaper-rack": {
            title: "Yesterday's Local Paper",
            bestFor: ["Detective"],
            notice:
                "No mention of class suspensions in yesterday's print edition. Weather note: 'intermittent showers, no storm signal.'",
        },
        microfilm: {
            title: "Microfilm — DepEd Advisory Protocol",
            bestFor: ["Source Investigator"],
            passage:
                "Legitimate advisories include a reference number and are posted on deped.gov.ph simultaneously. Screenshots alone are not valid proof.",
        },
        "press-monitor": {
            title: "Press Room — Wire Service",
            bestFor: ["Researcher"],
            broadcast:
                "Wire update: No suspension order filed with the regional education press desk. The viral post is treated as unconfirmed.",
        },
        "rumor-board": {
            title: "Anonymous Tips (Unverified)",
            bestFor: ["Media Literacy Analyst"],
            notice:
                "Sticky note: 'My neighbor's teacher confirmed suspension!' No name, school, or date. Posted anonymously.",
        },
        "fact-check-kiosk": {
            title: "Verified Fact-Check Database",
            bestFor: ["Researcher", "Data Analyst"],
            searchResults: [
                { title: "Official channels check", snippet: "No matching advisory on DepEd verified accounts in 48h." },
                { title: "Letterhead analysis", snippet: "Graphic matches an unrelated 2019 memo template." },
            ],
        },
        "social-terminal": {
            title: "Trending Local Posts",
            bestFor: ["Media Literacy Analyst"],
            searchResults: [
                { title: "Viral chain (47k shares)", snippet: "ALL CAPS, no link, urges immediate forwarding." },
                { title: "Comment thread", snippet: "'My school confirmed it' — no screenshot or official source." },
            ],
        },
        "community-tv": {
            title: "Community Center Display",
            bestFor: ["Detective"],
            broadcast: "Scrolling reminder to verify school announcements through official channels. No suspension listed.",
        },
        "records-desk": {
            title: "Records — School Calendar",
            bestFor: ["Detective"],
            notice: "Published calendar shows regular classes tomorrow. No amendment filed.",
        },
        "whisper-booth": {
            title: "Recorded Community Rumor",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "\"Everyone in our group chat says it's true!\" — emotional, no evidence cited.",
        },
        "gossip-pinboard": {
            title: "Neighborhood Gossip",
            bestFor: ["Media Literacy Analyst"],
            notice: "Handwritten: 'heard from a friend of a friend.' Unsigned, dated today.",
        },
        "town-hall-board": {
            title: "Town Hall — Official Postings",
            bestFor: ["Source Investigator"],
            notice: "Only posting today is a tax reminder signed by the treasurer. No emergency notice.",
        },
        "official-records": {
            title: "Municipal Records Index",
            bestFor: ["Source Investigator"],
            passage: "Emergency proclamations are logged within one hour. No school or weather entry today.",
        },
        "live-feed-monitor": {
            title: "Regional Broadcast Feed",
            bestFor: ["Researcher"],
            broadcast: "Regional desk confirms NO class suspension directive for this municipality.",
        },
        "satellite-radio": {
            title: "Satellite Talk — Caller Segment",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "Caller claim repeated on air without verification.",
        },
        "service-kiosk": {
            title: "Citizen Services Portal",
            bestFor: ["Researcher"],
            searchResults: [{ title: "School status", snippet: "No suspension order on file today." }],
        },
        "phone-hotline": {
            title: "Hotline Voicemail Log",
            bestFor: ["Detective"],
            broadcast: "Automated reply: no official announcement received. Check DepEd verified pages.",
        },
        "courtyard-bulletin": {
            title: "Courtyard Board",
            bestFor: ["Detective"],
            notice: "Tutoring center flyer advertises extra sessions tomorrow — implies classes continue.",
        },
        "street-tv": {
            title: "Street News Screen",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "Ticker repeats viral claim WITHOUT source label — aggregating social posts only.",
        },
    },
    2: {
        "archive-shelf": {
            title: "Archive — Debunked Health Claims",
            bestFor: ["Researcher"],
            passage: "Folder of debunked 'miracle cure' flyers: absolute prevention claims, urgency to share, zero citations.",
        },
        "rumor-board": {
            title: "Unverified Testimonials",
            bestFor: ["Media Literacy Analyst"],
            notice: "'Works 100%! My lola never gets sick!' — anecdote only, no medical study.",
        },
        "social-terminal": {
            title: "Viral Wellness Posts",
            bestFor: ["Media Literacy Analyst"],
            searchResults: [
                { title: "Influencer repost", snippet: "'Doctors HATE this trick!' — clickbait, no named experts." },
                { title: "Chain message", snippet: "Same text with 'forward to 10 people' appended." },
            ],
        },
        "fact-check-kiosk": {
            title: "Health Fact-Check",
            bestFor: ["Researcher"],
            searchResults: [{ title: "DOH Mythbusters", snippet: "Claim rated FALSE. No evidence for complete prevention." }],
        },
        "whisper-booth": {
            title: "Conspiracy Tip Line",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "\"Big pharma doesn't want you to know!\" — zero evidence, urges sharing.",
        },
        "street-tv": {
            title: "Paid Ad Loop",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "Sponsored segment mimics news format — not journalism.",
        },
        "town-hall-board": {
            title: "Health Office Notice",
            bestFor: ["Source Investigator"],
            notice: "Official warning against unverified cures spread online.",
        },
        "live-feed-monitor": {
            title: "National Health Feed",
            bestFor: ["Researcher"],
            broadcast: "National bulletin debunking similar mixture claims.",
        },
        "newspaper-rack": {
            title: "Health Column",
            bestFor: ["Researcher"],
            notice: "Column: no food replaces vaccines or medical care.",
        },
        "gossip-pinboard": {
            title: "Community Testimonials",
            bestFor: ["Media Literacy Analyst"],
            notice: "Handwritten 'it worked for me!' notes — anecdotes, not trials.",
        },
        "microfilm": { title: "Ethics Guidelines", bestFor: ["Source Investigator"], passage: "Health claims require peer review or agency endorsement before advisories." },
        "press-monitor": { title: "Health Desk", bestFor: ["Researcher"], broadcast: "DOH issued no advisory on this mixture — treating as misinformation." },
        "community-tv": { title: "Clinic Display", bestFor: ["Detective"], broadcast: "Slide: consult a doctor before trying social media remedies." },
        "records-desk": { title: "Clinic Files", bestFor: ["Detective"], notice: "No approved flyer for this mixture on file." },
        "official-records": { title: "Health Filings", bestFor: ["Source Investigator"], passage: "No registered advisory matching this mixture." },
        "satellite-radio": { title: "Call-In Hour", bestFor: ["Media Literacy Analyst"], broadcast: "Host admits they haven't checked with any doctor." },
        "service-kiosk": { title: "DOH Lookup", bestFor: ["Researcher"], searchResults: [{ title: "Query", snippet: "No endorsement found." }] },
        "phone-hotline": { title: "Health Line", bestFor: ["Detective"], broadcast: "Recording directs callers to verified DOH pages." },
        "courtyard-bulletin": { title: "Flyer Wall", bestFor: ["Media Literacy Analyst"], notice: "Photocopied viral post — no agency seal." },
    },
    3: {
        "town-hall-board": {
            title: "Signed Mayor's Notice",
            bestFor: ["Source Investigator"],
            notice: "Official notice with program name, start month, and contact office — signed.",
        },
        "official-records": {
            title: "Registry Confirmation",
            bestFor: ["Source Investigator"],
            passage: "Program registered with matching authorization number.",
        },
        "microfilm": {
            title: "Gazette Entry",
            bestFor: ["Source Investigator"],
            passage: "Authorization dated this quarter — same title as announcement.",
        },
        "live-feed-monitor": {
            title: "Live Press Conference",
            bestFor: ["Researcher"],
            broadcast: "Q&A with accredited reporters — details consistent with announcement.",
        },
        "rumor-board": {
            title: "Skeptical Tip",
            bestFor: ["Media Literacy Analyst"],
            notice: "'Too good to be true.' Skepticism without checking sources is also unreliable.",
        },
        "social-terminal": {
            title: "Hyped Repost",
            bestFor: ["Media Literacy Analyst"],
            searchResults: [{ title: "Share", snippet: "Exaggerated tone but core facts align with official release." }],
        },
        "archive-shelf": { title: "Program Rollouts Archive", bestFor: ["Researcher"], passage: "Similar programs were gazette-listed weeks before launch — matches pattern." },
        "newspaper-rack": { title: "Front Page", bestFor: ["Detective"], notice: "Story matches dates and budget figures from briefing." },
        "press-monitor": { title: "Press Pool", bestFor: ["Researcher"], broadcast: "Spokesperson quoted same start date live." },
        "fact-check-kiosk": { title: "Verification", bestFor: ["Researcher"], searchResults: [{ title: "Gazette", snippet: "Listing confirmed — program authorized." }] },
        "community-tv": { title: "Briefing Replay", bestFor: ["Detective"], broadcast: "Mayor briefing replay — specific dates, matches announcement." },
        "records-desk": { title: "Stamped Copy", bestFor: ["Detective"], notice: "On file with receipt date matching press briefing." },
        "whisper-booth": { title: "Excited Resident", bestFor: ["Media Literacy Analyst"], broadcast: "Hype language — doesn't contradict official facts." },
        "gossip-pinboard": { title: "Reactions", bestFor: ["Media Literacy Analyst"], notice: "Mix of praise and doubt — check the gazette." },
        "satellite-radio": { title: "Radio Summary", bestFor: ["Media Literacy Analyst"], broadcast: "Dramatic intro but facts match press release." },
        "service-kiosk": { title: "Program Lookup", bestFor: ["Researcher"], searchResults: [{ title: "Status", snippet: "Registered — start date confirmed." }] },
        "phone-hotline": { title: "Mayor's Line", bestFor: ["Detective"], broadcast: "Recording confirms details match posted notice." },
        "courtyard-bulletin": { title: "Official Copy", bestFor: ["Detective"], notice: "Duplicate of town hall posting." },
        "street-tv": { title: "Municipal Feed", bestFor: ["Researcher"], broadcast: "Official channel — low drama, factual." },
    },
    4: {
        microfilm: {
            title: "Disaster Photo Log 2023",
            bestFor: ["Image Investigator"],
            passage: "Same plaza flood image published three years ago for a different province.",
        },
        "fact-check-kiosk": {
            title: "Image Verification",
            bestFor: ["Image Investigator"],
            searchResults: [{ title: "Reverse search", snippet: "Photo found in 2023 article — different location." }],
        },
        "rumor-board": {
            title: "Panic Tip",
            bestFor: ["Media Literacy Analyst"],
            notice: "'EVACUATE NOW — plaza underwater!' — unsigned, no photo credit.",
        },
        "community-tv": {
            title: "Plaza Camera Feed",
            bestFor: ["Detective"],
            broadcast: "Live camera: ground dry, normal foot traffic, light rain only.",
        },
        "street-tv": {
            title: "Breaking Loop",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "Dramatic flood footage labeled BREAKING — file footage, not live.",
        },
        "social-terminal": {
            title: "Viral Photo Post",
            bestFor: ["Image Investigator"],
            searchResults: [{ title: "Repost", snippet: "Captioned 'happening NOW' but no original source in comments." }],
        },
        "archive-shelf": { title: "Photo Misuse Cases", bestFor: ["Image Investigator"], passage: "Viral disaster photos often reuse older regional images." },
        "newspaper-rack": { title: "Photo Desk", bestFor: ["Image Investigator"], notice: "Today's plaza submission rejected — metadata shows 2023 date." },
        "press-monitor": { title: "Weather Desk", bestFor: ["Detective"], broadcast: "No flooding reported in town plaza today." },
        "records-desk": { title: "Flood Watch Log", bestFor: ["Detective"], notice: "No flood watch entry created today." },
        "whisper-booth": { title: "Panicked Clip", bestFor: ["Media Literacy Analyst"], broadcast: "\"My cousin sent the photo — must be real!\" — no verification." },
        "gossip-pinboard": { title: "Photo Printout", bestFor: ["Image Investigator"], notice: "Grainy printout — no timestamp or photographer credit." },
        "town-hall-board": { title: "Emergency Board", bestFor: ["Source Investigator"], notice: "Blank except maintenance schedule — no evacuation order." },
        "official-records": { title: "Sensor Logs", bestFor: ["Data Analyst"], passage: "Rain station logs show normal levels for this hour." },
        "live-feed-monitor": { title: "Regional Desk", bestFor: ["Researcher"], broadcast: "No flood reports verified for this municipality today." },
        "satellite-radio": { title: "Caller Segment", bestFor: ["Media Literacy Analyst"], broadcast: "Unverified caller claim repeated without fact-check." },
        "service-kiosk": { title: "Alert Portal", bestFor: ["Researcher"], searchResults: [{ title: "Status", snippet: "No active flood alert for your area." }] },
        "phone-hotline": { title: "Dispatch Log", bestFor: ["Detective"], broadcast: "Multiple calls about photo — none verified by field teams." },
        "courtyard-bulletin": { title: "Weather Post", bestFor: ["Detective"], notice: "Volunteer forecast: light showers, not flooding." },
    },
    5: {
        microfilm: {
            title: "Annual Crime Summary",
            bestFor: ["Data Analyst"],
            passage: "Year-over-year totals: 142 vs 138 incidents — essentially flat overall.",
        },
        "records-desk": {
            title: "Full Report PDF",
            bestFor: ["Data Analyst"],
            notice: "Full PDF with raw tables — matches TV data desk segment.",
        },
        "rumor-board": {
            title: "Alarmist Scrawl",
            bestFor: ["Media Literacy Analyst"],
            notice: "'CRIME EXPLOSION — 300%!!!' — no source cited.",
        },
        "satellite-radio": {
            title: "Shock Jock",
            bestFor: ["Media Literacy Analyst"],
            broadcast: "Repeats '300%!' — never mentions base counts of 2 and 8.",
        },
        "social-terminal": {
            title: "Viral Stat Posts",
            bestFor: ["Media Literacy Analyst"],
            searchResults: [
                { title: "Headline share", snippet: "Screenshot only — no link to full report." },
                { title: "Denial post", snippet: "'Completely fabricated!' — equally unsourced." },
            ],
        },
        "fact-check-kiosk": {
            title: "Stat Context Tool",
            bestFor: ["Data Analyst"],
            searchResults: [{ title: "Analysis", snippet: "300% true for subset (2→8) but misleading for total trend." }],
        },
        "archive-shelf": { title: "Statistics Literacy", bestFor: ["Data Analyst"], passage: "300% from 2 to 8 vs population 40,000 — context matters." },
        "newspaper-rack": { title: "Inside Page", bestFor: ["Data Analyst"], notice: "Table with raw counts — headline omits this." },
        "press-monitor": { title: "Data Desk", bestFor: ["Data Analyst"], broadcast: "Spike is one minor category only — full spreadsheet shown." },
        "community-tv": { title: "Police Clip", bestFor: ["Detective"], broadcast: "Spokesperson: read full report, not headline percentages alone." },
        "whisper-booth": { title: "Angry Caller", bestFor: ["Media Literacy Analyst"], broadcast: "\"Don't care about numbers!\" — emotion, not data." },
        "gossip-pinboard": { title: "Neighborhood Fears", bestFor: ["Media Literacy Analyst"], notice: "Anecdotes of feeling unsafe — not statistics." },
        "town-hall-board": { title: "Police Summary", bestFor: ["Data Analyst"], notice: "Chart with raw numbers and baseline footnotes." },
        "official-records": { title: "Blotter Index", bestFor: ["Data Analyst"], passage: "Report authentic — numbers real but need context." },
        "live-feed-monitor": { title: "Council Hearing", bestFor: ["Data Analyst"], broadcast: "Councilor cites full table — headline technically true but incomplete." },
        "service-kiosk": { title: "Open Data", bestFor: ["Data Analyst"], searchResults: [{ title: "CSV", snippet: "Full category breakdown available." }] },
        "phone-hotline": { title: "Records Callback", bestFor: ["Detective"], broadcast: "Clerk confirms report genuine, offers full copy." },
        "courtyard-bulletin": { title: "Watch Flyer", bestFor: ["Media Literacy Analyst"], notice: "300% in bold — no fine print or source link." },
        "street-tv": { title: "Ticker Loop", bestFor: ["Media Literacy Analyst"], broadcast: "Scrolling headline without link to full report." },
    },
};

export default sourceVariants;

export function getSourceContent(announcementId, objectId, baseContent, typeMap) {
    const variants = sourceVariants[announcementId] || {};
    const baseKey = typeMap[objectId] || objectId;
    return variants[objectId] || baseContent[objectId] || baseContent[baseKey] || null;
}

export function getModalType(objectId, typeMap) {
    const mapped = typeMap[objectId];
    if (mapped) return mapped;
    if (objectId === "newsdesk") return "bulletin";
    return objectId;
}
