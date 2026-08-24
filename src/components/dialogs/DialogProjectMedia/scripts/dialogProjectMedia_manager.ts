import { registerComponentDialogStackGuard } from 'app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager'
import { S_DialogComponent } from 'src/stores/S_Dialog'
import { onMounted, ref, watch } from 'vue'
import { Result } from 'neverthrow'

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
  isDialogProjectMediaDirectInput,
  isDialogProjectMediaStoreTarget,
  onMounted,
  ref,
  registerComponentDialogStackGuard,
  resolveDialogComponentStore: resolveDialogComponentStoreBinding.resolveDialogComponentStore,
  watch
})

export const resolveDialogComponentStore = dialogProjectMediaApi.resolveDialogComponentStore

export const useDialogProjectMedia = dialogProjectMediaApi.useDialogProjectMedia
