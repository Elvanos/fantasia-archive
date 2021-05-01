<template>
<div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md" min="1"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
  </div>

  <div v-if="!editMode && localInput">
    <div
      v-if="!editMode"
    >
     <q-chip
      :color="(isDarkMode) ? 'accent' : 'gunmetal-light'"
      :text-color="(isDarkMode) ? 'dark' :'satin-sheen-gold-light'"
      :class="(isDarkMode) ? 'text-weight-bold':'text-weight-medium'">
         <q-icon
            :color="(isDarkMode) ? 'dark' :'satin-sheen-gold-light'"
            name="mdi-check-bold"
            class="q-mr-sm"
             />
        Active
      </q-chip>
    </div>
  </div>

  <q-toggle
    v-if="editMode"
    v-model="localInput"
    @input="processInput"
  />

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
export default class Field_Switch extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: false }) readonly inputDataValue!: boolean

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { immediate: true })
  reactToInputChanges () {
    this.localInput = (typeof this.inputDataValue === "boolean") ? this.inputDataValue : false
  }

  /**
   * Model for the local input
   */
  localInput: null|boolean = null

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
