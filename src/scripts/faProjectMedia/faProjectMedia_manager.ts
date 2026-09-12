import {
  FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
  normalizeFaProjectMediaPanel,
  resolveFaProjectMediaDialogPersistent,
  resolveFaProjectMediaDialogTitleI18nKey,
  resolveFaProjectMediaOpenPanel
} from './functions/faProjectMediaPanel'
import {
  FA_PROJECT_MEDIA_AUDIO_CONTROLS_RELAYOUT_MS,
  relayoutFaProjectMediaAudioControls
} from './functions/faProjectMediaAudioControlsRelayout'
import {
  applyFaProjectMediaMassEditPreviewProbe,
  FA_PROJECT_MEDIA_MASS_EDIT_PREVIEW_DEBOUNCE_MS,
  markFaProjectMediaMassEditPreviewFailed,
  markFaProjectMediaMassEditPreviewLoaded,
  resolveFaProjectMediaThumbCaption
} from './functions/faProjectMediaMassEditPreview'
import { createFaProjectMediaMassEditPreviewBindFactory } from './functions/faProjectMediaMassEditPreviewBind'
import {
  resolveFaProjectMediaMassEditPreviewKind,
  resolveFaProjectMediaMassEditPreviewTypeIconName
} from './functions/faProjectMediaMassEditPreviewKind'
import {
  applyFaProjectMediaMassEditExternalTypePatch,
  applyFaProjectMediaMassEditInternalTypePatch,
  applyFaProjectMediaMassEditTypePatch,
  appendFaProjectMediaMassEditIntakeRows,
  createFaProjectMediaMassEditRowsFromOnlineUrlsDraft,
  hasFaProjectMediaOnlineUrlDraftContent,
  isFaProjectMediaExternalType,
  isFaProjectMediaInternalType,
  isFaProjectMediaType,
  readFaSelectInputObjectId,
  resolveFaProjectMediaDisplayNameFromUrl,
  resolveFaProjectMediaMassEditFieldEnablement,
  resolveFaProjectMediaMassEditPreviewUrl,
  splitFaProjectMediaOnlineUrlDraftLines
} from './functions/faProjectMediaMassEditRow'
import {
  isFaProjectMediaMassEditRowDirty,
  mapFaProjectMediaToMassEditRow
} from './functions/faProjectMediaMassEditDraft'
import {
  mapFaProjectMediaMassEditRowToUpsertItem,
  mapFaProjectMediaMassEditRowsToUpsertItems
} from './functions/faProjectMediaMassEditUpsert'
import {
  buildFaProjectMediaMassEditSelectOptionLists,
  selectFaProjectMediaMassEditOptionById
} from './functions/faProjectMediaMassEditTableModel'

export const createFaProjectMediaMassEditPreviewBind = createFaProjectMediaMassEditPreviewBindFactory({
  applyProbeFn: applyFaProjectMediaMassEditPreviewProbe,
  markFailedFn: markFaProjectMediaMassEditPreviewFailed,
  markLoadedFn: markFaProjectMediaMassEditPreviewLoaded,
  resolveKindFn: resolveFaProjectMediaMassEditPreviewKind,
  resolveTypeIconNameFn: resolveFaProjectMediaMassEditPreviewTypeIconName
})

export {
  FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
  FA_PROJECT_MEDIA_AUDIO_CONTROLS_RELAYOUT_MS,
  FA_PROJECT_MEDIA_MASS_EDIT_PREVIEW_DEBOUNCE_MS,
  appendFaProjectMediaMassEditIntakeRows,
  applyFaProjectMediaMassEditExternalTypePatch,
  applyFaProjectMediaMassEditInternalTypePatch,
  applyFaProjectMediaMassEditPreviewProbe,
  applyFaProjectMediaMassEditTypePatch,
  buildFaProjectMediaMassEditSelectOptionLists,
  createFaProjectMediaMassEditRowsFromOnlineUrlsDraft,
  hasFaProjectMediaOnlineUrlDraftContent,
  isFaProjectMediaExternalType,
  isFaProjectMediaInternalType,
  isFaProjectMediaMassEditRowDirty,
  isFaProjectMediaType,
  mapFaProjectMediaMassEditRowToUpsertItem,
  mapFaProjectMediaMassEditRowsToUpsertItems,
  mapFaProjectMediaToMassEditRow,
  markFaProjectMediaMassEditPreviewFailed,
  markFaProjectMediaMassEditPreviewLoaded,
  normalizeFaProjectMediaPanel,
  readFaSelectInputObjectId,
  relayoutFaProjectMediaAudioControls,
  resolveFaProjectMediaDialogPersistent,
  resolveFaProjectMediaDialogTitleI18nKey,
  resolveFaProjectMediaDisplayNameFromUrl,
  resolveFaProjectMediaMassEditFieldEnablement,
  resolveFaProjectMediaMassEditPreviewUrl,
  resolveFaProjectMediaOpenPanel,
  resolveFaProjectMediaThumbCaption,
  selectFaProjectMediaMassEditOptionById,
  splitFaProjectMediaOnlineUrlDraftLines
}
