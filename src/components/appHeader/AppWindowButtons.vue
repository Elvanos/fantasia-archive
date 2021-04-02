<template>

   <q-btn-group
      flat
      class="appWindowButtons bg-dark"
   >

    <projectCloseCheckDialog
     :dialog-trigger="projectCloseCheckDialogTrigger"
     :dialog-mode="'appClose'"
      @trigger-dialog-close="projectCloseCheckDialogClose"
    />

    <!-- Minimize button-->
    <q-btn
      flat
      :ripple="false"
      :class="{'minimize': osSystem === 'darwin'}"
      dark
      size='sm'
      @click="minimizeWindow">
        <q-icon name="mdi-window-minimize"></q-icon>
    </q-btn>

    <!-- MinMax button-->
    <q-btn
      flat
      :ripple="false"
      :class="{'minMax': osSystem === 'darwin'}"
      dark
      size='sm'
      @click="resizeWindow">
        <q-icon :name="(isMaximized)? 'mdi-window-restore' : 'mdi-window-maximize'"></q-icon>
    </q-btn>

    <!-- Close button-->
    <q-btn
      flat
      :ripple="false"
      dark
      size='sm'
      @click="projectCloseCheckDialogAssignUID"
      :class="[{'close': osSystem === 'darwin'}]"
    >
      <q-icon name="mdi-window-close"></q-icon>
    </q-btn>

  </q-btn-group>

</template>

<script lang="ts">

import { Component } from "vue-property-decorator"
import { remote } from "electron"

import BaseClass from "src/BaseClass"
import projectCloseCheckDialog from "src/components/dialogs/ProjectCloseCheck.vue"

@Component({
  components: { projectCloseCheckDialog }
})
export default class AppWindowButtons extends BaseClass {
  /****************************************************************/
  // Basic component functionality
  /****************************************************************/

  /**
   * Determines if the window is maximed or not
   */
  isMaximized = false

  /**
   * Gets the currently used OS
   */
  osSystem = remote.process.platform

  /**
   * Currently opened window
   */
  currentWindow = remote.getCurrentWindow()

  /**
   * Checks if the window is currently maximized or not
   */
  checkIfMaximized () {
    this.isMaximized = this.currentWindow.isMaximized()
  }

  /**
   * Minimizes the current window
   */
  minimizeWindow () {
    this.currentWindow.minimize()
  }

  /**
   * Resizes the window to either smaller or maximized
   */
  resizeWindow () {
    if (this.currentWindow.isMaximized()) {
      this.currentWindow.unmaximize()
    }
    else {
      this.currentWindow.maximize()
    }
  }

  created () {
    window.addEventListener("resize", this.checkIfMaximized)
    this.checkIfMaximized()
  }

  destroyed () {
    window.addEventListener("resize", this.checkIfMaximized)
  }

  /****************************************************************/
  // Close project dialog
  /****************************************************************/

  projectCloseCheckDialogTrigger: string | false = false
  projectCloseCheckDialogClose () {
    this.projectCloseCheckDialogTrigger = false
  }

  projectCloseCheckDialogAssignUID () {
    this.projectCloseCheckDialogTrigger = this.generateUID()
  }
}
</script>

<style lang="scss" scoped>
.appWindowButtons {
  border-radius: 0;
  position: fixed;
  right: 0;
  top: 0;
  height: 40px;
  z-index: 99999999;
  color: #fff;
  -webkit-app-region: no-drag;
}
</style>

<style lang="scss" >

</style>
