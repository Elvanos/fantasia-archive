<template>
  <div>
    <existingDocumentDialog
      v-if="editMode"
      preventOpen="true"
      quickInsertMode="true"
      :dialog-trigger="existingObjectDialogTrigger"
      @trigger-dialog-close="existingObjectDialogClose"
      @signal-document-selected="handleDocumentSelected"
    />

    <div class="flex justify-center items-center text-weight-bolder q-mb-sm q-mt-md fieldWysiwygTitle">
      <span>
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="(inputIcon.includes('fas') || inputIcon.includes('fab'))? '15px': '20px'"   class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
      </span>
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
      @keypress.native="handleEditorKeypress"
      @click.native="handleEditorClick"
      />

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import FieldBase from "src/components/fields/_FieldBase"
import { QEditor } from "quasar"

@Component({
  components: {
    existingDocumentDialog: () => import("src/components/dialogs/ExistingDocument.vue")
  }
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

  existingObjectDialogTrigger: string | false = false

  handleDocumentSelected (id: string) {
    /*eslint-disable */
    const editor = this.$refs[`wysiwygField${this.inputDataBluePrint.id}`] as any

    editor.focus()
    const doc = this.SGET_document(id)
    // We need to timeout here to give time to the runtime to focus the editor.
    // when focused the caret will return to it's previous position and we can insert the document link
    setTimeout(() => {
      editor.runCmd("insertHtml", `<a href="document:${id}">${doc.label}</a>&nbsp;`)
    }, 100)

    /* eslint-enable */
  }

  existingObjectDialogClose () {
    this.existingObjectDialogTrigger = false
  }

  existingObjectAssignUID () {
    this.existingObjectDialogTrigger = this.generateUID()
  }

  handleEditorKeypress (evt: any) {
    /*eslint-disable */
    if (evt.key === '@' && this.editMode) {
      const editor = this.$refs[`wysiwygField${this.inputDataBluePrint.id}`] as QEditor

      // We don't want to paste anything special in the source mode editor, let the user do their thing
      if ((editor as any).isViewingSource){
        return;
      }
      
      // Prevent showing up `@` character
      evt.preventDefault()

      // Open the selector dialog
      // Timeout to allow to actually type the '@' symbol
      setTimeout(() => {
        this.existingObjectAssignUID()
      }, 1)
    }
    /* eslint-enable */
  }

  handleEditorClick (evt: any) {
    /*eslint-disable */
    if (evt.target.tagName.toLowerCase() === 'a') {
      // Only follow links when ctrl is pressed
      if (evt.ctrlKey) {
        const link = evt.target.href
        evt.stopPropagation()
        this.openLink(link)
      }
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
