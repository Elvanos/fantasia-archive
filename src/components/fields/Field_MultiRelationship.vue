<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon" :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
      <q-icon v-if="isOneWayRelationship" name="mdi-arrow-right-bold" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
          This is a one-way relationship. <br> Editing this value <span class="text-gunmetal-bright">will not</span> have effect on the connected document/s.
        </q-tooltip>
      </q-icon>
      <q-icon v-if="!isOneWayRelationship" name="mdi-arrow-left-right-bold" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
          This is a two-way relationship. <br> Editing this value <span class="text-gunmetal-bright">will</span> also effect the connected document/s.
        </q-tooltip>
      </q-icon>

    </div>

    <q-list
      v-if="!editMode && localInput"
      class="connectionList"
      dense>
      <q-item
      v-for="single in localInput"
      :key="single._id"
      clickable
      class="text-primary"
      @click="openExistingDocumentRoute(single)">
        <q-item-section>
           {{stripTags(single.label)}}
           <span class="inline-block q-ml-xs text-italic connectionNote">
            {{retrieveNoteText(single._id)}}
           </span>
        </q-item-section>
      </q-item>
    </q-list>

  <div class="flex" v-if="editMode">
    <q-select
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="multiRelashionshipSelect"
      dark
      style="flex-grow: 1;"
      dense
      :ref="`multieRelationshipField${this.inputDataBluePrint.id}`"
      :options="filteredInput"
      use-input
      outlined
      use-chips
      multiple
      input-debounce="0"
      v-model="localInput"
      @filter="filterSelect"
      @input="signalInput(false)"
    >
      <template v-slot:selected-item="scope">
        <q-chip
          removable
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          color="accent"
          text-color="dark"
          class="text-bold"
        >
          {{ stripTags(scope.opt.label) }}
        </q-chip>
      </template>
      <template v-slot:option="{ itemProps, itemEvents, opt }">
        <q-item
          v-bind="itemProps"
          v-on="itemEvents"
        >
           <q-item-section avatar>
            <q-icon
              :style="`color: ${retrieveIconColor(opt)}`"
              :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon"
              />
          </q-item-section>
          <q-item-section>
            <q-item-label
            :style="`color: ${opt.color}`"
             v-html="opt.label" ></q-item-label>
            <q-item-label caption class="text-cultured" v-html="opt.hierarchicalPath"></q-item-label>
            <q-item-label caption class="text-cultured" v-if="opt.tags">
              <q-chip
              v-for="(input,index) in opt.tags" :key="index"
              outline
              style="opacity: 0.8;"
              size="12px"
              class="text-cultured noBounce"
              v-html="`${input}`"
              >
              </q-chip>
            </q-item-label>
          </q-item-section>
          <q-tooltip v-if='opt.disable'>
            This option is unavailable for selection as it is already paired to another.
          </q-tooltip>
        </q-item>
      </template>
    </q-select>

    <table class="q-mt-sm">
      <tr
        v-for="(singleNote,index) in inputNotes"
        :key="index"
      >
        <td>
          {{stripTags(localInput[index].label)}}
        </td>
        <td>
          <q-input
            label="Note"
            v-model="singleNote.value"
            dense
            @keyup="signalInput(false)"
            outlined
            >
          </q-input>
        </td>

      </tr>
    </table>
  </div>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-lg" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"
import { advancedDocumentFilter } from "src/scripts/utilities/advancedDocumentFilter"
import { extend } from "quasar"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_ExtraFields } from "src/interfaces/I_Blueprint"
import { I_FieldRelationship, I_RelationshipPair } from "src/interfaces/I_FieldRelationship"

@Component({
  components: { }
})
export default class Field_SingleRelationship extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({
    default: () => {
      return []
    }
  }) readonly inputDataValue!: I_RelationshipPair

  @Prop({ default: "" }) readonly currentId!: ""

  @Prop() readonly isNew!: boolean

  @Prop() readonly editMode!: boolean

  localInput = [] as unknown as I_FieldRelationship[]

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue?.value) ? this.inputDataValue.value : []

    const notes = (!this.inputDataValue?.addedValues) ? [] : this.inputDataValue.addedValues
    this.inputNotes = notes.filter(single => this.localInput.find(e => single.pairedId === e._id))

    this.checkNotes()

    this.reloadObjectListAndCheckIfValueExists().catch(e => console.log(e))
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  extraInput: I_FieldRelationship[] = []
  filteredInput: I_FieldRelationship[] = []

  inputNotes: { pairedId: string; value: string; }[] = []

  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`].setOptionIndex(-1)
    // @ts-ignore 
    this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`].moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  filterSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredInput = this.extraInput
        if (this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`] && this.filteredInput.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      const listCopy : I_ShortenedDocument[] = extend(true, [], this.extraInput)

      // @ts-ignore
      this.filteredInput = advancedDocumentFilter(needle, listCopy)

      /*eslint-disable */
        if(this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`] && this.filteredInput.length > 0){
          this.refocusSelect().catch(e => console.log(e)) 
        }
        /* eslint-enable */
    })
  }

  retrieveNoteText (id: string) {
    const pairedNote = this.inputNotes.find(e => e.pairedId === id)
    return (pairedNote && pairedNote.value.length > 0) ? `(${pairedNote.value})` : ""
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

      const allDbObjects = (await CurrentObjectDB.allDocs({ include_docs: true })).rows
      const allDbDocs = allDbObjects.map(doc => doc.doc)

      const allObjects = allDbDocs.map((doc) => {
        const objectDoc = doc as unknown as I_ShortenedDocument

        const pairedField = (this.inputDataBluePrint?.relationshipSettings?.connectedField) || ""
        let isDisabled = false

        if (pairedField.length > 0) {
          const pairedFieldObject = objectDoc.extraFields.find(f => f.id === pairedField)

          const pairingType = this.inputDataBluePrint.type
          if (typeof pairedFieldObject?.value !== "string" && pairedFieldObject?.value !== null && pairingType === "manyToSingleRelationship") {
            isDisabled = true
          }
        }

        return {
          _id: objectDoc._id,
          icon: objectDoc.icon,
          value: objectDoc._id,
          type: objectDoc.type,
          disable: isDisabled,
          url: `/project/display-content/${objectDoc.type}/${objectDoc._id}`,
          label: objectDoc.extraFields.find(e => e.id === "name")?.value,
          isCategory: objectDoc.extraFields.find(e => e.id === "categorySwitch")?.value,
          color: objectDoc.extraFields.find(e => e.id === "documentColor")?.value,
          pairedField: pairedField,
          tags: objectDoc.extraFields.find(e => e.id === "tags")?.value,
          // @ts-ignore
          hierarchicalPath: this.getDocumentHieararchicalPath(objectDoc, allDbDocs)

        }
      }) as unknown as I_FieldRelationship[]

      const allObjectsWithoutCurrent: I_FieldRelationship[] = allObjects.filter((obj) => obj._id !== this.currentId)

      this.localInput = (Array.isArray(this.localInput)) ? this.localInput : []

      let nonExistValue = false

      this.localInput.forEach((s, index) => {
        if (s._id) {
          if (!allObjectsWithoutCurrent.find(e => e._id === s._id)) {
          // @ts-ignore
            this.localInput.splice(index, 1)
            nonExistValue = true
          }
          else {
            const matchedFieldContent = allObjectsWithoutCurrent.find(e => e._id === s._id)

            if (matchedFieldContent) {
              this.localInput[index].label = matchedFieldContent.label
            }
          }
        }
      })

      if (nonExistValue) {
        this.signalInput(true)
      }

      const allObjectsWithoutCategories: I_FieldRelationship[] = allObjectsWithoutCurrent.filter((obj) => !obj.isCategory)

      this.extraInput = allObjectsWithoutCategories
    }
  }

  checkNotes () {
    this.localInput.forEach(single => {
      if (!this.inputNotes.find(e => single._id === e.pairedId)) {
        this.inputNotes.push({ pairedId: single._id, value: "" })
      }
    })
  }

  @Emit()
  signalInput (skipSave?: boolean) {
    this.checkNotes()
    this.inputNotes = this.inputNotes.filter(single => this.localInput.find(e => single.pairedId === e._id))
    return {
      value: this.localInput,
      addedValues: this.inputNotes,
      skipSave: (skipSave)
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>

<style lang="scss">
.connectionList .q-item__section {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.connectionList .connectionNote {
  color: #000;
  opacity: 0.8;
}

</style>
