<template>
  <div
    class="appControlMenus bg-dark"
  >
    <q-btn-group
      flat
      class="appControlMenus__inner"
    >
      <!-- Project menu-->
      <AppControlSingleMenu :data-input="project" />

      <!-- Tools menu-->
      <AppControlSingleMenu :data-input="tools" />

      <!-- Help & Info Menu-->
      <AppControlSingleMenu :data-input="helpInfo" />
    </q-btn-group>

    <DialogMarkdownDocument />
  </div>
</template>

<script setup lang="ts">
import AppControlSingleMenu from 'src/components/AppControlMenus/AppControlSingleMenu/AppControlSingleMenu.vue'

import { project } from 'app/src/components/AppControlMenus/_data/project'
import { tools } from 'app/src/components/AppControlMenus/_data/tools'
import { helpInfo } from 'app/src/components/AppControlMenus/_data/helpInfo'

import DialogMarkdownDocument from 'app/src/components/DialogMarkdownDocument/DialogMarkdownDocument.vue'

</script>

<style lang="scss" scoped>
.appControlMenus {
  &__inner {
    -webkit-app-region: no-drag;
  }
}
</style>
