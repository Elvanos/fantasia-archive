<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip>
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
    </div>

    <div v-if="!editMode" v-html="localInput">
    </div>

    <q-editor
      v-model="localInput"
      :toolbar="wysiwygOptions"
      :fonts="wysiwygFonts"
      @input="signalInput"
      v-if="editMode"
      :definitions="definitions"
      min-height="250px"
      />

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
export default class Field_Wysiwyg extends BaseClass {
  @Prop({ default: [] }) readonly inputDataBluePrint!: I_ExtraFields
  @Prop({ default: "" }) readonly inputDataValue!: string
  @Prop() readonly editMode!: boolean
  @Prop() readonly isNew!: boolean

  changedInput = false
  localInput = ""

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

  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = this.inputDataValue
  }

  definitions = {
    fullscreen: { label: "Fullscreen" }
  }

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
