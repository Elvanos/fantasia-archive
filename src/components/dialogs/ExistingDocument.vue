<template>
      <q-dialog
      no-route-dismiss
      v-model="dialogModel"
      @hide="triggerDialogClose"
      >
      <q-card
        dark
        class="existingDocumentPopup"
      >

      <q-card-section class="row items-center">
          <h6 class="text-center q-my-sm">Open existing document</h6>
        </q-card-section>

        <q-card-section class="column items-center">
          <div class="q-mb-md">
            <q-checkbox dark color="primary" v-model="includeCategories" label="Include categories in the list?" />
          </div>

           <q-select
              style="width: 400px;"
              ref="ref_existingDocument"
              dense
              class="existingDocumentSelect"
              dark
              menu-anchor="bottom middle"
              menu-self="top middle"
              :options="filteredExistingInput"
              use-input
              multiple
              filled
              input-debounce="200"
              v-model="existingDocumentModel"
              @filter="filterExistingSelect"
              @input="openExistingInput"
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
                  >
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
                    <q-btn
                      tabindex="-1"
                      round
                      flat
                      dense
                      dark
                      color="accent"
                      class="z-1 q-ml-sm self-center"
                      icon="mdi-pencil"
                      size="sm"
                      @click.stop.prevent="editExistingInput(opt)"
                      >
                      <q-tooltip
                        :delay="300"
                      >
                        Edit {{ stripTags(opt.label) }}
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      tabindex="-1"
                      round
                      flat
                      dense
                      dark
                      color="primary"
                      class="z-1 q-ml-sm self-center"
                      icon="mdi-content-copy"
                      size="sm"
                      @click.stop.prevent="copyTargetDocument(opt)"
                      >
                      <q-tooltip
                        :delay="300"
                      >
                        Make a copy of {{ stripTags(opt.label) }}
                        <br>
                        This action will always close the popup.
                    </q-tooltip>
                    </q-btn>
                    <q-btn
                      tabindex="-1"
                      round
                      flat
                      dense
                      dark
                      color="primary"
                      class="z-1 q-ml-sm self-center"
                      icon="mdi-file-tree"
                      size="sm"
                      @click.stop.prevent="addNewUnderParent(opt)"
                      >
                      <q-tooltip
                        :delay="300"
                      >
                        Add a new document belonging under {{ stripTags(opt.label) }}
                        <br>
                        This action will always close the popup.
                      </q-tooltip>
                    </q-btn>

            <q-menu
              touch-position
              context-menu
              auto-close
              separate-close-popup
            >

              <q-list class="bg-gunmetal-light text-accent">

                <template>
                  <q-item clickable  @click="copyName(opt)">
                    <q-item-section>Copy name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-text-recognition" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTextColor(opt)">
                    <q-item-section>Copy text color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-eyedropper" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyBackgroundColor(opt)">
                    <q-item-section>Copy background color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-format-color-fill" />
                    </q-item-section>
                  </q-item>
                  <q-separator />
                    <q-item clickable @click="openExistingInput(opt)">
                    <q-item-section>Open document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-page-variant-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="editExistingInput(opt)">
                    <q-item-section>Edit document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="addNewUnderParent(opt)">
                    <q-item-section>Create new document with this document as parent</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-file-tree" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTargetDocument(opt)">
                    <q-item-section>Copy this document</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-content-copy" />
                    </q-item-section>
                  </q-item>
                </template>

              </q-list>

            </q-menu>
                  </q-item>
                </template>
            </q-select>
        </q-card-section>

        <q-card-section>
          <q-card-actions align="around" class="q-mb-sm">
            <q-btn flat label="Close" color="accent" v-close-popup />
          </q-card-actions>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { advancedDocumentFilter } from "src/scripts/utilities/advancedDocumentFilter"
import { extend } from "quasar"
import PouchDB from "pouchdb"

import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import { copyDocumentName, copyDocumentTextColor, copyDocumentBackgroundColor } from "src/scripts/documentActions/uniqueFieldCopy"
import { copyDocument } from "src/scripts/documentActions/copyDocument"

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_Blueprint } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class ExistingDocumentDialog extends DialogBase {
  /****************************************************************/
  // DIALOG CONTROL
  /****************************************************************/

  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.isCloseAbleViaKeybind = false
      this.SSET_setDialogState(true)
      this.dialogModel = true

      this.reloadOptions()
      this.populateExistingObjectDialog().catch(e => console.log(e))
    }
  }

  /****************************************************************/
  // COMPONENT SETTINGS
  /****************************************************************/

  /**
   * Watch options and react to changes
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    this.reloadOptions()
  }

  /**
   * Reloads local options
   */
  reloadOptions () {
    this.closeWithSameClick = this.SGET_options.allowQuickPopupSameKeyClose
    this.disableCloseAftertSelectQuickSearch = this.SGET_options.disableCloseAftertSelectQuickSearch
    this.includeCategories = !this.SGET_options.disableQuickSearchCategoryPrecheck
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
   * Determines if the popup shouldnt close after a document is selected from the dropdown list
   */
  disableCloseAftertSelectQuickSearch = false

  /**
   * Determines if the popup is closeable with the same keybind that summoned it
   */
  closeWithSameClick = false

  /**
   * Determines if text shadow will be shows for accesiblity reasons or not
   */
  textShadow = false

  /**
   * A local lock that prevents double-triggering and instant re-closing of the dialog via keybinds
   */
  isCloseAbleViaKeybind = false

  /****************************************************************/
  // LOCAL KEYBINDS
  /****************************************************************/

  /**
   * Local keybinds
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Keybind cheatsheet
    if (this.determineKeyBind("quickExistingDocument") && this.dialogModel && this.closeWithSameClick && this.isCloseAbleViaKeybind && this.SGET_getDialogsState) {
      this.dialogModel = false
      this.SSET_setDialogState(false)
      // @ts-ignore
      this.existingDocumentModel = null
    }
  }

  /****************************************************************/
  // PRE-FILTERING
  /****************************************************************/

  /**
   * Model for pre-filtering via categories
   */
  includeCategories = true

  /**
   * React to the category checkbox changes
   */
  @Watch("includeCategories")
  reactToCategoryCheckboxChange () {
    this.preFilterDocuments()
  }

  /**
   * Prefilter documents based on what is in the checkbox
   */
  preFilterDocuments () {
    this.existingObjectPrefilteredList = this.existingObjectsFullList
      .filter(e => !((!this.includeCategories && e.isCategory)))
  }

  /****************************************************************/
  // SELECT LIST MANAGEMENT
  /****************************************************************/

  /**
   * Raw list of objects retrieved from the database
   */
  existingObjectPrefilteredList = [] as I_ShortenedDocument[]

  /**
   * Pre-filtered list based on the category inclussion or exlcussion
   */
  existingObjectsFullList = [] as I_ShortenedDocument[]

  /**
   * All currently loaded blueprints
   */
  allDocumentBluePrints = [] as I_Blueprint[]

  /**
   * Set up up all data in to the dialog on popup load
   */
  async populateExistingObjectDialog () {
    this.allDocumentBluePrints = this.SGET_allBlueprints

    this.existingObjectsFullList = await this.retrieveAllDocuments()
    this.preFilterDocuments()

    await this.$nextTick()

    if (this.$refs.ref_existingDocument) {
      /*eslint-disable */
      // @ts-ignore 
      this.$refs.ref_existingDocument.focus()
      /* eslint-enable */
    }
    this.isCloseAbleViaKeybind = true
  }

  /**
   * Currently being opened document
   */
  existingDocumentModel = []

  /**
   * Filtered list of items
   */
  filteredExistingInput = null as unknown as I_ShortenedDocument[]

  /**
   * Refocuses the first value in the selct upon filtering for intuitive keyboard control
   */
  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_existingDocument.setOptionIndex(-1)
    // @ts-ignore 
    this.$refs.ref_existingDocument.moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  /**
   * Local list copty for filtering in order to not mess up the original list
   */
  listCopy: I_ShortenedDocument[] = []

  /**
   * Filter the pre-filtered list
   */
  filterExistingSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredExistingInput = this.existingObjectPrefilteredList.filter((obj) => !obj.isMinor)
        if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.listCopy = extend(true, [], this.existingObjectPrefilteredList)
      this.filteredExistingInput = advancedDocumentFilter(needle, this.listCopy, this.allDocumentBluePrints, this.existingObjectsFullList)

      if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
        this.refocusSelect().catch(e => console.log(e))
      }
    })
  }

  /****************************************************************/
  // TRIGGER ACTIONS
  /****************************************************************/

  /**
   * Opened the existing input in two modes
   * Either as a focus with closure of the dialog.
   * Or as a background tab without closing of the dialog.
   */
  async openExistingInput (e: I_ShortenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    // Open document and close dialog
    if (!this.disableCloseAftertSelectQuickSearch) {
      this.dialogModel = false
      // @ts-ignore
      this.openExistingDocumentRoute(e)
      this.existingDocumentModel = []
    }
    // Open document and DO NOT close the dialog
    else {
      // @ts-ignore
      this.existingDocumentModel = []

      const CurrentObjectDB = new PouchDB(e.type)
      // @ts-ignore
      const retrievedObject = await CurrentObjectDB.get(e.id)

      const dataPass = {
        doc: retrievedObject,
        treeAction: false
      }

      // @ts-ignore
      this.SSET_addOpenedDocument(dataPass)
      await CurrentObjectDB.close()
    }
  }

  /**
   * Opened the existing input in two modes
   * Either as a focus with closure of the dialog.
   * Or as a background tab without closing of the dialog.
   */
  async editExistingInput (e: I_ShortenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    // Open document and close dialog
    if (!this.disableCloseAftertSelectQuickSearch) {
      this.dialogModel = false
      // @ts-ignore
      this.openExistingDocumentRouteWithEdit(e)
      this.existingDocumentModel = []
    }
    // Open document and DO NOT close the dialog
    else {
      // @ts-ignore
      this.existingDocumentModel = []

      const CurrentObjectDB = new PouchDB(e.type)
      // @ts-ignore
      const retrievedObject = await CurrentObjectDB.get(e.id)

      // @ts-ignore
      retrievedObject.hasEdits = true

      const dataPass = {
        doc: retrievedObject,
        treeAction: false
      }

      // @ts-ignore
      this.SSET_addOpenedDocument(dataPass)
      await CurrentObjectDB.close()
    }
  }

  documentPass = null as unknown as I_OpenedDocument

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent (currentDoc: I_OpenedDocument) {
    createNewWithParent(currentDoc, this)
    this.dialogModel = false
  }

  /****************************************************************/
  // Document field copying
  /****************************************************************/

  copyName (currentDoc: I_OpenedDocument) {
    copyDocumentName(currentDoc)

    this.dialogModel = false
  }

  copyTextColor (currentDoc: I_OpenedDocument) {
    copyDocumentTextColor(currentDoc)

    this.dialogModel = false
  }

  copyBackgroundColor (currentDoc: I_OpenedDocument) {
    copyDocumentBackgroundColor(currentDoc)

    this.dialogModel = false
  }

  copyTargetDocument (currentDoc: I_OpenedDocument) {
    this.documentPass = extend(true, {}, currentDoc)

    const newDocument = copyDocument(this.documentPass, this.generateUID())

    const dataPass = {
      doc: newDocument,
      treeAction: false
    }

    // @ts-ignore
    this.SSET_addOpenedDocument(dataPass)
    this.$router.push({
      path: newDocument.url
    }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })

    this.dialogModel = false
  }
}
</script>

<style lang="scss" scoped>

.existingDocumentPopup {
  min-width: 600px;
  margin-top: 100px;
  align-self: flex-start;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }
}
</style>
