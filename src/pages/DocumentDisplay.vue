<template>
  <q-page
  class="documentDisplay"
  :class="{
    'q-pb-xl q-pl-xl q-pr-xl': disableDocumentControlBar,
    'q-pa-xl': !disableDocumentControlBar,
    'hiddenFields': (hideEmptyFields || retrieveFieldValue(currentData, 'finishedSwitch'))
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
            icon="mdi-content-save-edit"
            :color="(hasEdits) ? 'teal-14' : 'primary'"
            :outline="isDarkMode"
            class="q-mr-md"
            @click="saveCurrentDocument(true)"
            v-if="editMode"
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
          :color="(hasEdits) ? 'teal-14' : 'primary'"
          icon="mdi-content-save"
          @click="saveCurrentDocument(false)"
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
          color="primary"
          icon="mdi-content-copy"
          @click="copyTargetDocument"
          :outline="isDarkMode"
          class="q-mr-md"
          v-if="!currentData.isNew"
        >
          <q-tooltip
            :delay="500"
            anchor="bottom middle"
            self="top middle"
          >
            Copy current document
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
        v-for="field in bluePrintData.extraFields"
        :key="`${field.id}`"
        v-show="hasValueFieldFilter(field) || editMode"
        :class="`
          col-12
          col-md-${determineSize_MD(field)}
          col-lg-${determineSize_LG(field)}
          col-xl-${determineSize_XL(field)}
          q-mb-md
        `">

          <Field_Break
          class="inputWrapper break"
          v-if="field.type === 'break' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          />

          <Field_Text
          class="inputWrapper"
          v-if="field.type === 'text' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Number
          class="inputWrapper"
          v-if="field.type === 'number' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Switch
          class="inputWrapper"
          v-if="field.type === 'switch' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_ColorPicker
          class="inputWrapper"
          v-if="field.type === 'colorPicker' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_List
          class="inputWrapper"
          v-if="field.type === 'list' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_SingleSelect
          class="inputWrapper"
          v-if="field.type === 'singleSelect' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_MultiSelect
          class="inputWrapper"
          v-if="field.type === 'multiSelect' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_SingleRelationship
          class="inputWrapper"
          v-if="(field.type === 'singleToNoneRelationship' || field.type === 'singleToSingleRelationship' || field.type === 'singleToManyRelationship') && categoryFieldFilter(field.id)"
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
          'manyToSingleRelationship' || field.type === 'manyToManyRelationship') && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="retrieveFieldValue(currentData, field.id)"
          :isNew="currentData.isNew"
          :editMode="editMode"
          :current-id="currentData._id"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Wysiwyg
          class="inputWrapper"
          v-if="field.type === 'wysiwyg' && categoryFieldFilter(field.id)"
          :inputDataBluePrint="field"
          :inputDataValue="(retrieveFieldValue(currentData, field.id)) ? retrieveFieldValue(currentData, field.id) : ''"
          :isNew="currentData.isNew"
          :editMode="editMode"
          :current-id="currentData._id"
          @signal-input="reactToFieldUpdate($event, field)"
          />

          <Field_Tags
          class="inputWrapper"
          v-if="field.type === 'tags' && categoryFieldFilter(field.id)"
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
import { extend } from "quasar"
import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { copyDocument } from "src/scripts/documentActions/copyDocument"

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
  /****************************************************************/
  // LOCAL SETTINGS
  /****************************************************************/

  /**
   * React to changes on the options store
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.disableDocumentControlBar = options.disableDocumentControlBar
    this.isDarkMode = options.darkMode
    this.hideEmptyFields = options.hideEmptyFields
    this.preventAutoScroll = options.preventAutoScroll
  }

  /**
  * Determines if the documents will recall their scroll distances and auto-scroll on switching ot not.
  */
  preventAutoScroll = false

  /**
   * Determines if the document control bar is show or hidden
   */
  disableDocumentControlBar = false

  /**
   * Determines if this should be showing in dark or light mode
   */
  isDarkMode = false

  /**
   * Determines if empty fields should be hidden
   */
  hideEmptyFields = false

  /****************************************************************/
  // BASIC DATA
  /****************************************************************/

  /**
   * The current object type blueprint data
   */
  bluePrintData = false as unknown as I_Blueprint

  /**
   * Determines if the current document has active edits or not
   */
  hasEdits = false

  /**
   * Determines if the current document is in edit mode or not
   */
  editMode = false

  /**
   * Current raw data of the document
   */
  currentData = false as unknown as I_OpenedDocument

  /**
   * A direct dopy of "currentData" for the purposes of VUEX so they won't overlap via reference
   */
  localDataCopy = false as unknown as I_OpenedDocument

  /****************************************************************/
  // DOCUMENT FUNCTIONALITY
  /****************************************************************/

  /**
   * Watches on changes of the route in order to load proper blueprint and object data
   */
  @Watch("$route", { immediate: true, deep: true })
  async onUrlChange () {
    window.removeEventListener("scroll", this.watchPageScroll)
    window.removeEventListener("scroll", this.watchPageScroll)
    window.removeEventListener("scroll", this.watchPageScroll)

    await this.sleep(50)
    const doc = this.findRequestedOrActiveDocument() as I_OpenedDocument
    window.scrollTo({ top: 0, behavior: "auto" })

    this.reloadLocalContent()

    const scrollTop = (doc.scrollDistance && !this.preventAutoScroll) ? doc.scrollDistance : 0

    window.scrollTo({ top: scrollTop, behavior: "auto" })

    window.removeEventListener("scroll", this.watchPageScroll)
    window.removeEventListener("scroll", this.watchPageScroll)
    window.removeEventListener("scroll", this.watchPageScroll)

    window.addEventListener("scroll", this.watchPageScroll)
  }

  decounceScrollTimer = false as any
  watchPageScroll () {
    if (this.preventAutoScroll) {
      return
    }

    if (this.decounceScrollTimer) {
      window.clearTimeout(this.decounceScrollTimer)
    }

    this.decounceScrollTimer = window.setTimeout(() => {
      const currentScroll = window.scrollY

      const dataCopy: I_OpenedDocument = extend(true, {}, this.findRequestedOrActiveDocument())

      dataCopy.scrollDistance = currentScroll

      // Attempts to add current document to list
      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }, 200)
  }

  /**
   * Check if the current document has edits or not
   */
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
      this.reloadLocalContent()
    }
  }

  /**
   * Attemp to reload the current local content. If it doesn't exist, create a new one.
   */
  reloadLocalContent () {
    // Determine the type and retrieve the right blueprint
    this.bluePrintData = this.retrieveDocumentBlueprint()

    // Check if the objects exists in a database
    let retrievedObject = false as unknown as I_OpenedDocument | I_ShortenedDocument

    if (this.SGET_document(this.$route.params.id)) {
      retrievedObject = this.SGET_document(this.$route.params.id)
    }

    if (this.SGET_openedDocument(this.$route.params.id)) {
      retrievedObject = this.SGET_openedDocument(this.$route.params.id)
    }

    // Either create a new document or load existing one
    this.currentData = (retrievedObject) ? extend(true, [], retrievedObject) : this.createNewDocumentObject()

    if (!this.currentData) {
      this.$router.push({ path: "/project" }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      })
      return
    }

    const objectFields = this.mapNewObjectFields()

    if (!objectFields) {
      return
    }

    this.currentData.extraFields = objectFields

    if (this.currentData.editMode) {
      this.editMode = true
    }
    else {
      this.editMode = false
    }

    if (this.$route.query?.editMode) {
      this.editMode = true
      this.currentData.editMode = true
      const query = Object.assign({}, this.$route.query)
      delete query.editMode
      this.$router.replace({ query }).catch(e => console.log(e))
    }

    const dataCopy: I_OpenedDocument = extend(true, {}, this.currentData)

    // Attempts to add current document to list
    const dataPass = { doc: dataCopy, treeAction: false }
    this.SSET_addOpenedDocument(dataPass)
  }

  /**
   * React to a local field getting updated by updating it iun the store accordingly
   */
  reactToFieldUpdate (inputData: string, field: I_ExtraFields) {
    // FIELD - Text
    if (field.type === "text") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Number
    if (field.type === "number") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Switch
    if (field.type === "switch") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
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

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - List
    if (field.type === "list") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Simple select
    if (field.type === "singleSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Multi select
    if (field.type === "multiSelect") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Single relationship
    if (field.type === "singleToNoneRelationship" || field.type === "singleToManyRelationship" || field.type === "singleToSingleRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }

      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Multi relationship
    if (field.type === "manyToNoneRelationship" || field.type === "manyToSingleRelationship" || field.type === "manyToManyRelationship") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      // @ts-ignore
      if (inputData.skipSave) {
        this.currentData.extraFields[indexToUpdate].value.skipSave = false
        dataPass.doc.hasEdits = false
      }

      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Wysiwyg
    if (field.type === "wysiwyg") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)
      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }

    // FIELD - Tags
    if (field.type === "tags") {
      this.currentData.hasEdits = true
      const indexToUpdate = this.currentData.extraFields.findIndex(s => s.id === field.id)

      this.currentData.extraFields[indexToUpdate].value = inputData

      this.localDataCopy = extend(true, {}, this.currentData)
      const dataPass = { doc: this.localDataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }
  }

  /**
   * Retrieves the current document type blueprint
   */
  retrieveDocumentBlueprint () : I_Blueprint {
    this.bluePrintData = this.SGET_blueprint(this.$route.params.type)
    return this.SGET_blueprint(this.$route.params.type)
  }

  /**
   * Map new object "name" and "parentDoc" fields if pre-filled
   */
  mapNewObjectFields () {
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
            const parentID = this.$route.query.parent as string
            let retrievedObject = false as unknown as I_ShortenedDocument
            try {
              retrievedObject = this.SGET_document(parentID)
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
   */
  createNewDocumentObject () : I_OpenedDocument {
    this.editMode = true

    if (!this.$route.params.id || !this.bluePrintData) {
      // @ts-ignore
      return false
    }

    const uniqueID = this.$route.params.id
    return {
      _id: uniqueID,
      type: this.bluePrintData._id,
      icon: this.bluePrintData.icon,
      editMode: true,
      isNew: true,
      isFinished: false,
      hasEdits: false,
      url: `/project/display-content/${this.bluePrintData._id}/${uniqueID}`,
      extraFields: []
    }
  }

  /**
   * Check if field should be showing if the category setting is turned on
   */
  categoryFieldFilter (currentFieldID: string) {
    const isCategory = this.retrieveFieldValue(this.currentData, "categorySwitch")

    const ignoredList = ["breakDocumentSettings", "name", "documentColor", "documentBackgroundColor", "parentDoc", "order", "categorySwitch", "minorSwitch", "deadSwitch", "finishedSwitch", "tags"]
    return (
      (
        (!isCategory && currentFieldID !== "categoryDescription") ||
        ignoredList.includes(currentFieldID)
      ) || (isCategory && currentFieldID === "categoryDescription")
    )
  }

  /**
   * Checks if the field in question
   */
  hasValueFieldFilter (field: any) {
    if (!this.hideEmptyFields && !this.retrieveFieldValue(this.currentData, "finishedSwitch")) {
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

  /****************************************************************/
  // RESPONSIVE COLLUMN STYLES
  /****************************************************************/

  determineSize_MD (field: I_ExtraFields) {
    if (field.type === "break") {
      return 12
    }
    if (field.sizing <= 6) {
      return 6
    }

    return field.sizing
  }

  determineSize_LG (field: I_ExtraFields) {
    if (field.type === "break") {
      return 12
    }

    if (field.sizing <= 4) {
      return 4
    }

    return field.sizing
  }

  determineSize_XL (field: I_ExtraFields) {
    if (field.type === "break") {
      return 12
    }
    return field.sizing
  }

  /****************************************************************/
  // DELETE DIALOG
  /****************************************************************/

  deleteObjectDialogTrigger: string | false = false
  deleteObjectDialogClose () {
    this.deleteObjectDialogTrigger = false
  }

  deleteObjectAssignUID () {
    this.deleteObjectDialogTrigger = this.generateUID()
  }

  /****************************************************************/
  // ADD NEW DOCUMENT UNDER PARENT
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
  // DOCUMENT COPY
  /****************************************************************/
  documentPass = null as unknown as I_OpenedDocument

  copyTargetDocument () {
    this.documentPass = extend(true, {}, this.findRequestedOrActiveDocument())

    const newDocument = copyDocument(this.documentPass, this.generateUID())

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
  // DOCUMENT ACTIONS
  /****************************************************************/

  /**
   * Turns onthe edit mode
   */
  toggleEditMode () {
    const currentDoc = this.findRequestedOrActiveDocument()
    if (currentDoc && !currentDoc.editMode) {
      const dataCopy: I_OpenedDocument = extend(true, {}, currentDoc)
      dataCopy.editMode = true
      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
    }
  }

  /**
   * Saves the current document
   */
  async saveCurrentDocument (keepEditMode: boolean) {
    if (document.activeElement && keepEditMode === false) {
      (document.activeElement as HTMLElement).blur()
    }

    const currentDoc = this.findRequestedOrActiveDocument()

    // @ts-ignore
    const isNew = currentDoc.isNew

    const allDocuments = this.SGET_allOpenedDocuments

    const openedDocumentsCopy: I_OpenedDocument[] = extend(true, [], allDocuments.docs)

    if (currentDoc) {
      // @ts-ignore
      const savedDocument: {
        documentCopy: I_OpenedDocument,
        allOpenedDocuments: I_OpenedDocument[]
      } = await saveDocument(currentDoc, openedDocumentsCopy, this.SGET_allDocuments.docs, keepEditMode)

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

        // @ts-ignored
        this.SSET_updateDocument({ doc: this.mapShortDocument(doc, this.SGET_allDocumentsByType(doc.type).docs) })
      }

      this.$q.notify({
        group: false,
        type: "positive",
        message: "Document successfully saved"
      })
    }
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

body:not(.body--dark) {
  .documentDisplay {
    .isDead {
      text-decoration-color: #000;
    }
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

      .relationshipChipNewTab,
      .q-field__input,
      .q-icon,
      .q-field__native span {
        color: $darkModeText !important;

        .q-icon,
        &.q-chip__icon--remove {
          color: #000 !important;
        }
      }
    }
  }
}
</style>
