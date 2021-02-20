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
              <tr>
                <td class="text-left">Focuses next input field/input element/hierarchical tree node</td>
                <td class="text-left">TAB <br> <div class="text-italic keybindNote">(functionality is the same as when using a web-browser)</div></td>
              </tr>
              <tr>
                <td class="text-left">Focuses previous input field/input element/hierarchical tree node</td>
                <td class="text-left">SHFIT + TAB <br> <div class="text-italic keybindNote">(functionality is the same as when using a web-browser)</div></td>
              </tr>
              <tr>
                <td class="text-left">Open the focused document in the left hierarchical tree</td>
                <td class="text-left">SHIFT + TAB <br> <div class="text-italic keybindNote">(while the hierarchical tree item is focused)</div></td>
              </tr>
              <tr>
                <td class="text-left">Open keybind cheatsheet</td>
                <td class="text-left">CTRL + ALT + K</td>
              </tr>
              <tr>
                <td class="text-left">Focus search field in the left hierarchical tree</td>
                <td class="text-left">CTRL + SHIFT + Q</td>
              </tr>
              <tr>
                <td class="text-left">Clears any inpuit in the search field in the left hierarchical tree</td>
                <td class="text-left">CTRL + SHIFT + W</td>
              </tr>
              <tr>
                <td class="text-left">Open the focused document in the left hierarchical tree</td>
                <td class="text-left">ENTER <br> <div class="text-italic keybindNote">(while the hierarchical tree item is focused)</div></td>
              </tr>
              <tr>
                <td class="text-left">Collapse or open the focused category in the left hierarchical tree</td>
                <td class="text-left">SPACE <br> <div class="text-italic keybindNote">(while the hierarchical tree item is focused)</div></td>
              </tr>
              <tr>
                <td class="text-left">Quick-search existing document</td>
                <td class="text-left">CTRL + Q</td>
              </tr>
              <tr>
                <td class="text-left">Quick-add new document</td>
                <td class="text-left">CTRL + N</td>
              </tr>
              <tr>
                <td class="text-left">Next tab</td>
                <td class="text-left">ALT + RIGHT ARROW</td>
              </tr>
              <tr>
                <td class="text-left">Previous tab</td>
                <td class="text-left">ALT + LEFT ARROW</td>
              </tr>
              <tr>
                <td class="text-left">Close active document</td>
                <td class="text-left">CTRL + W</td>
              </tr>
              <tr>
                <td class="text-left">Delete active document</td>
                <td class="text-left">CTRL + D</td>
              </tr>
              <tr>
                <td class="text-left">Edit active document</td>
                <td class="text-left">CTRL + E</td>
              </tr>
              <tr>
                <td class="text-left">Save active document</td>
                <td class="text-left">CTRL + S</td>
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
      show-if-above
      >

      <objectTree
        :pushed-key="pushedKey"
      />

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
    <topTabs
    :pushed-key="pushedKey"
    />

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
      <router-view :key="$route.path" :pushed-key="pushedKey" />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">

import { Component } from "vue-property-decorator"
import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"

import objectTree from "src/components/ObjectTree.vue"
import topTabs from "src/components/TopTabs.vue"
import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"
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

  pushedKey = {} as I_KeyPressObject

  created () {
    window.addEventListener("keyup", this.triggerKeyPush)
  }

  destroyed () {
    window.removeEventListener("keyup", this.triggerKeyPush)
  }

  // @ts-ignore
  triggerKeyPush (e) {
    if (this.newDocumentDialog || this.existingDocumentDialog || this.keyBindsDialog) { return false }
    if (e?.altKey === true || e?.ctrlKey || e?.shiftKey) {
      const ouputKeycombo = {
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        keyCode: e.keyCode
      }
      this.pushedKey = ouputKeycombo

      this.processKeyPush()
    }
  }

  newDocumentDialog = false

  processKeyPush () {
    const currentKey = this.pushedKey

    // New document - CTRL + ALT + K
    if (!currentKey.shiftKey && currentKey.ctrlKey && currentKey.altKey && currentKey.keyCode === 75) {
      this.keyBindsDialog = true
    }

    // New document - CTRL + N
    if (!currentKey.shiftKey && currentKey.ctrlKey && !currentKey.altKey && currentKey.keyCode === 78) {
      this.populateNewObjectDialog()
    }

    // Open existing document - CTRL + Q
    if (!currentKey.shiftKey && currentKey.ctrlKey && !currentKey.altKey && currentKey.keyCode === 81) {
      this.populateExistingObjectDialog().catch(e => console.log(e))
    }
  }

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
    this.addNewObjectType(e)
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
    this.openExistingDocument(e)
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
