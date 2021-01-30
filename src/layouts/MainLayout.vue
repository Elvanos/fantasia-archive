<template>
  <q-layout view="lHh LpR lfr">

    <!-- Left drawer -->
    <q-drawer
      class=""
      content-class="bg-dark text-cultured"
      v-model="leftDrawerOpen"
      side="left"
      show-if-above
      bordered>

      <objectTree/>

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

import { Component } from "vue-property-decorator"
import BaseClass from "src/BaseClass"

import objectTree from "src/components/ObjectTree.vue"
import topTabs from "src/components/TopTabs.vue"

@Component({
  components: { objectTree, topTabs }
})
export default class MainLayout extends BaseClass {
  leftDrawerOpen = true
  rightDrawerOpen = false
}
</script>
