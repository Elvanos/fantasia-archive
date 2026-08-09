import type { I_faProjectDocumentLastOpenedListResult } from 'app/types/I_faProjectDocumentLastOpenedDomain'

/**
 * Loads last-opened documents for Project overview via projectContent IPC.
 */
export async function listProjectOverviewDocumentLastOpened (): Promise<I_faProjectDocumentLastOpenedListResult> {
  const api = window.faContentBridgeAPIs?.projectContent
  if (typeof api?.listDocumentLastOpened !== 'function') {
    return { items: [] }
  }
  return await api.listDocumentLastOpened()
}
