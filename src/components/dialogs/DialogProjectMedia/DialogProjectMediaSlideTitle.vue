<template>
  <h5
    class="dialogProjectMediaSlideTitle text-center text-h5"
    :data-test-locator="props.testLocator"
  >
    {{ props.label }}
  </h5>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DialogProjectMediaSlideTitle'
})

const props = defineProps<{
  label: string
  testLocator: string
}>()
</script>
