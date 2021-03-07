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

    <!-- Advanced search guide dialog -->
    <advancedSearchGuideDialog
      :dialog-trigger="advancedSearchGuideDialogTrigger"
      @trigger-dialog-close="advancedSearchGuideDialogClose"
    />

    <!-- Keybind dialog -->
    <keybindCheatsheetDialog
      :dialog-trigger="keybindsDialogTrigger"
      @trigger-dialog-close="keybindsDialogClose"
    />

    <q-page-sticky position="top-right" class="documentControl">

      <div class="documentControl__blocker"></div>

      <div class="documentControl__wrapper">

        <div class="documentControl__left">

          <q-btn
            icon="mdi-keyboard-settings"
            color="primary"
            outline
            @click="keybindsDialogAssignUID"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Open keybinds cheatsheet
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="mdi-file-question"
            color="primary"
            outline
            @click="advancedSearchGuideAssignUID"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Open advanced search guide
            </q-tooltip>
          </q-btn>

          <q-separator vertical inset color="accent" />

          <q-btn
            icon="mdi-package-variant-closed"
            color="primary"
            outline
            :disable="!projectExists"
            @click="commenceExport"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
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
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
              Quick-search an existing document
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="mdi-text-box-plus-outline"
            color="primary"
            outline
            @click="newObjectAssignUID"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
              Quick-add a new document
            </q-tooltip>
          </q-btn>

        </div>

        <div class="documentControl__right">

           <q-btn
            icon="mdi-file-document-edit"
            color="primary"
            outline
            @click="toggleEditMode"
            v-if="currentyEditable && SGET_allOpenedDocuments.docs.length > 0"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Edit current document
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="mdi-content-save"
            :color="(!hasEdits) ? 'teal-14' : 'primary'"
            outline
            @click="saveCurrentDocument"
            v-if="!currentyEditable && SGET_allOpenedDocuments.docs.length > 0"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom left"
              self="top middle"
            >
             Save current document
            </q-tooltip>

          </q-btn>

          <q-btn
            icon="mdi-file-tree"
            color="primary"
            outline
            @click="addNewUnderParent"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0"
          >
            <q-tooltip
              :delay="500"
              max-width="500px"
              anchor="bottom left"
              self="top middle"
            >
              Add new document with the current one as parent
            </q-tooltip>
          </q-btn>

          <q-separator vertical inset color="accent"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0"
          />

          <q-btn
            icon="mdi-text-box-remove-outline"
            color="secondary"
            outline
            @click="deleteObjectAssignUID"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom left"
              self="top middle"
            >
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
import advancedSearchGuideDialog from "src/components/dialogs/AdvancedSearchGuide.vue"
import keybindCheatsheetDialog from "src/components/dialogs/KeybindCheatsheet.vue"

import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import { extend, Loading, QSpinnerGears } from "quasar"
import { saveDocument } from "src/scripts/databaseManager/documentManager"

import { retrieveCurrentProjectName, exportProject } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: {
    newDocumentDialog,
    existingDocumentDialog,
    deleteDocumentCheckDialog,
    advancedSearchGuideDialog,
    keybindCheatsheetDialog
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
    if (this.determineKeyBind("deleteDocument") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0) {
      this.deleteObjectAssignUID()
    }

    // Edit document - CTRL + E
    if (this.determineKeyBind("editDocument") && this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0) {
      this.toggleEditMode()
    }

    // Save document - CTRL + S
    if (this.determineKeyBind("saveDocument") && !this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0) {
      this.saveCurrentDocument().catch(e => console.log(e))
    }
  }

  /****************************************************************/
  // Advanced search guide dialog
  /****************************************************************/

  advancedSearchGuideDialogTrigger: string | false = false
  advancedSearchGuideDialogClose () {
    this.advancedSearchGuideDialogTrigger = false
  }

  advancedSearchGuideAssignUID () {
    this.advancedSearchGuideDialogTrigger = this.generateUID()
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

  async commenceExport () {
    const projectName = await retrieveCurrentProjectName()
    const setup = {
      message: "<h4>Exporting current project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }
    exportProject(projectName, Loading, setup, this.$q)
  }

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent () {
    const currentDoc = this.findRequestedOrActiveDocument()
    if (currentDoc) {
      const routeObject = {
        _id: currentDoc.type,
        parent: currentDoc._id
      }
      // @ts-ignore
      this.addNewObjectRoute(routeObject)
    }
  }

  /****************************************************************/
  // Toggle edit mode & Save document
  /****************************************************************/
  toggleEditMode () {
    const currentDoc = this.findRequestedOrActiveDocument()
    if (currentDoc && !currentDoc.editMode) {
      const dataCopy: I_OpenedDocument = extend(true, {}, currentDoc)
      dataCopy.editMode = true
      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }
  }

  async saveCurrentDocument () {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur()
    }

    const currentDoc = this.findRequestedOrActiveDocument()

    const allDocuments = this.SGET_allOpenedDocuments

    const docCopy: I_OpenedDocument[] = extend(true, [], allDocuments.docs)

    if (currentDoc) {
      // @ts-ignore
      const savedDocument: {
        documentCopy: I_OpenedDocument,
        allOpenedDocuments: I_OpenedDocument[]
      } = await saveDocument(currentDoc, docCopy)

      // Update the opened document
      const dataPass = { doc: savedDocument.documentCopy, treeAction: true }
      this.SSET_updateOpenedDocument(dataPass)

      // Update all others
      for (const doc of savedDocument.allOpenedDocuments) {
        // Update the opened document
        const dataPass = { doc: doc, treeAction: true }
        this.SSET_updateOpenedDocument(dataPass)
      }
    }
  }

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange () {
    this.checkEditability()
    this.checkNew()
    this.checkHasEdits()
  }

  @Watch("SGET_allOpenedDocuments", { deep: true })
  onDocChange () {
    this.checkEditability()
    this.checkNew()
    this.checkHasEdits()
  }

  hasEdits = false

  checkHasEdits () {
    const currentDocument = this.findRequestedOrActiveDocument()

    if (currentDocument && !currentDocument.hasEdits) {
      this.hasEdits = true
    }
    else {
      this.hasEdits = false
    }
  }

  checkEditability () {
    const currentDocument = this.findRequestedOrActiveDocument()

    if (currentDocument && !currentDocument.editMode) {
      this.currentyEditable = true
    }
    else {
      this.currentyEditable = false
    }
  }

  checkNew () {
    const currentDocument = this.findRequestedOrActiveDocument()

    if (currentDocument && currentDocument.isNew) {
      this.currentlyNew = true
    }
    else {
      this.currentlyNew = false
    }
  }

  currentyEditable = false
  currentlyNew = false
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
    padding: 8.5px 15px;
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
