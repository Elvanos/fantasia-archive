<template>
  <div class="dialogProjectMedia__tabPanelsHost q-pa-none">
    <q-tab-panels
      :model-value="props.selectedPanel"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      class="dialogProjectMedia__tabPanelsRoot q-pa-none"
    >
      <q-tab-panel
        :name="listPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <DialogProjectMediaSlideTitle
          :label="$t('dialogs.projectMedia.titleList')"
          test-locator="dialogProjectMedia-title-mediaList"
        />
        <!-- Media list: search + thumbnail grid -->
        <div class="dialogProjectMedia__listPanel hasScrollbar">
          <div class="dialogProjectMedia__listHeader">
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
          </div>
          <DialogProjectMediaListGrid
            :items="props.listMediaItems"
            @select-item="emit('selectListItem', $event)"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="addPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <DialogProjectMediaSlideTitle
          :label="$t('dialogs.projectMedia.titleAdd')"
          test-locator="dialogProjectMedia-title-mediaAdd"
        />
        <!-- Media addition drop zone -->
        <div
          class="dialogProjectMedia__addDropZone"
          data-test-locator="dialogProjectMedia-addDropZone"
        >
          <div
            class="row no-wrap dialogProjectMedia__addChoiceRow"
            data-test-locator="dialogProjectMedia-addChoiceRow"
          >
            <div class="dialogProjectMedia__addChoiceCol">
              <q-btn
                flat
                class="dialogProjectMedia__addChoiceBtn"
                color="primary-bright"
                data-test-locator="dialogProjectMedia-addOfflineMediaButton"
                :label="$t('dialogs.projectMedia.addOfflineMediaButton')"
              />
            </div>
            <q-separator
              class="fa-separator-grey-lighter"
              inset
              vertical
              data-test-locator="dialogProjectMedia-addChoiceDivider"
            />
            <div class="dialogProjectMedia__addChoiceCol">
              <q-btn
                flat
                class="dialogProjectMedia__addChoiceBtn"
                color="primary-bright"
                data-test-locator="dialogProjectMedia-addOnlineMediaButton"
                :label="$t('dialogs.projectMedia.addOnlineMediaButton')"
                @click="emit('addOnlineMedia')"
              />
            </div>
          </div>
          <p
            class="dialogProjectMedia__addDropZoneHint dialogProjectMedia__addDropZoneHint--or fa-text-muted text-center"
            data-test-locator="dialogProjectMedia-addDropZoneHintOr"
          >
            {{ $t('dialogs.projectMedia.addMediaDropZoneOr') }}
          </p>
          <p
            class="dialogProjectMedia__addDropZoneHint dialogProjectMedia__addDropZoneHint--drag fa-text-muted text-center"
            data-test-locator="dialogProjectMedia-addDropZoneHintDrag"
          >
            {{ $t('dialogs.projectMedia.addMediaDropZoneDrag') }}
          </p>
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="addOnlineUrlsPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <DialogProjectMediaSlideTitle
          :label="$t('dialogs.projectMedia.titleAddOnline')"
          test-locator="dialogProjectMedia-title-mediaAddOnlineUrls"
        />
        <!-- Media addition online URLs -->
        <div
          class="dialogProjectMedia__addOnlineUrls"
          data-test-locator="dialogProjectMedia-addOnlineUrls"
        >
          <div class="dialogProjectMedia__addOnlineUrlsStack">
            <h6
              class="dialogProjectMedia__addOnlineUrlsTitle text-center"
              data-test-locator="dialogProjectMedia-addOnlineUrlsTitle"
            >
              {{ $t('dialogs.projectMedia.addOnlineUrlsTitle') }}
            </h6>
            <q-input
              ref="onlineUrlsInputRef"
              v-model="onlineUrlsDraft"
              class="dialogProjectMedia__addOnlineUrlsInput"
              color="primary-bright"
              dark
              data-test-locator="dialogProjectMedia-addOnlineUrlsInput"
              filled
              hide-bottom-space
              outlined
              type="textarea"
            />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="singleEditPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <DialogProjectMediaSingleEditPanel
          v-model:row="singleEditRow"
          :is-save-disabled="props.isSingleEditSaveDisabled"
          @close="emit('singleEditClose')"
          @save="emit('singleEditSave')"
        />
      </q-tab-panel>
      <q-tab-panel
        :name="massEditPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <DialogProjectMediaSlideTitle
          :label="$t('dialogs.projectMedia.titleMassEdit')"
          test-locator="dialogProjectMedia-title-mediaMassEdit"
        />
        <div class="dialogProjectMedia__panelScroll dialogProjectMedia__panelScroll--massEdit">
          <DialogProjectMediaMassEditList v-model="massEditRows" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'

import { nextTick, ref, watch } from 'vue'

import DialogProjectMediaListGrid from './DialogProjectMediaListGrid.vue'
import DialogProjectMediaMassEditList from './DialogProjectMediaMassEditList.vue'
import DialogProjectMediaSingleEditPanel from './DialogProjectMediaSingleEditPanel.vue'
import DialogProjectMediaSlideTitle from './DialogProjectMediaSlideTitle.vue'

defineOptions({
  name: 'DialogProjectMediaPanelsColumn'
})

const props = withDefaults(defineProps<{
  isSingleEditSaveDisabled?: boolean
  listMediaItems?: I_faProjectMedia[]
  selectedPanel: T_faProjectMediaPanel
}>(), {
  isSingleEditSaveDisabled: true,
  listMediaItems: () => []
})

const emit = defineEmits<{
  addOnlineMedia: []
  selectListItem: [item: I_faProjectMedia]
  singleEditClose: []
  singleEditSave: []
}>()

const searchQuery = defineModel<string>('searchQuery', { required: true })
const onlineUrlsDraft = defineModel<string>('onlineUrlsDraft', { default: '' })
const massEditRows = defineModel<I_faProjectMediaMassEditRow[]>('massEditRows', {
  default: () => []
})
const singleEditRow = defineModel<I_faProjectMediaMassEditRow | null>('singleEditRow', {
  default: null
})

const listPanelKey: T_faProjectMediaPanel = 'mediaList'
const addPanelKey: T_faProjectMediaPanel = 'mediaAdd'
const addOnlineUrlsPanelKey: T_faProjectMediaPanel = 'mediaAddOnlineUrls'
const singleEditPanelKey: T_faProjectMediaPanel = 'mediaSingleEdit'
const massEditPanelKey: T_faProjectMediaPanel = 'mediaMassEdit'

const onlineUrlsInputRef = ref<{ focus: () => void } | null>(null)

function focusOnlineUrlsInput (): void {
  onlineUrlsInputRef.value?.focus()
}

function focusOnlineUrlsInputIfActivePanel (): void {
  if (props.selectedPanel !== addOnlineUrlsPanelKey) {
    return
  }
  void nextTick(focusOnlineUrlsInput)
}

watch(
  () => props.selectedPanel,
  focusOnlineUrlsInputIfActivePanel,
  { immediate: true }
)
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.panelsColumn.scoped.scss"></style>
