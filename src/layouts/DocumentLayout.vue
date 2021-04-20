<template>
  <q-layout view="hHh LpR lfr">

    <!-- Header -->
    <appHeader/>

    <q-splitter
      v-model="splitterModel"
      unit="px"
      emit-immediately
      :class="splitterClass"
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

import objectTree from "src/components/ObjectTree.vue"
import appHeader from "src/components/AppHeader.vue"
import documentControl from "src/components/DocumentControl.vue"

import { extend } from "quasar"
import { OptionsStateInteface } from "src/store/module-options/state"

@Component({
  components: {
    objectTree,
    appHeader,
    documentControl
  }
})
export default class DocumentLayout extends BaseClass {
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

  .q-splitter__separator {
    background-color: transparent;
    height: calc(100vh - 95px);
    bottom: 0;
    top: 95px;
    position: sticky;
  }
}

</style>
