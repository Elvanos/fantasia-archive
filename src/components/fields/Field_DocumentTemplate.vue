<template>
  <div>
  <div class="documentLabelWrapper text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon" :size="(inputIcon.includes('fas') || inputIcon.includes('fab'))? '15px': '20px'" class="documentLabelIcon"/>
    <div class="documentLabelContent">
      {{inputDataBluePrint.name}}
    </div>
    <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="documentLabelTooltip">
        <q-tooltip :delay="500">
          <span v-html="toolTip"/>
      </q-tooltip>
    </q-icon>
  </div>

    <q-list
      v-if="!editMode"
      class="fieldSingleSelect_list"
      dense>
      <q-item>
        <q-item-section class="text-weight-medium">
           {{(selectedTemplate && selectedTemplate.name) ? selectedTemplate.name : ''}}
        </q-item-section>
      </q-item>
    </q-list>

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      dark
      popup-content-class="menuResizer"
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="singleSelect"
      :options="extraInput"
      option-value="id"
      use-input
      :outlined="!isDarkMode"
      :filled="isDarkMode"
      @filter="filterFn"
      v-model="selectedTemplate"
      @input="signalInput"
    >
      <template v-slot:selected-item="scope">
          {{scope.opt.name}}
      </template>
      <template v-slot:option="{ itemProps, itemEvents, opt }">
        <q-item
          v-bind="itemProps"
          v-on="itemEvents"
          :key="opt.id"
        >
          <q-item-section>
            <q-item-label>
              {{opt.name}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

    </q-select>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import { retrieveAllDocumentTemplatesFromDB } from "src/scripts/projectManagement/documentTemplates"

import FieldBase from "src/components/fields/_FieldBase"
import { extend } from "quasar"
import { I_DocumentTemplate } from "src/interfaces/I_DocumentTemplate"

@Component({
  components: { }
})
export default class Field_SingleSelect extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: "" }) readonly inputDataValue!: ""

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    // @ts-ignore
    this.localInput = (this.inputDataValue) ? this.inputDataValue : null

    this.assignLocalInputData()
  }

  /**
   * Model for the local input
   */
  localInput = null as unknown as string

  /**
   * Local list of all predefined document templates
   */
  documentTemplateList: I_DocumentTemplate[] = []

  selectedTemplate = null as unknown as I_DocumentTemplate

  /**
   * List of extra input values
   */
  extraInput: I_DocumentTemplate[] = []

  /**
   * Load data into the extra input
   */
  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  async populateExtraInput () {
    await this.loadDocumentTemplates()
    if (this.documentTemplateList) {
      this.extraInput = extend(true, [], this.documentTemplateList)
    }
    this.assignLocalInputData()
  }

  async loadDocumentTemplates () {
    this.documentTemplateList = await retrieveAllDocumentTemplatesFromDB()
  }

  assignLocalInputData () {
    if (this.documentTemplateList.length > 0 && this.localInput) {
      const newAssign = this.documentTemplateList.find(e => e.id === this.localInput)

      if (newAssign) {
        this.selectedTemplate = newAssign
      }
    }
  }

  /**
   * Filter the input list
   */
  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.documentTemplateList) {
          this.extraInput = this.documentTemplateList
        }
      })
      return
    }

    update(() => {
      if (this.inputDataBluePrint?.predefinedSelectValues) {
        const needle = val.toLowerCase()
        this.extraInput = this.documentTemplateList.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      }
    })
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    return (this.selectedTemplate) ? this.selectedTemplate.id : null
  }
}
</script>

<style lang="scss">
.fieldSingleSelect_list {
  .q-item {
    padding-right: 10px;
    padding-left: 10px;
    min-height: 32px !important;
  }

  .q-item__section {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}

</style>
