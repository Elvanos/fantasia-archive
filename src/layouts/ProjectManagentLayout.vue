<template>
  <q-layout view="lHh LpR lfr">
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

@Component({
  components: { }
})
export default class ProjectManagementLayout extends BaseClass {

}
</script>

<style lang="scss" scoped>

</style>
