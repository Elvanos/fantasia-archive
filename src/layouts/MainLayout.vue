<template>
  <q-layout view="hHh Lpr lFf">
    <GlobalWindowButtons />
    <q-header
      elevated
      class="bg-dark"
    >
      <AppControlMenus />
    </q-header>

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
