import { ResultAsync } from 'neverthrow'

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
