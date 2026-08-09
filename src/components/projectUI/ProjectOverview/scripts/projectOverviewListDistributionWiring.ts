import type { I_faProjectDocumentDistributionResult } from 'app/types/I_faProjectDocumentLastOpenedDomain'

/**
 * Loads document distribution for Project overview via projectContent IPC.
 */
export async function listProjectOverviewDocumentDistribution (): Promise<I_faProjectDocumentDistributionResult> {
  const api = window.faContentBridgeAPIs?.projectContent
  if (typeof api?.listDocumentDistribution !== 'function') {
    return {
      counts: [],
      documentTemplateTotalCount: 0,
      templates: [],
      totalDocumentCount: 0,
      worlds: []
    }
  }
  return await api.listDocumentDistribution()
}
