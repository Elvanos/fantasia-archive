<template>
  <div
    class="projectOverview__lastOpened"
    data-test-locator="projectOverview-lastOpened"
  >
    <q-card
      class="projectOverview__lastOpenedCard text-white"
      dark
    >
      <q-card-section>
        <h5
          class="projectOverview__lastOpenedTitle"
          data-test-locator="projectOverview-lastOpenedTitle"
        >
          {{ $t('projectUI.projectOverview.lastOpenedTitle') }}
        </h5>

        <q-list class="projectOverview__lastOpenedInner hasScrollbar">
          <div
            v-for="(item, index) in items"
            :key="item.documentId"
            class="projectOverview__lastOpenedItem"
          >
            <q-separator
              v-if="index > 0"
              class="projectOverview__lastOpenedSeparatorAlt"
            />
            <q-item
              v-ripple
              class="projectOverview__lastOpenedRow"
              clickable
              :data-test-locator="`projectOverview-lastOpenedItem-${item.documentId}`"
              :style="resolveItemChromeStyle(item)"
              @auxclick="onRowAuxClick(item.documentId, $event)"
              @click="onRowClick(item.documentId)"
            >
              <q-item-section
                avatar
                class="projectOverview__lastOpenedAvatar"
              >
                <q-icon
                  class="projectOverview__lastOpenedIcon fa-color-glyph"
                  :name="resolveProjectOverviewLastOpenedIconName(item)"
                />
              </q-item-section>
              <q-item-section>
                <span class="text-weight-medium">
                  <span
                    v-if="item.isDead"
                    class="projectOverview__lastOpenedDeadMarker"
                  >†</span>
                  <span
                    :class="{
                      'projectOverview__lastOpenedLabel--dead': item.isDead
                    }"
                  >{{ item.displayName }}</span>
                </span>
              </q-item-section>
              <q-item-section
                v-if="showWorldIndicators"
                side
              >
                <ProjectAppControlBarTabWorldIndicator
                  :color="resolveWorldIndicatorColor(item)"
                  :document-id="item.documentId"
                  indicator-class="projectOverview__lastOpenedWorldIndicator fa-color-glyph"
                  :visible="showWorldIndicators"
                />
              </q-item-section>

              <q-menu
                class="projectHierarchyTreeNodeContextMenu"
                context-menu
                dark
              >
                <q-list
                  class="projectHierarchyTreeNodeContextMenu__list"
                  role="menu"
                >
                  <ProjectHierarchyTreeNodeContextMenuCopyRows
                    :copy-background-color-label="$t('projectUI.projectAppControlBar.copyBackgroundColor')"
                    :copy-name-label="$t('projectUI.projectAppControlBar.copyName')"
                    :copy-text-color-label="$t('projectUI.projectAppControlBar.copyTextColor')"
                    :on-copy-background-color-click="() => onContextCopyBackgroundColor(item.documentId)"
                    :on-copy-name-click="() => onContextCopyName(item.documentId)"
                    :on-copy-text-color-click="() => onContextCopyTextColor(item.documentId)"
                  />
                  <q-separator
                    class="projectHierarchyTreeNodeContextMenu__separator"
                    dark
                    role="separator"
                  />
                  <ProjectHierarchyTreeNodeContextMenuDocumentRows
                    :add-new-document-under-this-label="$t('projectUI.projectHierarchyTree.contextMenu.addNewDocumentUnderThis')"
                    :copy-document-label="$t('projectUI.projectHierarchyTree.contextMenu.copyDocument')"
                    :edit-document-label="$t('projectUI.projectHierarchyTree.contextMenu.editDocument')"
                    :on-add-new-document-under-this-click="() => onContextAddUnder(item.documentId)"
                    :on-copy-document-click="() => onContextCopyDocument(item.documentId)"
                    :on-edit-document-click="() => onContextEdit(item.documentId)"
                    :on-open-document-click="() => onContextOpen(item.documentId)"
                    :open-document-label="$t('projectUI.projectHierarchyTree.contextMenu.openDocument')"
                    :shows-add-under="true"
                  />
                  <q-separator
                    class="projectHierarchyTreeNodeContextMenu__separator"
                    dark
                    role="separator"
                  />
                  <ProjectHierarchyTreeNodeContextMenuDeleteRow
                    :delete-document-label="$t('projectUI.projectHierarchyTree.contextMenu.deleteDocument')"
                    :on-delete-document-click="() => onContextDelete(item.documentId)"
                  />
                </q-list>
              </q-menu>
            </q-item>
          </div>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'

import type { I_faProjectDocumentLastOpenedItem } from 'app/types/I_faProjectDocumentLastOpenedDomain'

import ProjectAppControlBarTabWorldIndicator from 'app/src/components/projectUI/ProjectAppControlBar/ProjectAppControlBarTabWorldIndicator.vue'
import ProjectHierarchyTreeNodeContextMenuCopyRows from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuCopyRows.vue'
import ProjectHierarchyTreeNodeContextMenuDeleteRow from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDeleteRow.vue'
import ProjectHierarchyTreeNodeContextMenuDocumentRows from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDocumentRows.vue'

import { resolveProjectOverviewLastOpenedIconName } from './scripts/projectOverview_manager'

defineOptions({
  name: 'ProjectOverviewLastOpenedList'
})

defineProps<{
  items: I_faProjectDocumentLastOpenedItem[]
  onContextAddUnder: (documentId: string) => void
  onContextCopyBackgroundColor: (documentId: string) => void
  onContextCopyDocument: (documentId: string) => void
  onContextCopyName: (documentId: string) => void
  onContextCopyTextColor: (documentId: string) => void
  onContextDelete: (documentId: string) => void
  onContextEdit: (documentId: string) => void
  onContextOpen: (documentId: string) => void
  onRowAuxClick: (documentId: string, event: MouseEvent) => void
  onRowClick: (documentId: string) => void
  resolveItemChromeStyle: (
    item: I_faProjectDocumentLastOpenedItem
  ) => CSSProperties | undefined
  resolveWorldIndicatorColor: (item: I_faProjectDocumentLastOpenedItem) => string | null
  showWorldIndicators: boolean
}>()
</script>

<style lang="scss" src="../ProjectHierarchyTree/styles/ProjectHierarchyTreeNodeContextMenu.unscoped.scss"></style>
