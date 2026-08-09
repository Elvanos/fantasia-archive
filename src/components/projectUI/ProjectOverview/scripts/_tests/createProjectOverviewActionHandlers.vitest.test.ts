import { expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import {
  createProjectOverviewEmptyCtaHandlers,
  createProjectOverviewLastOpenedActionHandlers
} from '../../functions/createProjectOverviewActionHandlers'

/**
 * createProjectOverviewEmptyCtaHandlers
 * Routes to quick-add when templates are placed on a world.
 */
test('Test that empty CTA opens quick-add when mode is createDocument', () => {
  const runFaAction = vi.fn()
  const { onEmptyCtaClick } = createProjectOverviewEmptyCtaHandlers({
    FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
    FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
    emptyCtaMode: computed(() => 'createDocument'),
    runFaAction
  })

  onEmptyCtaClick()
  expect(runFaAction).toHaveBeenCalledWith('openQuickAddDocumentDialog', undefined)
})

/**
 * createProjectOverviewEmptyCtaHandlers
 * Opens Project Settings worlds tab when templates need assignment.
 */
test('Test that empty CTA opens Project Settings worlds tab for assignTemplate', () => {
  const runFaAction = vi.fn()
  const { onEmptyCtaClick } = createProjectOverviewEmptyCtaHandlers({
    FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
    FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
    emptyCtaMode: computed(() => 'assignTemplate'),
    runFaAction
  })

  onEmptyCtaClick()
  expect(runFaAction).toHaveBeenCalledWith('openProjectSettingsDialog', {
    initialTab: 'worldsSettings'
  })
})

/**
 * createProjectOverviewEmptyCtaHandlers
 * Opens Project Settings document templates tab when no templates.
 */
test('Test that empty CTA opens Project Settings templates tab for createTemplate', () => {
  const runFaAction = vi.fn()
  const { onEmptyCtaClick } = createProjectOverviewEmptyCtaHandlers({
    FA_DIALOG_PROJECT_SETTINGS_DOCUMENT_TEMPLATES_TAB: 'documentTemplatesSettings',
    FA_DIALOG_PROJECT_SETTINGS_WORLDS_TAB: 'worldsSettings',
    emptyCtaMode: computed(() => 'createTemplate'),
    runFaAction
  })

  onEmptyCtaClick()
  expect(runFaAction).toHaveBeenCalledWith('openProjectSettingsDialog', {
    initialTab: 'documentTemplatesSettings'
  })
})

/**
 * createProjectOverviewLastOpenedActionHandlers
 * Dispatches hierarchy open on row click.
 */
test('Test that last-opened handlers dispatch hierarchy tree actions', () => {
  const runFaAction = vi.fn()
  const handlers = createProjectOverviewLastOpenedActionHandlers({ runFaAction })

  handlers.onLastOpenedRowClick('doc-1')
  handlers.onLastOpenedContextCopyName('doc-1')
  handlers.onLastOpenedContextDelete('doc-1')

  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId: 'doc-1' })
  expect(runFaAction).toHaveBeenCalledWith('copyHierarchyTreeDocumentName', { documentId: 'doc-1' })
  expect(runFaAction).toHaveBeenCalledWith('deleteHierarchyTreeDocument', { documentId: 'doc-1' })
})

/**
 * createProjectOverviewLastOpenedActionHandlers
 * Unused ref keeps return-object shape stable under exactOptionalPropertyTypes.
 */
test('Test that last-opened handlers expose all context menu callbacks', () => {
  const runFaAction = vi.fn()
  const handlers = createProjectOverviewLastOpenedActionHandlers({ runFaAction })
  const documentId = ref('doc-2').value

  handlers.onLastOpenedContextCopyTextColor(documentId)
  handlers.onLastOpenedContextCopyBackgroundColor(documentId)
  handlers.onLastOpenedContextCopyDocument(documentId)
  handlers.onLastOpenedContextAddUnder(documentId)
  handlers.onLastOpenedContextOpen(documentId)
  handlers.onLastOpenedContextEdit(documentId)

  expect(runFaAction).toHaveBeenCalledTimes(6)
  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', { documentId })
  expect(runFaAction).toHaveBeenCalledWith('editHierarchyTreeDocument', { documentId })
})

/**
 * createProjectOverviewLastOpenedActionHandlers
 * Middle-click opens via middleBackground openMode (same as hierarchy tree).
 */
test('Test that last-opened middle-click opens with middleBackground mode', () => {
  const runFaAction = vi.fn()
  const handlers = createProjectOverviewLastOpenedActionHandlers({ runFaAction })
  const preventDefault = vi.fn()

  handlers.onLastOpenedRowAuxClick('doc-mid', {
    button: 1,
    preventDefault
  } as unknown as MouseEvent)

  expect(preventDefault).toHaveBeenCalledTimes(1)
  expect(runFaAction).toHaveBeenCalledWith('openHierarchyTreeDocument', {
    documentId: 'doc-mid',
    openMode: 'middleBackground'
  })
})

/**
 * createProjectOverviewLastOpenedActionHandlers
 * Non-middle auxclick is ignored.
 */
test('Test that last-opened auxclick ignores non-middle buttons', () => {
  const runFaAction = vi.fn()
  const handlers = createProjectOverviewLastOpenedActionHandlers({ runFaAction })
  const preventDefault = vi.fn()

  handlers.onLastOpenedRowAuxClick('doc-mid', {
    button: 2,
    preventDefault
  } as unknown as MouseEvent)

  expect(preventDefault).not.toHaveBeenCalled()
  expect(runFaAction).not.toHaveBeenCalled()
})
