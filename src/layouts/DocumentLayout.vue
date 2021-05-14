<template>
  <q-layout view="hHh LpR lfr">

     <!-- Repair project dialog -->
    <repairProjectDialog
      :dialog-trigger="repairProjectDialogTrigger"
      @trigger-dialog-close="repairProjectDialogClose"
    />

     <q-dialog v-model="pre017check" seamless position="bottom">
      <q-card style="width: 100vw; min-width: 100vw;" dark class="text-accent bg-secondary">

        <q-card-section class="row items-center no-wrap justify-center">
          <div>
            If you are working with a pre-0.1.7 version project, then please <span class="q-mx-lg"><q-btn outline label="Repair your project" color="accent" @click="repairProjectAssignUID" /></span>
          </div>

          <q-btn outline round icon="close" v-close-popup @click="close017Notification" class="notifClose" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Header -->
    <appHeader/>

    <q-splitter
      v-model="splitterModel"
      unit="px"
      emit-immediately
      :class="{splitterClass, 'splitterHidden': hideHierarchyTree}"
      @input="onChange"
      :limits="[limiterWidth, Infinity]"
      class="pageSplitter"
      >
      <template
        v-if="!hideHierarchyTree"
       #before>
        <!-- Left drawer -->
        <q-drawer
          content-class="bg-dark text-cultured sideWrapper"
          v-model="leftDrawerOpen"
          side="left"
          :width="splitterModel"
          :breakpoint="0"
          show-if-above
          >
            <objectTree

            />
        </q-drawer>
      </template>
      <template #after>
        <q-page-container :style="compPadding">
          <documentControl/>
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            appear
            :duration="50"
          >
            <router-view :key="$route.path" />
          </transition>

          <q-page-sticky position="top-right" :offset="[18, 75]">
            <q-btn
              icon="mdi-book-search-outline"
              color="red-13"
              fab
              v-if="legacyFieldsCheck"
              @click="openLegacyDocuments"
            >
              <q-tooltip
                :delay="500"
                anchor="bottom middle"
                self="top middle"
              >
                Check for documents with legacy values
              </q-tooltip>
            </q-btn>
          </q-page-sticky>

          </q-page-container>
        </template>
    </q-splitter>
  </q-layout>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"

import objectTree from "src/components/ObjectTree.vue"
import appHeader from "src/components/AppHeader.vue"
import documentControl from "src/components/DocumentControl.vue"
import { engageBlueprints, retrieveAllBlueprints } from "src/scripts/databaseManager/blueprintManager"
import repairProjectDialog from "src/components/dialogs/RepairProject.vue"

import { extend } from "quasar"
import { OptionsStateInteface } from "src/store/module-options/state"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: {
    objectTree,
    appHeader,
    documentControl,
    repairProjectDialog
  }
})
export default class DocumentLayout extends BaseClass {
  /****************************************************************/
  // PROJECT SETTINGS FIRST LOAD
  /****************************************************************/

  /**
   * Load all blueprints and build the tree out of them
   */
  async created () {
    if (this.SGET_allDocumentsFirstRunState) {
      await this.processBluePrints()
      this.establishAllDocumentDatabases()
      await this.loadAllProjectDocuments()
    }

    // Unfuck the rendering by giving the app some time to load first
    await this.$nextTick()
  }

  /**
   * Processes all blueprints and redies the store for population of the app
   */
  async processBluePrints (): Promise<void> {
    await engageBlueprints()

    const allObjectBlueprints = (await retrieveAllBlueprints()).rows.map((blueprint) => {
      return blueprint.doc
    })
    // @ts-ignore
      .sort((a: I_Blueprint, b: I_Blueprint) => {
        const order1 = a.order
        const order2 = b.order
        if (order1 > order2) {
          return -1
        }
        if (order1 < order2) {
          return 1
        }

        return 0
      }) as I_Blueprint[]

    this.SSET_allBlueprints(allObjectBlueprints)
  }

  establishAllDocumentDatabases () {
    if (!window.FA_dbs) {
      // @ts-ignore
      window.FA_dbs = {}
    }
    for (const blueprint of this.SGET_allBlueprints) {
      window.FA_dbs[blueprint._id] = new PouchDB(blueprint._id)
    }
  }

  async loadAllProjectDocuments () {
    for (const blueprint of this.SGET_allBlueprints) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const dbRows = await window.FA_dbs[blueprint._id].allDocs({ include_docs: true })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line
      const dbDocuments = dbRows.rows.map((d:any) => d.doc)
      const formattedDocuments: I_ShortenedDocument[] = []

      for (const singleDocument of dbDocuments) {
        const doc = singleDocument as unknown as I_ShortenedDocument
        const pushValue = this.mapShortDocument(doc, dbDocuments)
        formattedDocuments.push(pushValue)
      }

      const sortedDocuments = formattedDocuments.sort((a, b) => a.label.localeCompare(b.label))
      this.SSET_mapNewDocumentType({
        id: blueprint._id,
        docs: sortedDocuments
      })
    }

    this.SSET_allDocumentsMarkAsNonFirstRun()
  }

  /****************************************************************/
  // BASIC COMPONENT DATA
  /****************************************************************/

  /**
   * Model for the left drawer of the app containing the hierarchical tree
   */
  leftDrawerOpen = true

  /**
   * Width of the splitted model
   */
  splitterModel = 375

  pre017check = false

  /**
   * Special class for the splitter
   */
  get splitterClass () {
    return !this.leftDrawerOpen ? "splitt" : ""
  }

  /**
   * Special padding reset for the main page
   */
  get compPadding () {
    return this.leftDrawerOpen ? { paddingLeft: "0px" } : ""
  }

  /****************************************************************/
  // LOCAL SETTINGS
  /****************************************************************/

  /**
   * React to changes on the options store
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.hideHierarchyTree = options.hideHierarchyTree

    this.legacyFieldsCheck = options.legacyFieldsCheck

    // @ts-ignore
    this.pre017check = options.pre017check

    if (options.treeWidth && !this.hideHierarchyTree) {
      this.splitterModel = options.treeWidth
    }
    else {
      this.splitterModel = 0
    }
  }

  legacyFieldsCheck: boolean|undefined = true

  get limiterWidth () {
    return (!this.hideHierarchyTree) ? 374 : 0
  }

  hideHierarchyTree = false

  /****************************************************************/
  // OPTTION UPDATER
  /****************************************************************/

  /**
   * Debounce timer to prevent infinite dragging
   */
  pullTimer = null as any

  /**
   * Snapshop of the current settings in the store for further modification
   */
  optionsSnapShot = {} as OptionsStateInteface

  close017Notification () {
    this.optionsSnapShot = extend(true, {}, this.SGET_options)
    this.optionsSnapShot.pre017check = false
    this.SSET_options(this.optionsSnapShot)
  }

  openLegacyDocuments () {
    const legacyDocs = this.checkForLegacyDocuments()
    legacyDocs.forEach(doc => {
      const dataPass = {
        doc: doc,
        treeAction: false
      }

      // @ts-ignore
      this.SSET_addOpenedDocument(dataPass)
    })

    if (legacyDocs.length > 0) {
      this.$q.notify({
        group: false,
        type: "warning",
        timeout: 0,
        html: true,
        actions: [{ icon: "mdi-close", color: "black" }],
        message: `
        ${legacyDocs.length} documents with legacy field values found.
        <br>
        Please remap the legacy fields manually to ensure proper functioning of FA.
        <br>
        After the remapping is done, rerun the tool to re-check.
        `
      })
    }

    if (legacyDocs.length === 0) {
      const optionsSnapShot = extend(true, {}, this.SGET_options)
      // @ts-ignore
      optionsSnapShot.legacyFieldsCheck = false
      // @ts-ignore
      this.SSET_options(optionsSnapShot)

      this.$q.notify({
        group: false,
        type: "positive",
        timeout: 3000,
        message: "No legacy fields with active values found!"
      })
    }
  }

  /**
   * React to dragging of the splitter
   */
  onChange (value: number) {
    this.leftDrawerOpen = value > 0

    this.optionsSnapShot = extend(true, {}, this.SGET_options)

    this.optionsSnapShot.treeWidth = this.splitterModel

    clearTimeout(this.pullTimer)

    this.pullTimer = setTimeout(() => {
      this.SSET_options(this.optionsSnapShot)
    }, 500)
  }

  /****************************************************************/
  // Repair project dialog
  /****************************************************************/

  repairProjectDialogTrigger: string | false = false
  repairProjectDialogClose () {
    this.repairProjectDialogTrigger = false
  }

  repairProjectAssignUID () {
    this.repairProjectDialogTrigger = this.generateUID()
  }
}

</script>

<style lang="scss">

.notifClose {
  position: absolute;
  right: 20px;
  top: 14px;
}

.sideWrapper {
  height: calc(100% - 40px) !important;
}

.q-layout {
  outline: none !important;
}

.splitt {
  .q-splitter__before {
    transition: width 0.2s ease-out;
    width: 0 !important;
  }
}

.pageSplitter {
  aside {
    height: calc(100% - 55px) !important;
    margin-top: 55px !important;
  }

  &.splitterHidden {
    .q-splitter__separator {
      display: none;
    }
  }

  .q-splitter__separator {
    background-color: transparent;
    height: calc(100vh - 95px);
    bottom: 0;
    top: 95px;
    position: sticky;
  }
}

</style>
