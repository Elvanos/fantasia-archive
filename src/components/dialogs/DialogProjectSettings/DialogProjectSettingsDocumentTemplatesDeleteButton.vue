<template>
  <FaDeleteConfirmButton
    button-class="dialogProjectSettingsDocumentTemplatesDeleteButton"
    confirm-button-test-locator="dialogProjectSettings-documentTemplates-deleteConfirmConfirmButton"
    confirm-menu-test-locator="dialogProjectSettings-documentTemplates-deleteConfirmMenu"
    confirm-message-test-locator="dialogProjectSettings-documentTemplates-deleteConfirmMessage"
    countdown-test-locator="dialogProjectSettings-documentTemplates-deleteConfirmCountdown"
    delete-button-label-key="dialogs.projectSettings.panels.documentTemplates.deleteTemplateButton"
    delete-confirm-confirm-button-key="dialogs.projectSettings.panels.documentTemplates.deleteConfirm.confirmDeleteButton"
    delete-confirm-message-key="dialogs.projectSettings.panels.documentTemplates.deleteConfirm.message"
    no-caps
    remove-button-test-locator="dialogProjectSettings-documentTemplates-removeButton"
    :remove-disabled="props.removeDisabled"
    :remove-disabled-tooltip-key="removeDisabledTooltipKey"
    @confirm="emit('confirm')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import FaDeleteConfirmButton from 'app/src/components/elements/FaDeleteConfirmButton/FaDeleteConfirmButton.vue'

defineOptions({
  name: 'DialogProjectSettingsDocumentTemplatesDeleteButton'
})

const props = defineProps<{
  removeDisabled: boolean
  removeDisabledReason: 'hasDocuments' | 'assignedToWorld' | null
}>()

const emit = defineEmits<{
  confirm: []
}>()

const removeDisabledTooltipKey = computed(() => {
  if (props.removeDisabledReason === 'assignedToWorld') {
    return 'dialogs.projectSettings.panels.documentTemplates.removeDisabledAssignedToWorld'
  }
  return 'dialogs.projectSettings.panels.documentTemplates.removeDisabledHasDocuments'
})
</script>
