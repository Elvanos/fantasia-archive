/**
 * Best-effort MRU write for a saved document open. Never throws to callers.
 */
export async function recordFaOpenedDocumentLastOpenedBestEffort (
  documentId: string
): Promise<void> {
  const api = window.faContentBridgeAPIs?.projectContent
  if (typeof api?.recordDocumentLastOpened !== 'function') {
    return
  }
  try {
    await api.recordDocumentLastOpened({ documentId })
  } catch (error) {
    console.warn('[S_FaOpenedDocuments] recordDocumentLastOpened failed', error)
  }
}
