<template>
  <q-layout view="hHh LpR lfr">

    <!-- Keybind dialog -->
    <keybindCheatsheetDialog
      :dialog-trigger="keybindsDialogTrigger"
      @trigger-dialog-close="keybindsDialogClose"
    />

     <!-- New document dialog -->
    <newDocumentDialog
      :dialog-trigger="newObjectDialogTrigger"
      @trigger-dialog-close="newObjectDialogClose"
    />

    <!-- Existing document dialog -->
    <existingDocumentDialog
      :dialog-trigger="existingObjectDialogTrigger"
      @trigger-dialog-close="existingObjectDialogClose"
    />

    <!-- Left drawer -->
    <q-drawer
      content-class="bg-dark text-cultured sideWrapper"
      v-model="leftDrawerOpen"
      side="left"
      :width=375
      show-if-above
      >

      <objectTree/>

       <q-page-sticky position="bottom-right" class="controlButtons">

          <q-btn
              icon="mdi-note-plus-outline"
              color="primary"
              @click="newObjectAssignUID"
            >
              <q-tooltip>
                Quick-add a new document.
              </q-tooltip>
            </q-btn>

            <q-btn
              icon="mdi-database-search"
              color="primary"
              @click="existingObjectAssignUID"
            >
              <q-tooltip>
                Quick-search an existing document.
              </q-tooltip>
            </q-btn>

            <q-btn
              icon="mdi-keyboard-outline"
              color="primary"
              @click="keybindsDialogAssignUID"
            >
              <q-tooltip>
                Show keybind cheatsheet.
              </q-tooltip>
            </q-btn>
        </q-page-sticky>

    </q-drawer>

    <!-- Header -->
    <appHeader
      :is-project="true"
    />

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="300"
      >
      <router-view :key="$route.path" />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import BaseClass from "src/BaseClass"

import objectTree from "src/components/ObjectTree.vue"
import appHeader from "src/components/AppHeader.vue"
import keybindCheatsheetDialog from "src/components/dialogs/KeybindCheatsheet.vue"
import newDocumentDialog from "src/components/dialogs/NewDocument.vue"
import existingDocumentDialog from "src/components/dialogs/ExistingDocument.vue"

@Component({
  components: {
    objectTree,
    appHeader,
    keybindCheatsheetDialog,
    newDocumentDialog,
    existingDocumentDialog
  }
})
export default class MainLayout extends BaseClass {
  /****************************************************************/
  // Local settings
  /****************************************************************/

  /**
   * Model for the left drawer of the app containing the hierarchical tree
   */
  leftDrawerOpen = true

  /****************************************************************/
  // Keybinds management
  /****************************************************************/

  /**
   * Local keybinds
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Keybind cheatsheet
    if (this.determineKeyBind("openKeybindsCheatsheet")) {
      this.keybindsDialogAssignUID()
    }

    // Quick new document
    if (this.determineKeyBind("quickNewDocument")) {
      this.newObjectAssignUID()
    }

    // Quick open existing document
    if (this.determineKeyBind("quickExistingDocument")) {
      this.existingObjectAssignUID()
    }
  }

  /****************************************************************/
  // Keybings cheatsheet dialog
  /****************************************************************/

  keybindsDialogTrigger: string | false = false
  keybindsDialogClose () {
    this.keybindsDialogTrigger = false
  }

  keybindsDialogAssignUID () {
    this.keybindsDialogTrigger = this.generateUID()
  }

  /****************************************************************/
  // New document dialog
  /****************************************************************/

  newObjectDialogTrigger: string | false = false
  newObjectDialogClose () {
    this.newObjectDialogTrigger = false
  }

  newObjectAssignUID () {
    this.newObjectDialogTrigger = this.generateUID()
  }

  /****************************************************************/
  // Existing document dialog
  /****************************************************************/

  existingObjectDialogTrigger: string | false = false
  existingObjectDialogClose () {
    this.existingObjectDialogTrigger = false
  }

  existingObjectAssignUID () {
    this.existingObjectDialogTrigger = this.generateUID()
  }
}
</script>

<style lang="scss">
.q-layout {
  outline: none !important;
}

.keyBindsDialog {
  width: 100%;
  max-width: 1000px !important;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }

  table {
    td {
      max-width: 300px;
      white-space: inherit;
    }
  }

  .keybindNote {
    opacity: 0.8;
    font-size: 0.9em;
  }
}

.sideWrapper {
  padding-bottom: 70px !important;

  &::after {
    content: '';
    position: absolute;
    background-color: $dark;
    left: 0;
    bottom: 0;
    right: 5px;
    height: 60px;
  }
}

.controlButtons {
  z-index: 3;
  margin: 10px 15px 10px 10px;

  button {
    margin: 0 5px;
  }
}
</style>
