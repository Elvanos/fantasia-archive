/** @vitest-environment jsdom */
import { expect, test, vi } from 'vitest'
import { ref, watch } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import { mapWorkspaceLayoutToHierarchyTreeSkeleton } from '../projectHierarchyTreeSyncMapperWiring'
import { findProjectHierarchyTreeNodeById } from '../../functions/projectHierarchyTreeExpandState'
import { createProjectHierarchyTreeLazyLoadSessionWiring } from '../projectHierarchyTreeLazyLoadSessionWiring'
import { S_FaActiveProject } from 'app/src/stores/S_FaActiveProject'
import { S_FaProjectHierarchyTree } from 'app/src/stores/S_FaProjectHierarchyTree'

const sampleWorld = {
  color: '#ff0000',
  colorPalette: '',
  displayName: 'World A',
  groups: [
    {
      displayName: 'Group 1',
      hasChildren: true,
      id: 'group-1',
      rootSortOrder: 0,
      worldId: 'world-1'
    }
  ],
  id: 'world-1',
  placements: [
    {
      displayName: 'Buildings',
      documentTemplateId: 'template-1',
      groupId: 'group-1',
      groupSortOrder: 0,
      hasChildren: true,
      icon: 'mdi-home',
      id: 'placement-1',
      nickname: '',
      titlePluralTranslations: {},
      titleSingularTranslations: {},
      rootSortOrder: null,
      worldId: 'world-1'
    }
  ],
  sortOrder: 0
}

test('Test that lazy load session skips reapply while deferred publish flag is set', async () => {
  setActivePinia(createPinia())
  S_FaActiveProject().setActiveProject({
    filePath: 'C:\\a.faproject',
    id: 'project-id',
    name: 'N'
  })
  S_FaProjectHierarchyTree().replaceDocumentIndexFromDocuments([
    {
      createdAtMs: 1,
      displayName: 'Doc A',
      documentBackgroundColor: null,
      documentTextColor: null,
      extraClasses: '',
      id: 'doc-a',
      isCategory: false,
      isDead: false,
      isFinished: false,
      isMinor: false,
      parentDocumentId: null,
      placementId: 'placement-1',
      sortOrder: 0,
      templateId: 'template-1',
      treeOrderNumber: 1,
      updatedAtMs: 1,
      worldId: 'world-1'
    }
  ])
  window.faContentBridgeAPIs = {
    projectContent: {
      listPlacementDocumentChildren: vi.fn(async () => ({ items: [] }))
    }
  } as never
  const deferLazyLoadTreeRevisionPublish = ref(false)
  const treeData = ref(mapWorkspaceLayoutToHierarchyTreeSkeleton([sampleWorld]))
  const wiring = createProjectHierarchyTreeLazyLoadSessionWiring({
    deferLazyLoadTreeRevisionPublish,
    dragCommitPending: ref(false),
    dragExpandUiFrozen: ref(false),
    flushUiStatePersist: vi.fn(),
    getExpandedNodeIds: () => [],
    getForceSublevelCollapseInTree: () => false,
    getPendingRevealPath: () => [],
    getPreferredLanguageCode: () => 'en-US',
    getScrollTopPx: () => 0,
    getTreeRef: () => null,
    getTreeScrollHost: () => null,
    getWorlds: () => [sampleWorld],
    hierarchyStore: {
      flushUiStatePersist: vi.fn(),
      queuePersistExpandedNodeIds: vi.fn(),
      queuePersistScrollTopPx: vi.fn()
    },
    isTreeDragActive: ref(false),
    nextTick: async () => undefined,
    openNodeIds: ref(new Set()),
    pendingRevealPath: ref([]),
    requestAnimationFrame: (callback) => {
      callback()
      return 0
    },
    suppressTreeEmit: ref(false),
    treeData,
    watch
  })
  const reapplySpy = vi.spyOn(wiring.uiStateWiring, 'reapplyHeTreeOpenState')
  const placement = findProjectHierarchyTreeNodeById(treeData.value, 'placement-1')!
  await wiring.runDeferredLazyLoadBatch(async () => {
    await wiring.lazyLoadWiring.loadChildrenForNode(placement)
  }, {
    skipReapplyHeTreeOpenState: true
  })
  expect(findProjectHierarchyTreeNodeById(treeData.value, 'doc-a')?.id).toBe('doc-a')
  expect(reapplySpy).not.toHaveBeenCalled()
})
