<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon" size="20px" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
      <q-icon v-if="isOneWayRelationship" name="mdi-arrow-right-bold" size="16px" class="q-ml-md">
         <q-tooltip>
          This is a one-way relationship. <br> Editing this value <b>will not</b> have effect on the connected document/s.
        </q-tooltip>
      </q-icon>
      <q-icon v-if="!isOneWayRelationship" name="mdi-arrow-left-right-bold" size="16px" class="q-ml-md">
         <q-tooltip>
          This is a two-way relationship. <br> Editing this value <b>will</b> also effect the connected document/s.
        </q-tooltip>
      </q-icon>

    </div>

    <q-list
      v-if="!editMode && localInput"
      dense>
      <q-item
      clickable
      class="text-primary"
      @click="openExistingDocument(localInput)">
        <q-item-section>
           {{localInput.label}}
        </q-item-section>
      </q-item>
    </q-list>

  <div class="flex" v-if="editMode">
    <q-select
      style="flex-grow: 1;"
      dense
      :options="filteredInput"
      use-input
      outlined
      input-debounce="0"
      v-model="localInput"
      @filter="filterSelect"
      @input="signalInput"
    >
      <template v-slot:prepend v-if="inputIcon">
        <q-icon :name="inputIcon" />
      </template>
      <template v-slot:option="{ itemProps, itemEvents, opt }">
          <q-item
            v-bind="itemProps"
            v-on="itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="opt.label" ></q-item-label>
            </q-item-section>
            <q-tooltip v-if='opt.disable'>
              This option is unavailable for selection as it is already paired to another.
            </q-tooltip>
          </q-item>
        </template>
    </q-select>

  </div>

  <q-separator color="grey q-mt-lg" />

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"

import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_ExtraFields } from "src/interfaces/I_Blueprint"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"

@Component({
  components: { }
})
export default class Field_SingleRelationship extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({ default: "" }) readonly inputDataValue!: I_FieldRelationship

  @Prop({ default: "" }) readonly currentId!: ""

  @Prop() readonly isNew!: boolean

  @Prop() readonly editMode!: boolean

  changedInput = false
  localInput = "" as unknown as I_FieldRelationship

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    // @ts-ignore
    this.localInput = (this.inputDataValue) ? this.inputDataValue : ""

    this.reloadObjectListAndCheckIfValueExists().catch(e => console.log(e))
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  extraInput: I_FieldRelationship[] = []
  filteredInput: I_FieldRelationship[] = []

  filterSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredInput = this.extraInput
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filteredInput = this.extraInput.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
  }

  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  reactToBlueprintChanges () {
    this.reloadObjectListAndCheckIfValueExists().catch(e => console.log(e))
  }

  @Watch("currentId")
  reactToIDChanges () {
    this.reloadObjectListAndCheckIfValueExists().catch(e => console.log(e))
  }

  get isOneWayRelationship () {
    return (this.inputDataBluePrint.type === "singleToNoneRelationship" || this.inputDataBluePrint.type === "manyToNoneRelationship")
  }

  async reloadObjectListAndCheckIfValueExists () {
    if (this.inputDataBluePrint?.relationshipSettings && this.currentId.length > 0) {
      const CurrentObjectDB = new PouchDB(this.inputDataBluePrint.relationshipSettings.connectedObjectType)

      const allObjects = (await CurrentObjectDB.allDocs({ include_docs: true })).rows.map((doc) => {
        const objectDoc = doc.doc as unknown as I_ShortenedDocument

        const pairedField = (this.inputDataBluePrint?.relationshipSettings?.connectedField) || ""
        let isDisabled = false

        if (pairedField.length > 0) {
          const pairedFieldObject = objectDoc.extraFields.find(f => f.id === pairedField)
          const pairingType = this.inputDataBluePrint.type
          if (
            (typeof pairedFieldObject?.value !== "string" && pairedFieldObject?.value !== null && pairingType === "singleToSingleRelationship") ||
            (typeof pairedFieldObject?.value !== "string" && pairedFieldObject?.value !== null && pairingType === "singleToSingleRelationship")) {
            isDisabled = true
          }
        }

        return {
          _id: objectDoc._id,
          value: objectDoc._id,
          type: objectDoc.type,
          disable: isDisabled,
          url: `/project/display-content/${objectDoc.type}/${objectDoc._id}`,
          label: objectDoc.extraFields.find(e => e.id === "name")?.value,
          pairedField: pairedField
        }
      }) as unknown as I_FieldRelationship[]

      const allObjectsWithoutCurrent: I_FieldRelationship[] = allObjects.filter((obj) => obj._id !== this.currentId)

      if (this.localInput._id) {
        if (!allObjectsWithoutCurrent.find(e => e._id === this.localInput._id)) {
          // @ts-ignore
          this.localInput = ""
        }
      }

      this.extraInput = allObjectsWithoutCurrent
    }
  }

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput
  }
}
</script>
