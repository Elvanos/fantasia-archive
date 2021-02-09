<template>
<div>
  <h4 class="flex justify-start items-center text-weight-bolder q-mb-lg q-mt-xl">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
    {{inputDataBluePrint.name}}
  </h4>
</div>

</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator"

import BaseClass from "src/BaseClass"

import { I_ExtraFields } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class Field_Text extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: "" }) readonly inputDataValue!: string
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  changedInput = false
  localInput = ""
}
</script>
