<template>
<div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md" min="1"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip" name="mdi-help-circle" size="16px" class="q-ml-md">
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
    outlined
    dense
  />

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>
</div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"

import { I_ExtraFields } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class Field_Number extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: null }) readonly inputDataValue!: null|number
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  changedInput = false
  localInput: null|number = null

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
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
