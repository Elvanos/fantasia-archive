<template>
    <q-dialog
    v-model="dialogModel"
    @before-hide="triggerDialogClose"
    >
    <q-card
    class="documentCloseCheckDialog"
     dark>

      <q-card-section class="row justify-center">
        <h6 class="text-center q-my-sm">You have unsaved documents opened!</h6>
      </q-card-section>
      <q-card-section class="row justify-center q-mx-lg">
        All unsaved data will be lost upon closing the app unless the documents are saved first.
      </q-card-section>

      <q-card-section class="row q-mx-lg">
        <div class="q-mb-md text-bold">Affected documents:</div>
        <q-list class="projectCloseDialogList">
          <q-item
          v-for=" doc in openedDocsWithEdits"
          :key="doc._id"
          clickable
          v-ripple
          active
          class="noHigh"
          active-class="bg-primary-1 text-primary"
          v-close-popup
          :to="doc.url">
            <q-item-section avatar>
              <q-icon color="white" :name="doc.icon" />
            </q-item-section>

            <q-item-section class="text-primary">{{retrieveFieldValue(doc,'name')}}</q-item-section>
          </q-item>
        </q-list>

      </q-card-section>

      <q-card-actions align="right" class="q-mx-xl q-mt-lg q-mb-md">
        <q-btn
          flat
          label="Cancel"
          color="accent"
          class="q-mx-sm"
          v-close-popup />
        <q-btn
          outline
          :label="saveAllLabelText"
          color="primary"
          class="q-mx-sm"
          @click="determineMassSaveAction" />
        <q-btn
          outline
          :label="exitLabelText"
          color="secondary"
          class="q-mx-sm"
          v-close-popup
          @click="determineModeAction" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">

import { Component, Watch, Prop } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import { remote } from "electron"
import { extend, QSpinnerGears, Loading } from "quasar"
import { saveDocument } from "src/scripts/databaseManager/documentManager"

@Component({
  components: { }
})
export default class ProjectCloseCheck extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      this.SSET_setDialogState(true)
      this.checkForDocumentsWithEdits()
    }
  }

  /**
   * Determines if the dialog should be used in application closing mode or in project closing mode
   */
  @Prop() readonly dialogMode!: "appClose" | "projectClose"

  /**
   * Label text for the dialog
   */
  get exitLabelText () {
    if (this.dialogMode === "appClose") {
      return "Exit app without saving"
    }

    if (this.dialogMode === "projectClose") {
      return "Close project without saving"
    }
  }

  /**
   * Label text for the dialog
   */
  get saveAllLabelText () {
    if (this.dialogMode === "appClose") {
      return "Save all & exit FA"
    }

    if (this.dialogMode === "projectClose") {
      return "Save all & close project"
    }
  }

  /**
   * List of opened documents with edits in them
   */
  openedDocsWithEdits: I_OpenedDocument[]= []

  /**
   * Check if we have any documents with edit. If not, skip the dialog and proceed.
   */
  checkForDocumentsWithEdits () {
    this.openedDocsWithEdits = this.SGET_allOpenedDocuments.docs.filter(doc => doc.hasEdits)

    if (this.openedDocsWithEdits.length > 0) {
      this.dialogModel = true
    }
    else {
      this.determineModeAction()
    }
  }

  /**
   * Decide what action to take depending on the dialog mode
   */
  determineModeAction () {
    if (this.dialogMode === "appClose") {
      this.closeApp()
    }
    if (this.dialogMode === "projectClose") {
      this.closeProject()
    }
  }

  async determineMassSaveAction () {
    this.openedDocsWithEdits = this.SGET_allOpenedDocuments.docs.filter(doc => doc.hasEdits)

    const setup = {
      message: "<h4>Saving project...</h4>",
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

    if (this.dialogMode === "appClose") {
      this.closeApp()
    }
    if (this.dialogMode === "projectClose") {
      await this.sleep(3000)
      Loading.hide()
      this.closeProject()
    }
  }

  /**
   * Close the project and navigate to the intro screen
   */
  closeProject () {
    this.SSET_resetDocuments()
    this.triggerDialogClose()
    this.$router.push({ path: "/" }).catch((e: {name: string}) => {
      if (e && e.name !== "NavigationDuplicated") {
        console.log(e)
      }
    })
  }

  /**
   * Close app
   */
  closeApp () {
    remote.getCurrentWindow().destroy()
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
}
</script>

<style lang="scss">

  .documentCloseCheckDialog {
    width: 700px;
    max-width: 700px !important;
  }

  .projectCloseDialogList {
    width: 100%;
  }

</style>
