<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
    </div>

  <q-list
      v-if="!editMode"
      class="fieldList_list"
      dense>
      <q-item v-for="(input,index) in localInput" :key="index">
        <q-item-section
        class="fieldList_itemDot"
         side>
          <q-icon
            color="primary"
            name="mdi-menu-right"
             />
        </q-item-section>
        <q-item-section>
          <span class="text-weight-medium">
            {{input.value}}
          </span>
          <span v-if="localInput[index].affix" class="inline-block q-ml-xs text-italic">
            ({{localInput[index].affix}})
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
          @input="signalInput"
          @keydown="signalInput"
          :label="(inputAffix) ? inputAffix : ''"
          v-model="localInput[index].affix"
        />
      </div>

      <div style="width: 115px;" class="justify-end flex">
        <q-btn
          v-if="editMode"
          color="secondary"
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
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { extend } from "quasar"

import { I_ExtraFields } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class Field_List extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields

  @Prop({
    default: () => {
      return []
    }
  }) readonly inputDataValue!: {
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

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  get hasExtraInput () {
    // @ts-ignore
    this.localExtraInput = this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
    return this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
  }

  @Emit()
  signalInput () {
    this.changedInput = true

    const dataCopy: {
      value: string
      affix?: string
    }[] = extend(true, [], this.localInput)

    const returnValue = dataCopy.map(e => {
      e.value = e.value.trim()
      if (e.affix) {
        e.affix = e.affix.trim()
      }
      return e
    })

    return returnValue
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

<style lang="scss">
.fieldList_list {
  .q-item {
    padding-right: 10px;
    padding-left: 0;
  }

  .q-item__section {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .fieldList_itemDot {
    padding-right: 10px;
  }
}

</style>
