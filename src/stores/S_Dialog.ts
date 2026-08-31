import type { Ref } from 'vue'
import type { T_documentName } from 'app/types/T_appDialogsAndDocuments'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

import { v4 as uuidv4 } from 'uuid'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  decrementDialogOpenCountNonNegative,
  incrementDialogOpenCount
} from './functions/dialogOpenCount'

/**
 * This store manages the state of the markdown document dialogs in the application.
 */
export const S_DialogMarkdown = defineStore('S_DialogMarkdown', () => {
  const documentToOpen: Ref<T_documentName> = ref('license')

  const dialogUUID: Ref<string> = ref('')

  const markdownDialogOpenCount = ref(0)

  function generateDialogUUID () {
    dialogUUID.value = uuidv4()
  }

  function onMarkdownDialogBecameVisible (): void {
    markdownDialogOpenCount.value = incrementDialogOpenCount(markdownDialogOpenCount.value)
  }

  function onMarkdownDialogBecameHidden (): void {
    markdownDialogOpenCount.value = decrementDialogOpenCountNonNegative(markdownDialogOpenCount.value)
  }

  return {
    dialogUUID,
    documentToOpen,
    generateDialogUUID,
    markdownDialogOpenCount,
    onMarkdownDialogBecameHidden,
    onMarkdownDialogBecameVisible
  }
})

/**
 * This store manages the state of the component dialogs in the application.
 */
export const S_DialogComponent = defineStore('S_DialogComponent', () => {
  const dialogToOpen: Ref<T_dialogName> = ref('AboutFantasiaArchive')

  const dialogUUID: Ref<string> = ref('')

  /**
   * Optional Project Settings category tab applied on next open, then cleared.
   */
  const projectSettingsInitialTab: Ref<string | null> = ref(null)

  /**
   * Project Media slide panel requested by openProjectMediaDialog. Live while open.
   * TEMPORARY default mass edit. Restore mediaList when the experiment ends.
   */
  const projectMediaRequestedPanel: Ref<T_faProjectMediaPanel> = ref('mediaMassEdit')

  const componentDialogOpenCount = ref(0)

  function generateDialogUUID () {
    dialogUUID.value = uuidv4()
  }

  function onComponentDialogBecameVisible (): void {
    componentDialogOpenCount.value = incrementDialogOpenCount(componentDialogOpenCount.value)
  }

  function onComponentDialogBecameHidden (): void {
    componentDialogOpenCount.value = decrementDialogOpenCountNonNegative(componentDialogOpenCount.value)
  }

  function consumeProjectSettingsInitialTab (): string | null {
    const tab = projectSettingsInitialTab.value
    projectSettingsInitialTab.value = null
    return tab
  }

  return {
    componentDialogOpenCount,
    consumeProjectSettingsInitialTab,
    dialogToOpen,
    dialogUUID,
    generateDialogUUID,
    onComponentDialogBecameHidden,
    onComponentDialogBecameVisible,
    projectMediaRequestedPanel,
    projectSettingsInitialTab
  }
})
