<template>
  <q-layout view="lHh LpR lfr"
  >

   <q-dialog
      v-model="keyBindsDialog"
      >
      <q-card
        class="keyBindsDialog"
      >
        <q-card-section class="row items-center">
          <h6 class="text-center q-my-sm">Keybind list</h6>
        </q-card-section>

         <q-card-section>
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">Action</th>
                <th class="text-left">Keybind</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="keybind in SGET_getCurrentKeyBindData.defaults" :key="keybind.id">
                <td class="text-left" v-html="keybind.tooltip"/>
                <td class="text-left" v-html="retrieveKeybindString(keybind)"/>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-lg q-mt-md">
            <q-btn flat label="Close window" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="newDocumentDialog"
      >
      <q-card
        class="newDocumentPopup"
      >

      <q-card-section class="row items-center">
          <h6 class="text-center q-my-sm">Add new document</h6>
        </q-card-section>

        <q-card-section class="row items-center">
           <q-select
              ref="ref_newDocument"
              style="flex-grow: 1;"
              dense
              :options="filteredNewInput"
              use-input
              outlined
              input-debounce="0"
              v-model="newDocumentModel"
              @filter="filterNewSelect"
              @input="triggerNewInput"
            >
              <template v-slot:option="{ itemProps, itemEvents, opt }">
                  <q-item
                    v-bind="itemProps"
                    v-on="itemEvents"
                  >
                  <q-item-section avatar>
                    <q-icon :name="opt.icon" />
                  </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="opt.label" ></q-item-label>
                    </q-item-section>
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

    <q-dialog
      v-model="existingDocumentDialog"
      >
      <q-card
        class="newDocumentPopup"
      >

      <q-card-section class="row items-center">
          <h6 class="text-center q-my-sm">Open existing document</h6>
        </q-card-section>

        <q-card-section class="row items-center">
           <q-select
              ref="ref_existingDocument"
              style="flex-grow: 1;"
              dense
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
                    :style="`background-color: ${opt.color}99`"
                  >
                  <q-item-section avatar>
                    <q-icon :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon" />
                  </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="opt.label" ></q-item-label>
                    </q-item-section>
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

    <!-- Left drawer -->
    <q-drawer
      content-class="bg-dark text-cultured sideWrapper"
      v-model="leftDrawerOpen"
      side="left"
      :width=375
      show-if-above
      >

      <objectTree/>

       <q-page-sticky position="bottom-right" class="controlButtons">

          <q-btn
              icon="mdi-note-plus-outline"
              color="primary"
              @click="populateNewObjectDialog"
            >
              <q-tooltip>
                Quick-add a new document.
              </q-tooltip>
            </q-btn>

            <q-btn
              icon="mdi-database-search"
              color="primary"
              @click="populateExistingObjectDialog"
            >
              <q-tooltip>
                Quick-search an existing document.
              </q-tooltip>
            </q-btn>

            <q-btn
              icon="mdi-keyboard-outline"
              color="primary"
              @click="keyBindsDialog = true"
            >
              <q-tooltip>
                Show keybind cheatsheet.
              </q-tooltip>
            </q-btn>
        </q-page-sticky>

    </q-drawer>

    <!-- Header -->
    <topTabs/>

    <!-- Right drawer -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      elevated>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="300"
      >
      <router-view :key="$route.path" />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"

import objectTree from "src/components/ObjectTree.vue"
import topTabs from "src/components/TopTabs.vue"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

interface NewObjectDocument {
  label: string
  icon: string
  order: number
  _id: string
  specialLabel: string
}

@Component({
  components: { objectTree, topTabs }
})
export default class MainLayout extends BaseClass {
  leftDrawerOpen = true
  rightDrawerOpen = false

  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Keybind cheatsheet
    if (this.determineKeyBind("openKeybindsCheatsheet")) {
      this.keyBindsDialog = true
    }

    // Quick new document
    if (this.determineKeyBind("quickNewDocument")) {
      this.populateNewObjectDialog()
    }

    // Quick open existing document
    if (this.determineKeyBind("quickExistingDocument")) {
      this.populateExistingObjectDialog().catch(e => console.log(e))
    }
  }

  created () {
    window.addEventListener("keyup", this.triggerKeyPush)
  }

  destroyed () {
    window.removeEventListener("keyup", this.triggerKeyPush)
  }

  // @ts-ignore
  triggerKeyPush (e) {
    if (this.newDocumentDialog || this.existingDocumentDialog || this.keyBindsDialog) {
      return false
    }
    if (e?.altKey === true || e?.ctrlKey || e?.shiftKey) {
      const ouputKeycombo = {
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        keyCode: e.keyCode
      }

      this.SSET_updatePressedKey(ouputKeycombo)
    }
  }

  newDocumentDialog = false

  newObjectList = [] as NewObjectDocument[]

  newDocumentModel = null

  populateNewObjectDialog () {
    this.newDocumentDialog = true
    // @ts-ignore
    this.newObjectList = this.SGET_allBlueprints.map(blueprint => {
      return {
        label: blueprint.namePlural,
        icon: blueprint.icon,
        order: blueprint.order,
        _id: blueprint._id,
        specialLabel: blueprint.nameSingular.toLowerCase()
      }
    })

    this.$nextTick(function () {
      /*eslint-disable */
      setTimeout( () =>{
        // @ts-ignore 
        this.$refs.ref_newDocument.focus()
      }, 100)
      /* eslint-enable */
    })
  }

  filteredNewInput = null as unknown as NewObjectDocument[]

  filterNewSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredNewInput = this.newObjectList
        /*eslint-disable */
        if(this.$refs.ref_newDocument && this.filteredNewInput.length > 0){
          setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_newDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_newDocument.moveOptionSelection(1, true) 
        }, 300)      
        /* eslint-enable */
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filteredNewInput = this.newObjectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      /*eslint-disable */
      if(this.$refs.ref_newDocument && this.filteredNewInput.length > 0){        
        setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_newDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_newDocument.moveOptionSelection(1, true) 
        }, 300)       
      }
      /* eslint-enable */
    })
  }

  triggerNewInput (e: NewObjectDocument) {
    this.newDocumentDialog = false
    this.addNewObjectRoute(e)
    this.newDocumentModel = null
  }

  existingObjectList = [] as I_ShortenedDocument[]

  async populateExistingObjectDialog () {
    this.existingDocumentDialog = true
    let allDocs = [] as I_ShortenedDocument[]
    for (const blueprint of this.SGET_allBlueprints) {
      const CurrentObjectDB = new PouchDB(blueprint._id)

      const dbDocuments = await CurrentObjectDB.allDocs({ include_docs: true })
      const formattedDocuments = dbDocuments.rows.map(singleDocument => {
        const doc = singleDocument.doc as unknown as I_ShortenedDocument
        return {
          label: doc.extraFields.find(e => e.id === "name")?.value,
          icon: doc.icon,
          url: doc.url,
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

  existingDocumentDialog = false

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
    this.existingDocumentDialog = false
    // @ts-ignore
    this.openExistingDocumentRoute(e)
    this.existingDocumentModel = null
  }

  keyBindsDialog = false
}
</script>

<style lang="scss">
.q-layout {
  outline: none !important;
}

.newDocumentPopup {
  width: 400px;
  margin-top: 100px;
  align-self: flex-start;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }
}

.keyBindsDialog {
  width: 100%;
  max-width: 1000px !important;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }

  table {
    td {
      max-width: 300px;
      white-space: inherit;
    }
  }

  .keybindNote {
    opacity: 0.8;
    font-size: 0.9em;
  }
}

.sideWrapper {
  padding-bottom: 70px !important;

  &::after {
    content: '';
    position: absolute;
    background-color: $dark;
    left: 0;
    bottom: 0;
    right: 5px;
    height: 60px;
  }
}

.controlButtons {
  z-index: 3;
  margin: 10px 15px 10px 10px;

  button {
    margin: 0 5px;
  }
}
</style>
