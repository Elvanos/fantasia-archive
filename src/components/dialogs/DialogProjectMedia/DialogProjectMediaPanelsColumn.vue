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
        <!-- Media list: title + search -->
        <div class="dialogProjectMedia__listPanel hasScrollbar">
          <div class="dialogProjectMedia__listHeader">
            <h5
              class="dialogProjectMedia__panelTitle text-center text-h6"
              data-test-locator="dialogProjectMedia-panelTitle-mediaList"
            >
              {{ $t('dialogs.projectMedia.panelMediaList') }}
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
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="addPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <!-- Media addition drop zone -->
        <div
          v-if="props.addSubView === dropZoneSubViewKey"
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
        <!-- Media addition online URLs -->
        <div
          v-if="props.addSubView === onlineUrlsSubViewKey"
          class="dialogProjectMedia__addOnlineUrls"
          data-test-locator="dialogProjectMedia-addOnlineUrls"
        >
          <div class="dialogProjectMedia__addOnlineUrlsStack">
            <p
              class="dialogProjectMedia__addOnlineUrlsTitle text-center"
              data-test-locator="dialogProjectMedia-addOnlineUrlsTitle"
            >
              {{ $t('dialogs.projectMedia.addOnlineUrlsTitle') }}
            </p>
            <q-input
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
            <q-btn
              class="dialogProjectMedia__addOnlineUrlsSubmit"
              color="primary-bright"
              data-test-locator="dialogProjectMedia-addOnlineUrlsSubmit"
              :label="$t('dialogs.projectMedia.addOnlineUrlsSubmitButton')"
              outline
              unelevated
              @click="emit('submitOnlineUrls')"
            />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="singleEditPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <div class="dialogProjectMedia__panelScroll hasScrollbar">
          <h5
            class="dialogProjectMedia__panelTitle text-center text-h6"
            data-test-locator="dialogProjectMedia-panelTitle-mediaSingleEdit"
          >
            {{ $t('dialogs.projectMedia.panelSingleMediumEdit') }}
          </h5>
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="massEditPanelKey"
        class="dialogProjectMedia__tabPanel q-pa-none"
      >
        <div class="dialogProjectMedia__panelScroll hasScrollbar">
          <DialogProjectMediaMassEditTable v-model="massEditRows" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import type {
  I_faProjectMediaMassEditRow,
  T_faProjectMediaAddSubView,
  T_faProjectMediaPanel
} from 'app/types/I_faProjectMediaDomain'

import DialogProjectMediaMassEditTable from './DialogProjectMediaMassEditTable.vue'

defineOptions({
  name: 'DialogProjectMediaPanelsColumn'
})

const props = withDefaults(defineProps<{
  selectedPanel: T_faProjectMediaPanel
  addSubView?: T_faProjectMediaAddSubView
}>(), {
  addSubView: 'dropZone'
})

const emit = defineEmits<{
  addOnlineMedia: []
  submitOnlineUrls: []
}>()

const searchQuery = defineModel<string>('searchQuery', { required: true })
const onlineUrlsDraft = defineModel<string>('onlineUrlsDraft', { default: '' })
const massEditRows = defineModel<I_faProjectMediaMassEditRow[]>('massEditRows', {
  default: () => []
})

const listPanelKey: T_faProjectMediaPanel = 'mediaList'
const addPanelKey: T_faProjectMediaPanel = 'mediaAdd'
const singleEditPanelKey: T_faProjectMediaPanel = 'mediaSingleEdit'
const massEditPanelKey: T_faProjectMediaPanel = 'mediaMassEdit'
const dropZoneSubViewKey: T_faProjectMediaAddSubView = 'dropZone'
const onlineUrlsSubViewKey: T_faProjectMediaAddSubView = 'onlineUrls'
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.panelsColumn.scoped.scss"></style>
