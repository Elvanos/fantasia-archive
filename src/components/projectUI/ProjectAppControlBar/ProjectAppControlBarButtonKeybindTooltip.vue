<template>
  <div class="fa-tooltip-keybind-stack">
    <span class="fa-tooltip-keybind-stack__label">
      {{ label }}
    </span>
    <div
      v-if="keybindLabel !== null"
      class="fa-tooltip-keybind-hint fa-text-keybind-hint"
      :data-test-locator="keybindTestLocator"
    >
      ({{ keybindLabel }})
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ProjectAppControlBarButtonKeybindTooltip'
})

defineProps<{
  keybindLabel: string | null
  keybindTestLocator: string
  label: string
}>()
</script>
