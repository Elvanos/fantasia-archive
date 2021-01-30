<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon" size="20px" class="q-mr-md"/>
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

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      :options="extraInput"
      use-input
      outlined
      input-debounce="0"
      new-value-mode="add"
      v-model="localInput"
      @input="signalInput"
      @keydown="signalInput"
    >
    <template v-slot:prepend v-if="inputIcon">
      <q-icon :name="inputIcon" />
    </template>
    </q-select>

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
export default class Field_SingleSelect extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({ default: "" }) readonly inputDataValue!: ""

  @Prop() readonly isNew!: boolean

  @Prop() readonly editMode!: boolean

  changedInput = false
  localInput = ""

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : ""
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  get extraInput () {
    // @ts-ignore
    return this.inputDataBluePrint?.predefinedSelectValues
  }

  @Emit()
  signalInput () {
    console.log("emit")
    this.changedInput = true
    return this.localInput
  }
}
</script>
