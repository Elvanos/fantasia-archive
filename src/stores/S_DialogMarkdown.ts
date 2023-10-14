import type { Ref } from 'vue'
import { T_documentList } from 'app/interfaces/T_documentList'

import { v4 as uuidv4 } from 'uuid'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const S_DialogMarkdown = defineStore('S_DialogMarkdown', () => {
  const documentToOpen: Ref<T_documentList> = ref('license')

  const dialogUUID: Ref<string> = ref('')

  function generateDialogUUID () {
    dialogUUID.value = uuidv4()
  }

  return { documentToOpen, dialogUUID, generateDialogUUID }
})()
