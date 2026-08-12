import { Result } from 'neverthrow'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { registerComponentDialogStackGuard } from 'app/src/scripts/appGlobalManagementUI/appGlobalManagementUI_manager'
import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'
import { resolveFaProjectWorldDisplayName } from 'app/src/scripts/projectWorlds/faProjectWorldDisplayName_manager'
import { createResolveDialogComponentStore } from 'app/src/components/dialogs/DialogAboutFantasiaArchive/scripts/functions/createResolveDialogComponentStore'
import {
  pickFaProjectDialogLastSelectedWorldId,
  readFaProjectLastSelectedWorldId,
  writeFaProjectLastSelectedWorldId
} from 'app/src/scripts/projectDialogUiPref/projectDialogUiPref_manager'
import { S_DialogComponent } from 'src/stores/S_Dialog'

import {
  loadDialogQuickSearchDocumentDocumentsForWorld,
  loadDialogQuickSearchDocumentSources,
  readDialogQuickSearchDocumentDisableCloseAfterSelect,
  resolveDialogQuickSearchDocumentPreferredLanguageCode
} from './dialogQuickSearchDocumentDataWiring'
import { runDialogQuickSearchDocumentSession } from './dialogQuickSearchDocumentSessionWiring'
import { createUseDialogQuickSearchDocument } from './functions/createUseDialogQuickSearchDocument'
import {
  isDialogQuickSearchDocumentDirectInput,
  isDialogQuickSearchDocumentStoreTarget
} from './functions/dialogQuickSearchDocumentDialogInput'
import {
  FA_DIALOG_QUICK_SEARCH_DOCUMENT_FOCUS_MS,
  buildDialogQuickSearchDocumentDocumentOptions,
  buildDialogQuickSearchDocumentWorldOptions,
  pickFirstDialogQuickSearchDocumentWorldId,
  resolveDialogQuickSearchDocumentOptionIcon
} from './functions/dialogQuickSearchDocumentOptions'

const resolveDialogComponentStoreOrNullBinding = createResolveDialogComponentStore({
  fromThrowable: Result.fromThrowable,
  getDialogComponentStore: () => S_DialogComponent()
}).resolveDialogComponentStore

export const useDialogQuickSearchDocument = createUseDialogQuickSearchDocument({
  buildDocumentOptions: buildDialogQuickSearchDocumentDocumentOptions,
  buildWorldOptions: buildDialogQuickSearchDocumentWorldOptions,
  computed,
  documentFocusMs: FA_DIALOG_QUICK_SEARCH_DOCUMENT_FOCUS_MS,
  isDialogQuickSearchDocumentDirectInput,
  isDialogQuickSearchDocumentStoreTarget,
  loadDocumentsForWorld: loadDialogQuickSearchDocumentDocumentsForWorld,
  loadQuickSearchDocumentSources: loadDialogQuickSearchDocumentSources,
  nextTick,
  onBeforeUnmount,
  onMounted,
  pickFirstWorldId: pickFirstDialogQuickSearchDocumentWorldId,
  pickWorldIdWithSavedPreference: pickFaProjectDialogLastSelectedWorldId,
  readDisableCloseAfterSelectQuickSearch: readDialogQuickSearchDocumentDisableCloseAfterSelect,
  readLastSelectedWorldId: readFaProjectLastSelectedWorldId,
  ref,
  registerComponentDialogStackGuard,
  resolveDialogComponentStoreOrNull: resolveDialogComponentStoreOrNullBinding,
  resolveDocumentOptionIcon: resolveDialogQuickSearchDocumentOptionIcon,
  resolvePreferredLanguageCode: resolveDialogQuickSearchDocumentPreferredLanguageCode,
  resolveWorldOptionLabel: resolveFaProjectWorldDisplayName,
  runDialogQuickSearchDocumentSession,
  runFaAction,
  sleep: async (ms) => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms)
    })
  },
  watch,
  writeLastSelectedWorldId: writeFaProjectLastSelectedWorldId
})

export { FA_DIALOG_QUICK_SEARCH_DOCUMENT_FOCUS_MS }

export { buildDialogQuickSearchDocumentWorldOptionIconStyle } from './dialogQuickSearchDocumentWorldIconStyleWiring'
