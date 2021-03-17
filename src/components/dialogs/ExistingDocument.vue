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
          <div class="q-mb-lg">
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
              <template v-slot:option="{ itemProps, itemEvents, opt }">
                  <q-item
                    :class="{'hasTextShadow': textShadow}"
                    v-bind="itemProps"
                    v-on="itemEvents"
                    :style="`color: ${opt.color}`"
                  >
                    <q-item-section avatar>
                      <q-icon
                        :style="`color: ${retrieveIconColor(opt)}`"
                        :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon"
                        />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="opt.label" ></q-item-label>
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
                      color="primary"
                      class="z-1 q-ml-md"
                      icon="mdi-plus"
                      size="md"
                      @click.stop.prevent="addNewItemUnderSelected(opt)"
                      >
                      <q-tooltip
                        :delay="300"
                      >
                        Add a new document belonging under {{ stripTags(opt.label) }}
                      </q-tooltip>
                    </q-btn>
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
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { advancedDocumentFilter } from "src/scripts/utilities/advancedDocumentFilter"
import { extend } from "quasar"
import PouchDB from "pouchdb"

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_Blueprint } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class ExistingDocumentDialog extends DialogBase {
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

  existingObjectsBackupList = [] as I_ShortenedDocument[]
  existingObjectList = [] as I_ShortenedDocument[]
  allDocumentBluePrints = [] as I_Blueprint[]

  async populateExistingObjectDialog () {
    this.allDocumentBluePrints = this.SGET_allBlueprints

    const allDocs = await this.retrieveAllDocuments()

    this.existingObjectsBackupList = allDocs
    this.filterDocuments()

    await this.$nextTick()

    if (this.$refs.ref_existingDocument) {
      /*eslint-disable */
      // @ts-ignore 
      this.$refs.ref_existingDocument.focus()
      /* eslint-enable */
    }
    this.isCloseAbleViaKeybind = true
  }

  existingDocumentModel = []

  filteredExistingInput = null as unknown as I_ShortenedDocument[]

  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_existingDocument.setOptionIndex(-1)
    // @ts-ignore 
    this.$refs.ref_existingDocument.moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  filterExistingSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredExistingInput = this.existingObjectList
        if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      const listCopy : I_ShortenedDocument[] = extend(true, [], this.existingObjectList)
      this.filteredExistingInput = advancedDocumentFilter(needle, listCopy, this.allDocumentBluePrints, this.existingObjectsBackupList)

      if (this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0) {
        this.refocusSelect().catch(e => console.log(e))
      }
    })
  }

  async openExistingInput (e: I_ShortenedDocument[]) {
    if (!this.disableCloseAftertSelectQuickSearch) {
      this.dialogModel = false
      // @ts-ignore
      this.openExistingDocumentRoute(e[0])
      this.existingDocumentModel = []
    }
    else {
      // @ts-ignore
      this.existingDocumentModel = []

      const CurrentObjectDB = new PouchDB(e[0].type)
      // @ts-ignore
      const retrievedObject = await CurrentObjectDB.get(e[0].id)

      const dataPass = {
        doc: retrievedObject,
        treeAction: false
      }

      // @ts-ignore
      this.SSET_addOpenedDocument(dataPass)
    }
  }

  addNewItemUnderSelected (parent: any) {
    const routeObject = {
      _id: parent.type,
      parent: parent.id
    }
    // @ts-ignore
    this.addNewObjectRoute(routeObject)
  }

  disableCloseAftertSelectQuickSearch = false
  closeWithSameClick = false
  textShadow = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    this.reloadOptions()
  }

  reloadOptions () {
    const options = this.SGET_options
    this.closeWithSameClick = options.allowQuickPopupSameKeyClose
    this.disableCloseAftertSelectQuickSearch = options.disableCloseAftertSelectQuickSearch
    this.includeCategories = !options.disableQuickSearchCategoryPrecheck
    this.textShadow = options.textShadow
  }

  includeCategories = true

  @Watch("includeCategories")
  reactToCheckboxChange () {
    this.filterDocuments()
  }

  filterDocuments () {
    this.existingObjectList = this.existingObjectsBackupList.filter(e => !((!this.includeCategories && e.isCategory)))
  }

  isCloseAbleViaKeybind = false

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
