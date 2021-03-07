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
    class="fieldText_list"
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
      v-model="localInput"
      @keyup="signalInput"
      outlined
      dense
      :ref="`textField${this.inputDataBluePrint.id}`"
     >
        <template v-slot:append v-if="isNew && !changedInput && localInput.length > 0">
          <q-icon name="close" @click="deletePlaceholder()" class="cursor-pointer" />
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

  get toolTip () {
    return this.inputDataBluePrint?.tooltip
  }

  get inputIcon () {
    return this.inputDataBluePrint?.icon
  }

  @Watch("editMode", { immediate: true })
  checkForNameFields () {
    if (this.inputDataBluePrint?.id === "name" && this.editMode === true) {
      this.$nextTick(function () {
        /*eslint-disable */
        // @ts-ignore 
        this.$refs[`textField${this.inputDataBluePrint.id}`].focus()

        if(this.isNew && !this.changedInput && this.localInput.length > 0){
          // @ts-ignore 
          this.$refs[`textField${this.inputDataBluePrint.id}`].select()
        }
    /* eslint-enable */
      })
    }
  }

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
  }
}
</script>
<style lang='scss'>
.fieldText_list {
  .q-item {
    padding-right: 10px;
    padding-left: 10px;
  }
}
</style>
