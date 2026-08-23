import { defineStore } from 'pinia'
import debounce from 'lodash-es/debounce.js'
import { readonly, ref } from 'vue'

import type { Ref } from 'vue'

import type { I_faProjectDocument } from 'app/types/I_faProjectDocumentDomain'
import type {
  I_faProjectHierarchyTreeDocumentChild,
  I_faProjectHierarchyTreeHeTreeNode,
  I_faProjectHierarchyTreeListPlacementChildrenInput,
  I_faProjectHierarchyTreeMoveDocumentInput,
  I_faProjectHierarchyTreeReindexDocumentSiblingsInput,
  I_faProjectHierarchyTreeSearchHit,
  I_faProjectHierarchyTreeUiState,
  I_faProjectHierarchyTreeWorkspaceWorld
} from 'app/types/I_faProjectHierarchyTreeDomain'
import { buildProjectHierarchyTreeRevealPathFromSearchHit } from 'app/src/components/projectUI/ProjectHierarchyTree/functions/projectHierarchyTreeRevealPath'
import { S_FaActiveProject } from 'app/src/stores/S_FaActiveProject'
import {
  createFaProjectHierarchyDocumentIndex,
  listFaProjectHierarchyDocumentIndexPlacementChildren,
  replaceFaProjectHierarchyDocumentIndexFromDocuments,
  upsertFaProjectHierarchyDocumentIndexDocument
} from 'app/src/stores/functions/faProjectHierarchyDocumentIndex'
import {
  applyFaProjectHierarchyDocumentIndexMove,
  applyFaProjectHierarchyDocumentIndexReindex
} from 'app/src/stores/functions/faProjectHierarchyDocumentIndexMutations'
import {
  createEmptyProjectHierarchyTreeUiState,
  faProjectHierarchyTreePersistUiStatePatchFromBridge,
  faProjectHierarchyTreeRefreshDocumentsFromBridge,
  faProjectHierarchyTreeRefreshLayoutFromBridge,
  faProjectHierarchyTreeRefreshUiStateFromBridge
} from 'app/src/stores/scripts/sFaProjectHierarchyTreeBridge'

const UI_STATE_PERSIST_DEBOUNCE_MS = 150

const documentIndexMutationDeps = {
  listPlacementChildren: listFaProjectHierarchyDocumentIndexPlacementChildren,
  upsertDocument: upsertFaProjectHierarchyDocumentIndexDocument
}

/**
 * Workspace hierarchy sidebar tree session state (layout skeleton, UI persist, search reveal).
 */
export const S_FaProjectHierarchyTree = defineStore('S_FaProjectHierarchyTree', () => {
  const worlds: Ref<I_faProjectHierarchyTreeWorkspaceWorld[]> = ref([])
  const treeData: Ref<I_faProjectHierarchyTreeHeTreeNode[]> = ref([])
  const uiState: Ref<I_faProjectHierarchyTreeUiState> = ref(createEmptyProjectHierarchyTreeUiState())
  const pendingRevealPath: Ref<string[]> = ref([])
  const pendingDocumentRefreshIds: Ref<string[]> = ref([])
  const pendingHierarchyNodeRefreshIds: Ref<string[]> = ref([])
  const searchHits: Ref<I_faProjectHierarchyTreeSearchHit[]> = ref([])

  let lastPersistedExpandedNodeIdsJson = JSON.stringify(uiState.value.expandedNodeIds)
  let lastPersistedScrollTopPx = uiState.value.scrollTopPx
  let refreshLayoutInFlight: Promise<void> | null = null
  let refreshLayoutNeedsFollowUp = false
  const layoutRefreshGeneration = ref(0)
  /**
   * Bumped when overview chart census inputs change so Project Overview can reload without
   * remount: persisted document create/delete, and Project Settings template or worlds save.
   */
  const documentCensusRefreshGeneration = ref(0)

  function bumpDocumentCensusRefreshGeneration (): void {
    documentCensusRefreshGeneration.value += 1
  }

  /**
   * Bumped when document_last_opened MRU changes (open tab) so Project Overview can refresh
   * Last opened without a full chart census reload.
   */
  const documentLastOpenedRefreshGeneration = ref(0)

  let documentIndex = createFaProjectHierarchyDocumentIndex()
  let documentIndexLoadedForProjectId: string | null = null
  let documentIndexInFlight: Promise<void> | null = null
  let documentIndexLoadGeneration = 0

  function bumpDocumentLastOpenedRefreshGeneration (): void {
    documentLastOpenedRefreshGeneration.value += 1
  }

  function clearDocumentIndex (): void {
    documentIndexLoadGeneration += 1
    documentIndex = createFaProjectHierarchyDocumentIndex()
    documentIndexLoadedForProjectId = null
    documentIndexInFlight = null
  }

  function replaceDocumentIndexFromDocuments (items: readonly I_faProjectDocument[]): void {
    documentIndex = createFaProjectHierarchyDocumentIndex()
    replaceFaProjectHierarchyDocumentIndexFromDocuments(documentIndex, items)
    documentIndexLoadedForProjectId = S_FaActiveProject().activeProject?.id ?? null
  }

  function listIndexedPlacementChildren (
    input: I_faProjectHierarchyTreeListPlacementChildrenInput
  ): I_faProjectHierarchyTreeDocumentChild[] {
    return listFaProjectHierarchyDocumentIndexPlacementChildren(documentIndex, input)
  }

  function upsertIndexedDocument (document: I_faProjectDocument): void {
    upsertFaProjectHierarchyDocumentIndexDocument(documentIndex, document)
  }

  function applyIndexedReindexBucket (
    input: I_faProjectHierarchyTreeReindexDocumentSiblingsInput
  ): void {
    applyFaProjectHierarchyDocumentIndexReindex(
      documentIndex,
      input,
      documentIndexMutationDeps
    )
  }

  function applyIndexedMove (input: I_faProjectHierarchyTreeMoveDocumentInput): void {
    applyFaProjectHierarchyDocumentIndexMove(
      documentIndex,
      input,
      documentIndexMutationDeps
    )
  }

  async function loadDocumentIndexForProject (
    projectId: string,
    loadGeneration: number
  ): Promise<void> {
    const items = await faProjectHierarchyTreeRefreshDocumentsFromBridge()
    if (loadGeneration !== documentIndexLoadGeneration) {
      return
    }
    if (S_FaActiveProject().activeProject?.id !== projectId) {
      return
    }
    if (items === null) {
      if (
        loadGeneration === documentIndexLoadGeneration &&
        S_FaActiveProject().activeProject?.id === projectId
      ) {
        documentIndexLoadedForProjectId = projectId
      }
      return
    }
    replaceDocumentIndexFromDocuments(items)
  }

  async function ensureDocumentIndexLoaded (options?: { forceReload?: boolean }): Promise<void> {
    const projectId = S_FaActiveProject().activeProject?.id ?? null
    if (projectId === null) {
      clearDocumentIndex()
      return
    }
    const forceReload = options?.forceReload === true
    if (!forceReload && documentIndexLoadedForProjectId === projectId) {
      return
    }
    if (documentIndexInFlight !== null) {
      await documentIndexInFlight
      return await ensureDocumentIndexLoaded(options)
    }
    const loadGeneration = ++documentIndexLoadGeneration
    const pending = loadDocumentIndexForProject(projectId, loadGeneration)
    documentIndexInFlight = pending
    try {
      await pending
    } finally {
      if (documentIndexInFlight === pending) {
        documentIndexInFlight = null
      }
    }
  }

  async function reloadDocumentIndexFromBridge (): Promise<void> {
    await ensureDocumentIndexLoaded({
      forceReload: true
    })
  }

  function applyUiState (next: I_faProjectHierarchyTreeUiState): void {
    uiState.value = {
      expandedNodeIds: [...next.expandedNodeIds],
      schemaVersion: next.schemaVersion,
      scrollTopPx: next.scrollTopPx
    }
    lastPersistedExpandedNodeIdsJson = JSON.stringify(next.expandedNodeIds)
    lastPersistedScrollTopPx = next.scrollTopPx
  }

  function resetOnProjectClose (): void {
    worlds.value = []
    treeData.value = []
    searchHits.value = []
    pendingRevealPath.value = []
    pendingDocumentRefreshIds.value = []
    pendingHierarchyNodeRefreshIds.value = []
    applyUiState(createEmptyProjectHierarchyTreeUiState())
    clearDocumentIndex()
  }

  async function applyLayoutFromBridge (): Promise<void> {
    const layout = await faProjectHierarchyTreeRefreshLayoutFromBridge()
    if (layout === null) {
      return
    }
    worlds.value = layout.worlds
    if (layout.worlds.length === 0) {
      treeData.value = []
    }
    layoutRefreshGeneration.value += 1
  }

  async function refreshLayout (): Promise<void> {
    if (!S_FaActiveProject().hasActiveProject) {
      resetOnProjectClose()
      return
    }
    if (refreshLayoutInFlight !== null) {
      refreshLayoutNeedsFollowUp = true
      await refreshLayoutInFlight
      if (refreshLayoutNeedsFollowUp) {
        refreshLayoutNeedsFollowUp = false
        await refreshLayout()
      }
      return
    }
    refreshLayoutInFlight = applyLayoutFromBridge()
    await refreshLayoutInFlight.finally(() => {
      refreshLayoutInFlight = null
    })
  }

  async function refreshUiState (): Promise<void> {
    if (!S_FaActiveProject().hasActiveProject) {
      applyUiState(createEmptyProjectHierarchyTreeUiState())
      return
    }
    await faProjectHierarchyTreeRefreshUiStateFromBridge({
      applyUiState
    })
  }

  async function persistUiStatePatchNow (
    patch: Partial<Pick<I_faProjectHierarchyTreeUiState, 'expandedNodeIds' | 'scrollTopPx'>>
  ): Promise<void> {
    if (!S_FaActiveProject().hasActiveProject) {
      return
    }
    const nextExpanded = patch.expandedNodeIds ?? uiState.value.expandedNodeIds
    const plainExpandedNodeIds = [...nextExpanded]
    const nextScrollTop = patch.scrollTopPx ?? uiState.value.scrollTopPx
    const expandedJson = JSON.stringify(plainExpandedNodeIds)
    if (expandedJson === lastPersistedExpandedNodeIdsJson && nextScrollTop === lastPersistedScrollTopPx) {
      return
    }
    const bridgePayload = {
      expandedNodeIds: plainExpandedNodeIds,
      scrollTopPx: nextScrollTop
    }
    const wrote = await faProjectHierarchyTreePersistUiStatePatchFromBridge(bridgePayload)
    if (!wrote) {
      return
    }
    uiState.value = {
      expandedNodeIds: plainExpandedNodeIds,
      schemaVersion: 1,
      scrollTopPx: nextScrollTop
    }
    lastPersistedExpandedNodeIdsJson = expandedJson
    lastPersistedScrollTopPx = nextScrollTop
  }

  const schedulePersistUiStatePatch = debounce(
    (patch: Partial<Pick<I_faProjectHierarchyTreeUiState, 'expandedNodeIds' | 'scrollTopPx'>>) => {
      void persistUiStatePatchNow(patch)
    },
    UI_STATE_PERSIST_DEBOUNCE_MS
  )

  function queuePersistExpandedNodeIds (expandedNodeIds: string[]): void {
    uiState.value = {
      ...uiState.value,
      expandedNodeIds: [...expandedNodeIds]
    }
    schedulePersistUiStatePatch({
      expandedNodeIds
    })
  }

  function queuePersistScrollTopPx (scrollTopPx: number): void {
    uiState.value = {
      ...uiState.value,
      scrollTopPx
    }
    schedulePersistUiStatePatch({
      scrollTopPx
    })
  }

  function flushUiStatePersist (): void {
    schedulePersistUiStatePatch.flush()
  }

  function setSearchHits (hits: I_faProjectHierarchyTreeSearchHit[]): void {
    searchHits.value = hits
  }

  function requestRevealSearchHit (hit: I_faProjectHierarchyTreeSearchHit): void {
    pendingRevealPath.value = buildProjectHierarchyTreeRevealPathFromSearchHit(hit, worlds.value)
  }

  function clearPendingRevealPath (): void {
    pendingRevealPath.value = []
  }

  function clearSearch (): void {
    searchHits.value = []
    pendingRevealPath.value = []
  }

  function clearPendingDocumentRefreshIds (): void {
    pendingDocumentRefreshIds.value = []
  }

  function clearPendingHierarchyNodeRefreshIds (): void {
    pendingHierarchyNodeRefreshIds.value = []
  }

  function refreshDocumentsInTree (documentIds: string[]): void {
    if (!S_FaActiveProject().hasActiveProject || documentIds.length === 0) {
      return
    }
    pendingDocumentRefreshIds.value = [
      ...new Set([...pendingDocumentRefreshIds.value, ...documentIds])
    ]
  }

  function refreshHierarchyTreeNodes (nodeIds: string[]): void {
    if (!S_FaActiveProject().hasActiveProject || nodeIds.length === 0) {
      return
    }
    pendingHierarchyNodeRefreshIds.value = [
      ...new Set([...pendingHierarchyNodeRefreshIds.value, ...nodeIds])
    ]
  }

  function patchWorldColorPaletteInLayout (worldId: string, colorPalette: string): void {
    worlds.value = worlds.value.map((world) => {
      if (world.id !== worldId) {
        return world
      }
      return {
        ...world,
        colorPalette
      }
    })
  }

  const applyIndexedMoveOut = applyIndexedMove
  const applyIndexedReindexBucketOut = applyIndexedReindexBucket
  const clearPendingDocumentRefreshIdsOut = clearPendingDocumentRefreshIds
  const clearPendingHierarchyNodeRefreshIdsOut = clearPendingHierarchyNodeRefreshIds
  const clearPendingRevealPathOut = clearPendingRevealPath
  const clearSearchOut = clearSearch
  const bumpDocumentCensusRefreshGenerationOut = bumpDocumentCensusRefreshGeneration
  const bumpDocumentLastOpenedRefreshGenerationOut = bumpDocumentLastOpenedRefreshGeneration
  const documentCensusRefreshGenerationOut = documentCensusRefreshGeneration
  const documentLastOpenedRefreshGenerationOut = documentLastOpenedRefreshGeneration
  const ensureDocumentIndexLoadedOut = ensureDocumentIndexLoaded
  const flushUiStatePersistOut = flushUiStatePersist
  const layoutRefreshGenerationOut = layoutRefreshGeneration
  const listIndexedPlacementChildrenOut = listIndexedPlacementChildren
  const patchWorldColorPaletteInLayoutOut = patchWorldColorPaletteInLayout
  const pendingDocumentRefreshIdsOut = pendingDocumentRefreshIds
  const pendingHierarchyNodeRefreshIdsOut = pendingHierarchyNodeRefreshIds
  const pendingRevealPathOut = pendingRevealPath
  const queuePersistExpandedNodeIdsOut = queuePersistExpandedNodeIds
  const queuePersistScrollTopPxOut = queuePersistScrollTopPx
  const refreshDocumentsInTreeOut = refreshDocumentsInTree
  const refreshHierarchyTreeNodesOut = refreshHierarchyTreeNodes
  const refreshLayoutOut = refreshLayout
  const refreshUiStateOut = refreshUiState
  const reloadDocumentIndexFromBridgeOut = reloadDocumentIndexFromBridge
  const replaceDocumentIndexFromDocumentsOut = replaceDocumentIndexFromDocuments
  const requestRevealSearchHitOut = requestRevealSearchHit
  const resetOnProjectCloseOut = resetOnProjectClose
  const searchHitsOut = searchHits
  const setSearchHitsOut = setSearchHits
  /**
   * Component-testing only: replace hierarchy session without bridge hydrate.
   */
  function replaceSessionForComponentTesting (input: {
    treeData?: I_faProjectHierarchyTreeHeTreeNode[] | undefined
    uiState?: I_faProjectHierarchyTreeUiState | undefined
    worlds: I_faProjectHierarchyTreeWorkspaceWorld[]
  }): void {
    worlds.value = input.worlds
    if (input.treeData !== undefined) {
      treeData.value = input.treeData
    }
    if (input.uiState !== undefined) {
      applyUiState(input.uiState)
    }
    layoutRefreshGeneration.value += 1
    clearDocumentIndex()
  }

  const treeDataOut = treeData
  const uiStateOut = uiState
  const upsertIndexedDocumentOut = upsertIndexedDocument
  const worldsOut = worlds
  const replaceSessionForComponentTestingOut = replaceSessionForComponentTesting

  return {
    applyIndexedMove: applyIndexedMoveOut,
    applyIndexedReindexBucket: applyIndexedReindexBucketOut,
    bumpDocumentCensusRefreshGeneration: bumpDocumentCensusRefreshGenerationOut,
    bumpDocumentLastOpenedRefreshGeneration: bumpDocumentLastOpenedRefreshGenerationOut,
    clearPendingDocumentRefreshIds: clearPendingDocumentRefreshIdsOut,
    clearPendingHierarchyNodeRefreshIds: clearPendingHierarchyNodeRefreshIdsOut,
    clearPendingRevealPath: clearPendingRevealPathOut,
    clearSearch: clearSearchOut,
    documentCensusRefreshGeneration: readonly(documentCensusRefreshGenerationOut),
    documentLastOpenedRefreshGeneration: readonly(documentLastOpenedRefreshGenerationOut),
    ensureDocumentIndexLoaded: ensureDocumentIndexLoadedOut,
    flushUiStatePersist: flushUiStatePersistOut,
    layoutRefreshGeneration: readonly(layoutRefreshGenerationOut),
    listIndexedPlacementChildren: listIndexedPlacementChildrenOut,
    patchWorldColorPaletteInLayout: patchWorldColorPaletteInLayoutOut,
    pendingDocumentRefreshIds: pendingDocumentRefreshIdsOut,
    pendingHierarchyNodeRefreshIds: pendingHierarchyNodeRefreshIdsOut,
    pendingRevealPath: pendingRevealPathOut,
    queuePersistExpandedNodeIds: queuePersistExpandedNodeIdsOut,
    queuePersistScrollTopPx: queuePersistScrollTopPxOut,
    refreshDocumentsInTree: refreshDocumentsInTreeOut,
    refreshHierarchyTreeNodes: refreshHierarchyTreeNodesOut,
    refreshLayout: refreshLayoutOut,
    refreshUiState: refreshUiStateOut,
    reloadDocumentIndexFromBridge: reloadDocumentIndexFromBridgeOut,
    replaceDocumentIndexFromDocuments: replaceDocumentIndexFromDocumentsOut,
    replaceSessionForComponentTesting: replaceSessionForComponentTestingOut,
    requestRevealSearchHit: requestRevealSearchHitOut,
    resetOnProjectClose: resetOnProjectCloseOut,
    searchHits: readonly(searchHitsOut),
    setSearchHits: setSearchHitsOut,
    treeData: treeDataOut,
    uiState: readonly(uiStateOut),
    upsertIndexedDocument: upsertIndexedDocumentOut,
    worlds: readonly(worldsOut)
  }
})
