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

  <q-list
    v-if="!editMode"
    class="fieldNumber_list"
    dense>
    <q-item>
      <q-item-section>
        <span class="text-weight-medium">
          {{localInput}}
        </span>
      </q-item-section>
    </q-item>
  </q-list>

  <q-input
    v-if="editMode"
    v-model.number="localInput"
    type="number"
    @keyup="signalInput"
    :outlined="!isDarkMode"
    :filled="isDarkMode"
    dense
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
export default class Field_Number extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: null }) readonly inputDataValue!: null|number

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
  }

  /**
   * Model for the local input
   */
  localInput: null|number = null

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    return this.localInput
  }
}
</script>
<style lang='scss'>
.fieldNumber_list {
  .q-item {
    padding-right: 10px;
    padding-left: 10px;
  }
}
</style>
