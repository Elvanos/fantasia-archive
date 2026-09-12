<template>
  <div
    class="dialogProjectMediaListGrid"
    data-test-locator="dialogProjectMedia-listGrid"
  >
    <!-- Saved media thumbnails; left-click opens the single-edit slide -->
    <button
      v-for="item in items"
      :key="item.id"
      class="dialogProjectMediaListGrid__thumb"
      :data-test-locator="`dialogProjectMedia-list-thumb-${item.id}`"
      type="button"
      @click="emit('selectItem', item)"
    >
      <DialogProjectMediaPreviewThumbBind
        :debounce-ms="0"
        :item="item"
        locator-prefix="dialogProjectMedia-list-preview"
        thumb-size="list"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaPreviewThumbBind from './DialogProjectMediaPreviewThumbBind.vue'

defineOptions({
  name: 'DialogProjectMediaListGrid'
})

defineProps<{
  items: I_faProjectMedia[]
}>()

const emit = defineEmits<{
  selectItem: [item: I_faProjectMedia]
}>()
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.listGrid.scoped.scss"></style>
