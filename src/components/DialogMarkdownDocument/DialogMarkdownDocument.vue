<template>
  <!-- Dialog wrapper -->
  <q-dialog
    v-model="dialogModel"
    :class="['dialogMarkdownDocument', `${documentName}`]"
  >
    <q-card>
      <q-card-section :class="['dialogMarkdownDocument__content', `${documentName}`, 'q-mt-xl', 'q-mb-lg', 'q-mr-lg', 'q-ml-xl', 'q-pt-none']">
        <div class="flex justify-center">
          <q-markdown
            no-heading-anchor-links
            :src="$t(`documents.${documentName}`)"
          />
        </div>
      </q-card-section>

      <q-card-actions
        align="around"
        class="q-mb-lg"
      >
        <q-btn
          v-close-popup
          flat
          label="Close"
          color="accent"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'
import { S_DialogMarkdown } from 'src/stores/S_DialogMarkdown'

import { ref, watch } from 'vue'

const dialogModel = ref(false)
const documentName = ref('')

const openDialog = () => {
  documentName.value = S_DialogMarkdown.documentToOpen
  dialogModel.value = true
}

watch(() => S_DialogMarkdown.dialogUUID, () => {
  openDialog()
})

</script>

<style lang="scss">

.dialogMarkdownDocument {
  .q-card {
    max-width: calc(100vw - 100px) !important;
  }

  &.license .q-card {
    width: 680px;
  }

  &.changeLog .q-card {
    width: 1100px;
  }

  &.advancedSearchGuide .q-card {
    width: 1100px;
  }

  &__content {
    overflow: auto;
    max-height: calc(100vh - 235px);
    height: 850px;

    &.changeLog {
      padding-right: 40px;
    }

    &.advancedSearchGuide {
      padding-right: 40px;
    }
  }
}

</style>
