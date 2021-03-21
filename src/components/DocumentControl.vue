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

    <!-- Tips, Tricks & Trivia dialog -->
    <tipsTricksTriviaDialog
      :dialog-trigger="tipsTricksDialogTrigger"
      @trigger-dialog-close="tipsTricksDialogClose"
    />

    <q-page-sticky position="top-right" class="documentControl bg-dark" v-if="!disableDocumentControlBar">

      <div class="documentControl__blocker"></div>

      <div class="documentControl__wrapper">

        <div class="documentControl__left">

          <template v-if="!disableDocumentControlBarGuides">
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

            <q-btn
              icon="mdi-fire-alert"
              color="primary"
              outline
              @click="tipsTricksAssignUID"
            >
              <q-tooltip
                :delay="500"
                anchor="bottom middle"
                self="top middle"
              >
              Open Tips, Tricks & Trivia
              </q-tooltip>
            </q-btn>

            <q-separator vertical inset color="accent" />
          </template>

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
              Add a new document with the currently opened one as the parent
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
import tipsTricksTriviaDialog from "src/components/dialogs/TipsTricksTrivia.vue"

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
    keybindCheatsheetDialog,
    tipsTricksTriviaDialog
  }
})
export default class DocumentControl extends BaseClass {
  projectExists: undefined | string | boolean = false
  projectName = ""

  disableDocumentControlBar = false
  disableDocumentControlBarGuides = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.disableDocumentControlBar = options.disableDocumentControlBar
    this.disableDocumentControlBarGuides = options.disableDocumentControlBarGuides
  }

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
  async processKeyPush () {
    // Quick new document
    if (this.determineKeyBind("quickNewDocument") && !this.SGET_getDialogsState) {
      this.newObjectAssignUID()
    }

    // Quick open existing document
    if (this.determineKeyBind("quickExistingDocument") && !this.SGET_getDialogsState) {
      this.existingObjectAssignUID()
    }

    // Delete dialog - CTRL + D
    if (this.determineKeyBind("deleteDocument") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState) {
      this.deleteObjectAssignUID()
    }

    // Edit document - CTRL + E
    if (this.determineKeyBind("editDocument") && this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState) {
      this.toggleEditMode()
    }

    // Save document - CTRL + S
    if (this.determineKeyBind("saveDocument") && !this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState) {
      this.saveCurrentDocument().catch(e => console.log(e))
    }

    // Add new under parent - CTRL + SHIFT + N
    if (this.determineKeyBind("addUnderParent") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState) {
      await this.sleep(100)
      this.addNewUnderParent()
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
  // Tips, Tricka & Trivia dialog
  /****************************************************************/

  tipsTricksDialogTrigger: string | false = false
  tipsTricksDialogClose () {
    this.tipsTricksDialogTrigger = false
  }

  tipsTricksAssignUID () {
    this.tipsTricksDialogTrigger = this.generateUID()
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
  width: calc(100vw - 380px);
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
    width: calc(100vw - 385px);
    padding: 8.5px 15px;
    display: flex;
    justify-content: space-between;
    position: relative;

    &::after {
      content: " ";
      bottom: 1px;
      right: -5px;
      left: -5px;
      position: absolute;
      height: 1px;
      background-color: rgba($accent, 0.2);
    }
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
