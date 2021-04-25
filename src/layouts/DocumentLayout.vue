<template>
  <q-layout view="hHh LpR lfr">

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

import { extend } from "quasar"
import { OptionsStateInteface } from "src/store/module-options/state"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: {
    objectTree,
    appHeader,
    documentControl
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
    }) as I_Blueprint[]

    this.SSET_allBlueprints(allObjectBlueprints)
  }

  establishAllDocumentDatabases () {
    // @ts-ignore
    window.FA_dbs = {}
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

    if (options.treeWidth && !this.hideHierarchyTree) {
      this.splitterModel = options.treeWidth
    }
    else {
      this.splitterModel = 0
    }
  }

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
}

</script>

<style lang="scss">

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
