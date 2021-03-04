<template>

  <div>

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

    <!-- Delele document dialog -->
    <deleteDocumentCheckDialog
      :dialog-trigger="deleteObjectDialogTrigger"
      @trigger-dialog-close="deleteObjectDialogClose"
    />

    <q-page-sticky position="top-right" class="documentControl">

      <div class="documentControl__blocker"></div>

      <div class="documentControl__wrapper">

        <div class="documentControl__left">

          <q-btn
            icon="mdi-package-variant-closed"
            color="primary"
            outline
            :disable="!projectExists"
            @click="commenceExport"
          >
            <q-tooltip>
             Export current project
            </q-tooltip>
          </q-btn>

          <q-separator vertical inset color="accent" />

          <q-btn
            icon="mdi-database-search"
            color="primary"
            outline
            @click="existingObjectAssignUID"
          >
            <q-tooltip>
              Quick-search an existing document
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="mdi-text-box-plus-outline"
            color="primary"
            outline
            @click="newObjectAssignUID"
          >
            <q-tooltip>
              Quick-add a new document
            </q-tooltip>
          </q-btn>

        </div>

        <div class="documentControl__right">
          <q-btn
            icon="mdi-text-box-remove-outline"
            color="secondary"
            outline
            @click="deleteObjectAssignUID"
            :disable="SGET_allOpenedDocuments.docs.length < 1"
          >
            <q-tooltip>
              Delete current document
            </q-tooltip>
          </q-btn>

        </div>

      </div>

    </q-page-sticky>
  </div>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import newDocumentDialog from "src/components/dialogs/NewDocument.vue"
import existingDocumentDialog from "src/components/dialogs/ExistingDocument.vue"
import deleteDocumentCheckDialog from "src/components/dialogs/DeleteDocumentCheck.vue"

import { retrieveCurrentProjectName, exportProject } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: {
    newDocumentDialog,
    existingDocumentDialog,
    deleteDocumentCheckDialog
  }
})
export default class DocumentControl extends BaseClass {
  projectExists: undefined | string | boolean = false
  projectName = ""

  async created () {
    this.projectName = await retrieveCurrentProjectName()
    this.projectExists = !!(await retrieveCurrentProjectName())
  }

  /****************************************************************/
  // Keybinds management
  /****************************************************************/

  /**
   * Local keybinds
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Quick new document
    if (this.determineKeyBind("quickNewDocument")) {
      this.newObjectAssignUID()
    }

    // Quick open existing document
    if (this.determineKeyBind("quickExistingDocument")) {
      this.existingObjectAssignUID()
    }

    // Delete dialog - CTRL + D
    if (this.determineKeyBind("deleteDocument")) {
      this.deleteObjectAssignUID()
    }
  }

  /****************************************************************/
  // Delete dialog
  /****************************************************************/

  deleteObjectDialogTrigger: string | false = false
  deleteObjectDialogClose () {
    this.deleteObjectDialogTrigger = false
  }

  deleteObjectAssignUID () {
    this.deleteObjectDialogTrigger = this.generateUID()
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

  /****************************************************************/
  // Export project
  /****************************************************************/
  retrieveCurrentProjectName = retrieveCurrentProjectName

  exportProject = exportProject

  async commenceExport () {
    const projectName = await retrieveCurrentProjectName()
    this.exportProject(projectName)
  }
}
</script>

<style lang="scss">
.documentControl {
  z-index: 999;
  background-color: $dark;
  width: calc(100vw - 375px);
  margin-top: 2.5px;

  &__blocker {
    position: absolute;
    top: -7.5px;
    left: 0;
    right: 0;
    background-color: darken($dark, 0.5);
    z-index: 999;
    height: 7.5px;
  }

  &__wrapper {
    width: calc(100vw - 375px);
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
  }

  &__left,
  &__right {
    display: flex;
  }

  &__left {
    justify-content: flex-start;

    .q-btn,
    .q-separator {
      margin-right: 10px;
    }
  }

  &__right {
    justify-content: flex-end;

    .q-btn,
    .q-separator {
      margin-left: 10px;
    }
  }
}
</style>
