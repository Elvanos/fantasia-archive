<template>
  <q-dialog
    v-model="dialogModel"
    :class="['dialogComponent', 'dialogComponent--topPopup', documentName, 'dialogQuickAddDocument']"
    :aria-label="$t('dialogs.quickAddDocument.ariaLabel')"
    @hide="onDialogHide"
    @show="onDialogShow"
  >
    <q-card
      :class="['dialogComponent__wrapper', 'dialogQuickAddDocument', documentName]"
    >
      <q-card-section
        :class="['dialogComponent__content', documentName, 'dialogQuickAddDocument', 'hasScrollbar', 'q-pt-none']"
      >
        <h5
          id="dialogQuickAddDocument-title"
          class="text-center"
        >
          {{ $t('dialogs.quickAddDocument.title') }}
        </h5>

        <div
          v-if="showWorldSelect"
          class="dialogQuickAddDocument__worldSelect q-mb-md"
        >
          <FaSelectInput
            :model-value="selectedWorldOption"
            dark
            dense
            filled
            mode="otherType"
            :options="worldOptions"
            popup-content-class="faSelectInput__menu dialogQuickAddDocument__selectMenu"
            selection-presentation="inline"
            test-locator="dialogQuickAddDocument-select-world"
            :aria-label="$t('dialogs.quickAddDocument.worldLabel')"
            @option-activate="onWorldSelect"
            @update:model-value="onWorldSelect"
          />
        </div>

        <div class="dialogQuickAddDocument__templateSelect">
          <FaSelectInput
            :ref="bindTemplateSelectRef"
            :model-value="selectedTemplateOption"
            dark
            dense
            filled
            mode="otherType"
            :options="templateOptions"
            popup-content-class="faSelectInput__menu dialogQuickAddDocument__selectMenu"
            selection-presentation="inline"
            test-locator="dialogQuickAddDocument-select-template"
            :aria-label="$t('dialogs.quickAddDocument.templateLabel')"
            @update:model-value="(value) => void onTemplateSelect(value)"
          />
        </div>
      </q-card-section>

      <q-card-actions
        align="around"
        class="q-card__actions q-mx-xl q-mt-lg q-mb-md q-card__actions--horiz row justify-around"
      >
        <q-btn
          v-close-popup
          flat
          color="accent"
          data-test-locator="dialogQuickAddDocument-button-close"
          :label="$t('dialogs.quickAddDocument.closeButton')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

import FaSelectInput from 'app/src/components/elements/FaSelectInput/FaSelectInput.vue'

import { useDialogQuickAddDocument } from './scripts/dialogQuickAddDocument_manager'

defineOptions({
  name: 'DialogQuickAddDocument'
})

const props = defineProps<{
  directInput?: T_dialogName | undefined
}>()

const {
  bindTemplateSelectRef,
  dialogModel,
  documentName,
  onDialogHide,
  onDialogShow,
  onTemplateSelect,
  onWorldSelect,
  selectedTemplateOption,
  selectedWorldOption,
  showWorldSelect,
  templateOptions,
  worldOptions
} = useDialogQuickAddDocument(props)
</script>

<style lang="scss" src="./styles/DialogQuickAddDocument.unscoped.scss"></style>
