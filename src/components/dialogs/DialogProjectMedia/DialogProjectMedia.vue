<template>
  <q-dialog
    v-model="dialogModel"
    :persistent="isPersistent"
    :class="['dialogComponent', `${documentName}`]"
    :aria-label="$t(dialogTitleI18nKey)"
  >
    <q-card
      :class="['dialogComponent__wrapper', 'dialogProjectMedia', `${documentName}`]"
    >
      <q-card-section
        :class="['dialogComponent__content', 'dialogProjectMedia__body', `${documentName}`, 'q-mb-lg', 'q-pt-none', 'q-px-none']"
      >
        <DialogProjectMediaPanelsColumn
          v-model:mass-edit-rows="massEditRows"
          v-model:online-urls-draft="onlineUrlsDraft"
          v-model:search-query="searchQuery"
          v-model:single-edit-row="singleEditDraft"
          :is-single-edit-save-disabled="isSingleEditSaveDisabled"
          :list-media-items="listMediaItems"
          :selected-panel="selectedPanel"
          @add-online-media="showAddOnlineUrlsPanel"
          @select-list-item="openSingleEditSlide"
          @single-edit-close="closeSingleEditDialog"
          @single-edit-save="saveSingleEditAndCloseDialog"
        />
      </q-card-section>

      <q-card-actions
        v-if="isMassEditPanel"
        align="right"
        class="q-mb-lg q-px-md dialogProjectMedia__cardActions"
      >
        <q-btn
          v-close-popup
          class="dialogProjectMedia__cardActionButton"
          color="accent"
          data-test-locator="dialogProjectMedia-button-close"
          flat
          :label="$t('dialogs.projectMedia.massEditCloseWithoutSavingButton')"
          no-wrap
        />
        <q-btn
          class="dialogProjectMedia__cardActionButton"
          color="primary-bright"
          data-test-locator="dialogProjectMedia-button-saveAndBackToList"
          :label="$t('dialogs.projectMedia.massEditSaveAndBackToListButton')"
          no-wrap
          outline
          @click="saveAndBackToList"
        />
        <q-btn
          class="dialogProjectMedia__cardActionButton"
          color="primary-bright"
          data-test-locator="dialogProjectMedia-button-saveAndClose"
          :label="$t('dialogs.projectMedia.massEditSaveAndCloseButton')"
          no-wrap
          outline
          @click="saveAndClose"
        />
      </q-card-actions>
      <q-card-actions
        v-else-if="isAddOnlineUrlsPanel"
        align="right"
        class="q-mb-lg q-px-md dialogProjectMedia__cardActions"
      >
        <q-btn
          v-close-popup
          class="dialogProjectMedia__cardActionButton"
          color="accent"
          data-test-locator="dialogProjectMedia-button-close"
          flat
          :label="$t('dialogs.projectMedia.closeButton')"
          no-wrap
        />
        <q-btn
          class="dialogProjectMedia__cardActionButton"
          color="primary-bright"
          data-test-locator="dialogProjectMedia-addOnlineUrlsSubmit"
          :disable="isOnlineUrlsSubmitDisabled"
          :label="$t('dialogs.projectMedia.addOnlineUrlsSubmitButton')"
          no-wrap
          outline
          @click="submitOnlineUrls"
        />
      </q-card-actions>
      <q-card-actions
        v-else-if="showGenericClose"
        align="around"
        class="q-mb-lg"
      >
        <q-btn
          v-close-popup
          flat
          :label="$t('dialogs.projectMedia.closeButton')"
          color="accent"
          data-test-locator="dialogProjectMedia-button-close"
        />
      </q-card-actions>
      <Transition
        name="dialogProjectMediaSingleEditSlide"
        :duration="FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS"
        @after-leave="discardSingleEditSlide"
      >
        <DialogProjectMediaSingleEditSlide
          v-if="isSingleEditSlideOpen"
          v-model:row="singleEditDraft"
          :next-disabled="isSlideNextDisabled"
          :previous-disabled="isSlidePreviousDisabled"
          @close="closeSingleEditSlide"
          @next="openSingleEditSlideNext"
          @previous="openSingleEditSlidePrevious"
          @save="saveSingleEditSlide"
          @save-stay="saveSingleEditSlideStay"
        />
      </Transition>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaPanelsColumn from './DialogProjectMediaPanelsColumn.vue'
import DialogProjectMediaSingleEditSlide from './DialogProjectMediaSingleEditSlide.vue'
import {
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS,
  useDialogProjectMedia
} from './scripts/dialogProjectMedia_manager'

defineOptions({
  name: 'DialogProjectMedia'
})

const props = defineProps<{
  /**
   * Custom input directly fed to the component in case it doesn't get triggered from the global store
   */
  directInput?: T_dialogName | undefined
  /**
   * Optional slide panel when opened via directInput (Storybook / harness).
   */
  initialPanel?: T_faProjectMediaPanel | undefined
}>()

const {
  closeSingleEditDialog,
  closeSingleEditSlide,
  discardSingleEditSlide,
  dialogModel,
  dialogTitleI18nKey,
  documentName,
  isAddOnlineUrlsPanel,
  isMassEditPanel,
  isOnlineUrlsSubmitDisabled,
  isPersistent,
  isSingleEditSaveDisabled,
  isSingleEditSlideOpen,
  isSlideNextDisabled,
  isSlidePreviousDisabled,
  listMediaItems,
  massEditRows,
  onlineUrlsDraft,
  openSingleEditSlide,
  openSingleEditSlideNext,
  openSingleEditSlidePrevious,
  searchQuery,
  selectedPanel,
  saveAndBackToList,
  saveAndClose,
  saveSingleEditAndCloseDialog,
  saveSingleEditSlide,
  saveSingleEditSlideStay,
  showAddOnlineUrlsPanel,
  showGenericClose,
  singleEditDraft,
  submitOnlineUrls
} = useDialogProjectMedia(props)
</script>

<style lang="scss">
.q-dialog.dialogComponent.ProjectMedia {
  > .q-dialog__inner > .q-card.dialogComponent__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width:
      min(
        #{$dialogProjectMedia-card-width},
        calc(100vw - #{$dialogProjectMedia-card-maxWidthViewportSubtract})
      );
    overflow: hidden;
    position: relative;
    width: $dialogProjectMedia-card-width;
  }

  .dialogProjectMedia__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
<style lang="scss" src="./styles/DialogProjectMedia.cardActions.unscoped.scss"></style>
