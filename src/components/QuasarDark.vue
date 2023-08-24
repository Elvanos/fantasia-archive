<template>
  <q-card
    data-cy="dark-card"
    :dark="$q.dark.isActive"
  >
    {{ $q.dark.isActive ? 'Dark ' : 'Light' }} content
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuasarDark'
})
</script>
