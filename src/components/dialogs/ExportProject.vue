<template>

  <q-dialog
    v-model="dialogModel"
    @before-hide="triggerDialogClose"
    :persistent="exportOngoing"

    >
    <q-card
      v-if="!exportOngoing"
      class="exportDialog"
      dark
    >
      <q-card-section class="row justify-center text-center">
        <h6 class="text-center q-my-sm">Export project/documents</h6>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-4">
            <div class="q-mx-lg">
              <q-select
                class="exportTypeSelect"
                dark
                popup-content-class="menuResizer"
                :options="exportFormats"
                label="Export file format"
                filled
                input-debounce="0"
                v-model="selectedExportFormat"
              />

              <q-checkbox
                class="q-mt-lg"
                dark color="primary"
                v-model="exportWholeProject"
                label="Export whole project?"
              />

              <q-checkbox
                class="q-mt-lg"
                dark color="primary"
                v-model="includeTags"
                label="Include tags in the export?"
              />

              <q-checkbox
                class="q-mt-lg"
                dark color="primary"
                v-model="includeHierarchyPath"
                label="Include hierarchical path in the export?"
              />

              <q-checkbox
                class="q-mt-lg"
                dark color="primary"
                v-model="includeIsDead"
                label="Include dead/gone/destroyed documents in the export?"
              />

              <q-checkbox
                v-if="includeIsDead"
                class="q-mt-lg"
                dark color="primary"
                v-model="hideDeadInformation"
                label="Hide dead/gone/destroyed status in the exported documents?"
              />

            </div>
          </div>

          <div class="col-8">
            <div
             style="height: 100%;"
             class="q-mx-lg"
             >
              <div
                style="height: 100%; line-height: 2;"
                class="column justify-center items-center"
                v-if="exportWholeProject"
              >
                Please note that:
                <span class="text-bold text-secondary">
                  The more documents, the slower export.
                </span>
                <span>
                  FA currently needs to generate individual files for <span class="text-bold text-primary">{{SGET_allDocuments.docs.length}} </span> documents.
                </span>
              </div>
              <q-select
                ref="ref_exportDocument"
                class="exportDocumentSelect"
                dark
                popup-content-class="menuResizer"
                v-if="!exportWholeProject"
                menu-anchor="bottom middle"
                menu-self="top middle"
                :options="filteredExistingInput"
                use-input
                multiple
                use-chips
                filled
                label="Selected documents"
                input-debounce="500"
                v-model="exportDocumentsModel"
                @filter="filterExistingSelect"
              >
                <template v-slot:append v-if="!hideAdvSearchCheatsheetButton">
                  <q-btn round dense flat icon="mdi-help-rhombus" @click.stop.prevent="SSET_setAdvSearchWindowVisible"
                  >
                    <q-tooltip :delay="500">
                      Open search cheatsheet
                    </q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:option="{ itemProps, itemEvents, opt }">
                    <q-item
                      :class="{'hasTextShadow': textShadow, 'isMinor':opt.isMinor}"
                      v-bind="itemProps"
                      v-on="itemEvents"
                      :key="opt.id"
                      :style="`color: ${opt.color}; background-color: ${opt.bgColor}`"
                      @mouseleave="setDocumentPreviewClose"
                    >
                    <documentPreview
                      :document-id="opt._id"
                      :external-close-trigger="documentPreviewClose"
                      :special-z-index="999999999"
                      :custom-anchor="'top end'"
                      :custom-self="'center left'"
                      :custom-delay="1200"
                    />
                      <q-item-section avatar>
                        <q-icon
                          :style="`color: ${retrieveIconColor(opt)}`"
                          :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon"
                          />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          <span class="isDeadIndicator" v-if="opt.isDead">
                            †
                          </span>
                          <span :class="{'isDead': (opt.isDead && !hideDeadCrossThrough)}" v-html="opt.label">
                          </span>
                        </q-item-label>
                        <q-item-label caption class="text-cultured" v-html="opt.hierarchicalPath"></q-item-label>
                        <q-item-label caption class="text-cultured" v-if="opt.tags">
                          <q-chip
                          v-for="(input,index) in opt.tags" :key="index"
                          outline
                          style="opacity: 0.8;"
                          size="12px"
                          class="text-cultured"
                          v-html="`${input}`"
                          >
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                </template>
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="removeInput(scope)"
                    :tabindex="scope.tabindex"
                    :color="(scope.opt.isAutoGenerated) ? 'teal-3' : 'accent'"
                    text-color="dark"
                    class="text-bold"
                  >

                    <div
                      class="relationShipChipOverlay"
                      @mouseleave="setDocumentPreviewClose"
                    />

                    <div class="relationShipChipContent">
                      <template v-if="scope.opt.isDead">
                        †
                      </template>
                      {{ stripTags(scope.opt.label) }}
                    </div>
                    <documentPreview
                      :special-z-index="999999999"
                      :custom-delay="1200"
                      :document-id="scope.opt._id"
                      :external-close-trigger="documentPreviewClose"
                    />

                  </q-chip>
                </template>
              </q-select>
            </div>
          </div>
        </div>

      </q-card-section>

      <q-card-actions align="right" class="q-mb-lg q-mr-xl">
          <q-btn flat label="Cancel" color="accent" v-close-popup class="q-mr-lg" />
           <q-btn
            :flat="!exportWholeProject && exportDocumentsModel.length === 0"
            :outline="exportWholeProject || exportDocumentsModel.length > 0"
            label="Export"
            color="primary"
            :disable="!exportWholeProject && exportDocumentsModel.length === 0"
            @click="exportDocuments"
           />
      </q-card-actions>
    </q-card>

    <q-card v-if="exportOngoing" dark class="exportDialog">
        <q-card-section class="row justify-center">
        <h6 class="text-center q-my-sm">Exporting...</h6>
      </q-card-section>

      <q-card-section class="row justify-center q-mx-xl">
        <div>
          Current document: {{currentDocName}}
        </div>
      </q-card-section>

      <q-card-section class="row justify-center q-mx-xl q-mb-lg">
          <q-linear-progress stripe round dark size="20px" :value="progressCounter" color="primary" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
              <q-badge text-color="accent" color="dark" :label="`${exportedDocuments}/${exportList.length}`" />
            </div>
          </q-linear-progress>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">

import { Component, Watch, Prop } from "vue-property-decorator"
import { remote } from "electron"
import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"
// @ts-ignore
import json2md from "json2md/lib/index.js"
// @ts-ignore
// import PDFkit from "pdfkit/js/pdfkit.standalone.js"
// @ts-ignore
import htmlParseStringify from "html-parse-stringify/dist/html-parse-stringify.modern.js"
import DialogBase from "src/components/dialogs/_DialogBase"
import { uid, extend } from "quasar"
import fs from "fs-extra"
import documentPreview from "src/components/DocumentPreview.vue"

import { I_ExportObject } from "src/interfaces/I_ExportObject"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_PDFKitDocument } from "src/interfaces/I_PDFKitDocument"
import { I_HtmlParserNode } from "src/interfaces/I_HtmlParserNode"
import { advancedDocumentFilter } from "src/scripts/utilities/advancedDocumentFilter"

@Component({
  components: {
    documentPreview
  }
})
export default class ExportProject extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true

      this.resetLocalData()
      this.reloadOptions()
      this.populateExportObjectDialog()

      if (this.prepickedIds.length > 0) {
        // @ts-ignore
        this.exportDocumentsModel = this.SGET_allDocuments.docs.filter(doc => {
          return this.prepickedIds.includes(doc._id)
        })
      }
    }
  }

  resetLocalData () {
    this.selectedExportFormat = "Adobe Reader - PDF"
    this.exportWholeProject = false
    this.includeTags = false
    this.includeHierarchyPath = false
    this.hideDeadInformation = false
    this.includeIsDead = true
    this.exportDocumentsModel = []
    this.exportOngoing = false
    this.exportList = []
  }

  @Prop(({
    default () {
      return []
    }
  })) readonly prepickedIds!: string[]

  exportFormats = [
    "Adobe Reader - PDF",
    "Markdown - MD"
    // "Open office document - ODT",
    // "MS Word document - DOCX"
  ]

  selectedExportFormat = "Adobe Reader - PDF"

  exportWholeProject = false

  includeTags = false

  includeHierarchyPath = false

  hideDeadInformation = false

  includeIsDead = true

  setDocumentPreviewClose () {
    this.documentPreviewClose = uid()
  }

  /**
   * Reloads local options
   */
  reloadOptions () {
    this.textShadow = this.SGET_options.textShadow
    this.hideDeadCrossThrough = this.SGET_options.hideDeadCrossThrough
    this.hideAdvSearchCheatsheetButton = this.SGET_options.hideAdvSearchCheatsheetButton
  }

  /**
   * Hides the advanced search cheatsheet help button in relationship type fields.
   */
  hideAdvSearchCheatsheetButton = false

  /**
   * Determines if the "dead" document type should have a cross-text decoration or not
   */
  hideDeadCrossThrough = false

  /**
   * Determines if text shadow will be shows for accesiblity reasons or not
   */
  textShadow = false

  documentPreviewClose = ""

  /**
   * Currently being opened document
   */
  exportDocumentsModel = []

  /**
   * Pre-filtered list based on the category inclussion or exlcussion
   */
  existingObjectsFullList = [] as I_ShortenedDocument[]

  /**
   * All currently loaded blueprints
   */
  allDocumentBluePrints = [] as I_Blueprint[]

  /**
   * Filtered list of items
   */
  filteredExistingInput = null as unknown as I_ShortenedDocument[]

  /**
   * Local list copty for filtering in order to not mess up the original list
   */
  listCopy: I_ShortenedDocument[] = []

  /**
   * Refocuses the first value in the selct upon filtering for intuitive keyboard control
   */
  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_exportDocument.setOptionIndex(-1)
    // @ts-ignore 
    this.$refs.ref_exportDocument.moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  /**
   * Filter the pre-filtered list
   */
  filterExistingSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredExistingInput = this.existingObjectsFullList.filter((obj) => !obj.isMinor)
        if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.listCopy = extend(true, [], this.existingObjectsFullList)
      this.filteredExistingInput = advancedDocumentFilter(needle, this.listCopy, this.allDocumentBluePrints, this.existingObjectsFullList)

      if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
        this.refocusSelect().catch(e => console.log(e))
      }
    })
  }

  /**
   * Set up up all data in to the dialog on popup load
   */
  populateExportObjectDialog () {
    this.allDocumentBluePrints = this.SGET_allBlueprints

    this.existingObjectsFullList = this.SGET_allDocuments.docs
  }

  async removeInput (scope: {
    index: number
    removeAtIndex: (index: number) => void
  }) {
    scope.removeAtIndex(scope.index)

    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_exportDocument.hidePopup() 
    /* eslint-enable */
  }

  exportOngoing = false

  exportList:I_ShortenedDocument[] = []

  exportedDocuments = 0

  currentDocName = ""

  get progressCounter () {
    return (this.exportedDocuments / this.exportList.length)
  }

  exportDocuments () {
    remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    }).then(async (result) => {
      const folderPath = result.filePaths[0]

      if (!folderPath) {
        return
      }

      const projectName: string = await retrieveCurrentProjectName()

      const exportPath = `${folderPath}/${projectName} - Export`

      if (!fs.existsSync(exportPath)) {
        fs.mkdirSync(exportPath)
      }

      this.exportOngoing = true
      this.exportedDocuments = 0
      this.exportList = (this.exportWholeProject) ? this.SGET_allDocuments.docs : this.exportDocumentsModel

      if (!this.includeIsDead) {
        this.exportList = this.exportList.filter(doc => {
          return doc.extraFields.find(e => e.id === "deadSwitch")?.value !== true
        })
      }

      // @ts-ignore
      this.exportList = this.exportList.map(doc => {
        return this.SGET_allDocuments.docs.find(subDoc => subDoc._id === doc._id)
      })

      for (const document of this.exportList) {
        this.currentDocName = document.label

        // Build the export data object
        const exportObject = this.buildExportObject(document)

        // MD export
        if (this.selectedExportFormat === "Markdown - MD") {
          this.exportFile_MD(exportObject, exportPath)
        }

        // PDF
        if (this.selectedExportFormat === "Adobe Reader - PDF") {
          this.exportFile_PDF(exportObject, exportPath)
        }

        await this.sleep(10)
        this.exportedDocuments++
      }

      // Cleanup
      this.exportOngoing = false
      this.$q.notify({
        group: false,
        type: "positive",
        message: "Export finished"
      })
    }).catch(err => {
      console.log(err)
    })
  }

  buildExportObject (input: I_ShortenedDocument): I_ExportObject {
    const matchingBlueprint = this.SGET_blueprint(input.type)

    const exportObject = {
      name: input.extraFields.find(e => e.id === "name")?.value,
      documentType: matchingBlueprint.nameSingular,
      documentDirectory: matchingBlueprint.namePlural,
      isCategory: input.extraFields.find(e => e.id === "categorySwitch")?.value,
      fieldValues: this.buildFieldValues(input, matchingBlueprint)
    } as I_ExportObject

    if (!this.hideDeadInformation && this.includeIsDead) {
      exportObject.isDead = input.extraFields.find(e => e.id === "deadSwitch")?.value
    }
    else {
      exportObject.isDead = false
    }

    if (this.includeTags) {
      exportObject.tags = input.extraFields.find(e => e.id === "tags")?.value
    }
    if (this.includeHierarchyPath) {
      // @ts-ignore
      exportObject.hierarchicalPath = this.getDocumentHieararchicalPath(input, this.SGET_allDocuments.docs)
    }

    return exportObject
  }

  buildFieldValues (input: I_ShortenedDocument, blueprint: I_Blueprint) {
    const catIgnoreList = ["breakDocumentSettings", "name", "documentColor", "documentBackgroundColor", "parentDoc", "order", "categorySwitch", "minorSwitch", "deadSwitch", "finishedSwitch", "tags", "otherNames", "categoryDescription"]

    // Filter and map all fields
    const mappedFields = blueprint.extraFields
      .filter(field => field.type !== "tags")
      .filter(field => field.type !== "switch")
      .filter(field => field.id !== "name")
      .filter(field => field.id !== "order")
      .filter(field => field.id !== "deadSwitch")
      .filter(field => field.id !== "categorySwitch")
      .filter(field => field.id !== "parentDoc")
      .filter(field => field.id !== "documentColor")
      .filter(field => field.id !== "documentBackgroundColor")
      .filter(field => field.id !== "breakDocumentSettings")
      .filter(field => !field.isLegacy)
      .filter(field => {
        if (input.extraFields.find(e => e.id === "categorySwitch")?.value) {
          if (catIgnoreList.includes(field.id)) {
            return true
          }
          else {
            return false
          }
        }
        else {
          return true
        }
      })
      .map(field => {
        const matchedField = input.extraFields.find(sub => sub.id === field.id)
        let returnValue = matchedField?.value

        // Convert numbers to strings
        if (field.type === "number" && typeof returnValue === "number") {
          returnValue = returnValue.toString()
        }

        // Build string out of lists
        if (field.type === "list" && Array.isArray(returnValue)) {
          if (!field.predefinedListExtras) {
            returnValue = returnValue.map((e: {value: string}) => `${e.value}`)
          }
          else {
            returnValue = (field.predefinedListExtras?.reverse)
              ? returnValue.map((e: {value: string, affix: string}) => `${e.affix} (${e.value})`)
              : returnValue.map((e: {value: string, affix: string}) => `${e.value}: ${e.affix}`)
          }
        }

        // Build string out of single-relationship
        if ((
          field.type === "singleToManyRelationship" ||
            field.type === "singleToSingleRelationship" ||
            field.type === "singleToNoneRelationship"
        ) && returnValue && returnValue.value
        ) {
          const valueToMap = Array.isArray(returnValue.value) ? returnValue.value[0] : returnValue.value

          // @ts-ignore
          const matchingDocument = this.SGET_allDocuments.docs.find(doc => doc.id === valueToMap._id)

          if (matchingDocument) {
            // @ts-ignore
            let localReturnValue = matchingDocument.extraFields.find(e => e.id === "name")?.value as string

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const matchedNote = returnValue?.addedValues
            if (matchedNote?.value?.length > 0) {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              localReturnValue = `${localReturnValue} (${matchedNote.value})`
            }

            returnValue = localReturnValue
          }
          else {
            returnValue = ""
          }
        }

        // Build string out of multi-relationship
        if ((
          field.type === "manyToManyRelationship" ||
            field.type === "manyToSingleRelationship" ||
            field.type === "manyToNoneRelationship"
        ) && returnValue && returnValue.value
        ) {
          const valuesToMap = returnValue.value as {_id: string, type: string}[]

          const mappedValues = valuesToMap
            .filter(value => {
              return value.type === field?.relationshipSettings?.connectedObjectType
            })
            .map(value => {
              // @ts-ignore
              const matchingDocument = this.SGET_allDocuments.docs.find(doc => doc.id === value._id)
              if (matchingDocument) {
                // @ts-ignore
                let localReturnValue = matchingDocument.extraFields.find(e => e.id === "name")?.value as string

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const matchedNote = returnValue?.addedValues?.find((e: {pairedId: string}) => e.pairedId === value._id)
                if (matchedNote?.value?.length > 0) {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  localReturnValue = `${localReturnValue} (${matchedNote.value})`
                }

                return localReturnValue
              }
              return " "
            })
            .filter(e => e !== " ")

          returnValue = mappedValues
        }

        // Fix all missing values that slipped through
        if (returnValue === undefined) {
          returnValue = ""
        }

        const returnValueFormat = returnValue as string

        const name = field.name

        return {
          label: name,
          value: returnValueFormat,
          type: field.type,
          id: field.id
        }
      })
      .filter(field => field.value.length > 0 || field.type === "break")

    // Map empty breaks
    const idsToRemove = []
    for (let index = 0; index < mappedFields.length; index++) {
      const field = mappedFields[index]

      if (field.type === "break" && mappedFields[index + 1]?.type === "break") {
        idsToRemove.push(field.id)
      }
    }

    // Remove empty breaks
    idsToRemove.forEach(id => {
      const indexToRemove = mappedFields.findIndex(field => field.id === id)

      if (indexToRemove > -1) {
        mappedFields.splice(indexToRemove, 1)
      }
    })

    // Check for last, hanging break field
    if (mappedFields[mappedFields.length - 1]?.type === "break") {
      mappedFields.splice(mappedFields.length - 1, 1)
    }

    return mappedFields
  }

  fixExportPaths (exportPath: string, input: I_ExportObject) {
    const reservedCharacterList = [
      "/",
      ">",
      "<",
      "|",
      ":",
      "&",
      "\\",
      "-",
      "[",
      "]",
      "{",
      "}",
      "*",
      "?",
      "'",
      "\"",
      "#",
      "%",
      "$",
      "!",
      "@"
    ]

    let exportFileDirectory = input.documentDirectory
    reservedCharacterList.forEach(char => {
      exportFileDirectory = exportFileDirectory.replace(char, "-")
      exportFileDirectory = exportFileDirectory.replace(char, "-")
      exportFileDirectory = exportFileDirectory.replace(char, "-")
      exportFileDirectory = exportFileDirectory.replace(char, "-")
      exportFileDirectory = exportFileDirectory.replace(char, "-")
      exportFileDirectory = exportFileDirectory.replace(char, "-")
    })
    const documentDirectory = `${exportPath}/${exportFileDirectory}`

    // Create directory
    if (!fs.existsSync(documentDirectory)) {
      fs.mkdirSync(documentDirectory)
    }

    // Fix invalid characters in document file name
    let exportFileName = input.name
    reservedCharacterList.forEach(char => {
      exportFileName = exportFileName.replace(char, "-")
      exportFileName = exportFileName.replace(char, "-")
      exportFileName = exportFileName.replace(char, "-")
      exportFileName = exportFileName.replace(char, "-")
      exportFileName = exportFileName.replace(char, "-")
      exportFileName = exportFileName.replace(char, "-")
    })

    if (input.isCategory) {
      exportFileName = `_${exportFileName}`
    }

    return { documentDirectory, exportFileName }
  }

  exportFile_MD (input: I_ExportObject, exportPath: string) {
    // Build the proper JSON file for export
    const JSONExport: any[] = []

    // Name/Title
    JSONExport.push({ h1: input.name })
    if (input.isCategory) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      JSONExport[0] = `${JSONExport[0]} - Category`
    }

    // Document type
    JSONExport.push({ h2: "Document type" })
    JSONExport.push({ ul: [input.documentType] })

    // Status
    if (!this.hideDeadInformation) {
      JSONExport.push({ h2: "Status" })
      JSONExport.push({ ul: [(input.isDead) ? "Dead/Gone/Destroyed" : "Active/Alive"] })
    }

    // Hierarchy path
    if (this.includeHierarchyPath) {
      JSONExport.push({ h2: "Hierarchical path" })
      JSONExport.push({ ul: [input.hierarchicalPath] })
    }

    // Tags
    if (this.includeTags) {
      JSONExport.push({ h2: "Tags" })
      JSONExport.push({ ul: (Array.isArray(input.tags) ? input.tags : []) })
    }

    // Other fields
    input.fieldValues.forEach(field => {
      if (field.type === "break") {
        JSONExport.push({ hr: "" })
        JSONExport.push({ h1: field.label })
      }
      else if (field.type === "wysiwyg") {
        JSONExport.push({ h2: field.label })
        JSONExport.push({ p: field.value })
      }
      else {
        JSONExport.push({ h2: field.label })
        if (Array.isArray(field.value)) {
          JSONExport.push({ ul: field.value })
        }
        else {
          JSONExport.push({ ul: [field.value] })
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    let mdContent: string = json2md(JSONExport)

    // Fix double-empty lines
    var EOL = mdContent.match(/\r\n/gm) ? "\r\n" : "\n"
    var regExp = new RegExp("(" + EOL + "){3,}", "gm")
    mdContent = mdContent.replace(regExp, EOL + EOL)

    const { documentDirectory, exportFileName } = this.fixExportPaths(exportPath, input)

    // Write the file
    fs.writeFileSync(`${documentDirectory}/${exportFileName}.md`, mdContent)
  }

  exportFile_PDF (input: I_ExportObject, exportPath: string) {
    const { documentDirectory, exportFileName } = this.fixExportPaths(exportPath, input)

    const textFont = 11
    const subTitleFont = 15
    const listPadding = 60
    const textPadding = 40
    const blockquotePadding = 85

    const paragraphOptions = {
      lineGap: 3,
      paragraphGap: 8
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const doc: I_PDFKitDocument = "" as unknown as I_PDFKitDocument
    // new PDFkit({ size: "A4" })

    // Start stream
    doc.pipe(fs.createWriteStream(`${documentDirectory}/${exportFileName}.pdf`))

    // Name/Title
    let title = input.name
    if (input.isCategory) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      title = `${title} - Category`
    }
    doc.font("Times-Bold").fillColor("#18303a").fontSize(20)
      .text(title, { align: "center" })

    // Next line
    doc.fontSize(textFont).moveDown().moveDown()

    // Document type
    doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
      .text("Document type", textPadding, undefined, paragraphOptions)
    doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)
      .list([input.documentType], listPadding, undefined, paragraphOptions)
      .moveDown()

    // Status
    if (!this.hideDeadInformation) {
      doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
        .text("Status", textPadding, undefined, paragraphOptions)
      doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)
        .list([((input.isDead) ? "Dead/Gone/Destroyed" : "Active/Alive")], listPadding, undefined, paragraphOptions)
        .moveDown()
    }

    // Hierarchy path
    if (this.includeHierarchyPath) {
      doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
        .text("Hierarchical path", textPadding, undefined, paragraphOptions)
      doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)
        .list([input.hierarchicalPath], listPadding)
        .moveDown()
    }

    // Tags
    if (this.includeTags) {
      doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
        .text("Tags", textPadding, undefined, paragraphOptions)
      doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)
        .list((Array.isArray(input.tags) ? input.tags : []), listPadding, undefined, paragraphOptions)
        .moveDown()
    }

    // Other fields
    input.fieldValues.forEach(field => {
      if (field.type === "break") {
        doc.moveDown()
          .font("Times-Bold").fillColor("#000000").fontSize(subTitleFont)
          .text(field.label, textPadding, undefined, paragraphOptions)
          .moveDown()
      }
      else if (field.type === "wysiwyg") {
        doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
          .text(field.label, textPadding, undefined, paragraphOptions)
          .moveDown()

        // @ts-ignore
        const returnList = this.buildPDFWysiwygContent(field.value)

        doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)

        const wysiwygOptions: {[key:string]: any} = extend(true, {}, paragraphOptions)

        returnList.forEach(node => {
          if (node.type === "text") {
            // Italic
            wysiwygOptions.oblique = node.attrs.italic

            // Underline
            wysiwygOptions.underline = node.attrs.underline

            // Bold
            doc.font((node?.attrs?.bold) ? "Times-Bold" : "Times-Roman")

            // Continued
            wysiwygOptions.continued = node.attrs.continued

            // Align
            wysiwygOptions.align = (node?.attrs?.align) ? node.attrs.align : "left"
            // Padding
            const wysiwygPadding = (node?.attrs?.blockquotePadding) ? blockquotePadding : listPadding

            // @ts-ignore
            doc.text(node.content, wysiwygPadding, undefined, wysiwygOptions)
          }
          if (node.type === "br") {
            doc.moveDown()
          }
        })
        // @ts-ignore
        doc.moveDown()
      }
      else {
        doc.font("Times-Bold").fillColor("#000000").fontSize(textFont)
          .text(field.label, textPadding, undefined, paragraphOptions)
        doc.font("Times-Roman").fillColor("#000000").fontSize(textFont)
          .list((Array.isArray(field.value) ? field.value : [field.value]), listPadding, undefined, paragraphOptions)
          .moveDown()
      }
    })

    doc.end()
  }

  buildPDFWysiwygContent (input: string) {
    const returnNodeList: I_HtmlParserNode[] = []

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const parsedHTML: I_HtmlParserNode = htmlParseStringify.parse(`<div>${input}</div>`)

    const processNodeStyles = (styleSting: string) => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const alignMatch = styleSting.match(/text-align:\s*([^;}]*)/)
      if (alignMatch) {
        return alignMatch[1]
      }
      else {
        return false
      }
    }

    const processNode = (node: I_HtmlParserNode) => {
      // ------------- NODE EXTRA ATTRIBUTES ------------------
      let nodeStyles: false|string = false
      if (node?.attrs?.style) {
        const snapshot: {style:string} = extend(true, {}, node.attrs)
        nodeStyles = (processNodeStyles(snapshot.style)) ? snapshot.style : false
      }

      let parentIsBlockquote = false
      if (node.parentNode?.attrs?.blockquotePadding) {
        parentIsBlockquote = true
      }

      node.attrs = {}
      node.attrs.continued = false

      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const nextNode = node.selfNodeList[node.selfIndex + 1]

      // If next if bold, italic or underline
      if (nextNode) {
        if ((nextNode.type === "tag" && nextNode.name === "i") ||
        (nextNode.type === "tag" && nextNode.name === "b") ||
        (nextNode.type === "tag" && nextNode.name === "u")
        ) {
          node.attrs.continued = true
        }
      }

      // Text align
      if (nodeStyles) {
        const textAlign = processNodeStyles(nodeStyles)
        if (textAlign && textAlign !== "left") {
          node.attrs.align = textAlign
        }
      }
      else if (node.parentNode?.attrs?.align && node.parentNode?.attrs?.align !== "left") {
        node.attrs.align = node.parentNode.attrs.align
      }

      // Text modifier - Italic
      if ((node.type === "tag" && node.name === "i") || node?.parentNode?.attrs.italic === true) {
        node.attrs.italic = true
        node.attrs.continued = true
      }
      else {
        node.attrs.italic = false
      }

      // Text modifier - Bold
      if ((node.type === "tag" && node.name === "b") || node?.parentNode?.attrs.bold === true) {
        node.attrs.bold = true
        node.attrs.continued = true
      }
      else {
        node.attrs.bold = false
      }

      // Text modifier - Underline
      if ((node.type === "tag" && node.name === "u") || node?.parentNode?.attrs.underline === true) {
        node.attrs.underline = true
        node.attrs.continued = true
      }
      else {
        node.attrs.underline = false
      }

      // If it is the last one, obviously dont continue anything
      if (!nextNode && node.type !== "text") {
        node.isLast = true
      }

      // Don't continue is this lack a continuing node
      if (node.parentNode?.isLast && !nextNode) {
        node.attrs.continued = false
      }

      // Extra padding for blockquotes
      if ((node.type === "tag" && node.name === "blockquote") || parentIsBlockquote) {
        node.attrs.blockquotePadding = true
      }

      // ------------- NODE PROCESSING ----------------------

      // Return text node value OR a break
      if ((node.type === "text" && node.content) || node.type === "br") {
        const returnNode = node
        // @ts-ignore
        returnNode.content = returnNode.content.replace(/&nbsp;/g, "").replace(/(\r\n|\n|\r)/gm, "")
        returnNodeList.push(returnNode)
      }

      // Process subnodes
      else if (node?.children?.length > 0) {
        node.children.forEach((childNode, i) => {
          childNode.selfIndex = i
          childNode.selfNodeList = node.children
          childNode.parentNode = node

          processNode(childNode)
        })
      }
    }

    // Generate return value
    parsedHTML[0].selfNodeList = [parsedHTML[0]]
    parsedHTML[0].selfIndex = 0
    parsedHTML[0].attrs = {}
    processNode(parsedHTML[0])

    return returnNodeList
  }
}
</script>

<style lang="scss">
.exportDialog {
  width: 1000px;
  max-width: calc(100vw - 100px) !important;
  margin-top: 100px;
  align-self: flex-start;

  h6 {
    display: block;
  }
}
</style>
