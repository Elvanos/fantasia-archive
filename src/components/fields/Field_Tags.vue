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
      color="gunmetal-light" text-color="satin-sheen-gold-light" class="text-weight-medium">
        {{input}}
      </q-chip>
    </div>

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      dark
      :ref="`tagField${this.inputDataBluePrint.id}`"
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="tagSelect"
      :options="filteredTags"
      use-input
      outlined
      use-chips
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add"
      multiple
      v-model="localInput"
      @new-value="addNewValue"
      @input="signalInput"
      @keydown="signalInput"
      error-message="This tag is already present in the selection."
      :error="tagAlreadyExists"
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
          {{ stripTags(scope.opt) }}
        </q-chip>
      </template>
    </q-select>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
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
  localInput: string[] = []

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : []
    this.buildTagList().catch(e => console.log(e))
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

  filteredTags: string[] = []

  async defocusSelectRef () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore
    this.$refs[`tagField${this.inputDataBluePrint.id}`].setOptionIndex(-1)     
    /* eslint-enable */
  }

  tagAlreadyExists = false

  addNewValue (val: string) {
    const formattedNewTag = val.toLowerCase().trim()

    const tagAlreadyExistsInList = (this.allTags.find(tag => tag.toLowerCase() === formattedNewTag))

    const tagAlreadyExistsAttached = (this.localInput.find(tag => tag.toLowerCase() === formattedNewTag))

    if (!tagAlreadyExistsInList) {
      this.allTags.push(val)
    }

    if (!tagAlreadyExistsAttached) {
      this.localInput.push(val)
    }

    if (tagAlreadyExistsInList && tagAlreadyExistsAttached) {
      this.tagAlreadyExists = true
    }
  }

  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.allTags) {
          this.filteredTags = this.allTags
        }
        this.defocusSelectRef().catch(e => console.log(e))
      })
      return
    }

    update(() => {
      if (this.allTags) {
        const needle = val.toLowerCase()
        this.filteredTags = this.allTags.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }
      this.defocusSelectRef().catch(e => console.log(e))
    })
  }

  async buildTagList () {
    this.allTags = await tagListBuildFromBlueprints(this.SGET_allBlueprints)
  }

  @Emit()
  signalInput () {
    this.tagAlreadyExists = false
    this.changedInput = true
    return this.localInput
  }
}
</script>
