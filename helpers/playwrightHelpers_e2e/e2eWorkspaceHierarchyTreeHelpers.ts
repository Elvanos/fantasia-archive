import type { Page } from 'playwright'
import { expect } from '@playwright/test'

import { ensureFaPlaywrightE2eHierarchyTreeVisible } from 'app/helpers/playwrightHelpers_e2e/ensureFaPlaywrightE2eHierarchyTreeVisible'
import { e2eSeedHierarchyPlacementWithDocuments as e2eSeedHierarchyPlacementRaw } from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeSeed'

export { ensureFaPlaywrightE2eHierarchyTreeVisible }

export {
  e2eDeleteDocumentViaBridge,
  e2eGetDocumentById,
  e2eHydrateOpenedDocumentsAndRoute,
  e2eReadOpenedTabDocumentIds,
  e2eReadPlacementChildrenForParent,
  e2eReadPlacementRootSiblingDisplayNames
} from 'app/helpers/playwrightHelpers_e2e/e2eWorkspaceHierarchyTreeBridgeHelpers'

/**
 * Object of hierarchy tree data-test-locator keys shared by workspace E2E specs.
 */
export const e2eHierarchyTreeSelectorList = {
  addUnderButton: 'projectHierarchyTree-documentButton-addUnder',
  contextDeleteDocument: 'projectHierarchyTree-nodeContextMenu-deleteDocument',
  contextSortBy: 'projectHierarchyTree-nodeContextMenu-sortBy',
  contextSortBySubmenu: 'projectHierarchyTree-nodeContextMenu-sortBySubmenu',
  deleteDialog: 'dialogDeleteOpenedDocument',
  deleteDialogCancel: 'dialogDeleteOpenedDocument-cancel',
  deleteDialogConfirm: 'dialogDeleteOpenedDocument-delete',
  editButton: 'projectHierarchyTree-documentButton-edit',
  hierarchyTree: 'projectHierarchyTree',
  hierarchyTreeHost: 'projectHierarchyTree-host',
  nodeDocument: 'projectHierarchyTree-node-document',
  nodeDocumentLabelSuffix: '-label',
  nodeTemplatePlacement: 'projectHierarchyTree-node-templatePlacement',
  nodeWorld: 'projectHierarchyTree-node-world',
  openButton: 'projectHierarchyTree-documentButton-open',
  searchInput: 'projectHierarchyTreeSearch-input'
} as const

async function e2eInvokeHierarchyRefreshLayout (page: Page): Promise<void> {
  await page.evaluate(async () => {
    const root = globalThis.document.querySelector('#q-app') as HTMLElement & {
      __vue_app__?: {
        config: {
          globalProperties: {
            $pinia?: {
              _s?: Map<string, {
                refreshLayout?: () => Promise<void>
              }>
            }
          }
        }
      }
    }
    const hierarchyStore = root?.__vue_app__?.config.globalProperties.$pinia?._s?.get('S_FaProjectHierarchyTree')
    if (typeof hierarchyStore?.refreshLayout === 'function') {
      await hierarchyStore.refreshLayout()
    }
  })
}

export async function e2eRefreshHierarchyTreeLayout (page: Page): Promise<void> {
  await e2eInvokeHierarchyRefreshLayout(page)
}

export async function e2eSeedHierarchyPlacementWithDocuments (
  page: Page,
  input: Parameters<typeof e2eSeedHierarchyPlacementRaw>[1]
): Promise<Awaited<ReturnType<typeof e2eSeedHierarchyPlacementRaw>>> {
  const seeded = await e2eSeedHierarchyPlacementRaw(page, input)
  await e2eInvokeHierarchyRefreshLayout(page)
  return seeded
}

export async function e2eExpandWorldAndPlacementNodes (page: Page): Promise<void> {
  await ensureFaPlaywrightE2eHierarchyTreeVisible(page)

  await expect(
    page.locator(`[data-test-locator="${e2eHierarchyTreeSelectorList.hierarchyTreeHost}"]`)
  ).toBeVisible({ timeout: 15_000 })

  const treeRoot = page.locator(`[data-test-locator="${e2eHierarchyTreeSelectorList.hierarchyTree}"]`)
  await expect(treeRoot).toBeVisible({ timeout: 15_000 })

  const documentLabels = page.locator(
    `[data-test-locator="${e2eHierarchyTreeSelectorList.nodeDocument}${e2eHierarchyTreeSelectorList.nodeDocumentLabelSuffix}"]`
  )
  const addNewRow = page.locator('[data-test-locator="projectHierarchyTree-node-addNewDocument-label"]')
  const placementLabel = page.locator(
    `[data-test-locator="${e2eHierarchyTreeSelectorList.nodeTemplatePlacement}${e2eHierarchyTreeSelectorList.nodeDocumentLabelSuffix}"]`
  )
  const worldLabel = page.locator(
    `[data-test-locator="${e2eHierarchyTreeSelectorList.nodeWorld}${e2eHierarchyTreeSelectorList.nodeDocumentLabelSuffix}"]`
  )

  await expect.poll(async () => {
    if (await documentLabels.count() > 0 && await documentLabels.first().isVisible()) {
      return 'ready'
    }
    if (await addNewRow.count() > 0 && await addNewRow.first().isVisible()) {
      return 'ready'
    }

    const collapsedTreeItems = treeRoot.locator('[role="treeitem"][aria-expanded="false"]')
    if (await collapsedTreeItems.count() > 0) {
      const openIconWrapper = collapsedTreeItems.first()
        .locator('[data-test-locator="projectHierarchyTree-openIconWrapper"]')
      if (await openIconWrapper.count() > 0) {
        await openIconWrapper.dispatchEvent('pointerdown')
        await openIconWrapper.click({ force: true })
      } else {
        await collapsedTreeItems.first().click({ force: true })
      }
      await page.waitForTimeout(300)
      return 'expanding'
    }

    if (await placementLabel.count() > 0) {
      await placementLabel.first().click({ force: true })
      await page.waitForTimeout(300)
      return 'expanding'
    }

    if (await worldLabel.count() > 0) {
      await worldLabel.first().click({ force: true })
      await page.waitForTimeout(300)
    }
    return 'expanding'
  }, { timeout: 30_000 }).toBe('ready')
}

export async function e2eExpandHierarchyDocumentNode (page: Page, documentId: string): Promise<void> {
  const row = page.locator(`[data-test-hierarchy-node-id="${documentId}"]`)
    .locator('xpath=ancestor::div[contains(@class,"projectHierarchyTree__nodeRow")][1]')
  await expect(row).toHaveCount(1, { timeout: 15_000 })

  const treeItem = row.locator('xpath=ancestor::*[@role="treeitem"][1]')
  if (await treeItem.count() > 0 && await treeItem.getAttribute('aria-expanded') === 'true') {
    return
  }

  const openIconButton = row.locator('[data-test-locator="projectHierarchyTree-openIcon"]')
  const openIcon = row.locator('[data-test-locator="projectHierarchyTree-openIconWrapper"]')
  if (await openIconButton.count() === 0 && await openIcon.count() === 0) {
    // Leaf row (no open control) — nothing to expand.
    return
  }

  await expect.poll(async () => {
    if (await treeItem.count() === 0) {
      return true
    }
    if ((await treeItem.getAttribute('aria-expanded')) === 'true') {
      return true
    }

    if (await openIconButton.count() > 0) {
      await openIconButton.dispatchEvent('pointerdown')
      await openIconButton.click({ force: true })
    } else if (await openIcon.count() > 0) {
      await openIcon.dispatchEvent('pointerdown')
      await openIcon.click({ force: true })
    }
    await page.waitForTimeout(300)
    return (await treeItem.getAttribute('aria-expanded')) === 'true'
  }, { timeout: 15_000 }).toBe(true)
}

export async function e2eOpenHierarchyNodeContextMenu (page: Page, nodeId: string): Promise<void> {
  await page.locator(
    `[data-test-hierarchy-node-id="${nodeId}"]:not([role="menu"])`
  ).click({
    button: 'right',
    force: true
  })
}

export async function e2eClickHierarchySortByMode (page: Page, modeId: string): Promise<void> {
  const sortByRow = page.locator(`[data-test-locator="${e2eHierarchyTreeSelectorList.contextSortBy}"]`)
  await sortByRow.hover()
  const sortBySubmenu = page.locator(`[data-test-locator="${e2eHierarchyTreeSelectorList.contextSortBySubmenu}"]`)
  await sortBySubmenu.waitFor({
    state: 'visible',
    timeout: 15_000
  })
  const modeItem = page.locator(
    `[data-test-locator="projectHierarchyTree-nodeContextMenu-sortBy-${modeId}"]`
  )
  await modeItem.hover()
  await modeItem.click()
}
