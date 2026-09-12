import type { I_faProjectMedia } from 'app/types/I_faProjectMediaDomain'

import { ResultAsync } from 'neverthrow'

/**
 * Saved media rows for the Project Media list. Missing or failed listMedia is empty.
 */
export async function loadFaProjectMediaListFromBridge (): Promise<I_faProjectMedia[]> {
  const listMedia = window.faContentBridgeAPIs?.projectContent?.listMedia
  if (typeof listMedia !== 'function') {
    return []
  }
  const listed = await ResultAsync.fromPromise(
    listMedia(),
    () => new Error('listMedia')
  )
  if (listed.isErr()) {
    return []
  }
  return listed.value.items
}

/**
 * True when listMedia returns at least one row.
 * Missing bridge counts as empty. List failure counts as nonempty (keep list default).
 */
export async function hasAnyFaProjectMediaFromBridge (): Promise<boolean> {
  const listMedia = window.faContentBridgeAPIs?.projectContent?.listMedia
  if (typeof listMedia !== 'function') {
    return false
  }
  const listed = await ResultAsync.fromPromise(
    listMedia(),
    () => new Error('listMedia')
  )
  if (listed.isErr()) {
    return true
  }
  return listed.value.items.length > 0
}
