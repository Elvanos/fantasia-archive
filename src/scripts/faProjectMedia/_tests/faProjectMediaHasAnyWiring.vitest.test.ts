/** @vitest-environment jsdom */
import { afterEach, expect, test, vi } from 'vitest'

import { hasAnyFaProjectMediaFromBridge } from '../faProjectMediaHasAnyWiring'

afterEach(() => {
  vi.unstubAllGlobals()
})

/**
 * hasAnyFaProjectMediaFromBridge
 * Missing listMedia is treated as an empty library.
 */
test('Test that hasAnyFaProjectMediaFromBridge is false without listMedia', async () => {
  vi.stubGlobal('window', { faContentBridgeAPIs: {} })
  await expect(hasAnyFaProjectMediaFromBridge()).resolves.toBe(false)
})

/**
 * hasAnyFaProjectMediaFromBridge
 * Empty items means no media.
 */
test('Test that hasAnyFaProjectMediaFromBridge is false for an empty list', async () => {
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        listMedia: async () => ({ items: [] })
      }
    }
  })
  await expect(hasAnyFaProjectMediaFromBridge()).resolves.toBe(false)
})

/**
 * hasAnyFaProjectMediaFromBridge
 * At least one item means the library is nonempty.
 */
test('Test that hasAnyFaProjectMediaFromBridge is true when listMedia has items', async () => {
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        listMedia: async () => ({ items: [{ id: 'm1' }] })
      }
    }
  })
  await expect(hasAnyFaProjectMediaFromBridge()).resolves.toBe(true)
})

/**
 * hasAnyFaProjectMediaFromBridge
 * A rejected listMedia call keeps the nonempty (list) default.
 */
test('Test that hasAnyFaProjectMediaFromBridge is true when listMedia rejects', async () => {
  vi.stubGlobal('window', {
    faContentBridgeAPIs: {
      projectContent: {
        listMedia: async () => {
          throw new Error('ipc')
        }
      }
    }
  })
  await expect(hasAnyFaProjectMediaFromBridge()).resolves.toBe(true)
})
