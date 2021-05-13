<template>
 <q-tooltip
  content-class="documentPreviewWrapper"
  :content-style="`z-index: ${specialZIndex} !important;`"
  :delay="customDelay"
  max-width="700px"
  max-height="600px"
  :target="customTarget"
  :offset="[0, 0]"
  :anchor="customAnchor"
  :self="customSelf"
  @before-show="openDocumentPreview"
  @before-hide="consitentDocumentPreviewSwitch"
  v-model="documentPreviewSwitch"
  transition-show="scale"
  transition-hide="scale"
  ref="documentPreview"
  >
    <div
      v-if="localBlueprint"
      class="documentPreviewContent"
      @mouseenter="clearCloseTimer"
      @mouseleave="setCloseTimer"
    >
     <div
        v-for="field in localBlueprint.extraFields"
        :key="`${field.id}`"
        class="col-12 q-mb-md"
        v-show="hasValueFieldFilter(field)"
      >

        <Field_Break
        class="inputWrapper break"
        v-if="field.type === 'break' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        />

        <Field_Text
        class="inputWrapper"
        v-if="field.type === 'text' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_Number
        class="inputWrapper"
        v-if="field.type === 'number' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_Switch
        class="inputWrapper"
        v-if="field.type === 'switch' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_ColorPicker
        class="inputWrapper"
        v-if="field.type === 'colorPicker' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_List
        class="inputWrapper"
        v-if="field.type === 'list' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_SingleSelect
        class="inputWrapper"
        v-if="field.type === 'singleSelect' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_MultiSelect
        class="inputWrapper"
        v-if="field.type === 'multiSelect' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

        <Field_SingleRelationship
        class="inputWrapper"
        v-if="(field.type === 'singleToNoneRelationship' || field.type === 'singleToSingleRelationship' || field.type === 'singleToManyRelationship') && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        :current-id="localDocument._id"
        :recursive="true"
        :special-z-index="(specialZIndex)"
        @menu-mode="reactToMenuMode"
        @menu-enter="reactToMenuEnter"
        @menu-leave="reactToMenuLeave"
        @set-new-parent-id="setOtherContent"
        />

        <Field_MultiRelationship
        class="inputWrapper"
        v-if="(field.type === 'manyToNoneRelationship' || field.type ===
        'manyToSingleRelationship' || field.type === 'manyToManyRelationship') && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        :current-id="localDocument._id"
        :recursive="true"
        :special-z-index="specialZIndex"
        @menu-mode="reactToMenuMode"
        @menu-enter="reactToMenuEnter"
        @menu-leave="reactToMenuLeave"
        @set-new-parent-id="setOtherContent"
        />

        <Field_Wysiwyg
        class="inputWrapper"
        v-if="field.type === 'wysiwyg' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="(retrieveFieldValue(localDocument, field.id)) ? retrieveFieldValue(localDocument, field.id) : ''"
        :isNew="false"
        :editMode="false"
        :current-id="localDocument._id"
        />

        <Field_Tags
        class="inputWrapper"
        v-if="field.type === 'tags' && categoryFieldFilter(field.id)"
        :inputDataBluePrint="field"
        :inputDataValue="retrieveFieldValue(localDocument, field.id)"
        :isNew="false"
        :editMode="false"
        />

     </div>

    </div>

  </q-tooltip>
</template>

<script lang="ts">

import { Component, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_Blueprint } from "src/interfaces/I_Blueprint"

import Field_Break from "src/components/fields/Field_Break.vue"
import Field_Text from "src/components/fields/Field_Text.vue"
import Field_Number from "src/components/fields/Field_Number.vue"
import Field_Switch from "src/components/fields/Field_Switch.vue"
import Field_ColorPicker from "src/components/fields/Field_ColorPicker.vue"
import Field_List from "src/components/fields/Field_List.vue"
import Field_SingleSelect from "src/components/fields/Field_SingleSelect.vue"
import Field_MultiSelect from "src/components/fields/Field_MultiSelect.vue"
import Field_Wysiwyg from "src/components/fields/Field_Wysiwyg.vue"
import Field_Tags from "src/components/fields/Field_Tags.vue"
import { extend } from "quasar"

@Component({
  components: {
    Field_Break,
    Field_Text,
    Field_Number,
    Field_Switch,
    Field_ColorPicker,
    Field_List,
    Field_SingleSelect,
    Field_MultiSelect,
    Field_SingleRelationship: () => import("src/components/fields/Field_SingleRelationship.vue"),
    Field_MultiRelationship: () => import("src/components/fields/Field_MultiRelationship.vue"),
    Field_Wysiwyg,
    Field_Tags
  }
})
export default class DocumentPreview extends BaseClass {
  /****************************************************************/
  // LOCAL CONTENT
  /****************************************************************/

  /**
   * Variable string for closing of the popup due to external influences
   */
  @Prop({ default: "" }) readonly externalCloseTrigger!: string

  @Watch("externalCloseTrigger")
  reactToExternalClose () {
    this.setCloseTimer()
  }

  /**
   * Retrieved document ID
   */
  @Prop() readonly documentId!: string

  setOtherContent (id:string) {
    this.hasOtherContent = true
    this.setNewDocumentID(id).catch(e => console.log(e))
  }

  async setNewDocumentID (id: string) {
    this.localDocument = extend(true, {}, this.SGET_document(id))
    if (!this.localDocument) {
      // @ts-ignore
      this.localDocument = extend(true, {}, this.SGET_openedDocument(id))
    }
    if (this.localDocument) {
      this.localBlueprint = this.SGET_blueprint(this.localDocument.type)

      await this.$nextTick()

      document.querySelectorAll(".documentPreviewWrapper").forEach(e => {
        e.scrollTop = 0
      })
    }
  }

  @Watch("documentId", { immediate: true })
  reactToDocumentIDChange (val: string) {
    if (this.documentId) {
      this.setNewDocumentID(val).catch(e => console.log(e))
    }
  }

  localDocument = false as unknown as I_ShortenedDocument
  localBlueprint = false as unknown as I_Blueprint

  /**
   * Check if field should be showing if the category setting is turned on
   */
  categoryFieldFilter (currentFieldID: string) {
    const isCategory = this.retrieveFieldValue(this.localDocument, "categorySwitch")

    const ignoredList = ["breakDocumentSettings", "name", "documentColor", "documentBackgroundColor", "parentDoc", "order", "categorySwitch", "minorSwitch", "deadSwitch", "finishedSwitch", "tags", "otherNames"]
    return (
      (
        (!isCategory && currentFieldID !== "categoryDescription") ||
        ignoredList.includes(currentFieldID)
      ) || (isCategory && currentFieldID === "categoryDescription")
    )
  }

  /**
   * Checks if the field in question
   */
  hasValueFieldFilter (field: any) {
    if (this.retrieveFieldType(this.localDocument, field.id) === "break") {
      return true
    }

    const value = this.retrieveFieldValue(this.localDocument, field.id)

    if (!value ||
    (Array.isArray(value) && value.length === 0) ||
    // @ts-ignore
     (value?.value && value.value.length === 0) ||
    // @ts-ignore
     (value.value === null)) {
      return false
    }
    return true
  }

  /****************************************************************/
  // GLOBAL OPTIONS
  /****************************************************************/

  /**
   * React to changes on the options store
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    this.isDarkMode = this.SGET_options.darkMode
  }

  /**
   * Determines if this is in dark-mode or not
   */
  isDarkMode = false

  /****************************************************************/
  // VISIBILITY MANAGEMENT
  /****************************************************************/

  /**
   * Variable string for closing of the popup due to external influences
   */
  @Prop({ default: 999 }) readonly specialZIndex!: number
  @Prop({ default: 750 }) readonly customDelay!: number
  @Prop({ default: true }) readonly customTarget!: string | boolean
  @Prop({ default: "bottom middle" }) readonly customAnchor!: string
  @Prop({ default: "top middle" }) readonly customSelf!: string
  @Prop({ default: 500 }) readonly customCloseDelay!: number

  consitentDocumentPreviewSwitch () {
    if (this.documentPreviewLock) {
      this.documentPreviewSwitch = true
    }
  }

  documentPreviewClose () {
    this.documentPreviewLock = false
    this.documentPreviewSwitch = false
    this.hasOtherContent = false
  }

  documentPreviewLock = false
  documentPreviewSwitch = false

  hasOtherContent = false

  openDocumentPreview () {
    if (!this.hasOtherContent) {
      this.documentPreviewLock = true
      if (this.documentId) {
        this.setNewDocumentID(this.documentId).catch(e => console.log(e))
      }
    }
  }

  clearCloseTimer () {
    this.disableScroll()
    clearTimeout(this.closeTimer)
  }

  setCloseTimer () {
    this.enableScroll()
    this.closeTimer = setTimeout(() => {
      this.documentPreviewClose()
    }, this.customCloseDelay)
  }

  /**
   * Debounce timer for nice user experience
   */
  closeTimer = null as any

  menuMode = false

  reactToMenuMode (menuMode: boolean) {
    this.menuMode = menuMode
  }

  reactToMenuEnter () {
    this.clearCloseTimer()
  }

  reactToMenuLeave () {
    this.setCloseTimer()
  }

  wheelOpt = { passive: false }
  wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel"

  preventDefault (e: WheelEvent) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const previewWrapper = e.target.closest(".documentPreviewWrapper")

    if (previewWrapper) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const previewContent = previewWrapper.querySelector(".documentPreviewContent")

      const wheelDirection = (e.deltaY > 0) ? "down" : "up"

      if (wheelDirection === "up" && previewWrapper.scrollTop === 0) {
        e.preventDefault()
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const combinedHeight = previewContent.getBoundingClientRect().height - previewWrapper.getBoundingClientRect().height

      if (wheelDirection === "down" && previewWrapper.scrollTop >= combinedHeight) {
        e.preventDefault()
      }
    }
  }

  disableScroll () {
    // @ts-ignore
    window.addEventListener("DOMMouseScroll", this.preventDefault, false)
    // @ts-ignore
    window.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt)
    // @ts-ignore
    window.addEventListener("touchmove", this.preventDefault, this.wheelOpt)
  }

  enableScroll () {
    // @ts-ignore
    window.removeEventListener("DOMMouseScroll", this.preventDefault, false)
    // @ts-ignore
    window.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt)
    // @ts-ignore
    window.removeEventListener("touchmove", this.preventDefault, this.wheelOpt)
  }
}
</script>

<style lang="scss">
.documentPreviewWrapper.no-pointer-events {
  pointer-events: all !important;
  padding: 0 !important;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
  height: 600px;
  background-color: map-get($customColors, 'gunmetal-lighter') !important;
}

.documentPreviewContent {
  padding: 20px;
  width: 700px;
  max-width: 100%;
  min-height: 600px;
  background-color: map-get($customColors, 'gunmetal-lighter') !important;
  color: #fff;

  .inputWrapper {
    display: flex;
    flex-direction: column;
  }

  h5 {
    font-size: 19px;
  }

  .text-primary {
    color: #ffd673 !important;
  }

  .colorIndicator {
    border: 1px solid #c5c5c5 !important;
  }

  .connectionNote,
  .listNote {
    color: #fff !important;
    font-weight: normal;
  }

  .fieldWysiwyg {
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
