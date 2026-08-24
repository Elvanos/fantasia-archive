<template>
  <q-btn
    :class="buttonClass"
    color="primary-bright"
    :data-test-locator="locator"
    :icon="icon"
    outline
    @click="onClick"
  >
    <FaCornerContentDot
      v-if="contentDotLocator !== undefined"
      :locator="contentDotLocator"
      :visible="contentDotVisible === true"
    />
    <q-tooltip
      anchor="bottom middle"
      class="projectAppControlBar__buttonTooltip"
      self="top middle"
    >
      <ProjectAppControlBarButtonKeybindTooltip
        :keybind-label="keybindLabel"
        :keybind-test-locator="keybindTestLocator"
        :label="tooltip"
      />
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import FaCornerContentDot from 'app/src/components/elements/FaCornerContentDot/FaCornerContentDot.vue'

import ProjectAppControlBarButtonKeybindTooltip from './ProjectAppControlBarButtonKeybindTooltip.vue'

defineOptions({
  name: 'ProjectAppControlBarStripIconButton'
})

defineProps<{
  buttonClass?: string
  contentDotLocator?: string
  contentDotVisible?: boolean
  icon: string
  keybindLabel: string | null
  keybindTestLocator: string
  locator: string
  onClick: () => void
  tooltip: string
}>()
</script>
