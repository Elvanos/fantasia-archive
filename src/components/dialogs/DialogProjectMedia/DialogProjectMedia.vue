<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    :class="['dialogComponent', `${documentName}`]"
    aria-labelledby="dialogProjectMedia-title"
  >
    <q-card
      :class="['dialogComponent__wrapper', 'dialogProjectMedia', `${documentName}`]"
    >
      <h5
        id="dialogProjectMedia-title"
        class="dialogProjectMedia__title text-center text-h5"
        data-test-locator="dialogProjectMedia-title"
      >
        {{ $t('dialogs.projectMedia.title') }}
      </h5>

      <q-card-section
        :class="['dialogComponent__content', 'dialogProjectMedia__body', `${documentName}`, 'q-mb-lg', 'q-mr-lg', 'q-ml-xl', 'q-pt-none']"
      >
        <DialogProjectMediaPanelsColumn
          v-model:search-query="searchQuery"
          :selected-panel="selectedPanel"
        />
      </q-card-section>

      <q-card-actions
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
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaPanelsColumn from './DialogProjectMediaPanelsColumn.vue'
import { useDialogProjectMedia } from './scripts/dialogProjectMedia_manager'

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
  dialogModel,
  documentName,
  searchQuery,
  selectedPanel
} = useDialogProjectMedia(props)
</script>

<style lang="scss">
.ProjectMedia {
  &.dialogComponent__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: calc(100vw - #{$dialogProjectMedia-card-maxWidthViewportSubtract});
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
