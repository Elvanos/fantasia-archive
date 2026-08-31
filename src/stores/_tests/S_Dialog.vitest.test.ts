import { beforeEach, expect, test, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type * as S_DialogStores from '../S_Dialog'

const { uuidMock } = vi.hoisted(() => {
  return {
    uuidMock: vi.fn(() => 'uuid-1')
  }
})

vi.mock('uuid', () => {
  return {
    v4: uuidMock
  }
})

let S_DialogMarkdown: ReturnType<typeof S_DialogStores.S_DialogMarkdown>
let S_DialogComponent: ReturnType<typeof S_DialogStores.S_DialogComponent>

beforeEach(async () => {
  setActivePinia(createPinia())
  vi.resetModules()
  const stores = await import('../S_Dialog')
  S_DialogMarkdown = stores.S_DialogMarkdown()
  S_DialogComponent = stores.S_DialogComponent()
  S_DialogMarkdown.documentToOpen = 'license'
  S_DialogMarkdown.dialogUUID = ''
  S_DialogComponent.dialogToOpen = 'AboutFantasiaArchive'
  S_DialogComponent.dialogUUID = ''
  uuidMock.mockReset()
  uuidMock.mockReturnValue('uuid-1')
})

/**
 * S_DialogMarkdown
 * Test markdown dialog defaults and UUID generation.
 */
test('Test that S_DialogMarkdown has defaults and updates UUID', () => {
  expect(S_DialogMarkdown.documentToOpen).toBe('license')
  expect(S_DialogMarkdown.dialogUUID).toBe('')
  S_DialogMarkdown.generateDialogUUID()
  expect(S_DialogMarkdown.dialogUUID).toBe('uuid-1')
})

/**
 * S_DialogComponent
 * Test component dialog defaults and UUID generation.
 */
test('Test that S_DialogComponent has defaults and updates UUID', () => {
  expect(S_DialogComponent.dialogToOpen).toBe('AboutFantasiaArchive')
  expect(S_DialogComponent.dialogUUID).toBe('')
  expect(S_DialogComponent.projectSettingsInitialTab).toBe(null)
  expect(S_DialogComponent.projectMediaRequestedPanel).toBe('mediaMassEdit')
  S_DialogComponent.generateDialogUUID()
  expect(S_DialogComponent.dialogUUID).toBe('uuid-1')
})

/**
 * S_DialogComponent
 * consumeProjectSettingsInitialTab returns and clears the pending tab.
 */
test('Test that S_DialogComponent consumeProjectSettingsInitialTab clears after read', () => {
  S_DialogComponent.projectSettingsInitialTab = 'documentTemplatesSettings'
  expect(S_DialogComponent.consumeProjectSettingsInitialTab()).toBe('documentTemplatesSettings')
  expect(S_DialogComponent.projectSettingsInitialTab).toBe(null)
  expect(S_DialogComponent.consumeProjectSettingsInitialTab()).toBe(null)
})

/**
 * S_DialogMarkdown
 * Store fields accept new document keys like production open flows.
 */
test('Test that S_DialogMarkdown documentToOpen accepts a new document key', () => {
  S_DialogMarkdown.documentToOpen = 'changeLog'
  expect(S_DialogMarkdown.documentToOpen).toBe('changeLog')
})

/**
 * S_DialogComponent
 * Store fields accept new dialog keys like production open flows.
 */
test('Test that S_DialogComponent dialogToOpen accepts a new dialog key', () => {
  S_DialogComponent.dialogToOpen = 'AppSettings'
  expect(S_DialogComponent.dialogToOpen).toBe('AppSettings')
})

/**
 * S_DialogMarkdown
 * Repeated UUID generation overwrites dialogUUID with the latest v4 value.
 */
test('Test that S_DialogMarkdown generateDialogUUID overwrites dialogUUID on each call', () => {
  uuidMock.mockReturnValueOnce('uuid-first').mockReturnValueOnce('uuid-second')
  S_DialogMarkdown.generateDialogUUID()
  expect(S_DialogMarkdown.dialogUUID).toBe('uuid-first')
  S_DialogMarkdown.generateDialogUUID()
  expect(S_DialogMarkdown.dialogUUID).toBe('uuid-second')
})

test('Test that S_DialogMarkdown open count visible and hidden stay non-negative', () => {
  expect(S_DialogMarkdown.markdownDialogOpenCount).toBe(0)
  S_DialogMarkdown.onMarkdownDialogBecameVisible()
  expect(S_DialogMarkdown.markdownDialogOpenCount).toBe(1)
  S_DialogMarkdown.onMarkdownDialogBecameHidden()
  expect(S_DialogMarkdown.markdownDialogOpenCount).toBe(0)
  S_DialogMarkdown.onMarkdownDialogBecameHidden()
  expect(S_DialogMarkdown.markdownDialogOpenCount).toBe(0)
})

test('Test that S_DialogComponent open count visible and hidden stay non-negative', () => {
  expect(S_DialogComponent.componentDialogOpenCount).toBe(0)
  S_DialogComponent.onComponentDialogBecameVisible()
  expect(S_DialogComponent.componentDialogOpenCount).toBe(1)
  S_DialogComponent.onComponentDialogBecameHidden()
  expect(S_DialogComponent.componentDialogOpenCount).toBe(0)
  S_DialogComponent.onComponentDialogBecameHidden()
  expect(S_DialogComponent.componentDialogOpenCount).toBe(0)
})

/**
 * S_DialogComponent
 * projectSettingsInitialTab is consumed once then cleared.
 */
test('Test that S_DialogComponent consumeProjectSettingsInitialTab clears the tab', () => {
  S_DialogComponent.projectSettingsInitialTab = 'documentTemplatesSettings'
  expect(S_DialogComponent.consumeProjectSettingsInitialTab()).toBe('documentTemplatesSettings')
  expect(S_DialogComponent.projectSettingsInitialTab).toBeNull()
  expect(S_DialogComponent.consumeProjectSettingsInitialTab()).toBeNull()
})

/**
 * S_DialogComponent
 * projectMediaRequestedPanel stays set so a later open can switch the live panel.
 */
test('Test that S_DialogComponent projectMediaRequestedPanel assignment sticks', () => {
  S_DialogComponent.projectMediaRequestedPanel = 'mediaAdd'
  expect(S_DialogComponent.projectMediaRequestedPanel).toBe('mediaAdd')
  S_DialogComponent.projectMediaRequestedPanel = 'mediaList'
  expect(S_DialogComponent.projectMediaRequestedPanel).toBe('mediaList')
})
