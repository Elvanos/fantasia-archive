<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md fieldWysiwygTitle">
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
    </div>

    <div
      v-if="!editMode"
      class="fieldWysiwyg"
      v-html="localInput">
    </div>

    <q-editor
      v-model="localInput"
      :ref="`wysiwygField${this.inputDataBluePrint.id}`"
      @paste.native="evt => pasteCapture(evt)"
      :toolbar="wysiwygOptions"
      :fonts="wysiwygFonts"
      @input="processInput"
      :flat="isDarkMode"
      v-if="editMode"
      :definitions="definitions"
      min-height="350px"
      />

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
export default class Field_Wysiwyg extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({ default: "" }) readonly inputDataValue!: string

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
   * Model for the local input
   */
  localInput = ""

  /**
   * Debounce timer to prevent buggy input sync
   */
  pullTimer = null as any

  processInput () {
    clearTimeout(this.pullTimer)
    this.pullTimer = setTimeout(() => {
      this.signalInput()
    }, 500)
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    return this.localInput.trim()
  }

  /****************************************************************/
  // WYSIWYG FUNCTIONALITY
  /****************************************************************/

  /**
   * Disableds the full-screen edit mode upon cancleling the editing mode
   */
  @Watch("editMode")
  turnOffFullScreen () {
    if (!this.editMode && this.$refs[`wysiwygField${this.inputDataBluePrint.id}`]) {
      /*eslint-disable */
      // @ts-ignore
      this.$refs[`wysiwygField${this.inputDataBluePrint.id}`].exitFullscreen()
      /* eslint-enable */
    }
  }

  /**
   * Strips all formatting from CTRL + V pasting
   */
  pasteCapture (evt: any) {
    /*eslint-disable */

    // Let inputs do their thing, so we don't break pasting of links.
    if (evt.target.nodeName === "INPUT") {
      return
    }
    let text, onPasteStripFormattingIEPaste
    evt.preventDefault()
    if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
      text = evt.originalEvent.clipboardData.getData("text/plain")
      // @ts-ignore
      this.$refs[`wysiwygField${this.inputDataBluePrint.id}`].runCmd("insertText", text)
    }
    else if (evt.clipboardData && evt.clipboardData.getData) {
      text = evt.clipboardData.getData("text/plain")
      // @ts-ignore
      this.$refs[`wysiwygField${this.inputDataBluePrint.id}`].runCmd("insertText", text)
    }
    // @ts-ignore
    else if (window.clipboardData && window.clipboardData.getData) {
      if (!onPasteStripFormattingIEPaste) {
        onPasteStripFormattingIEPaste = true
        // @ts-ignore
        this.$refs[`wysiwygField${this.inputDataBluePrint.id}`].runCmd("ms-pasteTextOnly", text)
      }
      onPasteStripFormattingIEPaste = false
    }
    /* eslint-enable */
  }

  /**
   * Subsitution strings for toolbar
   */
  definitions = {
    fullscreen: { label: "Fullscreen" }
  }

  /**
   * Font list
   */
  wysiwygFonts = {
    arial: "Arial",
    arial_black: "Arial Black",
    comic_sans: "Comic Sans MS",
    courier_new: "Courier New",
    impact: "Impact",
    lucida_grande: "Lucida Grande",
    times_new_roman: "Times New Roman",
    verdana: "Verdana"
  }

  /**
   * Wysiwyg toolbar ontions
   */
  wysiwygOptions = [
    ["left", "center", "right", "justify"],
    ["bold", "italic", "underline", "subscript", "superscript"],
    [
      {
        label: this.$q.lang.editor.formatting,
        icon: this.$q.iconSet.editor.formatting,
        list: "no-icons",
        fixedIcon: true,
        options: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p"
        ]
      },
      {
        label: this.$q.lang.editor.fontSize,
        icon: this.$q.iconSet.editor.fontSize,
        fixedIcon: true,
        list: "no-icons",
        options: [
          "size-1",
          "size-2",
          "size-3",
          "size-4",
          "size-5",
          "size-6",
          "size-7"
        ]
      },
      {
        label: this.$q.lang.editor.defaultFont,
        icon: this.$q.iconSet.editor.font,
        fixedIcon: true,
        list: "no-icons",
        options: [
          "default_font",
          "arial",
          "arial_black",
          "comic_sans",
          "courier_new",
          "impact",
          "lucida_grande",
          "times_new_roman",
          "verdana"
        ]
      },
      "removeFormat"
    ],
    ["hr", "link", "quote", "unordered", "ordered", "outdent", "indent"],
    ["undo", "redo"],
    ["fullscreen"],
    ["viewsource"]
  ]
}
</script>

<style lang='scss'>
.fieldWysiwyg {
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
