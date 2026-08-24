<template>
  <q-dialog
    v-model="dialogModel"
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

      <div class="dialogProjectMedia__searchWrapper">
        <q-input
          v-model="searchQuery"
          dense
          dark
          class="dialogProjectMedia__searchInput"
          data-test-locator="dialogProjectMedia-search"
          :placeholder="$t('dialogs.projectMedia.searchPlaceholder')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <q-card-section
        :class="['dialogComponent__content', 'dialogProjectMedia__body', `${documentName}`, 'q-mb-lg', 'q-mr-lg', 'q-ml-xl', 'q-pt-none']"
      />

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

import { useDialogProjectMedia } from './scripts/dialogProjectMedia_manager'

defineOptions({
  name: 'DialogProjectMedia'
})

const props = defineProps<{
  /**
   * Custom input directly fed to the component in case it doesn't get triggered from the global store
   */
  directInput?: T_dialogName | undefined
}>()

const {
  dialogModel,
  documentName,
  searchQuery
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

  .dialogProjectMedia__title {
    padding-inline-end: $dialogProjectMedia-title-paddingInlineEnd;
    z-index: $dialogProjectMedia-title-zIndex;
  }

  .dialogProjectMedia__searchInput {
    width: 100%;
  }

  .dialogProjectMedia__searchWrapper {
    pointer-events: auto;
    position: absolute;
    right: $dialogProjectMedia-searchWrapper-right;
    top: $dialogProjectMedia-searchWrapper-top;
    width: $dialogProjectMedia-searchWrapper-width !important;
    z-index: $dialogProjectMedia-searchWrapper-zIndex;
  }

  .dialogProjectMedia__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }
}
</style>
