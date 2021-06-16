import { I_ExportTemplate } from "./../../interfaces/I_ExportTemplate"
// @ts-ignore
import PouchDB from "pouchdb"
import { extend } from "quasar"

/**
 * Save export template
 */
export const saveExportTemplateIntoDB = async (editedExportInput: I_ExportTemplate) => {
  editedExportInput = extend(true, {}, editedExportInput)

  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  const projectDataObject = projectData.rows[0].doc as {exportTemplates: I_ExportTemplate[]}

  if (!projectDataObject.exportTemplates) {
    projectDataObject.exportTemplates = []
  }

  const existingIndex = projectDataObject.exportTemplates.findIndex(t => t.id === editedExportInput.id)

  if (existingIndex > -1) {
    projectDataObject.exportTemplates[existingIndex] = editedExportInput
  }
  else {
    projectDataObject.exportTemplates.push(editedExportInput)
  }

  projectDataObject.exportTemplates.sort((a, b) => a.name.localeCompare(b.name))

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs["project-data"].put(projectDataObject)
}

/**
 * Retrieves all export templates from the database
 */
export const retrieveAllExportTemplatesFromDB = async (): Promise<I_ExportTemplate[]> => {
  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  const projectDataObject = projectData.rows[0].doc as {exportTemplates: I_ExportTemplate[]}

  if (projectDataObject.exportTemplates) {
    return projectDataObject.exportTemplates
  }
  else {
    return []
  }
}
