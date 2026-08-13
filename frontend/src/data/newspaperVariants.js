/**
 * Unique newspaper content per announcement — each stand has different coverage.
 */

export const NEWSPAPER_IDS = [
    "daily-herald-plaza",
    "morning-post-courtyard",
    "tabloid-stand-media",
    "news-vendor-records",
    "campus-paper-library",
    "evening-edition-broadcast",
    "street-news-citizen",
    "plaza-news-kiosk",
    "community-weekly-hall",
];

const newspaperVariants = {
    1: {
        "daily-herald-plaza": {
            title: "Daily Herald — Metro Desk",
            bestFor: ["Detective"],
            notice: "No suspension story in today's edition. Schools section lists normal operating hours.",
        },
        "morning-post-courtyard": {
            title: "Morning Post — Courtyard Edition",
            bestFor: ["Researcher"],
            notice: "Weather column only: light showers. No emergency school notices filed.",
        },
        "tabloid-stand-media": {
            title: "Flash Tabloid — BREAKING?",
            bestFor: ["Media Literacy Analyst"],
            notice: "Sensational headline: 'CLASSES CANCELLED?!' — body text says 'sources unconfirmed.'",
        },
        "news-vendor-records": {
            title: "Records Office Gazette",
            bestFor: ["Source Investigator"],
            notice: "Official notices page blank for school emergencies today.",
        },
        "campus-paper-library": {
            title: "Campus Chronicle",
            bestFor: ["Media Literacy Analyst"],
            notice: "Student op-ed warns against sharing unverified suspension screenshots.",
        },
        "evening-edition-broadcast": {
            title: "Evening Edition — Late Wire",
            bestFor: ["Detective"],
            notice: "Wire desk update: no DepEd confirmation received as of press time.",
        },
        "street-news-citizen": {
            title: "Citizen Street News",
            bestFor: ["Media Literacy Analyst"],
            notice: "Free handout reprints viral screenshot — no editorial verification noted.",
        },
        "plaza-news-kiosk": {
            title: "Plaza News Kiosk",
            bestFor: ["Researcher"],
            notice: "Digital ticker: 'Suspension rumor UNCONFIRMED — check official channels.'",
        },
        "community-weekly-hall": {
            title: "Community Weekly",
            bestFor: ["Detective"],
            notice: "Neighborhood column: buses ran on schedule; no parent pickup rush observed.",
        },
    },

    2: {
        "daily-herald-plaza": {
            title: "Daily Herald — Health Section",
            bestFor: ["Researcher"],
            notice: "DOH column: no endorsement of viral miracle mixture. Consult licensed physicians.",
        },
        "morning-post-courtyard": {
            title: "Morning Post — Wellness Brief",
            bestFor: ["Researcher"],
            notice: "Mythbusters sidebar rates similar claims FALSE from prior years.",
        },
        "tabloid-stand-media": {
            title: "Flash Tabloid — Miracle Cure!",
            bestFor: ["Media Literacy Analyst"],
            notice: "'Doctors HATE this!' headline — no named doctors, no study citations.",
        },
        "news-vendor-records": {
            title: "Records Health Bulletin",
            bestFor: ["Source Investigator"],
            notice: "No registered municipal health advisory on file for this mixture.",
        },
        "campus-paper-library": {
            title: "Campus Chronicle — Science Desk",
            bestFor: ["Researcher"],
            notice: "Editorial: anecdotal testimonials are not clinical evidence.",
        },
        "evening-edition-broadcast": {
            title: "Evening Edition — Health Wire",
            bestFor: ["Detective"],
            notice: "Hospital spokesperson: 'No miracle prevention — standard hygiene still recommended.'",
        },
        "street-news-citizen": {
            title: "Citizen Street News",
            bestFor: ["Media Literacy Analyst"],
            notice: "Ad disguised as article — sponsored content label buried in fine print.",
        },
        "plaza-news-kiosk": {
            title: "Plaza News Kiosk",
            bestFor: ["Researcher"],
            notice: "Fact-check feed: claim rated FALSE by DOH mythbusters page.",
        },
        "community-weekly-hall": {
            title: "Community Weekly",
            bestFor: ["Media Literacy Analyst"],
            notice: "Letters section: neighbors sharing chain messages without reading sources.",
        },
    },

    3: {
        "daily-herald-plaza": {
            title: "Daily Herald — City Desk",
            bestFor: ["Detective", "Researcher"],
            notice: "Front page matches briefing: program dates, budget figures, authorization number cited.",
        },
        "morning-post-courtyard": {
            title: "Morning Post — Official Launch",
            bestFor: ["Source Investigator"],
            notice: "Reprints signed municipal notice with start month and registry code.",
        },
        "tabloid-stand-media": {
            title: "Flash Tabloid — BIGGEST EVER!",
            bestFor: ["Media Literacy Analyst"],
            notice: "Hype headline exaggerates scope — but core dates match official release.",
        },
        "news-vendor-records": {
            title: "Records Office Gazette",
            bestFor: ["Source Investigator"],
            notice: "Program entry in official registry with matching authorization number.",
        },
        "campus-paper-library": {
            title: "Campus Chronicle",
            bestFor: ["Media Literacy Analyst"],
            notice: "Social posts dramatize rollout, but facts align with municipal page.",
        },
        "evening-edition-broadcast": {
            title: "Evening Edition — Press Pool",
            bestFor: ["Detective"],
            notice: "Multiple accredited reporters attended briefing — details consistent.",
        },
        "street-news-citizen": {
            title: "Citizen Street News",
            bestFor: ["Researcher"],
            notice: "Summary accurate; sensational adjectives in subhead only.",
        },
        "plaza-news-kiosk": {
            title: "Plaza News Kiosk",
            bestFor: ["Detective"],
            notice: "Ticker lists same start date as town hall notice board.",
        },
        "community-weekly-hall": {
            title: "Community Weekly",
            bestFor: ["Source Investigator"],
            notice: "Town hall staff quoted confirming standard program rollout procedures followed.",
        },
    },

    4: {
        "daily-herald-plaza": {
            title: "Daily Herald — Photo Desk",
            bestFor: ["Image Investigator"],
            notice: "Rejected today's flood submission — metadata shows 2023 capture, wrong province.",
        },
        "morning-post-courtyard": {
            title: "Morning Post — Weather Watch",
            bestFor: ["Data Analyst"],
            notice: "Rain gauges normal. No flood watch issued for plaza district.",
        },
        "tabloid-stand-media": {
            title: "Flash Tabloid — EVACUATE NOW!",
            bestFor: ["Media Literacy Analyst"],
            notice: "Runs dramatic photo without verification — caption claims 'happening now.'",
        },
        "news-vendor-records": {
            title: "Records Sensor Log",
            bestFor: ["Data Analyst"],
            notice: "Official river gauge and rain station readings within normal range.",
        },
        "campus-paper-library": {
            title: "Campus Chronicle — Media Lab",
            bestFor: ["Image Investigator"],
            notice: "Reverse image search tutorial uses this exact photo as a 2023 hoax example.",
        },
        "evening-edition-broadcast": {
            title: "Evening Edition — Field Report",
            bestFor: ["Detective"],
            notice: "Reporter on plaza: dry ground, normal foot traffic, no evacuation.",
        },
        "street-news-citizen": {
            title: "Citizen Street News",
            bestFor: ["Media Literacy Analyst"],
            notice: "Reprints viral photo with 'BREAKING' banner — no staff verification.",
        },
        "plaza-news-kiosk": {
            title: "Plaza News Kiosk",
            bestFor: ["Detective"],
            notice: "Live plaza cam thumbnail shows dry conditions — contradicts viral image.",
        },
        "community-weekly-hall": {
            title: "Community Weekly",
            bestFor: ["Detective"],
            notice: "Guard column: patrolled plaza all morning, no flooding observed.",
        },
    },

    5: {
        "daily-herald-plaza": {
            title: "Daily Herald — Data Desk",
            bestFor: ["Data Analyst"],
            notice: "Full table printed: 142 vs 138 total incidents YoY — headline percentage lacks context.",
        },
        "morning-post-courtyard": {
            title: "Morning Post — Crime Report",
            bestFor: ["Data Analyst"],
            notice: "Inside page shows raw counts. 300% applies to minor category only (2→8).",
        },
        "tabloid-stand-media": {
            title: "Flash Tabloid — 300% CRIME!",
            bestFor: ["Media Literacy Analyst"],
            notice: "Screaming headline with no fine print, no link to full police report.",
        },
        "news-vendor-records": {
            title: "Records Police Summary",
            bestFor: ["Data Analyst"],
            notice: "Authentic report on file — social posts omit baseline footnotes.",
        },
        "campus-paper-library": {
            title: "Campus Chronicle — Stats 101",
            bestFor: ["Data Analyst"],
            notice: "Explainer: large percentages can hide tiny base counts.",
        },
        "evening-edition-broadcast": {
            title: "Evening Edition — Police Briefing",
            bestFor: ["Detective"],
            notice: "Spokesperson urges reading full report, not headline percentages alone.",
        },
        "street-news-citizen": {
            title: "Citizen Street News",
            bestFor: ["Media Literacy Analyst"],
            notice: "Flyer reprint: '300%!' in huge type — no source link or date.",
        },
        "plaza-news-kiosk": {
            title: "Plaza News Kiosk",
            bestFor: ["Data Analyst"],
            notice: "Open data portal link to CSV with full category breakdown.",
        },
        "community-weekly-hall": {
            title: "Community Weekly",
            bestFor: ["Media Literacy Analyst"],
            notice: "Neighbors debate headline only — nobody cites the full PDF.",
        },
    },
};

export default newspaperVariants;

export function getNewspaperContent(announcementId, objectId) {
    return newspaperVariants[announcementId]?.[objectId] || null;
}
