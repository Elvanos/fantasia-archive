<template>
  <div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
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
      :color="(isDarkMode) ? 'accent' : 'gunmetal-light'"
      :text-color="(isDarkMode) ? 'dark' :'satin-sheen-gold-light'"
      :class="(isDarkMode) ? 'text-weight-bold':'text-weight-medium'">
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
      :outlined="!isDarkMode"
      :filled="isDarkMode"
      use-chips
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add-unique"
      multiple
      v-model="localInput"
      @new-value="addNewValue"
      @input="processInput"
      @keydown="processInput"
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

import FieldBase from "src/components/fields/_FieldBase"

import { tagListBuildFromBlueprints } from "src/scripts/utilities/tagListBuilder"

@Component({
  components: { }
})
export default class Field_Tags extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({
    default: () => {
      return []
    }
  }) readonly inputDataValue!: []

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : []
    this.buildTagList()
  }

  /**
   * Model for the local input
   */
  localInput: string[] = []

  /**
   * Add an additional blueprint watch to catch all the changes for the tag refresh to avoid glitches and bugs
   */
  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  reactToBlueprintChanges () {
    this.buildTagList()
  }

  /**
   * Debounce timer to prevent buggy input sync
   */
  pullTimer = null as any

  processInput () {
    clearTimeout(this.pullTimer)
    this.pullTimer = setTimeout(() => {
      this.signalInput()
    }, 500)
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    this.tagAlreadyExists = false
    return this.localInput
  }

  /****************************************************************/
  // TAG MANAGEMENT
  /****************************************************************/

  /**
   * List of all currently existing tags
   */
  allTags: string[] = []

  /**
   * List of all currently filtered tags
   */
  filteredTags: string[] = []

  /**
   * Defocus after filtering to avoid un-intuitive focus
   */
  async defocusSelectRef () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore
    this.$refs[`tagField${this.inputDataBluePrint.id}`].setOptionIndex(-1)     
    /* eslint-enable */
  }

  /**
   * Determines if the newly added tag already exists or not
   */
  tagAlreadyExists = false

  /**
   * Add a new tag value to the list
   */
  addNewValue (val: string) {
    const formattedNewTag = val.toLowerCase().trim()

    const tagAlreadyExistsInList = (this.allTags.find(tag => tag.toLowerCase() === formattedNewTag))

    const tagAlreadyExistsAttached = (this.localInput.find(tag => tag.toLowerCase() === formattedNewTag))

    if (!tagAlreadyExistsInList) {
      this.allTags.push(val)
    }

    if (!tagAlreadyExistsAttached) {
      this.localInput.push(val)
      /*eslint-disable */
      // @ts-ignore
      this.$refs[`tagField${this.inputDataBluePrint.id}`].updateInputValue ('')     
      /* eslint-enable */
      this.processInput()
    }

    if (tagAlreadyExistsInList && tagAlreadyExistsAttached) {
      this.tagAlreadyExists = true
    }
  }

  /**
   * Filter the tag list
   */
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

  /**
   * Build a new tag list from all existing tags on all documents across the whole project
   */
  buildTagList () {
    this.allTags = tagListBuildFromBlueprints(this.SGET_allDocuments.docs)
  }
}
</script>
