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
      dark
      :ref="`singleSelectField${this.inputDataBluePrint.id}`"
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="singleSelect"
      :options="extraInput"
      use-input
      outlined
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add"
      v-model="localInput"
      @input="signalInput"
      @keydown="signalInput"
    >
    </q-select>

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

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  extraInput: string[] = []

  async defocusSelectRef () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore
    this.$refs[`singleSelectField${this.inputDataBluePrint.id}`].setOptionIndex(-1)     
    /* eslint-enable */
  }

  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  populateExtraInput () {
    if (this.inputDataBluePrint?.predefinedSelectValues) {
      this.extraInput = this.inputDataBluePrint?.predefinedSelectValues
    }
  }

  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.inputDataBluePrint?.predefinedSelectValues) {
          this.extraInput = this.inputDataBluePrint.predefinedSelectValues
        }
      })
      this.defocusSelectRef().catch(e => console.log(e))
      return
    }

    update(() => {
      if (this.inputDataBluePrint?.predefinedSelectValues) {
        const needle = val.toLowerCase()
        this.extraInput = this.inputDataBluePrint.predefinedSelectValues.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }
      this.defocusSelectRef().catch(e => console.log(e))
    })
  }

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput
  }
}
</script>
