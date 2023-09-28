<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      elevated
      dark
      class="bg-dark appHeader"
    >
      <AppControlMenus />
    </q-header>

    <GlobalWindowButtons />

    <q-drawer
      show-if-above
      dark
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import GlobalWindowButtons from 'components/GlobalWindowButtons/GlobalWindowButtons.vue'
import AppControlMenus from 'components/AppControlMenus/AppControlMenus.vue'

</script>

<style lang="scss" scoped>
.appHeader {
  -webkit-app-region: drag;

  // Tweak so the menus will slide nicely behind the buttons
  z-index: 7000;
}
</style>

<style lang="scss">
// Unscoped due to impossibility of being matched with the rendered elements otherwise
.appHeader {

  // Tweak for default white shadow rendering in the dark-mode variation of the element
  .q-layout__shadow:after{
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0px 10px rgba(0, 0, 0, 0.24) !important;
  }
}
</style>
