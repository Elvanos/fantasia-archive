<template>
  <!-- App base-control button-group -->
  <q-btn-group
    flat
    class="globalWindowButtons bg-dark"
  >
    <!-- Minimize button -->
    <q-btn
      flat
      dark
      size="xs"
      class="globalWindowButtons__minimize"
      data-test="globalWindowButtons-button-minimize"
      @click="minimizeWindow()"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ $t('GlobalWindowButtons.minimizeButton') }}
      </q-tooltip>
      <q-icon name="mdi-window-minimize" />
    </q-btn>

    <!-- MinMax button -->
    <q-btn
      flat
      dark
      size="xs"
      class="globalWindowButtons__resize"
      data-test="globalWindowButtons-button-resize"
      @click="[resizeWindow(),checkIfWindowMaximized()]"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ isMaximized ? $t('GlobalWindowButtons.resizeButton') : $t('GlobalWindowButtons.maximizeButton') }}
      </q-tooltip>
      <q-icon :name="(isMaximized)? 'mdi-window-restore' : 'mdi-window-maximize'" />
    </q-btn>

    <!-- Close button -->
    <q-btn
      flat
      dark
      size="xs"
      class="globalWindowButtons__close"
      data-test="globalWindowButtons-button-close"
      @click="tryCloseWindow()"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ $t('GlobalWindowButtons.close') }}
      </q-tooltip>
      <q-icon name="mdi-window-close" />
    </q-btn>
  </q-btn-group>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Triggers minimize of the window by the minimize button click
 */
const minimizeWindow = () => {
  if (process.env.MODE === 'electron') {
    window.faWindowControlAPI.minimizeWindow()
  }
}

/**
 * Triggers resize of the window by the min/max button click
 */
const resizeWindow = () => {
  if (process.env.MODE === 'electron') {
    window.faWindowControlAPI.resizeWindow()
  }
}

/**
 * Triggers checking of the current app state by the close button click.
 * This functionality checks the following:

 * 1. If the app has any projects opened to begin with at the moment
 * 2. If the project has any pending chnages to it

 * If both is found to be true, then an appropriate dialog is opened.
 * Otherwise, the app simply closes.
 */
const tryCloseWindow = () => {
  // TODO add project close checking
  if (process.env.MODE === 'electron') {
    window.faWindowControlAPI.closeWindow()
  }
}

/**
Checks if the window is maximized and sets local variable accordingly
*/
const checkIfWindowMaximized = () => {
  if (process.env.MODE === 'electron') {
    isMaximized.value = window.faWindowControlAPI.checkWindowMaximized()
  }
}

/**
 * Determines if the window is currently maximized or not
 */
const isMaximized: Ref<boolean> = ref(false)

/**
 * Window interval checker variable
 */
let checkerInterval: number

/**
 * Hook up a interval timer on mount for continuous checking
 * This done due to the fact that dragging via the top header bar doesn't properly fire "drag" event
 */
onMounted(() => {
  checkerInterval = window.setInterval(() => {
    checkIfWindowMaximized()
  }, 300)
})

/**
 *Unhook the interval timer on unmounting in order to prevent left-over intervals ticking in the app
 */
onUnmounted(() => {
  window.clearInterval(checkerInterval)
})

</script>

<style lang="scss" scoped>

.globalWindowButtons {
  position: fixed;
  z-index: 99999999;
  right: 0;
  top: 0;

  border-radius: 0;

  height:$globalWindowButtons_height;
  color: $globalWindowButtons_color;

  -webkit-app-region: no-drag;
}
</style>
