<template>
  <!-- App base-control button-group -->
  <q-btn-group
    flat
    class="globalWindowButtons bg-dark"
  >
    <!-- Minimize button -->
    <q-btn
      flat
      :ripple="false"
      dark
      size="xs"
      @click="minimizeWindow()"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ $t('globalWindowButtons_minimizeButton') }}
      </q-tooltip>
      <q-icon name="mdi-window-minimize" />
    </q-btn>

    <!-- MinMax button -->
    <q-btn
      flat
      :ripple="false"
      dark
      size="xs"
      @click="[resizeWindow(),checkIfWindowMaximized()]"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ isMaximized ? $t('globalWindowButtons_resizeButton') : $t('globalWindowButtons_maximizeButton') }}
      </q-tooltip>
      <q-icon :name="(isMaximized)? 'mdi-window-restore' : 'mdi-window-maximize'" />
    </q-btn>

    <!-- Close button -->
    <q-btn
      flat
      :ripple="false"
      dark
      size="xs"
      @click="tryCloseWindow()"
    >
      <q-tooltip
        :delay="1000"
        :offset="[0, 5]"
      >
        {{ $t('globalWindowButtons_close') }}
      </q-tooltip>
      <q-icon name="mdi-window-close" />
    </q-btn>
  </q-btn-group>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

// TODO Add all tests!

/*
Triggers minimize of the window by the minimize button click
*/
const minimizeWindow = () => {
  window.faWindowControlAPI.minimizeWindow()
}

/*
Triggers resize of the window by the min/max button click
*/
const resizeWindow = () => {
  window.faWindowControlAPI.resizeWindow()
}

/*
Triggers checking of the current app state by the close button click
This functionality checks the following:
  1. If the app has any projects opened to begin with at the moment
  2. If the project has any pending chnages to it
If both is found to be true, then an appropriate dialog is opened
Otherwise, the app simply closes
*/
const tryCloseWindow = () => {
  // TODO add project close checking
  window.faWindowControlAPI.closeWindow()
}

/*
Checks if the window is maximized and sets local ref
*/
const checkIfWindowMaximized = () => {
  isMaximized.value = window.faWindowControlAPI.checkWindowMaximized()
}

/*
Determines if the window is currently maximized or not
*/
const isMaximized: Ref<boolean> = ref(false)

/*
Check on component mount if the windows if maximized or not
*/
onMounted(() => {
  checkIfWindowMaximized()
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
