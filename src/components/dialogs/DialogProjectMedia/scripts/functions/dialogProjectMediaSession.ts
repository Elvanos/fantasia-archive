import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

const addPanel: T_faProjectMediaPanel = 'mediaAdd'
const addOnlineUrlsPanel: T_faProjectMediaPanel = 'mediaAddOnlineUrls'
const listPanel: T_faProjectMediaPanel = 'mediaList'
const massEditPanel: T_faProjectMediaPanel = 'mediaMassEdit'

export function resetOnlineUrlsDraftIfEnteringPanel (
  selectedPanel: T_faProjectMediaPanel,
  onlineUrlsDraft: I_ref<string>
): void {
  if (selectedPanel === addOnlineUrlsPanel) {
    onlineUrlsDraft.value = ''
  }
}

export function resetSessionOnClose (
  selectedPanel: I_ref<T_faProjectMediaPanel>,
  onlineUrlsDraft: I_ref<string>,
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>,
  listMediaItems: I_ref<I_faProjectMedia[]>,
  singleEditDraft: I_ref<I_faProjectMediaMassEditRow | null>,
  singleEditBaseline: I_ref<I_faProjectMediaMassEditRow | null>,
  singleEditSlideOpen: I_ref<boolean>
): void {
  onlineUrlsDraft.value = ''
  massEditRows.value = []
  listMediaItems.value = []
  singleEditDraft.value = null
  singleEditBaseline.value = null
  singleEditSlideOpen.value = false
  if (selectedPanel.value === addOnlineUrlsPanel) {
    selectedPanel.value = addPanel
  }
}

export function submitOnlineUrlsIntake (input: {
  createMassEditRowsFromOnlineUrlsDraft: (draft: string) => I_faProjectMediaMassEditRow[]
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
  onlineUrlsDraft: I_ref<string>
  selectedPanel: I_ref<T_faProjectMediaPanel>
}): void {
  const incoming = input.createMassEditRowsFromOnlineUrlsDraft(input.onlineUrlsDraft.value)
  if (incoming.length === 0) {
    return
  }
  input.massEditRows.value = [...input.massEditRows.value, ...incoming]
  input.selectedPanel.value = massEditPanel
}

export function shouldReloadDialogProjectMediaList (
  dialogOpen: boolean,
  selectedPanel: T_faProjectMediaPanel
): boolean {
  return dialogOpen && selectedPanel === listPanel
}

export function resolveDialogProjectMediaSessionWatchKey (
  dialogOpen: boolean,
  selectedPanel: T_faProjectMediaPanel
): string {
  return `${dialogOpen}:${selectedPanel}`
}

export async function applyDialogProjectMediaListLoad (input: {
  generation: { value: number }
  listItems: I_ref<I_faProjectMedia[]>
  loadListMedia: () => Promise<I_faProjectMedia[]>
}): Promise<void> {
  const nextGeneration = input.generation.value + 1
  input.generation.value = nextGeneration
  const items = await input.loadListMedia()
  if (input.generation.value !== nextGeneration) {
    return
  }
  input.listItems.value = items
}

export function scheduleDialogProjectMediaListLoad (input: {
  dialogOpen: boolean
  generation: { value: number }
  listItems: I_ref<I_faProjectMedia[]>
  loadListMedia: () => Promise<I_faProjectMedia[]>
  selectedPanel: T_faProjectMediaPanel
}): void {
  if (!shouldReloadDialogProjectMediaList(input.dialogOpen, input.selectedPanel)) {
    return
  }
  void applyDialogProjectMediaListLoad({
    generation: input.generation,
    listItems: input.listItems,
    loadListMedia: input.loadListMedia
  })
}

export function attachDialogProjectMediaWatches (input: {
  dialogModel: I_ref<boolean>
  getDirectInput: () => T_dialogName | undefined
  getRequestedPanel: () => T_faProjectMediaPanel
  isDialogProjectMediaDirectInput: (input: T_dialogName | undefined) => boolean
  isDialogProjectMediaStoreTarget: (dialogToOpen: unknown) => boolean
  listLoadGeneration: { value: number }
  listMediaItems: I_ref<I_faProjectMedia[]>
  loadListMedia: () => Promise<I_faProjectMedia[]>
  massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
  onlineUrlsDraft: I_ref<string>
  openDialog: (input: T_dialogName) => void
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  selectedPanel: I_ref<T_faProjectMediaPanel>
  singleEditBaseline: I_ref<I_faProjectMediaMassEditRow | null>
  singleEditDraft: I_ref<I_faProjectMediaMassEditRow | null>
  singleEditSlideOpen: I_ref<boolean>
  watch: (source: () => unknown, effect: () => void) => void
}): void {
  input.watch(() => input.resolveDialogComponentStore()?.dialogUUID, () => {
    const dialogComponentStore = input.resolveDialogComponentStore()
    if (
      dialogComponentStore !== null &&
      input.isDialogProjectMediaStoreTarget(dialogComponentStore.dialogToOpen)
    ) {
      input.openDialog(dialogComponentStore.dialogToOpen as T_dialogName)
    }
  })
  input.watch(() => input.getDirectInput(), () => {
    if (input.isDialogProjectMediaDirectInput(input.getDirectInput())) {
      input.openDialog(input.getDirectInput() as T_dialogName)
    }
  })
  input.watch(() => input.getRequestedPanel(), () => {
    if (input.dialogModel.value) {
      input.selectedPanel.value = input.getRequestedPanel()
    }
  })
  input.watch(() => input.selectedPanel.value, () => {
    resetOnlineUrlsDraftIfEnteringPanel(input.selectedPanel.value, input.onlineUrlsDraft)
  })
  input.watch(() => {
    return resolveDialogProjectMediaSessionWatchKey(
      input.dialogModel.value,
      input.selectedPanel.value
    )
  }, () => {
    if (!input.dialogModel.value) {
      resetSessionOnClose(
        input.selectedPanel,
        input.onlineUrlsDraft,
        input.massEditRows,
        input.listMediaItems,
        input.singleEditDraft,
        input.singleEditBaseline,
        input.singleEditSlideOpen
      )
      return
    }
    scheduleDialogProjectMediaListLoad({
      dialogOpen: input.dialogModel.value,
      generation: input.listLoadGeneration,
      listItems: input.listMediaItems,
      loadListMedia: input.loadListMedia,
      selectedPanel: input.selectedPanel.value
    })
  })
}
