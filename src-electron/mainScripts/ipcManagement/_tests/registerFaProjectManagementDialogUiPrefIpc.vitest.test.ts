import { beforeEach, expect, test, vi } from 'vitest'

import { FA_PROJECT_MANAGEMENT_IPC } from 'app/src-electron/electron-ipc-bridge'

const { handleMock, runWithDbMock } = vi.hoisted(() => ({
  handleMock: vi.fn(),
  runWithDbMock: vi.fn() as ReturnType<typeof vi.fn>
}))

vi.mock('electron', () => ({
  ipcMain: {
    handle: handleMock
  }
}))

vi.mock('app/src-electron/mainScripts/projectManagement/projectManagement_manager', () => ({
  readFaProjectDialogUiPref: vi.fn(() => ({
    key: 'last_selected_world_id' as const,
    value: 'world-a'
  })),
  runWithFaProjectDatabaseForIpcAsync: runWithDbMock,
  upsertFaProjectDialogUiPref: vi.fn()
}))

beforeEach(() => {
  handleMock.mockReset()
  runWithDbMock.mockReset()
  runWithDbMock.mockImplementation(async (_event: unknown, work: (db: unknown) => unknown) => {
    return {
      ok: true as const,
      value: await work({})
    }
  })
})

function handlerFor (channel: string): (...args: unknown[]) => unknown {
  const call = handleMock.mock.calls.find((c) => c[0]! === channel)
  expect(call).toBeDefined()
  return call?.[1]! as (...args: unknown[]) => unknown
}

/**
 * registerFaProjectManagementDialogUiPrefIpc
 * Registers get/set handlers for dialog UI prefs.
 */
test('Test that registerFaProjectManagementDialogUiPrefIpc registers handlers', async () => {
  const { registerFaProjectManagementDialogUiPrefIpc } = await import(
    '../registerFaProjectManagementDialogUiPrefIpc'
  )
  registerFaProjectManagementDialogUiPrefIpc()
  expect(handlerFor(FA_PROJECT_MANAGEMENT_IPC.getProjectDialogUiPrefAsync)).toBeTypeOf('function')
  expect(handlerFor(FA_PROJECT_MANAGEMENT_IPC.setProjectDialogUiPrefAsync)).toBeTypeOf('function')
})

/**
 * registerFaProjectManagementDialogUiPrefIpc
 * getProjectDialogUiPrefAsync returns null value when DB unavailable.
 */
test('Test that getProjectDialogUiPrefAsync returns null value when DB is unavailable', async () => {
  runWithDbMock.mockResolvedValueOnce({
    ok: false as const,
    reason: 'no-db'
  })
  const { registerFaProjectManagementDialogUiPrefIpc } = await import(
    '../registerFaProjectManagementDialogUiPrefIpc'
  )
  registerFaProjectManagementDialogUiPrefIpc()
  const result = await handlerFor(FA_PROJECT_MANAGEMENT_IPC.getProjectDialogUiPrefAsync)(
    {},
    { key: 'last_selected_world_id' }
  )
  expect(result).toEqual({
    key: 'last_selected_world_id',
    value: null
  })
})

/**
 * registerFaProjectManagementDialogUiPrefIpc
 * getProjectDialogUiPrefAsync returns DB result when available.
 */
test('Test that getProjectDialogUiPrefAsync returns DB result when available', async () => {
  const pref = {
    key: 'last_selected_world_id' as const,
    value: 'world-z'
  }
  const { readFaProjectDialogUiPref } = await import(
    'app/src-electron/mainScripts/projectManagement/projectManagement_manager'
  )
  vi.mocked(readFaProjectDialogUiPref).mockReturnValueOnce(pref)
  const { registerFaProjectManagementDialogUiPrefIpc } = await import(
    '../registerFaProjectManagementDialogUiPrefIpc'
  )
  registerFaProjectManagementDialogUiPrefIpc()
  const result = await handlerFor(FA_PROJECT_MANAGEMENT_IPC.getProjectDialogUiPrefAsync)(
    {},
    { key: 'last_selected_world_id' }
  )
  expect(result).toEqual(pref)
})

/**
 * registerFaProjectManagementDialogUiPrefIpc
 * setProjectDialogUiPrefAsync returns false when DB unavailable.
 */
test('Test that setProjectDialogUiPrefAsync returns false when DB is unavailable', async () => {
  runWithDbMock.mockResolvedValueOnce({
    ok: false as const,
    reason: 'no-db'
  })
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const { registerFaProjectManagementDialogUiPrefIpc } = await import(
    '../registerFaProjectManagementDialogUiPrefIpc'
  )
  registerFaProjectManagementDialogUiPrefIpc()
  const result = await handlerFor(FA_PROJECT_MANAGEMENT_IPC.setProjectDialogUiPrefAsync)(
    {},
    {
      key: 'last_selected_world_id',
      value: 'world-b'
    }
  )
  expect(result).toBe(false)
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringMatching(/setProjectDialogUiPref skipped/)
  )
  warnSpy.mockRestore()
})

/**
 * registerFaProjectManagementDialogUiPrefIpc
 * setProjectDialogUiPrefAsync persists when DB is available.
 */
test('Test that setProjectDialogUiPrefAsync returns true when DB is available', async () => {
  const { upsertFaProjectDialogUiPref } = await import(
    'app/src-electron/mainScripts/projectManagement/projectManagement_manager'
  )
  const { registerFaProjectManagementDialogUiPrefIpc } = await import(
    '../registerFaProjectManagementDialogUiPrefIpc'
  )
  registerFaProjectManagementDialogUiPrefIpc()
  const result = await handlerFor(FA_PROJECT_MANAGEMENT_IPC.setProjectDialogUiPrefAsync)(
    {},
    {
      key: 'last_selected_world_id',
      value: 'world-c'
    }
  )
  expect(result).toBe(true)
  expect(upsertFaProjectDialogUiPref).toHaveBeenCalledWith(
    {},
    'last_selected_world_id',
    'world-c'
  )
})
