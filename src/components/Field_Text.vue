<template>
<div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
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
      v-model="localInput"
      @keyup="signalInput"
      outlined
      dense
     >
        <template v-slot:append v-if="isNew && !changedInput && localInput.length > 0">
          <q-icon name="close" @click="deletePlaceholder()" class="cursor-pointer" />
        </template>
    </q-input>

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
export default class Field_Text extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: "" }) readonly inputDataValue!: string
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  changedInput = false
  localInput = ""

  deletePlaceholder () {
    this.localInput = ""
    this.signalInput()
  }

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
