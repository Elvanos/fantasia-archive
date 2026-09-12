import type { I_faProjectMediaUpsertItem } from 'app/types/I_faProjectMediaDomain'

import { i18n } from 'app/i18n/externalFileLoader'
import { ResultAsync } from 'neverthrow'

function mapFaProjectMediaUpsertError (error: unknown): unknown {
  return error
}

/**
 * Persist media rows through projectContent.upsertMedia. Missing bridge or IPC fail throws.
 */
export async function upsertFaProjectMediaViaContentBridge (
  items: I_faProjectMediaUpsertItem[]
): Promise<void> {
  const api = window.faContentBridgeAPIs?.projectContent
  if (typeof api?.upsertMedia !== 'function') {
    throw new Error(i18n.global.t('dialogs.projectMedia.saveError'))
  }
  const writeResult = await ResultAsync.fromPromise(
    api.upsertMedia(items),
    mapFaProjectMediaUpsertError
  )
  if (writeResult.isErr()) {
    throw new Error(i18n.global.t('dialogs.projectMedia.saveError'))
  }
}
