<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-sm"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
    </div>

    <q-list
      v-if="!editMode"
      class="fieldSingleSelect_list"
      dense>
      <q-item>
        <q-item-section class="text-weight-medium">
           {{localInput}}
        </q-item-section>
      </q-item>
    </q-list>

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      dark
      popup-content-class="menuResizer"
      :ref="`singleSelectField${this.inputDataBluePrint.id}`"
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="singleSelect"
      :options="extraInput"
      use-input
      :outlined="!isDarkMode"
      :filled="isDarkMode"
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add"
      v-model="localInput"
      @input="processInput"
      @keydown="processInput"
    >
     <template v-slot:selected-item="scope">
      <q-chip
        v-if="scope.opt && scope.opt.length > 0"
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="accent"
        text-color="dark"
        class="text-bold"
      >
        {{ scope.opt }}
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

@Component({
  components: { }
})
export default class Field_SingleSelect extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: "" }) readonly inputDataValue!: ""

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : ""
  }

  /**
   * Model for the local input
   */
  localInput = ""

  /**
   * List of extra input values
   */
  extraInput: string[] = []

  /**
   * Load data into the extra input
   */
  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  populateExtraInput () {
    if (this.inputDataBluePrint?.predefinedSelectValues) {
      this.extraInput = this.inputDataBluePrint?.predefinedSelectValues
    }
  }

  /**
   * Defocus after filtering to avoid un-intuitive focus
   */
  async defocusSelectRef () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore
    this.$refs[`singleSelectField${this.inputDataBluePrint.id}`].setOptionIndex(-1)     
    /* eslint-enable */
  }

  /**
   * Filter the input list
   */
  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.inputDataBluePrint?.predefinedSelectValues) {
          this.extraInput = this.inputDataBluePrint.predefinedSelectValues
        }
      })
      this.defocusSelectRef().catch(e => console.log(e))
      return
    }

    update(() => {
      if (this.inputDataBluePrint?.predefinedSelectValues) {
        const needle = val.toLowerCase()
        this.extraInput = this.inputDataBluePrint.predefinedSelectValues.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }
      this.defocusSelectRef().catch(e => console.log(e))
    })
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
    return this.localInput
  }
}
</script>

<style lang="scss">
.fieldSingleSelect_list {
  .q-item {
    padding-right: 10px;
    padding-left: 10px;
  }

  .q-item__section {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}

</style>
