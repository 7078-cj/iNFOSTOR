import investigationContent from "../data/investigationContent";
import {
    getSourceContent,
    getModalType,
} from "../data/sourceVariants";
import {
    CONTENT_TYPE_MAP,
    OBJECT_LABELS,
} from "../data/mapInteractables";
import TVView from "./evidenceModals/TVView";
import RadioView from "./evidenceModals/RadioView";
import LibraryView from "./evidenceModals/LibraryView";
import BulletinView from "./evidenceModals/BulletinView";
import ComputerView from "./evidenceModals/ComputerView";
import NewsDeskView from "./evidenceModals/NewsDeskView";
import { ModalBackdrop, EmptySourceMessage } from "./evidenceModals/shared";

export default function EvidenceModal({
    objectId,
    announcementId,
    challenge,
    playerRole,
    onClose,
    onSubmitEvidence,
}) {
    if (!objectId || !announcementId) return null;

    const baseContent = investigationContent[announcementId] || {};
    const content = getSourceContent(
        announcementId,
        objectId,
        baseContent,
        CONTENT_TYPE_MAP
    );

    const modalType = getModalType(objectId, CONTENT_TYPE_MAP);
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

            {content && modalType === "tv" && (
                <TVView
                    {...sharedProps}
                    title={content.title}
                    text={content.broadcast}
                />
            )}

            {content && modalType === "radio" && (
                <RadioView
                    {...sharedProps}
                    title={content.title}
                    text={content.broadcast}
                />
            )}

            {content && modalType === "library" && (
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

            {content &&
                modalType === "bulletin" &&
                objectId !== "newsdesk" && (
                    <BulletinView
                        {...sharedProps}
                        title={content.title}
                        text={content.notice}
                    />
                )}

            {content && modalType === "computer" && (
                <ComputerView
                    {...sharedProps}
                    content={content}
                    isArchive={
                        objectId === "archive-computer" ||
                        objectId === "official-records"
                    }
                />
            )}
        </ModalBackdrop>
    );
}
