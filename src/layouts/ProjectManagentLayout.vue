<template>
  <q-layout view="lHh LpR lfr">

    <!-- Header -->
    <appHeader
      :is-project="false"
    />

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="50"
      >
      <router-view :key="$route.path" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { Component } from "vue-property-decorator"
import BaseClass from "src/BaseClass"
import appHeader from "src/components/AppHeader.vue"

@Component({
  components: { appHeader }
})
export default class ProjectManagementLayout extends BaseClass {

}
</script>

<style lang="scss" scoped>

</style>
