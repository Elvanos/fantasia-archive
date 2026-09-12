import type {
  I_faProjectMediaMassEditRow,
  I_faProjectMediaUpsertItem
} from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

export async function persistDialogProjectMediaSingleEdit (input: {
  afterSuccess: 'closeDialog' | 'closeSlide' | 'staySlide'
  closeSlide: () => void
  dialogModel: I_ref<boolean>
  draft: I_ref<I_faProjectMediaMassEditRow | null>
  mapRowToUpsertItem: (row: I_faProjectMediaMassEditRow) => I_faProjectMediaUpsertItem
  rebindDraftFromList: (id: string) => void
  reloadList: () => Promise<void>
  runFaActionAwait: (
    id: 'saveProjectMedia',
    payload: { items: I_faProjectMediaUpsertItem[] }
  ) => Promise<boolean>
}): Promise<void> {
  const row = input.draft.value
  if (row === null) {
    return
  }
  const items = [input.mapRowToUpsertItem(row)]
  const saved = await input.runFaActionAwait('saveProjectMedia', { items })
  if (!saved) {
    return
  }
  await applyDialogProjectMediaSingleEditSaveSuccess({
    afterSuccess: input.afterSuccess,
    closeSlide: input.closeSlide,
    dialogModel: input.dialogModel,
    rebindDraftFromList: input.rebindDraftFromList,
    reloadList: input.reloadList,
    savedId: row.id
  })
}

async function applyDialogProjectMediaSingleEditSaveSuccess (input: {
  afterSuccess: 'closeDialog' | 'closeSlide' | 'staySlide'
  closeSlide: () => void
  dialogModel: I_ref<boolean>
  rebindDraftFromList: (id: string) => void
  reloadList: () => Promise<void>
  savedId: string
}): Promise<void> {
  if (input.afterSuccess === 'closeDialog') {
    input.dialogModel.value = false
    return
  }
  if (input.afterSuccess === 'staySlide') {
    await input.reloadList()
    input.rebindDraftFromList(input.savedId)
    return
  }
  input.closeSlide()
  await input.reloadList()
}

export function bindDialogProjectMediaSingleEditSave (input: {
  closeSlide: () => void
  dialogModel: I_ref<boolean>
  draft: I_ref<I_faProjectMediaMassEditRow | null>
  mapRowToUpsertItem: (row: I_faProjectMediaMassEditRow) => I_faProjectMediaUpsertItem
  rebindDraftFromList: (id: string) => void
  reloadList: () => Promise<void>
  runFaActionAwait: (
    id: 'saveProjectMedia',
    payload: { items: I_faProjectMediaUpsertItem[] }
  ) => Promise<boolean>
}): {
    saveAndCloseDialog: () => Promise<void>
    saveSlide: () => Promise<void>
    saveSlideStay: () => Promise<void>
  } {
  async function saveAndCloseDialog (): Promise<void> {
    await persistDialogProjectMediaSingleEdit({
      afterSuccess: 'closeDialog',
      closeSlide: input.closeSlide,
      dialogModel: input.dialogModel,
      draft: input.draft,
      mapRowToUpsertItem: input.mapRowToUpsertItem,
      rebindDraftFromList: input.rebindDraftFromList,
      reloadList: input.reloadList,
      runFaActionAwait: input.runFaActionAwait
    })
  }
  async function saveSlide (): Promise<void> {
    await persistDialogProjectMediaSingleEdit({
      afterSuccess: 'closeSlide',
      closeSlide: input.closeSlide,
      dialogModel: input.dialogModel,
      draft: input.draft,
      mapRowToUpsertItem: input.mapRowToUpsertItem,
      rebindDraftFromList: input.rebindDraftFromList,
      reloadList: input.reloadList,
      runFaActionAwait: input.runFaActionAwait
    })
  }
  async function saveSlideStay (): Promise<void> {
    await persistDialogProjectMediaSingleEdit({
      afterSuccess: 'staySlide',
      closeSlide: input.closeSlide,
      dialogModel: input.dialogModel,
      draft: input.draft,
      mapRowToUpsertItem: input.mapRowToUpsertItem,
      rebindDraftFromList: input.rebindDraftFromList,
      reloadList: input.reloadList,
      runFaActionAwait: input.runFaActionAwait
    })
  }
  return {
    saveAndCloseDialog,
    saveSlide,
    saveSlideStay
  }
}
