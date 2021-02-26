<template>
      <q-dialog
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

        <q-card-section class="row items-center">
           <q-select
              ref="ref_existingDocument"
              style="flex-grow: 1;"
              dense
              dark
              :options="filteredExistingInput"
              use-input
              outlined
              input-debounce="0"
              v-model="existingDocumentModel"
              @filter="filterExistingSelect"
              @input="openExistingInput"
            >
              <template v-slot:option="{ itemProps, itemEvents, opt }">
                  <q-item
                    v-bind="itemProps"
                    v-on="itemEvents"
                    :style="`color: ${opt.color}`"
                  >
                  <q-item-section avatar>
                    <q-icon
                      :style="`color: ${opt.color}`"
                      :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon"
                      />
                  </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="opt.label" ></q-item-label>
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
                        Add a new document belonging under {{ opt.label }}
                      </q-tooltip>
                    </q-btn>
                  </q-item>
                </template>
            </q-select>
        </q-card-section>

        <q-card-section>
          <q-card-actions align="center" class="q-mb-sm">
            <q-btn flat label="Close window" color="primary" v-close-popup />
          </q-card-actions>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import PouchDB from "pouchdb"

import DialogBase from "src/components/dialogs/_DialogBase"

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
      this.SSET_setDialogState(true)
      this.dialogModel = true

      this.populateExistingObjectDialog().catch(e => console.log(e))
    }
  }

  existingObjectList = [] as I_ShortenedDocument[]

  async populateExistingObjectDialog () {
    let allDocs = [] as I_ShortenedDocument[]
    for (const blueprint of this.SGET_allBlueprints) {
      const CurrentObjectDB = new PouchDB(blueprint._id)

      const dbDocuments = await CurrentObjectDB.allDocs({ include_docs: true })
      const formattedDocuments = dbDocuments.rows.map(singleDocument => {
        const doc = singleDocument.doc as unknown as I_ShortenedDocument
        return {
          label: doc.extraFields.find(e => e.id === "name")?.value,
          icon: doc.icon,
          id: doc._id,
          url: doc.url,
          type: doc.type,
          color: doc.extraFields.find(e => e.id === "documentColor")?.value,
          isCategory: doc.extraFields.find(e => e.id === "categorySwitch")?.value
        } as unknown as I_ShortenedDocument
      }).sort((a, b) => a.label.localeCompare(b.label))
      // @ts-ignore
      allDocs = [...allDocs, ...formattedDocuments]
    }

    this.existingObjectList = allDocs

    this.$nextTick(function () {
    /*eslint-disable */
      setTimeout( () =>{
        if(this.$refs.ref_existingDocument){
          // @ts-ignore 
          this.$refs.ref_existingDocument.focus()
        }
      }, 300)
    /* eslint-enable */
    })
  }

  existingDocumentModel = null

  filteredExistingInput = null as unknown as I_ShortenedDocument[]

  filterExistingSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredExistingInput = this.existingObjectList
        /*eslint-disable */
        if(this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0){
          setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_existingDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_existingDocument.moveOptionSelection(1, true) 
        }, 300)      
        /* eslint-enable */
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filteredExistingInput = this.existingObjectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      /*eslint-disable */
        if(this.$refs.ref_existingDocument && this.filteredExistingInput.length > 0){
          setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_existingDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_existingDocument.moveOptionSelection(1, true) 
        }, 300)      
        /* eslint-enable */
      }
    })
  }

  openExistingInput (e: I_ShortenedDocument) {
    this.dialogModel = false
    // @ts-ignore
    this.openExistingDocumentRoute(e)
    this.existingDocumentModel = null
  }

  addNewItemUnderSelected (parent: any) {
    const routeObject = {
      _id: parent.type,
      parent: parent.id
    }
    // @ts-ignore
    this.addNewObjectRoute(routeObject)
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
