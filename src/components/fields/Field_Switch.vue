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

  <q-toggle
    :disable="!editMode"
    v-model="localInput"
    @input="signalInput"
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
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    return this.localInput
  }
}
</script>
