import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'
import type { I_ref } from 'app/types/I_vueCompositionShims'

export function createDialogProjectMedia (deps: {
  getRequestedPanel: () => T_faProjectMediaPanel
  isDialogProjectMediaDirectInput: (input: T_dialogName | undefined) => boolean
  isDialogProjectMediaStoreTarget: (dialogToOpen: unknown) => boolean
  normalizeFaProjectMediaPanel: (value: unknown) => T_faProjectMediaPanel
  onMounted: (hook: () => void) => void
  ref: <T>(value: T) => I_ref<T>
  registerComponentDialogStackGuard: (dialogModel: I_ref<boolean>) => void
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  watch: (source: () => unknown, effect: () => void) => void
}): {
    resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
    useDialogProjectMedia: (props: {
      directInput?: T_dialogName | undefined
      initialPanel?: T_faProjectMediaPanel | undefined
    }) => {
      dialogModel: I_ref<boolean>
      documentName: I_ref<string>
      searchQuery: I_ref<string>
      selectedPanel: I_ref<T_faProjectMediaPanel>
    }
  } {
  const resolveDialogComponentStore = deps.resolveDialogComponentStore

  const useDialogProjectMedia = (props: {
    directInput?: T_dialogName | undefined
    initialPanel?: T_faProjectMediaPanel | undefined
  }) => {
    const dialogModel = deps.ref(false)
    deps.registerComponentDialogStackGuard(dialogModel)
    const documentName = deps.ref('')
    const searchQuery = deps.ref('')
    const selectedPanel = deps.ref(deps.normalizeFaProjectMediaPanel(undefined))

    function resolveOpenPanel (): T_faProjectMediaPanel {
      if (props.initialPanel !== undefined) {
        return deps.normalizeFaProjectMediaPanel(props.initialPanel)
      }
      return deps.getRequestedPanel()
    }

    function openDialog (input: T_dialogName): void {
      documentName.value = input
      selectedPanel.value = resolveOpenPanel()
      dialogModel.value = true
    }

    deps.watch(() => resolveDialogComponentStore()?.dialogUUID, () => {
      const dialogComponentStore = resolveDialogComponentStore()
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

    deps.onMounted(() => {
      if (deps.isDialogProjectMediaDirectInput(props.directInput)) {
        openDialog(props.directInput as T_dialogName)
      }
    })

    return {
      dialogModel,
      documentName,
      searchQuery,
      selectedPanel
    }
  }

  return {
    resolveDialogComponentStore,
    useDialogProjectMedia
  }
}
