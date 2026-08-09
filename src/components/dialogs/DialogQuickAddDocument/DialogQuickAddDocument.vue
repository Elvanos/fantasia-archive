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
          <q-select
            :model-value="selectedWorldId"
            color="primary-bright"
            dark
            dense
            data-test-locator="dialogQuickAddDocument-select-world"
            emit-value
            filled
            :aria-label="$t('dialogs.quickAddDocument.worldLabel')"
            map-options
            menu-anchor="bottom middle"
            menu-self="top middle"
            :options="worldOptions"
            option-label="label"
            option-value="value"
            outlined
            popup-content-class="dialogQuickAddDocument__selectMenu"
            @update:model-value="onWorldSelect"
          >
            <template #option="scope">
              <div
                class="dialogQuickAddDocument__optionWrap"
                :data-test-locator="`dialogQuickAddDocument-world-option-${scope.index}`"
              >
                <q-separator
                  v-if="scope.index > 0"
                  class="dialogQuickAddDocument__separatorAlt"
                  :data-test-locator="`dialogQuickAddDocument-world-separatorAlt-${scope.index}`"
                />
                <q-item
                  v-bind="scope.itemProps"
                >
                  <q-item-section avatar>
                    <q-icon
                      class="fa-color-glyph"
                      :name="scope.opt.icon"
                      :style="buildDialogQuickAddDocumentWorldOptionIconStyle(scope.opt.color)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
            <template #selected-item="scope">
              <div class="dialogQuickAddDocument__selectedWorld row items-center no-wrap">
                <q-icon
                  class="fa-color-glyph q-mr-sm"
                  :name="scope.opt.icon"
                  :style="buildDialogQuickAddDocumentWorldOptionIconStyle(scope.opt.color)"
                />
                <span>{{ scope.opt.label }}</span>
              </div>
            </template>
          </q-select>
        </div>

        <div class="dialogQuickAddDocument__templateSelect">
          <q-select
            :ref="bindTemplateSelectRef"
            :model-value="selectedTemplateId"
            color="primary-bright"
            dark
            dense
            data-test-locator="dialogQuickAddDocument-select-template"
            emit-value
            filled
            input-debounce="0"
            :aria-label="$t('dialogs.quickAddDocument.templateLabel')"
            map-options
            menu-anchor="bottom middle"
            menu-self="top middle"
            :options="filteredTemplateOptions"
            option-label="label"
            option-value="value"
            outlined
            popup-content-class="dialogQuickAddDocument__selectMenu"
            use-input
            @filter="onTemplateFilter"
            @update:model-value="(value) => void onTemplateSelect(value)"
          >
            <template #option="scope">
              <div
                class="dialogQuickAddDocument__optionWrap"
                :data-test-locator="`dialogQuickAddDocument-template-option-${scope.index}`"
              >
                <q-separator
                  v-if="scope.index > 0"
                  class="dialogQuickAddDocument__separatorAlt"
                  :data-test-locator="`dialogQuickAddDocument-template-separatorAlt-${scope.index}`"
                />
                <q-item
                  v-bind="scope.itemProps"
                >
                  <q-item-section avatar>
                    <q-icon
                      :name="scope.opt.icon"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
            <template #selected-item="scope">
              <div class="dialogQuickAddDocument__selectedTemplate row items-center no-wrap">
                <q-icon
                  class="q-mr-sm"
                  :name="scope.opt.icon"
                />
                <span>{{ scope.opt.label }}</span>
              </div>
            </template>
          </q-select>
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

import {
  buildDialogQuickAddDocumentWorldOptionIconStyle,
  useDialogQuickAddDocument
} from './scripts/dialogQuickAddDocument_manager'

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
  filteredTemplateOptions,
  onDialogHide,
  onDialogShow,
  onTemplateFilter,
  onTemplateSelect,
  onWorldSelect,
  selectedTemplateId,
  selectedWorldId,
  showWorldSelect,
  worldOptions
} = useDialogQuickAddDocument(props)
</script>

<style lang="scss" src="./styles/DialogQuickAddDocument.unscoped.scss"></style>
