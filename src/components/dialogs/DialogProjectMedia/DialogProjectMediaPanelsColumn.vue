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
          <h5
            class="dialogProjectMedia__panelTitle text-center text-h6"
            data-test-locator="dialogProjectMedia-panelTitle-mediaMassEdit"
          >
            {{ $t('dialogs.projectMedia.panelMassMediumEdit') }}
          </h5>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import type { T_faProjectMediaPanel } from 'app/types/I_faProjectMediaDomain'

defineOptions({
  name: 'DialogProjectMediaPanelsColumn'
})

const props = defineProps<{
  selectedPanel: T_faProjectMediaPanel
}>()

const searchQuery = defineModel<string>('searchQuery', { required: true })

const listPanelKey: T_faProjectMediaPanel = 'mediaList'
const addPanelKey: T_faProjectMediaPanel = 'mediaAdd'
const singleEditPanelKey: T_faProjectMediaPanel = 'mediaSingleEdit'
const massEditPanelKey: T_faProjectMediaPanel = 'mediaMassEdit'
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.panelsColumn.scoped.scss"></style>
