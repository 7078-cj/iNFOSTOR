/*
|--------------------------------------------------------------------------
| Icon Set — public entry point
|--------------------------------------------------------------------------
| Import icons from here rather than reaching into the individual files, and
| never inline a raw <svg> in a screen. Everything in this set shares one
| chassis (IconBase) so stroke weight, corner treatment and colour
| inheritance stay consistent as the set grows.
|
| Division of labour with Lucide:
|
|   custom (this set)   anything that carries game meaning — roles, verdicts,
|                       phases, evidence types. These are the game's identity
|                       and are drawn to match each other.
|
|   lucide-react        generic interface chrome only — close, chevrons,
|                       copy, external-link, spinners. One library, never
|                       mixed with another stock set.
|
| If an icon needs to mean something in the game, it belongs here.
*/

export { default as IconBase } from "./IconBase";

export {
    DetectiveIcon,
    ResearcherIcon,
    SourceInvestigatorIcon,
    ImageInvestigatorIcon,
    DataAnalystIcon,
    MediaLiteracyIcon,
    ImposterIcon,
} from "./RoleIcons";

export {
    VerdictTrueIcon,
    VerdictMisleadingIcon,
    VerdictFalseIcon,
    VerdictContextIcon,
    VerdictContinueIcon,
} from "./VerdictIcons";

export {
    PhaseAnnouncementIcon,
    PhaseInvestigationIcon,
    PhaseEvidenceIcon,
    PhaseDiscussionIcon,
    PhaseConsensusIcon,
    PhaseRevealIcon,
} from "./PhaseIcons";

export {
    EvidenceDocumentIcon,
    EvidenceImageIcon,
    EvidenceStatIcon,
    EvidenceQuoteIcon,
    EvidenceLinkIcon,
} from "./EvidenceIcons";

export {
    ROLE_ICONS,
    INVESTIGATOR_ROLE_ORDER,
    getRoleVisual,
    VERDICTS,
    CLASSIFICATION_ORDER,
    getVerdict,
    PHASES,
    PHASE_ORDER,
    resolvePhaseKey,
    getPhaseVisual,
    getPhaseIndex,
    EVIDENCE_TYPES,
    getEvidenceVisual,
} from "./registry";
