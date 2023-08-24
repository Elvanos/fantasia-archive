<template>
  <q-btn
    data-cy="button"
    label="test emit"
    color="positive"
    rounded
    icon="edit"
    @click="$emit('test')"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuasarButton',
  emits: { test: () => true }
})
</script>
