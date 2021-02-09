<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
    </div>

  <q-list
      v-if="!editMode"
      dense>
      <q-item v-for="(input,index) in localInput" :key="index">
        <q-item-section side>
          <q-icon name="mdi-menu-right" />
        </q-item-section>
        <q-item-section>
          <span>
            {{input.value}}
            <span v-if="localInput[index].affix" class="inline-block q-ml-xs text-italic text-lowercase">
            ({{localInput[index].affix}})
            </span>
          </span>
        </q-item-section>
      </q-item>
    </q-list>

  <div v-if="editMode">
    <div class="row q-mb-sm"
      v-for="(singleInput,index) in localInput"
      :key="index"
    >
      <div class="col">
        <q-input
          v-model="localInput[index].value"
          dense
          @keyup="signalInput"
          outlined
          >
        </q-input>
      </div>

      <div
      class="q-ml-lg justify-end flex"
      style="max-width: 220px; width: 220px;"
      v-if="hasExtraInput">
        <q-select
          style="width: 100%;"
          dense
          :options="localExtraInput"
          use-input
          :hide-dropdown-icon="!editMode"
          :outlined="editMode"
          :borderless="!editMode"
          :readonly="!editMode"
          input-debounce="0"
          new-value-mode="add"
          :label="(inputAffix) ? inputAffix : ''"
          v-model="localInput[index].affix"
        />
      </div>

      <div style="width: 115px;" class="justify-end flex">
        <q-btn
          v-if="editMode"
          color="red"
          @click="removeFromList(index)"
          label="Remove" />
      </div>
    </div>

    <div class="row q-mt-xs" v-if="editMode">
      <div class="col justify-start flex">
        <q-btn color="primary" :label="`Add new`" @click="addNewInput" />
      </div>
    </div>
  </div>

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
export default class Field_List extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({ default: () => { return [] } }) readonly inputDataValue!: {
    value: string
    affix?: string
  }[]

  @Prop() readonly isNew!: boolean

  @Prop() readonly editMode!: boolean

  changedInput = false
  localInput = [] as {
    value: string
    affix?: string
  }[]

  localExtraInput = []

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : []
  }

  get inputAffix () {
    return (this.inputDataBluePrint?.predefinedListExtras?.affix) || ""
  }

  removeFromList (index: number) {
    this.localInput.splice(index, 1)
    this.signalInput()
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  get hasExtraInput () {
    // @ts-ignore
    this.localExtraInput = this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
    return this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
  }

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput
  }

  addNewInput () {
    this.localInput.push({
      value: "",
      affix: ""
    })
    this.signalInput()
  }
}
</script>
