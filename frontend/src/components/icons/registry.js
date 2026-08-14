/*
|--------------------------------------------------------------------------
| Icon Registries
|--------------------------------------------------------------------------
| Maps the strings the server actually sends over the websocket onto their
| icon, colour token and player-facing copy. Kept apart from the icon
| components themselves so each .jsx file exports only components — the
| project's react-refresh lint rule requires that split.
|
| These keys are contracts with the backend. Role names come from
| INVESTIGATOR_ROLES and vote values from VALID_VOTES, both in
| game_environment.py. Changing a key here without changing it there breaks
| role display or scoring silently, so treat them as fixed.
*/

import {
    DetectiveIcon,
    ResearcherIcon,
    SourceInvestigatorIcon,
    ImageInvestigatorIcon,
    DataAnalystIcon,
    MediaLiteracyIcon,
    ImposterIcon,
} from "./RoleIcons";

import {
    VerdictTrueIcon,
    VerdictMisleadingIcon,
    VerdictFalseIcon,
    VerdictContextIcon,
    VerdictContinueIcon,
} from "./VerdictIcons";

import {
    PhaseAnnouncementIcon,
    PhaseInvestigationIcon,
    PhaseEvidenceIcon,
    PhaseDiscussionIcon,
    PhaseConsensusIcon,
    PhaseRevealIcon,
} from "./PhaseIcons";

import {
    EvidenceDocumentIcon,
    EvidenceImageIcon,
    EvidenceStatIcon,
    EvidenceQuoteIcon,
    EvidenceLinkIcon,
} from "./EvidenceIcons";

/* ======================================================================
   ROLES — keys must match INVESTIGATOR_ROLES exactly
   ====================================================================== */

export const ROLE_ICONS = {
    Detective: {
        Icon: DetectiveIcon,
        colorVar: "var(--color-role-detective)",
        blurb: "Examines dates, names, locations and inconsistencies.",
        lookFor: "Dates that don't line up, misspelled agencies, places that don't exist.",
    },
    Researcher: {
        Icon: ResearcherIcon,
        colorVar: "var(--color-role-researcher)",
        blurb: "Verifies claims against reliable or official sources.",
        lookFor: "Whether an official body actually published this, and where.",
    },
    "Source Investigator": {
        Icon: SourceInvestigatorIcon,
        colorVar: "var(--color-role-source)",
        blurb: "Traces where the information originated.",
        lookFor: "The original poster, the chain of reshares, anonymous origins.",
    },
    "Image Investigator": {
        Icon: ImageInvestigatorIcon,
        colorVar: "var(--color-role-image)",
        blurb: "Checks whether images are authentic and in context.",
        lookFor: "Reused photos, wrong seasons or signage, edited details.",
    },
    "Data Analyst": {
        Icon: DataAnalystIcon,
        colorVar: "var(--color-role-data)",
        blurb: "Checks statistics, numbers and graphs.",
        lookFor: "Percentages that don't add up, missing baselines, cherry-picked ranges.",
    },
    "Media Literacy Analyst": {
        Icon: MediaLiteracyIcon,
        colorVar: "var(--color-role-media)",
        blurb: "Spots emotional language, clickbait and false urgency.",
        lookFor: "ALL CAPS, 'share immediately', fear or outrage doing the persuading.",
    },
    Imposter: {
        Icon: ImposterIcon,
        colorVar: "var(--color-role-imposter)",
        blurb: "Prevents the group from correctly flagging misinformation.",
        lookFor: "Cast doubt on solid evidence without being obvious about it.",
    },
};

export const INVESTIGATOR_ROLE_ORDER = [
    "Detective",
    "Researcher",
    "Source Investigator",
    "Image Investigator",
    "Data Analyst",
    "Media Literacy Analyst",
];

export function getRoleVisual(role) {
    return ROLE_ICONS[role] || null;
}

/* ======================================================================
   VERDICTS — keys must match VALID_VOTES exactly
   ====================================================================== */

export const VERDICTS = {
    TRUE: {
        Icon: VerdictTrueIcon,
        label: "True",
        shortLabel: "True",
        colorVar: "var(--color-verdict-true)",
        dimVar: "var(--color-verdict-true-dim)",
        description: "Supported by reliable evidence.",
    },
    MISLEADING: {
        Icon: VerdictMisleadingIcon,
        label: "Misleading",
        shortLabel: "Misleading",
        colorVar: "var(--color-verdict-misleading)",
        dimVar: "var(--color-verdict-misleading-dim)",
        description:
            "Contains some truth but presents it incorrectly or without important context.",
    },
    "FALSE/HOAX": {
        Icon: VerdictFalseIcon,
        label: "False / Hoax",
        shortLabel: "False",
        colorVar: "var(--color-verdict-false)",
        dimVar: "var(--color-verdict-false-dim)",
        description:
            "Reliable evidence contradicts the claim or shows it was fabricated.",
    },
    OUT_OF_CONTEXT: {
        Icon: VerdictContextIcon,
        label: "Out of Context",
        shortLabel: "Context",
        colorVar: "var(--color-verdict-context)",
        dimVar: "var(--color-verdict-context-dim)",
        description:
            "Real material presented outside the situation it actually belongs to.",
    },
    CONTINUE_INVESTIGATION: {
        Icon: VerdictContinueIcon,
        label: "Keep Investigating",
        shortLabel: "Continue",
        colorVar: "var(--color-verdict-continue)",
        dimVar: "var(--color-verdict-continue-dim)",
        description: "Not enough evidence yet to reach a verdict.",
    },
};

/* The four that resolve a round, in ballot order. CONTINUE_INVESTIGATION is
   excluded here and presented separately, because it is a refusal to
   classify rather than a classification. */
export const CLASSIFICATION_ORDER = [
    "TRUE",
    "MISLEADING",
    "FALSE/HOAX",
    "OUT_OF_CONTEXT",
];

export function getVerdict(value) {
    return VERDICTS[value] || null;
}

/* ======================================================================
   PHASES
   ====================================================================== */

export const PHASES = {
    announcement: {
        Icon: PhaseAnnouncementIcon,
        label: "Announcement",
        colorVar: "var(--color-phase-announcement)",
        hint: "A new claim has come in. Read it carefully.",
    },
    investigation: {
        Icon: PhaseInvestigationIcon,
        label: "Investigation",
        colorVar: "var(--color-phase-investigation)",
        hint: "Work your role. Gather what you can before time runs out.",
    },
    evidence: {
        Icon: PhaseEvidenceIcon,
        label: "Evidence",
        colorVar: "var(--color-phase-evidence)",
        hint: "Everything the team found, side by side.",
    },
    discussion: {
        Icon: PhaseDiscussionIcon,
        label: "Discussion",
        colorVar: "var(--color-phase-discussion)",
        hint: "Compare findings. Challenge anything that doesn't hold up.",
    },
    consensus: {
        Icon: PhaseConsensusIcon,
        label: "Consensus",
        colorVar: "var(--color-phase-consensus)",
        hint: "Commit to a verdict.",
    },
    reveal: {
        Icon: PhaseRevealIcon,
        label: "Reveal",
        colorVar: "var(--color-phase-reveal)",
        hint: "The real classification, and why.",
    },
};

export const PHASE_ORDER = [
    "announcement",
    "investigation",
    "evidence",
    "discussion",
    "consensus",
    "reveal",
];

/* Server phase strings that don't map 1:1 onto the six-step flow. "result"
   is the server's name for the reveal step; waiting and finished sit
   outside a round entirely and have no place on the rail. */
const PHASE_ALIASES = {
    result: "reveal",
};

export function resolvePhaseKey(phase) {
    if (!phase) {
        return null;
    }

    return PHASE_ALIASES[phase] || (PHASES[phase] ? phase : null);
}

export function getPhaseVisual(phase) {
    const key = resolvePhaseKey(phase);

    return key ? PHASES[key] : null;
}

/* How far through the round a given phase sits, for the rail's progress
   treatment. Returns -1 for phases outside a round. */
export function getPhaseIndex(phase) {
    const key = resolvePhaseKey(phase);

    return key ? PHASE_ORDER.indexOf(key) : -1;
}

/* ======================================================================
   EVIDENCE TYPES
   ====================================================================== */

export const EVIDENCE_TYPES = {
    document: { Icon: EvidenceDocumentIcon, label: "Document" },
    source: { Icon: EvidenceDocumentIcon, label: "Source" },
    image: { Icon: EvidenceImageIcon, label: "Image" },
    statistic: { Icon: EvidenceStatIcon, label: "Statistic" },
    quote: { Icon: EvidenceQuoteIcon, label: "Quote" },
    link: { Icon: EvidenceLinkIcon, label: "Link" },
};

export function getEvidenceVisual(type) {
    return EVIDENCE_TYPES[type] || EVIDENCE_TYPES.document;
}
