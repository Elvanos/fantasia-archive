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
    dense>
    <q-item>
       <q-item-section>
      <div class="colorIndicatorWrapper">
        <div class="colorIndicator" :style="`background-color: ${localInput}`">
        </div>
        <span class="text-weight-medium">
          {{localInput}}
        </span>
      </div>

      </q-item-section>
    </q-item>
  </q-list>

  <q-input
    v-if="editMode"
    v-model.number="localInput"
    type="text"
    @keyup="signalInput"
    outlined
    dense
  >
    <template v-slot:prepend>
     <div class="colorIndicator" :style="`background-color: ${localInput}`">
     </div>
    </template>
    <template v-slot:append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color
            @input="signalInput"
            v-model="localInput"
           />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>

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
export default class Field_ColorPicker extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: null }) readonly inputDataValue!: string
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  changedInput = false
  localInput = ""

  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput.trim()
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

<style lang="scss" scoped>
.colorIndicator {
  width: 20px;
  height: 20px;
  background-color: transparent;
}

.colorIndicatorWrapper {
  display: flex;
  margin-left: -15px;

  .colorIndicator {
    margin-right: 15px;
  }
}
</style>
