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

  <q-toggle
    :disable="!editMode"
    v-model="localInput"
    @input="signalInput"
  />

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-lg" />
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
export default class Field_Switch extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: false }) readonly inputDataValue!: boolean
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  changedInput = false
  localInput: null|boolean = null

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

  @Watch("inputDataValue", { immediate: true })
  reactToInputChanges () {
    this.localInput = (typeof this.inputDataValue === "boolean") ? this.inputDataValue : false
  }
}
</script>
