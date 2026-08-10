import type { Page } from 'playwright'

import type { I_faProjectDocument } from 'app/types/I_faProjectDocumentDomain'
import type { I_faProjectHierarchyTreeDocumentChild } from 'app/types/I_faProjectHierarchyTreeDomain'

export async function e2eReadOpenedTabDocumentIds (page: Page): Promise<string[]> {
  return page.locator('[data-test-locator^="projectAppControlBar-tab-"]').evaluateAll((nodes) => {
    return nodes.map((node) => {
      const locator = node.getAttribute('data-test-locator') ?? ''
      return locator.replace('projectAppControlBar-tab-', '')
    })
  })
}

export async function e2eReadPlacementRootSiblingDisplayNames (
  page: Page,
  placementId: string
): Promise<string[]> {
  return page.evaluate(async (nextPlacementId) => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    const children = await content.listPlacementDocumentChildren({
      parentDocumentId: null,
      placementId: nextPlacementId
    })
    return children.items.map((row) => row.displayName)
  }, placementId)
}

export async function e2eGetDocumentById (
  page: Page,
  documentId: string
): Promise<I_faProjectDocument> {
  return page.evaluate(async (id) => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    return await content.getDocumentById(id)
  }, documentId)
}

export async function e2eDeleteDocumentViaBridge (page: Page, documentId: string): Promise<void> {
  await page.evaluate(async (id) => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    await content.deleteDocument(id)
  }, documentId)
}

export async function e2eReadPlacementChildrenForParent (
  page: Page,
  placementId: string,
  parentDocumentId: string
): Promise<I_faProjectHierarchyTreeDocumentChild[]> {
  return page.evaluate(async (input) => {
    const content = window.faContentBridgeAPIs?.projectContent
    if (content === undefined) {
      throw new Error('Project content bridge unavailable')
    }
    const children = await content.listPlacementDocumentChildren({
      parentDocumentId: input.parentDocumentId,
      placementId: input.placementId
    })
    return children.items
  }, {
    parentDocumentId,
    placementId
  })
}

export async function e2eHydrateOpenedDocumentsAndRoute (
  page: Page,
  documentId: string
): Promise<void> {
  await page.evaluate(async (nextDocumentId) => {
    const root = document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                hydrateFromProjectDatabase?: () => Promise<void>
              }>
            }
            $router: {
              replace: (location: { path: string }) => Promise<void>
            }
          }
        }
      }
    }
    const globalProperties = root?.__vue_app__?.config.globalProperties
    const router = globalProperties?.$router
    const openedDocumentsStore = globalProperties?.$pinia?._s?.get('S_FaOpenedDocuments')
    if (router === undefined) {
      throw new Error('Vue router missing in E2E app')
    }
    if (typeof openedDocumentsStore?.hydrateFromProjectDatabase !== 'function') {
      throw new Error('S_FaOpenedDocuments.hydrateFromProjectDatabase missing in E2E app')
    }
    await openedDocumentsStore.hydrateFromProjectDatabase()
    await router.replace({ path: `/home/document/${nextDocumentId}` })
  }, documentId)
}
