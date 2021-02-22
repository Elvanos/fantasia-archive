<template>
  <q-page class="q-pa-xl"
  v-if="bluePrintData"
  >
    <div class="row justify-start q-col-gutter-x-xl">

      <q-dialog
        v-model="deleteConfirmationDialog"
        >
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Are you sure want to delete <b>{{retrieveFieldValue(currentData,'name')}}</b>? <br> This action can not be reverted and the data will be lost <b>forever</b>.</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Delete"
              color="red"
              v-close-popup
              @click="deleteDocument()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="col-12 flex justify-end q-mb-lg q-mt-md">
        <q-btn
        color="primary"
        :label="`Save ${bluePrintData.nameSingular}`"
        @click="saveDocument"
        class="q-mr-xl"
        v-if="editMode"
        />
        <q-btn
        color="primary"
        :label="`Edit ${bluePrintData.nameSingular}`"
        @click="toggleEditMode"
        class="q-mr-xl"
        v-if="!editMode"
        />
        <q-btn
        v-if="!currentData.isNew"
        color="red"
        :label="`Delete ${bluePrintData.nameSingular}`"
        @click="openDeleteDialog"
        />
      </div>

      <div
        :class="`col-${field.sizing} q-mb-md`"
        v-for="field in bluePrintData.extraFields"
        :key="field.id"
        >

          <Field_Break
          class="inputWrapper break"
          v-if="field.type === 'break' && fieldLimiter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          />

          <Field_Text
          class="inputWrapper"
          v-if="(field.type === 'text' && retrieveFieldValue(currentData,field.id) || field.type === 'text' && retrieveFieldLength(currentData,field.id) === 0) && fieldLimiter(field.id)"
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
// import { cleanDatabases } from "src/databaseManager/cleaner"
import { single_changeRelationshipToAnotherObject, many_changeRelationshipToAnotherObject } from "src/databaseManager/relationshipManager"

import { extend } from "quasar"

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
import console from "console"

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
    Field_Wysiwyg
  }
})

export default class PageDocumentDisplay extends BaseClass {
  /**
   * Watches on changes of the route in order to load proper blueprint and object data
   */
  @Watch("$route", { immediate: true, deep: true })
  async onUrlChange () {
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
    this.SSET_addOpenedDocument(dataCopy)
  }

  reactToFieldUpdate (inputData: string, field: I_ExtraFields) {
    // FIELD - Text
    if (field.type === "text") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Number
    if (field.type === "number") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Switch
    if (field.type === "switch") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)

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

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - List
    if (field.type === "list") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData
      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Simple select
    if (field.type === "singleSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Multi select
    if (field.type === "multiSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Single relationship
    if (field.type === "singleToNoneRelationship" || field.type === "singleToManyRelationship" || field.type === "singleToSingleRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Multi relationship
    if (field.type === "manyToNoneRelationship" || field.type === "manyToSingleRelationship" || field.type === "manyToManyRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }

    // FIELD - Wysiwyg
    if (field.type === "wysiwyg") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

      this.SSET_updateOpenedDocument(dataCopy)
    }
  }

  toggleEditMode () {
    this.editMode = true
    this.currentData.editMode = true
    const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)
    this.SSET_updateOpenedDocument(dataCopy)
  }

  async saveDocument () {
    this.editMode = false
    this.currentData.isNew = false
    this.currentData.hasEdits = false
    this.currentData.editMode = false

    const CurrentObjectDB = new PouchDB(this.$route.params.type)

    let currentDocument = false as unknown as I_OpenedDocument
    try {
      currentDocument = await CurrentObjectDB.get(this.$route.params.id)
    }
    catch (error) {}

    let documentCopy = {} as unknown as I_OpenedDocument
    if (currentDocument) {
      documentCopy = extend(true, {}, this.currentData)
      documentCopy._rev = currentDocument?._rev
    }
    else {
      documentCopy = extend(true, {}, this.currentData)
    }

    // Handle relatinship fields
    const single_relationshipTypes = ["singleToSingleRelationship", "singleToManyRelationship"]
    const single_allRelationshipFields = documentCopy.extraFields.filter(field => {
      const currentField = this.bluePrintData.extraFields.find(e => e.id === field.id) as unknown as I_ExtraFields
      return (currentField && single_relationshipTypes.includes(currentField.type))
    })
    const many_relationshipTypes = ["manyToSingleRelationship", "manyToManyRelationship"]
    const many_allRelationshipFields = documentCopy.extraFields.filter(field => {
      const currentField = this.bluePrintData.extraFields.find(e => e.id === field.id) as unknown as I_ExtraFields
      return (currentField && many_relationshipTypes.includes(currentField.type))
    })

    // Update single fields
    for (const field of single_allRelationshipFields) {
      const single_updatedDocuments: I_OpenedDocument[] = await single_changeRelationshipToAnotherObject(field, documentCopy, currentDocument)

      const pairedFieldID = this.bluePrintData.extraFields.find(e => e.id === field.id)?.relationshipSettings?.connectedField

      const filteredDocuments = single_updatedDocuments.filter(doc => {
        return this.SGET_allOpenedDocuments.docs.find(subDoc => {
          return subDoc._id === doc._id
        })
      })

      // Update the particular field in each currently opened document
      filteredDocuments.forEach(doc => {
        const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

        if (toUpdateIndex) {
          const docCopy: I_OpenedDocument = extend(true, {}, this.SGET_openedDocument(doc._id))
          docCopy.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
          this.SSET_updateOpenedDocument(docCopy)
        }
      })
    }

    // Update many fields
    for (const field of many_allRelationshipFields) {
      const many_updatedDocuments: I_OpenedDocument[] = await many_changeRelationshipToAnotherObject(field, documentCopy, currentDocument)

      const pairedFieldID = this.bluePrintData.extraFields.find(e => e.id === field.id)?.relationshipSettings?.connectedField

      const filteredDocuments = many_updatedDocuments.filter(doc => {
        return this.SGET_allOpenedDocuments.docs.find(subDoc => {
          return subDoc._id === doc._id
        })
      })

      // Update the particular field in each currently opened document
      filteredDocuments.forEach(doc => {
        const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

        if (toUpdateIndex) {
          const docCopy: I_OpenedDocument = extend(true, {}, this.SGET_openedDocument(doc._id))
          docCopy.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
          this.SSET_updateOpenedDocument(docCopy)
        }
      })
    }
    // Save the document
    await CurrentObjectDB.put(documentCopy)

    // Update the opened document
    this.SSET_updateOpenedDocument(documentCopy)
  }

  deleteConfirmationDialog = false

  editMode = false

  /**
   * React to keypresses
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Save document
    if (this.determineKeyBind("saveDocument") && this.editMode) {
      this.saveDocument().catch(e => {
        console.log(e)
      })
    }

    // Edit document - CTRL + E
    if (this.determineKeyBind("editDocument") && !this.editMode) {
      this.toggleEditMode()
    }

    // Delete dialog - CTRL + D
    if (this.determineKeyBind("deleteDocument")) {
      this.openDeleteDialog()
    }
  }

  openDeleteDialog () {
    this.deleteConfirmationDialog = true
  }

  async deleteDocument () {
    this.deleteConfirmationDialog = false

    const CurrentObjectDB = new PouchDB(this.$route.params.type)

    let currentDocument = false as unknown as I_OpenedDocument
    try {
      currentDocument = await CurrentObjectDB.get(this.$route.params.id)
    }
    catch (error) {}

    const documentCopy: I_OpenedDocument = extend(true, {}, this.currentData)
    documentCopy._rev = currentDocument?._rev
    // @ts-ignore
    await CurrentObjectDB.remove(documentCopy)
    // await cleanDatabases()

    const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

    this.SSET_removeOpenedDocument(dataCopy)
  }

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

            console.log(retrievedObject)

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

    const ignoredList = ["breakBasic", "name", "documentColor", "parentDoc", "order", "categorySwitch"]
    return (!isCategory || ignoredList.includes(currentFieldID))
  }
}
</script>

<style lang="scss" scoped>
.inputWrapper {
  min-height: 105px;
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
</style>
