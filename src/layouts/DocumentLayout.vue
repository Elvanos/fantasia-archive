<template>
  <q-layout view="hHh LpR lfr">

    <!-- Left drawer -->
    <q-drawer
      content-class="bg-dark text-cultured sideWrapper"
      v-model="leftDrawerOpen"
      side="left"
      :width=375
      show-if-above
      >

      <objectTree/>

    </q-drawer>

    <!-- Header -->
    <appHeader
      :is-project="true"
    />

    <q-page-container>
      <documentControl/>
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

import { Component } from "vue-property-decorator"
import BaseClass from "src/BaseClass"

import objectTree from "src/components/ObjectTree.vue"
import appHeader from "src/components/AppHeader.vue"
import documentControl from "src/components/DocumentControl.vue"

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
}
</script>

<style lang="scss">
.q-layout {
  outline: none !important;
}

</style>
