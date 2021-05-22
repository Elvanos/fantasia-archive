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

    <!-- Export project dialog -->
    <exportProjectDialog
      :dialog-trigger="exportProjectDialogTrigger"
      :prepicked-ids="[prepickedID]"
      :prepicked-no-folder-mode="true"
      @trigger-dialog-close="exportProjectDialogClose"
    />

    <q-page-sticky position="top-right"
      class="documentControl bg-dark"
      :class="{'fullScreen': hideHierarchyTree}"
      v-if="!disableDocumentControlBar"
      >

      <div
      class="documentControl__blocker"
      ></div>

      <div
      class="documentControl__wrapper"
      :class="{'fullScreen': hideHierarchyTree}"
      >

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
            @click="commenceSave"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Save current project
            </q-tooltip>
          </q-btn>

          <q-separator vertical inset color="accent" />

          <q-btn
            icon="mdi-page-layout-sidebar-left"
            color="primary"
            outline
            @click="toggleHierarchicalTree"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Toggle hierarchical tree
            </q-tooltip>
          </q-btn>

          <q-btn
            icon="mdi-clipboard-text-outline"
            color="primary"
            outline
            @click="SSET_setNoteCorkboardWindowVisible"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom middle"
              self="top middle"
            >
             Show note board
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

          <template
            v-if="SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
          >
            <q-separator vertical inset color="accent" />

            <q-btn
              icon="mdi-content-save-settings-outline"
              color="primary"
              outline
              @click="massSave"
            >
              <q-tooltip
                :delay="500"
                anchor="bottom left"
                self="top middle"
              >
              Save all opened document with active changes
              </q-tooltip>
            </q-btn>

          </template>

        </div>

        <div class="documentControl__right">

           <q-btn
            icon="mdi-file-document-edit"
            color="primary"
            outline
            @click="toggleEditMode"
            v-if="currentyEditable && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
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
            icon="mdi-content-save-edit"
            :color="(!hasEdits) ? 'teal-14' : 'primary'"
            outline
            @click="saveCurrentDocument(true)"
            v-if="!currentyEditable && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
          >
            <q-tooltip
              :delay="500"
              anchor="bottom left"
              self="top middle"
            >
             Save document without exiting edit mode
            </q-tooltip>

          </q-btn>

          <q-btn
            icon="mdi-content-save"
            :color="(!hasEdits) ? 'teal-14' : 'primary'"
            outline
            @click="saveCurrentDocument(false)"
            v-if="!currentyEditable && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
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
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
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

          <q-btn
            icon="mdi-content-copy"
            color="primary"
            outline
            @click="copyTargetDocument"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0 && this.$route.path !== '/project'"
          >
            <q-tooltip
              :delay="500"
              max-width="500px"
              anchor="bottom left"
              self="top middle"
            >
             Copy current document
            </q-tooltip>
          </q-btn>

           <q-separator vertical inset color="accent"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
          />

          <q-btn
            :color="(!hasEdits) ? 'secondary' : 'primary'"
            icon="mdi-database-export-outline"
            @click="commenceExport"
            outline
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
            >
              <q-tooltip
                :delay="500"
                anchor="bottom middle"
                self="top middle"
              >
                Export current project
                <span class="text-secondary" v-if="!hasEdits">
                  <br>
                  <br>
                  Document has active edits.
                  <br>
                  These will not be exported.
                  <br>
                  Please save first.
                </span>
              </q-tooltip>
            </q-btn>

          <q-separator vertical inset color="accent"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
          />

          <q-btn
            icon="mdi-text-box-remove-outline"
            color="secondary"
            outline
            @click="deleteObjectAssignUID"
            v-if="!currentlyNew && SGET_allOpenedDocuments.docs.length > 0  && this.$route.path !== '/project'"
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
import exportProjectDialog from "src/components/dialogs/ExportProject.vue"

import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import { extend, Loading, QSpinnerGears } from "quasar"
import { saveDocument } from "src/scripts/databaseManager/documentManager"
import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import { copyDocument } from "src/scripts/documentActions/copyDocument"

import { retrieveCurrentProjectName, saveProject } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: {
    newDocumentDialog,
    existingDocumentDialog,
    deleteDocumentCheckDialog,
    advancedSearchGuideDialog,
    keybindCheatsheetDialog,
    tipsTricksTriviaDialog,
    exportProjectDialog
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
    this.hideHierarchyTree = options.hideHierarchyTree
  }

  hideHierarchyTree = false

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
    if (this.determineKeyBind("deleteDocument") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      this.deleteObjectAssignUID()
    }

    // Export document - NONE
    if (this.determineKeyBind("exportDocument") && this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      this.commenceExport()
    }

    // Edit document - CTRL + E
    if (this.determineKeyBind("editDocument") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      this.toggleEditMode()
    }

    // Save document - CTRL + S
    if (this.determineKeyBind("saveDocument") && !this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      setTimeout(() => {
        this.saveCurrentDocument(false).catch(e => console.log(e))
      }, 500)
    }

    // Save document without exiting edit mode - CTRL + ALT + S
    if (this.determineKeyBind("saveDocumentNoExit") && !this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      setTimeout(() => {
        this.saveCurrentDocument(true).catch(e => console.log(e))
      }, 500)
    }

    // Mass document save - CTRL + SHIFT + S
    if (this.determineKeyBind("saveDocumentMass") && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      setTimeout(() => {
        this.massSave().catch(e => console.log(e))
      }, 500)
    }

    // Save document and mark it as finished - NONE
    if (this.determineKeyBind("saveDocumentTickFinish") && !this.currentyEditable && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      setTimeout(() => {
        this.saveCurrentDocument(false, true).catch(e => console.log(e))
      }, 500)
    }

    // Add new under parent - CTRL + SHIFT + N
    if (this.determineKeyBind("addUnderParent") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      await this.sleep(100)
      this.addNewUnderParent()
    }

    // Copy document - CTRL + ALT + C
    if (this.determineKeyBind("copyDocument") && !this.currentlyNew && this.SGET_allOpenedDocuments.docs.length > 0 && !this.SGET_getDialogsState && this.$route.path !== "/project") {
      await this.sleep(100)
      this.copyTargetDocument()
    }

    // Toggle hierarchical tree - CTRL + ALT + SHIFT + T
    if (this.determineKeyBind("toggleHierarchicalTree")) {
      // @ts-ignore
      this.toggleHierarchicalTree()
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
  // Export project dialog
  /****************************************************************/

  exportProjectDialogTrigger: string | false = false
  exportProjectDialogClose () {
    this.exportProjectDialogTrigger = false
  }

  exportProjectAssignUID () {
    this.exportProjectDialogTrigger = this.generateUID()
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
  // Save project
  /****************************************************************/
  retrieveCurrentProjectName = retrieveCurrentProjectName

  async commenceSave () {
    const projectName = await retrieveCurrentProjectName()
    const setup = {
      message: "<h4>Saving current project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }
    saveProject(projectName, Loading, setup, this.$q)
  }

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent () {
    const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument
    createNewWithParent(currentDoc, this)
  }

  /****************************************************************/
  // Document copy
  /****************************************************************/
  documentPass = null as unknown as I_OpenedDocument

  copyTargetDocument () {
    this.documentPass = extend(true, {}, this.findRequestedOrActiveDocument())

    const blueprint = this.SGET_blueprint(this.documentPass.type)
    const newDocument = copyDocument(this.documentPass, this.generateUID(), blueprint)

    const dataPass = {
      doc: newDocument,
      treeAction: false
    }

    // @ts-ignore
    this.SSET_addOpenedDocument(dataPass)
    this.$router.push({
      path: newDocument.url
    }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
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

  documentsCopy = null as unknown as I_OpenedDocument[]

  async saveCurrentDocument (editMode: boolean, saveAsFinished = false) {
    if (document.activeElement && editMode === false) {
      (document.activeElement as HTMLElement).blur()
    }

    const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument

    // @ts-ignore
    const isNew = currentDoc.isNew

    const allDocuments = this.SGET_allOpenedDocuments

    this.documentsCopy = extend(true, [], allDocuments.docs)
    if (currentDoc) {
      const docCopy:I_OpenedDocument = extend(true, [], currentDoc)

      if (saveAsFinished) {
        const isFinishedInded = docCopy.extraFields.findIndex(e => e.id === "finishedSwitch")
        docCopy.extraFields[isFinishedInded].value = true
      }

      // @ts-ignore
      const savedDocument: {
        documentCopy: I_OpenedDocument,
        allOpenedDocuments: I_OpenedDocument[]
      } = await saveDocument(docCopy, this.documentsCopy, this.SGET_allDocuments.docs, editMode, this).catch(err => console.log(err))

      // Update the opened document
      const dataPass = { doc: savedDocument.documentCopy, treeAction: true }
      this.SSET_updateOpenedDocument(dataPass)

      // Update document
      if (!isNew) {
        // @ts-ignore
        this.SSET_updateDocument({ doc: this.mapShortDocument(savedDocument.documentCopy, this.SGET_allDocumentsByType(savedDocument.documentCopy.type).docs) })
      }
      // Add new document
      else {
        // @ts-ignore
        this.SSET_addDocument({ doc: this.mapShortDocument(savedDocument.documentCopy, this.SGET_allDocumentsByType(savedDocument.documentCopy.type).docs) })
      }

      // Update all others
      for (const doc of savedDocument.allOpenedDocuments) {
        // Update the opened document
        const dataPass = { doc: doc, treeAction: true }
        this.SSET_updateOpenedDocument(dataPass)

        // @ts-ignore
        this.SSET_updateDocument({ doc: this.mapShortDocument(doc, this.SGET_allDocumentsByType(doc.type).docs) })
      }

      this.$q.notify({
        group: false,
        type: "positive",
        message: "Document successfully saved"
      })
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

  openedDocsWithEdits: I_OpenedDocument[]= []

  async massSave () {
    this.openedDocsWithEdits = this.SGET_allOpenedDocuments.docs.filter(doc => doc.hasEdits)

    const setup = {
      message: "<h4>Saving all opened documents...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }

    // @ts-ignore
    Loading.show(setup)
    for (const document of this.openedDocsWithEdits) {
      await this.saveOpenedDocument(document)
    }

    await this.sleep(3000)
    Loading.hide()
  }

  async saveOpenedDocument (document: I_OpenedDocument) {
    const docCopy:I_OpenedDocument = extend(true, [], document)
    const allOpenedDocuments:I_OpenedDocument[] = extend(true, [], this.SGET_allOpenedDocuments)

    // @ts-ignore
    const isNew = document.isNew

    // @ts-ignore
    const savedDocument: {
      documentCopy: I_OpenedDocument,
      allOpenedDocuments: I_OpenedDocument[]
    } = await saveDocument(docCopy, allOpenedDocuments, this.SGET_allDocuments.docs, false, this, true)

    // Update the opened document
    const dataPass = { doc: savedDocument.documentCopy, treeAction: true }
    this.SSET_updateOpenedDocument(dataPass)

    // Update document
    if (!isNew) {
      // @ts-ignore
      this.SSET_updateDocument({ doc: this.mapShortDocument(savedDocument.documentCopy, this.SGET_allDocumentsByType(savedDocument.documentCopy.type).docs) })
    }
    // Add new document
    else {
      // @ts-ignore
      this.SSET_addDocument({ doc: this.mapShortDocument(savedDocument.documentCopy, this.SGET_allDocumentsByType(savedDocument.documentCopy.type).docs) })
    }

    // Update all others
    for (const doc of savedDocument.allOpenedDocuments) {
      // Update the opened document
      const dataPass = { doc: doc, treeAction: true }
      this.SSET_updateOpenedDocument(dataPass)

      // @ts-ignore
      this.SSET_updateDocument({ doc: this.mapShortDocument(doc, this.SGET_allDocumentsByType(doc.type).docs) })
    }
  }

  prepickedID = ""

  commenceExport () {
    const currentDocument = this.findRequestedOrActiveDocument()
    // @ts-ignore
    this.prepickedID = currentDocument._id

    this.exportProjectAssignUID()
  }
}
</script>

<style lang="scss">
.documentControl {
  z-index: 999;
  width: calc(100vw - 380px);
  margin-top: 2.5px;

  &.fullScreen {
    width: calc(100vw);
  }

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

    &.fullScreen {
      width: calc(100vw);
    }

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

html body {
  &.q-body--prevent-scroll {
    .documentControl {
      min-width: calc(100vw - 375px);
    }
  }
}
</style>
