import { I_DocumentTemplate } from "./../../interfaces/I_DocumentTemplate"
// @ts-ignore
import PouchDB from "pouchdb"
import { extend } from "quasar"

/**
 * Save a document template
 */
export const saveDocumentTemplateIntoDB = async (editedDocumentTemplate: I_DocumentTemplate) => {
  editedDocumentTemplate = extend(true, {}, editedDocumentTemplate)

  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  const projectDataObject = projectData.rows[0].doc as {documentTemplates: I_DocumentTemplate[]}

  if (!projectDataObject.documentTemplates) {
    projectDataObject.documentTemplates = []
  }

  const existingIndex = projectDataObject.documentTemplates.findIndex(t => t.id === editedDocumentTemplate.id)

  if (existingIndex > -1) {
    projectDataObject.documentTemplates[existingIndex] = editedDocumentTemplate
  }
  else {
    projectDataObject.documentTemplates.push(editedDocumentTemplate)
  }

  projectDataObject.documentTemplates.sort((a, b) => a.name.localeCompare(b.name))

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs["project-data"].put(projectDataObject)
}

/**
 * Retrieves all document templates from the database
 */
export const retrieveAllDocumentTemplatesFromDB = async (): Promise<I_DocumentTemplate[]> => {
  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  const projectDataObject = projectData.rows[0].doc as {documentTemplates: I_DocumentTemplate[]}

  if (projectDataObject.documentTemplates) {
    return projectDataObject.documentTemplates
  }
  else {
    return []
  }
}

/**
 * Removes a document template from the databse
 */
export const removeDocumentTemplateFromDB = async (editedDocumentTemplate: I_DocumentTemplate) => {
  editedDocumentTemplate = extend(true, {}, editedDocumentTemplate)

  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }

  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  const projectDataObject = projectData.rows[0].doc as {documentTemplates: I_DocumentTemplate[]}

  if (!projectDataObject.documentTemplates) {
    projectDataObject.documentTemplates = []
  }

  const indexToRemove = projectDataObject.documentTemplates.findIndex(t => t.id === editedDocumentTemplate.id)

  if (indexToRemove > -1) {
    projectDataObject.documentTemplates.splice(indexToRemove, 1)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs["project-data"].put(projectDataObject)
}
