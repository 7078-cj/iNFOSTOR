/**
 * All investigation sources on the map — spread across themed rooms.
 */

export const INVESTIGATION_OBJECTS = [
    // Public Library
    { id: "library", x: 620, y: 640, w: 40, h: 40 },
    { id: "archive-shelf", x: 560, y: 720, w: 36, h: 38 },
    { id: "newspaper-rack", x: 780, y: 600, w: 34, h: 36 },
    { id: "microfilm", x: 680, y: 780, w: 38, h: 32 },

    // Newsroom
    { id: "newsdesk", x: 580, y: 980, w: 42, h: 34 },
    { id: "press-monitor", x: 720, y: 960, w: 44, h: 32 },
    { id: "rumor-board", x: 640, y: 1080, w: 40, h: 34 },

    // Tech Lab
    { id: "computer", x: 1680, y: 540, w: 38, h: 32 },
    { id: "archive-computer", x: 1860, y: 500, w: 38, h: 32 },
    { id: "fact-check-kiosk", x: 1580, y: 620, w: 36, h: 40 },
    { id: "social-terminal", x: 1780, y: 680, w: 38, h: 32 },

    // Media Lounge
    { id: "tv", x: 1380, y: 980, w: 44, h: 32 },
    { id: "community-tv", x: 1520, y: 1020, w: 44, h: 32 },
    { id: "bulletin", x: 1640, y: 1080, w: 40, h: 34 },
    { id: "records-desk", x: 1320, y: 1100, w: 40, h: 34 },

    // Community Hall
    { id: "radio", x: 580, y: 1380, w: 34, h: 30 },
    { id: "second-radio", x: 720, y: 1420, w: 34, h: 30 },
    { id: "whisper-booth", x: 860, y: 1400, w: 32, h: 34 },
    { id: "gossip-pinboard", x: 640, y: 1480, w: 40, h: 34 },

    // Records Office (northwest)
    { id: "town-hall-board", x: 120, y: 120, w: 42, h: 36 },
    { id: "official-records", x: 280, y: 200, w: 38, h: 32 },

    // Broadcast Booth (northeast)
    { id: "live-feed-monitor", x: 2100, y: 120, w: 44, h: 32 },
    { id: "satellite-radio", x: 1980, y: 220, w: 34, h: 30 },

    // Citizen Services (southeast)
    { id: "service-kiosk", x: 2100, y: 1320, w: 36, h: 38 },
    { id: "phone-hotline", x: 1980, y: 1420, w: 32, h: 34 },

    // Courtyard (south center)
    { id: "courtyard-bulletin", x: 1180, y: 1320, w: 40, h: 34 },
    { id: "street-tv", x: 1320, y: 1380, w: 44, h: 32 },
];

export const CONTENT_TYPE_MAP = {
    newsdesk: "bulletin",
    "archive-computer": "computer",
    "second-radio": "radio",
    "archive-shelf": "library",
    "newspaper-rack": "bulletin",
    microfilm: "library",
    "press-monitor": "tv",
    "rumor-board": "bulletin",
    "fact-check-kiosk": "computer",
    "social-terminal": "computer",
    "community-tv": "tv",
    "records-desk": "bulletin",
    "whisper-booth": "radio",
    "gossip-pinboard": "bulletin",
    "town-hall-board": "bulletin",
    "official-records": "library",
    "live-feed-monitor": "tv",
    "satellite-radio": "radio",
    "service-kiosk": "computer",
    "phone-hotline": "radio",
    "courtyard-bulletin": "bulletin",
    "street-tv": "tv",
};

export const OBJECT_LABELS = {
    library: "Public Library",
    tv: "Channel 4 News TV",
    bulletin: "Municipal Noticeboard",
    radio: "Radyo Bayan FM",
    computer: "Investigation Terminal",
    newsdesk: "City News Desk",
    "archive-computer": "Archive Terminal",
    "second-radio": "Community Radio Booth",
    "archive-shelf": "Archive Reading Room",
    "newspaper-rack": "Newspaper Rack",
    microfilm: "Microfilm Reader",
    "press-monitor": "Press Room Monitor",
    "rumor-board": "Unverified Tips Board",
    "fact-check-kiosk": "Fact-Check Kiosk",
    "social-terminal": "Social Media Terminal",
    "community-tv": "Community TV Wall",
    "records-desk": "Public Records Desk",
    "whisper-booth": "Whisper Booth",
    "gossip-pinboard": "Neighborhood Gossip Board",
    "town-hall-board": "Town Hall Noticeboard",
    "official-records": "Official Records Index",
    "live-feed-monitor": "Live Broadcast Feed",
    "satellite-radio": "Satellite News Radio",
    "service-kiosk": "Citizen Services Kiosk",
    "phone-hotline": "Public Hotline Phone",
    "courtyard-bulletin": "Courtyard Noticeboard",
    "street-tv": "Street-Level News Screen",
};

export const INTERIOR_WALLS = [
    { id: "wall-mid", x: 1140, y: 600, w: 120, h: 140 },
    { id: "wall-north", x: 900, y: 400, w: 200, h: 30 },
    { id: "wall-south", x: 1300, y: 1050, w: 200, h: 30 },
    { id: "wall-library-a", x: 500, y: 540, w: 30, h: 280 },
    { id: "wall-library-b", x: 500, y: 540, w: 220, h: 30 },
    { id: "wall-library-c", x: 500, y: 790, w: 320, h: 30 },
    { id: "wall-tech-a", x: 1500, y: 440, w: 30, h: 280 },
    { id: "wall-tech-b", x: 1500, y: 440, w: 240, h: 30 },
    { id: "wall-tech-c", x: 1740, y: 440, w: 30, h: 280 },
    { id: "wall-news-a", x: 500, y: 900, w: 30, h: 200 },
    { id: "wall-news-b", x: 500, y: 900, w: 280, h: 30 },
    { id: "wall-news-c", x: 500, y: 1100, w: 400, h: 30 },
    { id: "wall-media-a", x: 1260, y: 860, w: 30, h: 320 },
    { id: "wall-media-b", x: 1260, y: 860, w: 280, h: 30 },
    { id: "wall-media-c", x: 1540, y: 860, w: 30, h: 320 },
    { id: "wall-hall-a", x: 500, y: 1280, w: 30, h: 200 },
    { id: "wall-hall-b", x: 500, y: 1280, w: 400, h: 30 },
    { id: "wall-records-a", x: 80, y: 80, w: 30, h: 280 },
    { id: "wall-records-b", x: 80, y: 80, w: 360, h: 30 },
    { id: "wall-records-c", x: 410, y: 80, w: 30, h: 200 },
    { id: "wall-broadcast-a", x: 1920, y: 80, w: 30, h: 280 },
    { id: "wall-broadcast-b", x: 1920, y: 80, w: 360, h: 30 },
    { id: "wall-broadcast-c", x: 1920, y: 330, w: 360, h: 30 },
    { id: "wall-citizen-a", x: 1920, y: 1280, w: 30, h: 240 },
    { id: "wall-citizen-b", x: 1680, y: 1280, w: 270, h: 30 },
    { id: "wall-citizen-c", x: 1920, y: 1490, w: 360, h: 30 },
    { id: "wall-courtyard-a", x: 1080, y: 1280, w: 30, h: 200 },
    { id: "wall-courtyard-b", x: 1080, y: 1280, w: 400, h: 30 },
    { id: "wall-plaza-divider", x: 940, y: 520, w: 20, h: 180 },
    { id: "wall-plaza-divider2", x: 1440, y: 520, w: 20, h: 180 },
];
