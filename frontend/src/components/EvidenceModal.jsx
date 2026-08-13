import investigationContent from "../data/investigationContent";
import TVView from "./evidenceModals/TVView";
import RadioView from "./evidenceModals/RadioView";
import LibraryView from "./evidenceModals/LibraryView";
import BulletinView from "./evidenceModals/BulletinView";
import ComputerView from "./evidenceModals/ComputerView";
import NewsDeskView from "./evidenceModals/NewsDeskView";
import { ModalBackdrop, EmptySourceMessage } from "./evidenceModals/shared";

const OBJECT_LABELS = {
    library: "Public Library",
    tv: "Channel 4 News TV",
    bulletin: "Municipal Noticeboard",
    radio: "Radyo Bayan FM",
    computer: "Investigation Terminal",
    newsdesk: "City News Desk",
    "archive-computer": "Archive Terminal",
    "second-radio": "Community Radio Booth",
};

const CONTENT_KEY_MAP = {
    newsdesk: "bulletin",
    "archive-computer": "computer",
    "second-radio": "radio",
};

/**
 * Routes to a themed modal UI based on which world object was interacted with.
 */
export default function EvidenceModal({
    objectId,
    announcementId,
    challenge,
    playerRole,
    onClose,
    onSubmitEvidence,
}) {
    if (!objectId) return null;

    const contentKey = CONTENT_KEY_MAP[objectId] || objectId;
    const content = investigationContent[announcementId]?.[contentKey];
    const objectLabel = OBJECT_LABELS[objectId] || objectId;

    const relevantToPlayer =
        playerRole && content?.bestFor?.includes(playerRole);

    const sharedProps = {
        objectLabel,
        challenge,
        relevantToPlayer,
        onSubmitEvidence,
        onClose,
    };

    return (
        <ModalBackdrop onClose={onClose}>
            {!content && <EmptySourceMessage />}

            {content && contentKey === "tv" && (
                <TVView
                    {...sharedProps}
                    title={content.title}
                    text={content.broadcast}
                />
            )}

            {content && contentKey === "radio" && (
                <RadioView
                    {...sharedProps}
                    title={content.title}
                    text={content.broadcast}
                />
            )}

            {content && contentKey === "library" && (
                <LibraryView
                    {...sharedProps}
                    title={content.title}
                    text={content.passage}
                />
            )}

            {content && objectId === "newsdesk" && (
                <NewsDeskView
                    {...sharedProps}
                    title={content.title}
                    text={content.notice}
                />
            )}

            {content && contentKey === "bulletin" && objectId !== "newsdesk" && (
                <BulletinView
                    {...sharedProps}
                    title={content.title}
                    text={content.notice}
                />
            )}

            {content && contentKey === "computer" && (
                <ComputerView
                    {...sharedProps}
                    content={content}
                    isArchive={objectId === "archive-computer"}
                />
            )}
        </ModalBackdrop>
    );
}
