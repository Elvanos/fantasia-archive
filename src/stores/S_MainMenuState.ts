import type { Ref } from 'vue'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const S_MainMenuState = defineStore('S_MainMenuState', () => {
  const mainMenuState: Ref<boolean> = ref(false)

  return { mainMenuState }
})()
