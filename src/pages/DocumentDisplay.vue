<template>
  <q-page
  class="documentDisplay"
  :class="{
    'q-pb-xl q-pl-xl q-pr-xl': disableDocumentControlBar,
    'q-pa-xl': !disableDocumentControlBar,
    'hiddenFields': hideEmptyFields
    }"
  v-if="bluePrintData"
  >

    <!-- Delele document dialog -->
    <deleteDocumentCheckDialog
      :dialog-trigger="deleteObjectDialogTrigger"
      @trigger-dialog-close="deleteObjectDialogClose"
    />

    <div class="row justify-start q-col-gutter-x-xl">

      <div
       class="flex justify-end localControlRow"
       v-if="disableDocumentControlBar"
       >

        <q-btn
          :color="(hasEdits) ? 'teal-14' : 'primary'"
          icon="mdi-content-save"
          @click="saveCurrentDocument"
          :outline="isDarkMode"
          class="q-mr-md"
          v-if="editMode"
        >
          <q-tooltip
            :delay="500"
            anchor="bottom middle"
            self="top middle"
          >
            Save current document
          </q-tooltip>
        </q-btn>

        <q-btn
          color="primary"
          icon="mdi-file-document-edit"
          @click="toggleEditMode"
          :outline="isDarkMode"
          class="q-mr-md"
          v-if="!editMode"
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
          color="primary"
          icon="mdi-file-tree"
          @click="addNewUnderParent"
          :outline="isDarkMode"
          class="q-mr-md"
          v-if="!currentData.isNew"
        >
          <q-tooltip
            :delay="500"
            anchor="bottom middle"
            self="top middle"
          >
            Add a new document with the currently opened one as the parent
          </q-tooltip>
        </q-btn>

        <q-btn
          color="secondary"
          icon="mdi-text-box-remove-outline"
          :outline="isDarkMode"
          @click="deleteObjectAssignUID"
          v-if="!currentData.isNew"
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

      <div
        :class="`col-${field.sizing} q-mb-md`"
        v-for="field in bluePrintData.extraFields"
        :key="field.id"
        v-show="determineFieldValue(field) || editMode"
        >

          <Field_Break
          class="inputWrapper break"
          v-if="field.type === 'break' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          />

          <Field_Text
          class="inputWrapper"
          v-if="field.type === 'text' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Number
          class="inputWrapper"
          v-if="field.type === 'number' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Switch
          class="inputWrapper"
          v-if="field.type === 'switch' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_ColorPicker
          class="inputWrapper"
          v-if="field.type === 'colorPicker' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_List
          class="inputWrapper"
          v-if="field.type === 'list' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_SingleSelect
          class="inputWrapper"
          v-if="field.type === 'singleSelect' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_MultiSelect
          class="inputWrapper"
          v-if="field.type === 'multiSelect' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_SingleRelationship
          class="inputWrapper"
          v-if="(field.type === 'singleToNoneRelationship' || field.type === 'singleToSingleRelationship' || field.type === 'singleToManyRelationship') && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          :current-id="currentData._id"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_MultiRelationship
          class="inputWrapper"
          v-if="(field.type === 'manyToNoneRelationship' || field.type ===
          'manyToSingleRelationship' || field.type === 'manyToManyRelationship') && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          :current-id="currentData._id"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Wysiwyg
          class="inputWrapper"
          v-if="field.type === 'wysiwyg' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="(retrieveFieldValue(currentData, field.id)) ? retrieveFieldValue(currentData, field.id) : ''"
          :isNew="currentData.isNew"
          :editMode="editMode"
          :current-id="currentData._id"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Tags
          class="inputWrapper"
          v-if="field.type === 'tags' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

      </div>

    </div>

  </q-page>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"

import { I_Blueprint, I_ExtraFields } from "src/interfaces/I_Blueprint"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import PouchDB from "pouchdb"
import { extend } from "quasar"

import { saveDocument } from "src/scripts/databaseManager/documentManager"
import deleteDocumentCheckDialog from "src/components/dialogs/DeleteDocumentCheck.vue"

import Field_Break from "src/components/fields/Field_Break.vue"
import Field_Text from "src/components/fields/Field_Text.vue"
import Field_Number from "src/components/fields/Field_Number.vue"
import Field_Switch from "src/components/fields/Field_Switch.vue"
import Field_ColorPicker from "src/components/fields/Field_ColorPicker.vue"
import Field_List from "src/components/fields/Field_List.vue"
import Field_SingleSelect from "src/components/fields/Field_SingleSelect.vue"
import Field_MultiSelect from "src/components/fields/Field_MultiSelect.vue"
import Field_SingleRelationship from "src/components/fields/Field_SingleRelationship.vue"
import Field_MultiRelationship from "src/components/fields/Field_MultiRelationship.vue"
import Field_Wysiwyg from "src/components/fields/Field_Wysiwyg.vue"
import Field_Tags from "src/components/fields/Field_Tags.vue"

@Component({
  components: {
    Field_Break,
    Field_Text,
    Field_Number,
    Field_Switch,
    Field_ColorPicker,
    Field_List,
    Field_SingleSelect,
    Field_MultiSelect,
    Field_SingleRelationship,
    Field_MultiRelationship,
    Field_Wysiwyg,
    Field_Tags,

    deleteDocumentCheckDialog
  }
})

export default class PageDocumentDisplay extends BaseClass {
  /**
   * Watches on changes of the route in order to load proper blueprint and object data
   */
  @Watch("$route", { immediate: true, deep: true })
  async onUrlChange () {
    await this.sleep(50)
    window.scrollTo({ top: 0, behavior: "auto" })

    await this.reloadLocalContent().catch(e => console.log(e))

    window.scrollTo({ top: 0, behavior: "auto" })
  }

  hasEdits = false

  checkHasEdits () {
    const currentDocument = this.findRequestedOrActiveDocument()

    if (currentDocument && currentDocument.hasEdits) {
      this.hasEdits = true
    }
    else {
      this.hasEdits = false
    }
  }

  /**
   * Watches on changes of the opened documents in order to load proper blueprint and object data
   */
  @Watch("SGET_allOpenedDocuments", { immediate: true, deep: true })
  async onDocChange () {
    this.checkHasEdits()

    await this.sleep(100)

    const matchingDoc = this.findRequestedOrActiveDocument()
    if (matchingDoc && matchingDoc._id === this.currentData._id && !matchingDoc.hasEdits) {
      this.reloadLocalContent().catch(e => console.log(e))
    }
  }

  disableDocumentControlBar = false
  isDarkMode = false
  hideEmptyFields = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.disableDocumentControlBar = options.disableDocumentControlBar
    this.isDarkMode = options.darkMode
    this.hideEmptyFields = options.hideEmptyFields
  }

  async reloadLocalContent () {
    // Determine the type and retrieve the right blueprint
    this.bluePrintData = this.retrieveDocumentBlueprint()

    // Check if the objects exists in a database
    const CurrentObjectDB = new PouchDB(this.$route.params.type)
    let retrievedObject = false as unknown as I_OpenedDocument
    try {
      retrievedObject = await CurrentObjectDB.get(this.$route.params.id)
    }
    catch (error) {}
    if (!retrievedObject) {
      const snapshot: I_OpenedDocument[] = extend(true, [], this.SGET_allOpenedDocuments.docs)
      retrievedObject = snapshot.find(s => this.$route.params.id === s._id) as unknown as I_OpenedDocument
      if (retrievedObject?.isNew || retrievedObject?.editMode) {
        this.editMode = true
      }
    }
    else {
      retrievedObject = (this.SGET_openedDocument(retrievedObject._id)) ? this.SGET_openedDocument(retrievedObject._id) : retrievedObject
      this.editMode = (this.SGET_openedDocument(retrievedObject._id)?.hasEdits || this.SGET_openedDocument(retrievedObject._id)?.editMode)
    }

    // Either create a new document or load existing one
    this.currentData = (retrievedObject) ? extend(true, [], retrievedObject) : this.createNewDocumentObject()

    const objectFields = await this.checkObjectFields()

    if (!objectFields) {
      return
    }

    this.currentData.extraFields = objectFields

    const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

    // Attempts to add current document to list
    const dataPass = { doc: dataCopy, treeAction: false }
    this.SSET_addOpenedDocument(dataPass)
  }

  async reactToFieldUpdate (inputData: string, field: I_ExtraFields) {
    // FIELD - Text
    if (field.type === "text") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Number
    if (field.type === "number") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Switch
    if (field.type === "switch") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)

      if (field.id === "categorySwitch") {
        const localCopy: I_Blueprint = (extend(true, {}, this.bluePrintData))
        const blueprintUpdateCopy: I_Blueprint = (extend(true, {}, this.bluePrintData))
        blueprintUpdateCopy.extraFields = []

        // Reset fields so they re-render
        this.SSET_blueprint(blueprintUpdateCopy)
        this.retrieveDocumentBlueprint()
        this.SSET_blueprint(localCopy)
        this.retrieveDocumentBlueprint()
      }
    }

    // FIELD - Color Picker
    if (field.type === "colorPicker") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - List
    if (field.type === "list") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData
      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Simple select
    if (field.type === "singleSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Multi select
    if (field.type === "multiSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Single relationship
    if (field.type === "singleToNoneRelationship" || field.type === "singleToManyRelationship" || field.type === "singleToSingleRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }

      // @ts-ignore
      if (inputData.skipSave) {
        this.currentData.extraFields[indexToUpdate].value.skipSave = false
        await this.triggerSaveDocument()
        return
      }

      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Multi relationship
    if (field.type === "manyToNoneRelationship" || field.type === "manyToSingleRelationship" || field.type === "manyToManyRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }

      // @ts-ignore
      if (inputData.skipSave) {
        this.currentData.extraFields[indexToUpdate].value.skipSave = false
        await this.triggerSaveDocument()
        return
      }

      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Wysiwyg
    if (field.type === "wysiwyg") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Tags
    if (field.type === "tags") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)

      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }
  }

  async triggerSaveDocument () {
    const currentDoc = this.currentData

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

      this.editMode = false
      this.currentData.isNew = false
      this.currentData.hasEdits = false
      this.currentData.editMode = false
    }
  }

  editMode = false

  currentData = false as unknown as I_OpenedDocument

  /**
   * The current object type blueprint data
   */
  bluePrintData = false as unknown as I_Blueprint

  /**
   * Retrieves the current document type blueprint
   */
  retrieveDocumentBlueprint () : I_Blueprint {
    this.bluePrintData = this.SGET_blueprint(this.$route.params.type)
    return this.SGET_blueprint(this.$route.params.type)
  }

  async checkObjectFields () {
    const currentExtraFields = (this.currentData && this.currentData.extraFields) ? this.currentData.extraFields : []

    const blueprint = this.retrieveDocumentBlueprint()

    if (!blueprint) {
      return false
    }

    for (const field of blueprint.extraFields) {
      const exists = currentExtraFields.find(f => {
        return f.id === field.id
      })

      if (!exists) {
        if (field.id === "name") {
          currentExtraFields.push(
            {
              id: "name",
              value: `New ${this.bluePrintData.nameSingular.toLowerCase()}`
            }
          )
        }
        else if (field.id === "parentDoc") {
          if (this.$route.query?.parent) {
            // Check if the objects exists in a database
            const CurrentObjectDB = new PouchDB(this.$route.params.type)
            const parentID = this.$route.query.parent as string
            let retrievedObject = false as unknown as I_OpenedDocument
            try {
              retrievedObject = await CurrentObjectDB.get(parentID)
            }
            catch (error) {}

            currentExtraFields.push(
              {
                id: "parentDoc",
                value: {
                  value: {
                    _id: retrievedObject._id,
                    value: retrievedObject._id,
                    type: this.bluePrintData._id,
                    disable: false,
                    url: retrievedObject.url,
                    label: this.retrieveFieldValue(retrievedObject, "name"),
                    pairedField: ""
                  },
                  addedValues: {
                    pairedId: "",
                    value: ""
                  }
                }
              }
            )
          }
          else {
            currentExtraFields.push({ id: field.id, value: "" })
          }
        }
        else {
          currentExtraFields.push({ id: field.id, value: "" })
        }
      }
    }

    return currentExtraFields
  }

  /**
   * Creates a new document object
   * @return The created object
   */
  createNewDocumentObject () : I_OpenedDocument {
    this.editMode = true

    const uniqueID = this.$route.params.id
    return {
      _id: uniqueID,
      type: this.bluePrintData._id,
      icon: this.bluePrintData.icon,
      editMode: true,
      isNew: true,
      hasEdits: false,
      url: `/project/display-content/${this.bluePrintData._id}/${uniqueID}`,
      extraFields: []
    }
  }

  fieldLimiter (currentFieldID: string) {
    const isCategory = this.retrieveFieldValue(this.currentData, "categorySwitch")

    const ignoredList = ["breakBasic", "name", "documentColor", "parentDoc", "order", "categorySwitch", "tags"]
    return (!isCategory || ignoredList.includes(currentFieldID))
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

  determineFieldValue (field: any) {
    if (!this.hideEmptyFields) {
      return true
    }

    const value = this.retrieveFieldValue(this.currentData, field.id)

    if (!value ||
    (Array.isArray(value) && value.length === 0) ||
    // @ts-ignore
     (value?.value && value.value.length === 0) ||
    // @ts-ignore
     (value.value === null)) {
      return false
    }
    return true
  }
}
</script>

<style lang="scss" scoped>
.inputWrapper {
  min-height: 95px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  &.break {
    min-height: inherit;
  }
}
</style>

<style lang="scss">
.separatorWrapper {
  margin-top: auto;
}

.q-field {
  max-width: 100%;
}

.documentDisplay {
  &.hiddenFields {
    padding-top: 105px;
  }

  .localControlRow {
    position: absolute;
    right: 48px;
    top: 50px;
  }

  /* WebKit/Blink Browsers */
  ::selection {
    background: lighten($dark, 30);
    color: white;
  }

  /* Gecko Browsers */
  ::-moz-selection {
    background: lighten($dark, 30);
    color: white;
  }
}

body.body--dark {
  .documentDisplay {

    /* WebKit/Blink Browsers */
    ::selection {
      color: lighten($primary, 25);
      background: lighten($secondary, 7);
    }

    /* Gecko Browsers */
    ::-moz-selection {
      color: lighten($primary, 25);
      background: lighten($secondary, 7);
    }
    $darkModeText: #dcdcdc;

    color: $darkModeText;

    .connectionList .connectionNote,
    .listNote {
      color: $darkModeText;
      opacity: 0.9;
    }

    .q-list--dark,
    .q-item--dark,
    .q-field--dark .q-field__native,
    .q-field--dark .q-field__prefix,
    .q-field--dark .q-field__suffix,
    .q-field--dark .q-field__input {
      color: $darkModeText;
    }

    .q-separator {
      opacity: 0.85;
      background-color: $primary !important;
    }

    .q-field--dark .q-field__control::before {
      background-color: rgba(255, 255, 255, 0.1);
      opacity: 0.6;
      border: none;
    }

    .tagSelect,
    .singleSelect,
    .multiSelect,
    .singleRelashionshipSelect,
    .multiRelashionshipSelect,
    .existingDocumentSelect,
    .newDocumentSelect {
      &.q-field--dark .q-field__control::before {
        border: none;
      }

      .q-field__input,
      .q-icon,
      .q-field__native span {
        color: $darkModeText !important;

        &.q-chip__icon--remove {
          color: #000 !important;
        }
      }
    }
  }
}
</style>
