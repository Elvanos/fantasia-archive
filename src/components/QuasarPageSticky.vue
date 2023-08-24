<template>
  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-btn
      data-cy="button"
      rounded
      color="accent"
      icon="arrow_forward"
    >
      {{ title }}
    </q-btn>
  </q-page-sticky>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QuasarPageSticky',
  props: {
    title: {
      type: String,
      required: true
    }
  }
})
</script>
