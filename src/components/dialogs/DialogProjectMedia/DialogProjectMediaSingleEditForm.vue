<template>
  <div
    class="dialogProjectMediaSingleEditForm"
    data-test-locator="dialogProjectMedia-singleEdit-form"
  >
    <DialogProjectMediaPreviewThumbBind
      :debounce-ms="0"
      :item="row"
      locator-prefix="dialogProjectMedia-singleEdit-preview"
      thumb-size="singleEdit"
    />
    <DialogProjectMediaMassEditBlockFields
      v-model:row="row"
      :dense="props.dense"
      :external-type-options="externalTypeOptions"
      :internal-type-options="internalTypeOptions"
      locator-prefix="dialogProjectMedia-singleEdit"
      stack-type-row
      :type-options="typeOptions"
    />
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { buildFaProjectMediaMassEditSelectOptionLists } from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'
import DialogProjectMediaMassEditBlockFields from './DialogProjectMediaMassEditBlockFields.vue'
import DialogProjectMediaPreviewThumbBind from './DialogProjectMediaPreviewThumbBind.vue'

defineOptions({
  name: 'DialogProjectMediaSingleEditForm'
})

const row = defineModel<I_faProjectMediaMassEditRow>('row', { required: true })

const props = withDefaults(defineProps<{
  dense?: boolean
}>(), {
  dense: true
})

const { t } = useI18n()

const selectOptionLists = computed(() => {
  return buildFaProjectMediaMassEditSelectOptionLists(t)
})

const typeOptions = computed(() => {
  return selectOptionLists.value.typeOptions
})

const internalTypeOptions = computed(() => {
  return selectOptionLists.value.internalTypeOptions
})

const externalTypeOptions = computed(() => {
  return selectOptionLists.value.externalTypeOptions
})
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.singleEditForm.scoped.scss"></style>
