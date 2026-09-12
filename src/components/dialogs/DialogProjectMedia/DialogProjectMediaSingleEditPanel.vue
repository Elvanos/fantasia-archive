<template>
  <div class="dialogProjectMediaSingleEditPanel">
    <DialogProjectMediaSlideTitle
      :label="$t('dialogs.projectMedia.titleSingle')"
      test-locator="dialogProjectMedia-title-mediaSingleEdit"
    />
    <div class="dialogProjectMediaSingleEditPanel__body hasScrollbar">
      <DialogProjectMediaSingleEditForm
        v-if="row !== null"
        v-model:row="row"
      />
    </div>
    <div class="q-mb-lg q-px-md dialogProjectMedia__cardActions dialogProjectMediaSingleEditPanel__footer">
      <q-btn
        class="dialogProjectMedia__cardActionButton"
        color="accent"
        data-test-locator="dialogProjectMedia-singleEdit-close"
        flat
        :label="$t('dialogs.projectMedia.closeButton')"
        no-wrap
        @click="emit('close')"
      />
      <q-btn
        class="dialogProjectMedia__cardActionButton"
        color="primary-bright"
        data-test-locator="dialogProjectMedia-singleEdit-saveAndClose"
        :disable="isSaveDisabled"
        :label="$t('dialogs.projectMedia.singleEditSaveAndCloseButton')"
        no-wrap
        outline
        @click="emit('save')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditForm from './DialogProjectMediaSingleEditForm.vue'
import DialogProjectMediaSlideTitle from './DialogProjectMediaSlideTitle.vue'

defineOptions({
  name: 'DialogProjectMediaSingleEditPanel'
})

const row = defineModel<I_faProjectMediaMassEditRow | null>('row', { default: null })

defineProps<{
  isSaveDisabled: boolean
}>()

const emit = defineEmits<{
  close: []
  save: []
}>()
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.singleEditPanel.scoped.scss"></style>
