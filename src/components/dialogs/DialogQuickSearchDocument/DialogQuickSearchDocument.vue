<template>
  <q-dialog
    v-model="dialogModel"
    :class="['dialogComponent', 'dialogComponent--topPopup', documentName, 'dialogQuickSearchDocument']"
    :aria-label="$t('dialogs.quickSearchDocument.ariaLabel')"
    no-route-dismiss
    @hide="onDialogHide"
    @show="onDialogShow"
  >
    <q-card
      :class="['dialogComponent__wrapper', 'dialogQuickSearchDocument', documentName]"
    >
      <q-card-section
        :class="['dialogComponent__content', documentName, 'dialogQuickSearchDocument', 'hasScrollbar', 'q-pt-none']"
      >
        <h5
          id="dialogQuickSearchDocument-title"
          class="text-center"
        >
          {{ $t('dialogs.quickSearchDocument.title') }}
        </h5>

        <div
          v-if="showWorldSelect"
          class="dialogQuickSearchDocument__worldSelect q-mb-md"
        >
          <FaSelectInput
            :model-value="selectedWorldOption"
            dark
            dense
            filled
            mode="otherType"
            :options="worldOptions"
            popup-content-class="faSelectInput__menu dialogQuickSearchDocument__selectMenu"
            selection-presentation="inline"
            test-locator="dialogQuickSearchDocument-select-world"
            :aria-label="$t('dialogs.quickSearchDocument.worldLabel')"
            @option-activate="onWorldSelect"
            @update:model-value="onWorldSelect"
          />
        </div>

        <div class="dialogQuickSearchDocument__documentSelect">
          <FaSelectInput
            :ref="bindDocumentSelectRef"
            :activate-only="documentSelectActivateOnly"
            :model-value="selectedDocumentOption"
            dark
            dense
            filled
            mode="document"
            :options="documentOptions"
            popup-content-class="faSelectInput__menu dialogQuickSearchDocument__selectMenu"
            test-locator="dialogQuickSearchDocument-select-document"
            selection-presentation="inline"
            :aria-label="$t('dialogs.quickSearchDocument.documentLabel')"
            @option-activate="onDocumentSelect"
            @option-auxclick="onDocumentOptionAuxClick"
            @update:model-value="onDocumentSelect"
          >
            <template #option-trailing="scope">
              <div
                class="dialogQuickSearchDocument__optionActions"
                data-test-locator="dialogQuickSearchDocument-optionActions"
                @auxclick.stop.prevent
                @click.stop
                @mousedown.stop
                @pointerdown.stop
              >
                <q-btn
                  class="dialogQuickSearchDocument__optionAction dialogQuickSearchDocument__optionAction--edit"
                  color="dark"
                  :data-test-locator="`dialogQuickSearchDocument-optionAction-edit-${scope.opt.id}`"
                  dense
                  flat
                  icon="mdi-pencil"
                  round
                  size="24px"
                  tabindex="-1"
                  @auxclick.stop.prevent="onDocumentEditClick(scope.opt.id, $event)"
                  @click.stop.prevent="onDocumentEditClick(scope.opt.id, $event)"
                >
                  <q-tooltip>
                    {{ $t('dialogs.quickSearchDocument.editDocumentTooltip') }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  class="dialogQuickSearchDocument__optionAction dialogQuickSearchDocument__optionAction--copy"
                  color="dark"
                  :data-test-locator="`dialogQuickSearchDocument-optionAction-copy-${scope.opt.id}`"
                  dense
                  flat
                  icon="mdi-content-copy"
                  round
                  size="24px"
                  tabindex="-1"
                  @auxclick.stop.prevent="onDocumentCopyClick(scope.opt.id, $event)"
                  @click.stop.prevent="onDocumentCopyClick(scope.opt.id, $event)"
                >
                  <q-tooltip>
                    {{ $t('dialogs.quickSearchDocument.copyDocumentTooltip') }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  class="dialogQuickSearchDocument__optionAction dialogQuickSearchDocument__optionAction--addUnder"
                  color="dark"
                  :data-test-locator="`dialogQuickSearchDocument-optionAction-addUnder-${scope.opt.id}`"
                  dense
                  flat
                  icon="mdi-file-tree"
                  round
                  size="24px"
                  tabindex="-1"
                  @auxclick.stop.prevent="onDocumentAddUnderClick(scope.opt.id, $event)"
                  @click.stop.prevent="onDocumentAddUnderClick(scope.opt.id, $event)"
                >
                  <q-tooltip>
                    {{ $t('dialogs.quickSearchDocument.addUnderDocumentTooltip') }}
                  </q-tooltip>
                </q-btn>
              </div>
            </template>
            <template #option-context-menu="scope">
              <DialogQuickSearchDocumentOptionContextMenu
                :document-id="scope.opt.id"
                :on-add-under="onDocumentContextAddUnder"
                :on-copy-background-color="onDocumentContextCopyBackgroundColor"
                :on-copy-document="onDocumentContextCopyDocument"
                :on-copy-name="onDocumentContextCopyName"
                :on-copy-text-color="onDocumentContextCopyTextColor"
                :on-delete="onDocumentContextDelete"
                :on-edit="onDocumentContextEdit"
                :on-open="onDocumentContextOpen"
              />
            </template>
          </FaSelectInput>
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
          data-test-locator="dialogQuickSearchDocument-button-close"
          :label="$t('dialogs.quickSearchDocument.closeButton')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'

import FaSelectInput from 'app/src/components/elements/FaSelectInput/FaSelectInput.vue'

import DialogQuickSearchDocumentOptionContextMenu from './DialogQuickSearchDocumentOptionContextMenu.vue'
import { useDialogQuickSearchDocument } from './scripts/dialogQuickSearchDocument_manager'

defineOptions({
  name: 'DialogQuickSearchDocument'
})

const props = defineProps<{
  directInput?: T_dialogName | undefined
}>()

const {
  bindDocumentSelectRef,
  dialogModel,
  documentName,
  documentOptions,
  documentSelectActivateOnly,
  onDialogHide,
  onDialogShow,
  onDocumentAddUnderClick,
  onDocumentContextAddUnder,
  onDocumentContextCopyBackgroundColor,
  onDocumentContextCopyDocument,
  onDocumentContextCopyName,
  onDocumentContextCopyTextColor,
  onDocumentContextDelete,
  onDocumentContextEdit,
  onDocumentContextOpen,
  onDocumentCopyClick,
  onDocumentEditClick,
  onDocumentOptionAuxClick,
  onDocumentSelect,
  onWorldSelect,
  selectedDocumentOption,
  selectedWorldOption,
  showWorldSelect,
  worldOptions
} = useDialogQuickSearchDocument(props)
</script>

<style lang="scss" src="./styles/DialogQuickSearchDocument.unscoped.scss"></style>
