import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type {
  I_createDialogProjectMediaDeps,
  I_dialogProjectMediaBound,
  I_dialogProjectMediaProps
} from 'app/types/I_createDialogProjectMedia'

export function createDialogProjectMedia (deps: I_createDialogProjectMediaDeps): {
  resolveDialogComponentStore: () => I_dialogComponentStoreLike | null
  useDialogProjectMedia: (props: I_dialogProjectMediaProps) => I_dialogProjectMediaBound
} {
  const resolveDialogComponentStore = deps.resolveDialogComponentStore
  function useDialogProjectMedia (props: I_dialogProjectMediaProps) {
    return deps.bindUse(deps, props)
  }
  return {
    resolveDialogComponentStore,
    useDialogProjectMedia
  }
}
