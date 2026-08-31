import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type {
  I_faProjectMediaMassEditRow,
  T_faProjectMediaAddSubView,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

const addSubViewDropZone: T_faProjectMediaAddSubView = 'dropZone'
const addSubViewOnlineUrls: T_faProjectMediaAddSubView = 'onlineUrls'
const massEditPanel: T_faProjectMediaPanel = 'mediaMassEdit'

type T_dialogProjectMediaFactoryDeps = {
  createMassEditRowsFromOnlineUrlsDraft: (draft: string) => I_faProjectMediaMassEditRow[]
  getRequestedPanel: () => T_faProjectMediaPanel
  isDialogProjectMediaDirectInput: (input: T_dialogName | undefined) => boolean
  isDialogProjectMediaStoreTarget: (dialogToOpen: unknown) => boolean
  normalizeFaProjectMediaPanel: (value: unknown) => T_faProjectMediaPanel
  onMounted: (hook: () => void) => void
  ref: <T>(value: T) => I_ref<T>
  registerComponentDialogStackGuard: (dialogModel: I_ref<boolean>) => void
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  watch: (source: () => unknown, effect: () => void) => void
}

type T_dialogProjectMediaProps = {
  directInput?: T_dialogName | undefined
  initialPanel?: T_faProjectMediaPanel | undefined
}

function bindUseDialogProjectMedia (
  deps: T_dialogProjectMediaFactoryDeps,
  props: T_dialogProjectMediaProps
): {
    addSubView: I_ref<T_faProjectMediaAddSubView>
    dialogModel: I_ref<boolean>
    documentName: I_ref<string>
    massEditRows: I_ref<I_faProjectMediaMassEditRow[]>
    onlineUrlsDraft: I_ref<string>
    searchQuery: I_ref<string>
    selectedPanel: I_ref<T_faProjectMediaPanel>
    showAddOnlineUrlsSubView: () => void
    submitOnlineUrls: () => void
  } {
  const dialogModel = deps.ref(false)
  deps.registerComponentDialogStackGuard(dialogModel)
  const documentName = deps.ref('')
  const searchQuery = deps.ref('')
  const selectedPanel = deps.ref(deps.normalizeFaProjectMediaPanel(undefined))
  const addSubView = deps.ref(addSubViewDropZone)
  const onlineUrlsDraft = deps.ref('')
  const massEditRows = deps.ref([] as I_faProjectMediaMassEditRow[])

  function resolveOpenPanel (): T_faProjectMediaPanel {
    if (props.initialPanel !== undefined) {
      return deps.normalizeFaProjectMediaPanel(props.initialPanel)
    }
    return deps.getRequestedPanel()
  }

  function resetAddMediaSubView (): void {
    addSubView.value = addSubViewDropZone
    onlineUrlsDraft.value = ''
  }

  function resetSessionOnClose (): void {
    resetAddMediaSubView()
    massEditRows.value = []
  }

  function showAddOnlineUrlsSubView (): void {
    addSubView.value = addSubViewOnlineUrls
  }

  function applyMassEditIntake (incoming: I_faProjectMediaMassEditRow[]): void {
    massEditRows.value = [...massEditRows.value, ...incoming]
  }

  function submitOnlineUrls (): void {
    const incoming = deps.createMassEditRowsFromOnlineUrlsDraft(onlineUrlsDraft.value)
    applyMassEditIntake(incoming)
    selectedPanel.value = massEditPanel
  }

  function openDialog (input: T_dialogName): void {
    documentName.value = input
    selectedPanel.value = resolveOpenPanel()
    dialogModel.value = true
  }

  deps.watch(() => deps.resolveDialogComponentStore()?.dialogUUID, () => {
    const dialogComponentStore = deps.resolveDialogComponentStore()
    if (
      dialogComponentStore !== null &&
      deps.isDialogProjectMediaStoreTarget(dialogComponentStore.dialogToOpen)
    ) {
      openDialog(dialogComponentStore.dialogToOpen as T_dialogName)
    }
  })

  deps.watch(() => props.directInput, () => {
    if (deps.isDialogProjectMediaDirectInput(props.directInput)) {
      openDialog(props.directInput as T_dialogName)
    }
  })

  deps.watch(() => deps.getRequestedPanel(), () => {
    if (dialogModel.value) {
      selectedPanel.value = deps.getRequestedPanel()
    }
  })

  deps.watch(() => dialogModel.value, () => {
    if (!dialogModel.value) {
      resetSessionOnClose()
    }
  })

  deps.onMounted(() => {
    if (deps.isDialogProjectMediaDirectInput(props.directInput)) {
      openDialog(props.directInput as T_dialogName)
    }
  })

  return {
    addSubView,
    dialogModel,
    documentName,
    massEditRows,
    onlineUrlsDraft,
    searchQuery,
    selectedPanel,
    showAddOnlineUrlsSubView,
    submitOnlineUrls
  }
}

export function createDialogProjectMedia (deps: T_dialogProjectMediaFactoryDeps): {
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  useDialogProjectMedia: (props: T_dialogProjectMediaProps) => ReturnType<
    typeof bindUseDialogProjectMedia
  >
} {
  const resolveDialogComponentStore = deps.resolveDialogComponentStore
  function useDialogProjectMedia (props: T_dialogProjectMediaProps) {
    return bindUseDialogProjectMedia(deps, props)
  }
  return {
    resolveDialogComponentStore,
    useDialogProjectMedia
  }
}
