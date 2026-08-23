import type {
  I_faProjectHierarchyTreeDocumentChild,
  I_faProjectHierarchyTreeListPlacementChildrenInput,
  I_faProjectHierarchyTreeReindexDocumentSiblingsInput
} from 'app/types/I_faProjectHierarchyTreeDomain'
import { getActivePinia } from 'pinia'

import { S_FaProjectHierarchyTree } from 'app/src/stores/S_FaProjectHierarchyTree'
import { getFaComponentTestingProjectContentOverrides } from './faComponentTestingProjectContentOverridesWiring'
import {
  buildFaComponentTestingPlacementDocumentChildrenKey,
  reindexFaComponentTestingPlacementDocumentChildren
} from './functions/faComponentTestingPlacementDocumentChildren'

/**
 * Active hierarchy tree store, or null when Pinia is not installed (some unit tests).
 */
export function tryGetFaProjectHierarchyTreeStoreForRenderer ():
ReturnType<typeof S_FaProjectHierarchyTree> | null {
  if (getActivePinia() === undefined) {
    return null
  }
  return S_FaProjectHierarchyTree()
}

/**
 * Lists placement document children from overrides when present, else the session document index.
 */
export async function listFaProjectPlacementDocumentChildrenForRenderer (
  input: I_faProjectHierarchyTreeListPlacementChildrenInput
): Promise<{ items: I_faProjectHierarchyTreeDocumentChild[] }> {
  const overridesMap = getFaComponentTestingProjectContentOverrides()?.placementDocumentChildrenByKey
  if (overridesMap !== undefined) {
    const key = buildFaComponentTestingPlacementDocumentChildrenKey(
      input.placementId,
      input.parentDocumentId ?? null
    )
    const items = overridesMap[key]
    if (items !== undefined) {
      return {
        items: [...items]
      }
    }
    return {
      items: []
    }
  }
  const store = tryGetFaProjectHierarchyTreeStoreForRenderer()
  if (store === null) {
    return {
      items: []
    }
  }
  await store.ensureDocumentIndexLoaded()
  return {
    items: store.listIndexedPlacementChildren(input)
  }
}

/**
 * Reindexes sibling document order in overrides when present, else bridge.
 */
export async function reindexFaProjectDocumentSiblingsForRenderer (
  input: I_faProjectHierarchyTreeReindexDocumentSiblingsInput
): Promise<unknown> {
  const overridesMap = getFaComponentTestingProjectContentOverrides()?.placementDocumentChildrenByKey
  if (overridesMap !== undefined) {
    const key = buildFaComponentTestingPlacementDocumentChildrenKey(
      input.placementId,
      input.parentDocumentId ?? null
    )
    const current = overridesMap[key] ?? []
    overridesMap[key] = reindexFaComponentTestingPlacementDocumentChildren(
      current,
      input.orderedDocumentIds
    )
    return true
  }
  const api = window.faContentBridgeAPIs?.projectContent
  if (typeof api?.reindexDocumentSiblingsInHierarchy !== 'function') {
    throw new Error('projectContent.reindexDocumentSiblingsInHierarchy unavailable')
  }
  const result = await api.reindexDocumentSiblingsInHierarchy(input)
  tryGetFaProjectHierarchyTreeStoreForRenderer()?.applyIndexedReindexBucket(input)
  return result
}
