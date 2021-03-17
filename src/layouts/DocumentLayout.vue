<template>
  <q-layout view="hHh LpR lfr">

    <!-- Header -->
    <appHeader
      :is-project="true"
    />

    <q-splitter
      v-model="splitterModel"
      unit="px"
      emit-immediately
      :class="splitterClass"
      @input="onChange"
      :limits="[374, Infinity]"
      class="pageSplitter"
      >
      <template #before>
        <!-- Left drawer -->
        <q-drawer
          content-class="bg-dark text-cultured sideWrapper"
          v-model="leftDrawerOpen"
          side="left"
          :width="drawerWidth"
          :breakpoint="0"
          show-if-above
          >
            <objectTree/>
        </q-drawer>
      </template>
      <template #after>
        <q-page-container :style="compPadding">
          <documentControl/>
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            appear
            :duration="150"
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
  // Local settings
  /****************************************************************/

  /**
   * Model for the left drawer of the app containing the hierarchical tree
   */
  leftDrawerOpen = true

  splitterModel = 374

  disableDocumentToolTips = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    if (options.treeWidth) {
      this.splitterModel = options.treeWidth
    }
  }

  get drawerWidth () {
    return this.splitterModel + 1
  }

  get splitterClass () {
    return !this.leftDrawerOpen ? "splitt" : ""
  }

  get compPadding () {
    return this.leftDrawerOpen ? { paddingLeft: "0px" } : ""
  }

  pullTimer = null as any

  onChange (value: number) {
    this.leftDrawerOpen = value > 0

    const optionsSnapShot: OptionsStateInteface = extend(true, {}, this.SGET_options)

    optionsSnapShot.treeWidth = this.splitterModel

    clearTimeout(this.pullTimer)

    this.pullTimer = setTimeout(() => {
      this.SSET_options(optionsSnapShot)
    }, 500)
  }
}

</script>

<style lang="scss">
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
  }
}

</style>
