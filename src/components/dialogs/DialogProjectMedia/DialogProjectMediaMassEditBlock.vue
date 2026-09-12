<template>
  <div
    class="dialogProjectMediaMassEditBlock"
    :data-test-locator="`dialogProjectMedia-massEdit-block-${row.id}`"
  >
    <!-- Preview from the URL currently shown on this block -->
    <DialogProjectMediaPreviewThumbBind :item="row" />

    <DialogProjectMediaMassEditBlockFields
      v-model:row="row"
      :external-type-options="externalTypeOptions"
      :internal-type-options="internalTypeOptions"
      :type-options="typeOptions"
    />
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import type { I_faSelectInputObjectItem } from 'app/types/I_faSelectInput'

import DialogProjectMediaMassEditBlockFields from './DialogProjectMediaMassEditBlockFields.vue'
import DialogProjectMediaPreviewThumbBind from './DialogProjectMediaPreviewThumbBind.vue'

defineOptions({
  name: 'DialogProjectMediaMassEditBlock'
})

const row = defineModel<I_faProjectMediaMassEditRow>('row', { required: true })

defineProps<{
  externalTypeOptions: I_faSelectInputObjectItem[]
  internalTypeOptions: I_faSelectInputObjectItem[]
  typeOptions: I_faSelectInputObjectItem[]
}>()
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.massEditBlock.scoped.scss"></style>
