<template>
  <q-menu
    class="projectHierarchyTreeNodeContextMenu"
    context-menu
    dark
    data-test-locator="dialogQuickSearchDocument-optionContextMenu"
  >
    <q-list
      class="projectHierarchyTreeNodeContextMenu__list"
      role="menu"
    >
      <ProjectHierarchyTreeNodeContextMenuCopyRows
        :copy-background-color-label="$t('projectUI.projectAppControlBar.copyBackgroundColor')"
        :copy-name-label="$t('projectUI.projectAppControlBar.copyName')"
        :copy-text-color-label="$t('projectUI.projectAppControlBar.copyTextColor')"
        :on-copy-background-color-click="() => onCopyBackgroundColor(documentId)"
        :on-copy-name-click="() => onCopyName(documentId)"
        :on-copy-text-color-click="() => onCopyTextColor(documentId)"
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
        :on-add-new-document-under-this-click="() => onAddUnder(documentId)"
        :on-copy-document-click="() => onCopyDocument(documentId)"
        :on-edit-document-click="() => onEdit(documentId)"
        :on-open-document-click="() => onOpen(documentId)"
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
        :on-delete-document-click="() => onDelete(documentId)"
      />
    </q-list>
  </q-menu>
</template>

<script lang="ts" setup>
import ProjectHierarchyTreeNodeContextMenuCopyRows from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuCopyRows.vue'
import ProjectHierarchyTreeNodeContextMenuDeleteRow from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDeleteRow.vue'
import ProjectHierarchyTreeNodeContextMenuDocumentRows from 'app/src/components/projectUI/ProjectHierarchyTree/ProjectHierarchyTreeNodeContextMenuDocumentRows.vue'

/** Same hierarchy document context rows as ProjectOverview Last opened. */
defineOptions({
  name: 'DialogQuickSearchDocumentOptionContextMenu'
})

defineProps<{
  documentId: string
  onAddUnder: (documentId: string) => void
  onCopyBackgroundColor: (documentId: string) => void
  onCopyDocument: (documentId: string) => void
  onCopyName: (documentId: string) => void
  onCopyTextColor: (documentId: string) => void
  onDelete: (documentId: string) => void
  onEdit: (documentId: string) => void
  onOpen: (documentId: string) => void
}>()
</script>

<style lang="scss" src="../../projectUI/ProjectHierarchyTree/styles/ProjectHierarchyTreeNodeContextMenu.unscoped.scss"></style>
