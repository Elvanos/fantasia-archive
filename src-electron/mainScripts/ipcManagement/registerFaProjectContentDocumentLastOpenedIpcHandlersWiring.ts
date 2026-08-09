import type { IpcMain } from 'electron'

import { FA_PROJECT_CONTENT_IPC } from 'app/src-electron/electron-ipc-bridge'
import { runFaProjectContentIpcWork } from './runFaProjectContentIpcWorkWiring'
import { listFaProjectDocumentDistribution } from 'app/src-electron/mainScripts/projectManagement/projectDbContent/faProjectDocumentDistributionQueryWiring'
import { recordFaProjectDocumentLastOpened } from 'app/src-electron/mainScripts/projectManagement/projectDbContent/faProjectDocumentLastOpenedPersistWiring'
import { listFaProjectDocumentLastOpened } from 'app/src-electron/mainScripts/projectManagement/projectDbContent/faProjectDocumentLastOpenedQueryWiring'
import { parseFaProjectRecordDocumentLastOpenedPayload } from 'app/src-electron/shared/faProjectDocumentLastOpenedContentSchema'

/**
 * Registers document_last_opened MRU + distribution handlers on ipcMain.
 */
export function wireFaProjectContentDocumentLastOpenedIpcHandlers (ipcMain: IpcMain): void {
  ipcMain.handle(FA_PROJECT_CONTENT_IPC.listDocumentLastOpenedAsync, async (event) => {
    return await runFaProjectContentIpcWork(event, (db) => {
      return listFaProjectDocumentLastOpened(db)
    })
  })
  ipcMain.handle(FA_PROJECT_CONTENT_IPC.recordDocumentLastOpenedAsync, async (event, payload) => {
    return await runFaProjectContentIpcWork(event, (db) => {
      const parsed = parseFaProjectRecordDocumentLastOpenedPayload(payload)
      db.transaction(() => {
        recordFaProjectDocumentLastOpened(db, parsed.documentId)
      })()
    })
  })
  ipcMain.handle(FA_PROJECT_CONTENT_IPC.listDocumentDistributionAsync, async (event) => {
    return await runFaProjectContentIpcWork(event, (db) => {
      return listFaProjectDocumentDistribution(db)
    })
  })
}
