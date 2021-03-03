<template>
  <div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
  </div>

    <div
      v-if="!editMode"
    >
     <q-chip
      v-for="(input,index) in localInput" :key="index"
      color="primary" text-color="white" class="text-bold">
        {{input}}
      </q-chip>
    </div>

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      dark
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="tagSelect"
      :options="allTags"
      use-input
      outlined
      use-chips
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add"
      multiple
      v-model="localInput"
      @input="signalInput"
      @keydown="signalInput"
    >
    </q-select>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-lg" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { tagListBuildFromBlueprints } from "src/scripts/utilities/tagListBuilder"
import { I_ExtraFields } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class Field_Tags extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({
    default: () => {
      return []
    }
  }) readonly inputDataValue!: []

  @Prop() readonly isNew!: boolean

  @Prop() readonly editMode!: boolean

  changedInput = false
  localInput = []

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : []
  }

  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  reactToBlueprintChanges () {
    this.buildTagList().catch(e => console.log(e))
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  allTags: string[] = []

  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.inputDataBluePrint?.predefinedSelectValues) {
          this.allTags = this.inputDataBluePrint.predefinedSelectValues
        }
      })
      return
    }

    update(() => {
      if (this.inputDataBluePrint?.predefinedSelectValues) {
        const needle = val.toLowerCase()
        this.allTags = this.inputDataBluePrint.predefinedSelectValues.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }
    })
  }

  async buildTagList () {
    this.allTags = await tagListBuildFromBlueprints(this.SGET_allBlueprints)
  }

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput
  }
}
</script>
