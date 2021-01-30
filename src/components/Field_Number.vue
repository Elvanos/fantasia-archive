<template>
<div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon" size="20px" class="q-mr-md" min="1"/>
    {{inputDataBluePrint.name}}
  </div>

  <q-list
    v-if="!editMode"
    dense>
    <q-item>
      <q-item-section>
          {{localInput}}
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

    <q-separator color="grey q-mt-lg" />

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

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
  }
}
</script>
