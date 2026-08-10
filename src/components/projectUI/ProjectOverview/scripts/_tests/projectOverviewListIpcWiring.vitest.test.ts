import { beforeEach, expect, test, vi } from 'vitest'

import { listProjectOverviewDocumentDistribution } from '../projectOverviewListDistributionWiring'
import { listProjectOverviewDocumentLastOpened } from '../projectOverviewListLastOpenedWiring'

beforeEach(() => {
  vi.restoreAllMocks()
  delete window.__faComponentTestingProjectOverviewLists
})

/**
 * listProjectOverviewDocumentDistribution
 * Returns empty distribution when the bridge API is missing.
 */
test('Test that listProjectOverviewDocumentDistribution returns empty without bridge API', async () => {
  window.faContentBridgeAPIs = undefined as unknown as typeof window.faContentBridgeAPIs
  await expect(listProjectOverviewDocumentDistribution()).resolves.toEqual({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  })
})

/**
 * listProjectOverviewDocumentDistribution
 * Component Playwright probe bypasses frozen contextBridge list methods.
 */
test('Test that listProjectOverviewDocumentDistribution prefers component testing probe', async () => {
  const probeDistribution = {
    counts: [],
    templates: [],
    documentTemplateTotalCount: 1,
    totalDocumentCount: 4,
    worlds: []
  }
  window.__faComponentTestingProjectOverviewLists = {
    distribution: probeDistribution
  }
  const listDocumentDistribution = vi.fn(async () => ({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 0,
    worlds: []
  }))
  window.faContentBridgeAPIs = {
    projectContent: { listDocumentDistribution }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(listProjectOverviewDocumentDistribution()).resolves.toEqual(probeDistribution)
  expect(listDocumentDistribution).not.toHaveBeenCalled()
})

/**
 * listProjectOverviewDocumentDistribution
 * Forwards to projectContent.listDocumentDistribution when available.
 */
test('Test that listProjectOverviewDocumentDistribution calls bridge API', async () => {
  const listDocumentDistribution = vi.fn(async () => ({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 3,
    worlds: []
  }))
  window.faContentBridgeAPIs = {
    projectContent: { listDocumentDistribution }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(listProjectOverviewDocumentDistribution()).resolves.toEqual({
    counts: [],
    templates: [],
    documentTemplateTotalCount: 0,
    totalDocumentCount: 3,
    worlds: []
  })
  expect(listDocumentDistribution).toHaveBeenCalledTimes(1)
})

/**
 * listProjectOverviewDocumentLastOpened
 * Returns empty items when the bridge API is missing.
 */
test('Test that listProjectOverviewDocumentLastOpened returns empty without bridge API', async () => {
  window.faContentBridgeAPIs = {
    projectContent: {}
  } as unknown as typeof window.faContentBridgeAPIs
  await expect(listProjectOverviewDocumentLastOpened()).resolves.toEqual({ items: [] })
})

/**
 * listProjectOverviewDocumentLastOpened
 * Component Playwright probe bypasses frozen contextBridge list methods.
 */
test('Test that listProjectOverviewDocumentLastOpened prefers component testing probe', async () => {
  const probeItems = [{
    displayName: 'Hero',
    documentBackgroundColor: null,
    documentId: 'doc-probe',
    documentTextColor: null,
    isCategory: false,
    isDead: false,
    openedAtMs: 1,
    templateIcon: 'mdi-account',
    templateId: 't1',
    worldId: 'w1'
  }]
  window.__faComponentTestingProjectOverviewLists = {
    lastOpened: { items: probeItems }
  }
  const listDocumentLastOpened = vi.fn(async () => ({ items: [] }))
  window.faContentBridgeAPIs = {
    projectContent: { listDocumentLastOpened }
  } as unknown as typeof window.faContentBridgeAPIs

  await expect(listProjectOverviewDocumentLastOpened()).resolves.toEqual({ items: probeItems })
  expect(listDocumentLastOpened).not.toHaveBeenCalled()
})

/**
 * listProjectOverviewDocumentLastOpened
 * Forwards to projectContent.listDocumentLastOpened when available.
 */
test('Test that listProjectOverviewDocumentLastOpened calls bridge API', async () => {
  const listDocumentLastOpened = vi.fn(async () => ({
    items: [{
      displayName: 'Hero',
      documentBackgroundColor: null,
      documentId: 'doc-1',
      documentTextColor: null,
      isCategory: false,
      isDead: false,
      openedAtMs: 1,
      templateIcon: 'mdi-account',
      templateId: 't1',
      worldId: 'w1'
    }]
  }))
  window.faContentBridgeAPIs = {
    projectContent: { listDocumentLastOpened }
  } as unknown as typeof window.faContentBridgeAPIs

  const result = await listProjectOverviewDocumentLastOpened()
  expect(result.items).toHaveLength(1)
  expect(listDocumentLastOpened).toHaveBeenCalledTimes(1)
})
