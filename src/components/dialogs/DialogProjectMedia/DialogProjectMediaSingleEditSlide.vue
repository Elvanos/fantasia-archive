<template>
  <div
    class="dialogProjectMediaSingleEditSlide"
    data-test-locator="dialogProjectMedia-singleEditSlide"
  >
    <div
      class="dialogProjectMediaSingleEditSlide__backdrop"
      data-test-locator="dialogProjectMedia-singleEditSlide-backdrop"
    />
    <div class="dialogProjectMediaSingleEditSlide__panel">
      <div class="dialogProjectMediaSingleEditSlide__body hasScrollbar">
        <DialogProjectMediaSingleEditForm
          v-if="row !== null"
          v-model:row="row"
          :dense="false"
        />
      </div>
      <div class="q-mb-lg q-px-md dialogProjectMedia__cardActions dialogProjectMediaSingleEditSlide__footer">
        <div class="dialogProjectMediaSingleEditSlide__nav">
          <q-btn
            :aria-label="$t('dialogs.projectMedia.singleEditPreviousTooltip')"
            class="dialogProjectMedia__cardActionButton dialogProjectMediaSingleEditSlide__navBtn"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-previous"
            :disable="previousDisabled"
            icon="keyboard_arrow_left"
            no-wrap
            outline
            @click="emit('previous')"
          />
          <q-btn
            :aria-label="$t('dialogs.projectMedia.singleEditNextTooltip')"
            class="dialogProjectMedia__cardActionButton dialogProjectMediaSingleEditSlide__navBtn"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-next"
            :disable="nextDisabled"
            icon="keyboard_arrow_right"
            no-wrap
            outline
            @click="emit('next')"
          />
        </div>
        <div class="dialogProjectMediaSingleEditSlide__actions">
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="accent"
            data-test-locator="dialogProjectMedia-singleEditSlide-close"
            flat
            :label="$t('dialogs.projectMedia.closeButton')"
            no-wrap
            @click="emit('close')"
          />
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-saveStay"
            :label="$t('dialogs.projectMedia.singleEditSaveWithoutCloseButton')"
            no-wrap
            outline
            @click="emit('saveStay')"
          />
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-save"
            :label="$t('dialogs.projectMedia.singleEditSaveAndCloseButton')"
            no-wrap
            outline
            @click="emit('save')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaSingleEditForm from './DialogProjectMediaSingleEditForm.vue'

defineOptions({
  name: 'DialogProjectMediaSingleEditSlide'
})

const row = defineModel<I_faProjectMediaMassEditRow | null>('row', { required: true })

defineProps<{
  nextDisabled: boolean
  previousDisabled: boolean
}>()

const emit = defineEmits<{
  close: []
  next: []
  previous: []
  save: []
  saveStay: []
}>()
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.singleEditSlide.scoped.scss"></style>
<style lang="scss" src="./styles/DialogProjectMedia.singleEditSlide.unscoped.scss"></style>
