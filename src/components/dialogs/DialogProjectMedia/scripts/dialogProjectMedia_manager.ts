import { registerComponentDialogStackGuard } from 'app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager'
import { S_DialogComponent } from 'src/stores/S_Dialog'
import { onMounted, ref, watch } from 'vue'
import { Result } from 'neverthrow'

import { normalizeFaProjectMediaPanel } from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'
import {
  isDialogProjectMediaDirectInput,
  isDialogProjectMediaStoreTarget
} from './functions/dialogProjectMediaDialogInput'
import { createDialogProjectMedia } from './functions/createDialogProjectMedia'
import { createResolveDialogComponentStore } from './functions/createResolveDialogComponentStore'

const resolveDialogComponentStoreBinding = createResolveDialogComponentStore({
  fromThrowable: Result.fromThrowable,
  getDialogComponentStore: () => S_DialogComponent()
})

const dialogProjectMediaApi = createDialogProjectMedia({
  getRequestedPanel: () => {
    const store = resolveDialogComponentStoreBinding.resolveDialogComponentStore()
    return normalizeFaProjectMediaPanel(store?.projectMediaRequestedPanel)
  },
  isDialogProjectMediaDirectInput,
  isDialogProjectMediaStoreTarget,
  normalizeFaProjectMediaPanel,
  onMounted,
  ref,
  registerComponentDialogStackGuard,
  resolveDialogComponentStore: resolveDialogComponentStoreBinding.resolveDialogComponentStore,
  watch
})

export const resolveDialogComponentStore = dialogProjectMediaApi.resolveDialogComponentStore

export const useDialogProjectMedia = dialogProjectMediaApi.useDialogProjectMedia
