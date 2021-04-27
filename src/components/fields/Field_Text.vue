<template>
<div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
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
      @keydown="signalInput"
      :outlined="!isDarkMode"
      :filled="isDarkMode"
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

import FieldBase from "src/components/fields/_FieldBase"

@Component({
  components: { }
})
export default class Field_Text extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: "" }) readonly inputDataValue!: string

  /**
   * Determines if the parent document is new or not
   */
  @Prop() readonly isNew!: boolean

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
  }

  /**
   * Determines if the input has any changes on it or not
   */
  changedInput = false

  /**
   * Model for the local input
   */
  localInput = ""

  /**
   * Deletes the placeholder value in the input field
   */
  deletePlaceholder () {
    this.localInput = ""
    this.signalInput()
  }

  /**
   * Observe change on the edit mode and in case this field is "name", auto-select it as first field
   */
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

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    this.changedInput = true
    return this.localInput.trim()
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
