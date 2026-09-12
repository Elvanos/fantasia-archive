import { beforeEach, expect, test, vi } from 'vitest'

import { createFaActionDefinitionHandlersProjectMedia } from '../createFaActionDefinitionHandlersProjectMedia'

const SAMPLE_UUID = '550e8400-e29b-41d4-a716-446655440000'

const notifyCreateMock = vi.fn()
const upsertMediaMock = vi.fn(async () => undefined)
const S_FaActiveProjectMock = vi.fn(() => ({
  hasActiveProject: true
}))

const i18n = {
  global: {
    t: (key: string) => key
  }
}

function sampleItems () {
  return [{
    displayName: 'Art',
    externalEmbed: '',
    externalLink: 'https://cdn.example.test/art.png',
    externalType: 'linked' as const,
    id: SAMPLE_UUID,
    internalLink: '',
    internalType: '' as const,
    type: 'external' as const
  }]
}

beforeEach(() => {
  notifyCreateMock.mockClear()
  upsertMediaMock.mockClear()
  S_FaActiveProjectMock.mockReset()
  S_FaActiveProjectMock.mockReturnValue({ hasActiveProject: true })
})

/**
 * handleSaveProjectMedia
 * Rejects when no project is active.
 */
test('Test that handleSaveProjectMedia throws when no project is active', async () => {
  S_FaActiveProjectMock.mockReturnValue({ hasActiveProject: false })
  const { handleSaveProjectMedia } = createFaActionDefinitionHandlersProjectMedia({
    i18n,
    notifyCreate: notifyCreateMock,
    S_FaActiveProject: S_FaActiveProjectMock,
    upsertMedia: upsertMediaMock
  })
  await expect(handleSaveProjectMedia({ items: sampleItems() })).rejects.toThrow(
    'dialogs.projectMedia.saveError'
  )
  expect(upsertMediaMock).not.toHaveBeenCalled()
  expect(notifyCreateMock).not.toHaveBeenCalled()
})

/**
 * handleSaveProjectMedia
 * Persists items then emits a success toast.
 */
test('Test that handleSaveProjectMedia upserts items and notifies success', async () => {
  const { handleSaveProjectMedia } = createFaActionDefinitionHandlersProjectMedia({
    i18n,
    notifyCreate: notifyCreateMock,
    S_FaActiveProject: S_FaActiveProjectMock,
    upsertMedia: upsertMediaMock
  })
  const items = sampleItems()
  await handleSaveProjectMedia({ items })
  expect(upsertMediaMock).toHaveBeenCalledWith(items)
  expect(notifyCreateMock).toHaveBeenCalledWith({
    group: false,
    message: 'dialogs.projectMedia.saveSuccess',
    type: 'positive'
  })
})

/**
 * handleSaveProjectMedia
 * Persist failure throws and skips the success toast.
 */
test('Test that handleSaveProjectMedia throws when upsert fails', async () => {
  upsertMediaMock.mockRejectedValueOnce(new Error('dialogs.projectMedia.saveError'))
  const { handleSaveProjectMedia } = createFaActionDefinitionHandlersProjectMedia({
    i18n,
    notifyCreate: notifyCreateMock,
    S_FaActiveProject: S_FaActiveProjectMock,
    upsertMedia: upsertMediaMock
  })
  await expect(handleSaveProjectMedia({ items: sampleItems() })).rejects.toThrow(
    'dialogs.projectMedia.saveError'
  )
  expect(notifyCreateMock).not.toHaveBeenCalled()
})
