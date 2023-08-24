<template>
  <q-btn
    data-cy="open-menu-btn"
    label="Open menu"
  >
    <q-menu>
      <q-list>
        <q-item
          v-close-popup
          clickable
        >
          <q-item-section>Item 1</q-item-section>
        </q-item>
        <q-item
          v-close-popup
          clickable
        >
          <q-item-section>Item 2</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuasarMenu'
})
</script>
