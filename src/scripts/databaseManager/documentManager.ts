import { single_changeRelationshipToAnotherObject, many_changeRelationshipToAnotherObject } from "src/scripts/databaseManager/relationshipManager"
import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_ExtraFields } from "src/interfaces/I_Blueprint"
import { extend } from "quasar"
import PouchDB from "pouchdb"

/**
 * Saves the given project and handles all the needed procedures
 */
export const saveDocument = async (
  document: I_OpenedDocument,
  allOpenedDocuments: I_OpenedDocument[],
  allDocuments: I_ShortenedDocument[],
  editModeAfterSave: boolean
) => {
  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint: {extraFields: I_ExtraFields[]} = await BlueprintsDB.get(document.type)
  window.FA_dbs[document.type] = new PouchDB(document.type)
  const CurrentObjectDB = window.FA_dbs[document.type]

  let currentDocument = false as unknown as I_OpenedDocument
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    currentDocument = await CurrentObjectDB.get(document._id)
  }
  catch (error) {
    // console.log("Creating new document")
  }

  let documentCopy = {} as unknown as I_OpenedDocument
  if (currentDocument) {
    documentCopy = extend(true, {}, document)
    documentCopy._rev = currentDocument?._rev
  }
  else {
    documentCopy = extend(true, {}, document)
  }

  allOpenedDocuments = allOpenedDocuments.filter(doc => doc._id !== document._id)

  // Handle relationship fields
  const single_relationshipTypes = ["singleToSingleRelationship", "singleToManyRelationship"]
  const single_allRelationshipFields = documentCopy.extraFields.filter(field => {
    const currentField = currentBlueprint.extraFields.find(e => e.id === field.id) as unknown as I_ExtraFields
    return (currentField && single_relationshipTypes.includes(currentField.type))
  })
  const many_relationshipTypes = ["manyToSingleRelationship", "manyToManyRelationship"]
  const many_allRelationshipFields = documentCopy.extraFields.filter(field => {
    const currentField = currentBlueprint.extraFields.find(e => e.id === field.id) as unknown as I_ExtraFields
    return (currentField && many_relationshipTypes.includes(currentField.type))
  })

  // Update single fields
  for (const field of single_allRelationshipFields) {
    const single_updatedDocuments: I_OpenedDocument[] = await single_changeRelationshipToAnotherObject(field, documentCopy, currentDocument)

    const pairedFieldID = currentBlueprint.extraFields.find(e => e.id === field.id)?.relationshipSettings?.connectedField

    const filteredOpenedDocuments = single_updatedDocuments.filter(doc => {
      return allOpenedDocuments.find(subDoc => {
        return subDoc._id === doc._id
      })
    })

    const filteredallDocuments = single_updatedDocuments.filter(doc => {
      return allDocuments.find(subDoc => {
        return subDoc._id === doc._id
      })
    })

    // Update the particular field in each currently opened document
    filteredOpenedDocuments.forEach(doc => {
      const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

      if (toUpdateIndex) {
        const matchingDoc = allOpenedDocuments.find(subDoc => subDoc._id === doc._id)
        if (matchingDoc) {
          matchingDoc.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
        }
      }
    })

    // Update the particular field in each all document
    filteredallDocuments.forEach(doc => {
      const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

      if (toUpdateIndex) {
        const matchingDoc = allDocuments.find(subDoc => subDoc._id === doc._id)
        if (matchingDoc) {
          matchingDoc.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
        }
      }
    })
  }

  // Update many fields
  for (const field of many_allRelationshipFields) {
    const many_updatedDocuments: I_OpenedDocument[] = await many_changeRelationshipToAnotherObject(field, documentCopy, currentDocument)

    const pairedFieldID = currentBlueprint.extraFields.find(e => e.id === field.id)?.relationshipSettings?.connectedField

    const filteredDocuments = many_updatedDocuments.filter(doc => {
      return allOpenedDocuments.find(subDoc => {
        return subDoc._id === doc._id
      })
    })

    // Update the particular field in each currently opened document
    filteredDocuments.forEach(doc => {
      const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

      if (toUpdateIndex) {
        const matchingDoc = allOpenedDocuments.find(subDoc => subDoc._id === doc._id)
        if (matchingDoc) {
          matchingDoc.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
        }
      }
    })

    const filteredallDocuments = many_updatedDocuments.filter(doc => {
      return allDocuments.find(subDoc => {
        return subDoc._id === doc._id
      })
    })

    // Update the particular field in each all document
    filteredallDocuments.forEach(doc => {
      const toUpdateIndex = doc.extraFields.findIndex(e => e.id === pairedFieldID)

      if (toUpdateIndex) {
        const matchingDoc = allDocuments.find(subDoc => subDoc._id === doc._id)
        if (matchingDoc) {
          matchingDoc.extraFields[toUpdateIndex] = doc.extraFields[toUpdateIndex]
        }
      }
    })
  }

  documentCopy.isNew = false
  documentCopy.hasEdits = false
  documentCopy.editMode = false

  if (documentCopy.scrollDistance) {
    delete (documentCopy.scrollDistance)
  }

  // Save the document
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await CurrentObjectDB.put(documentCopy)

  // Set edit mode for frontend
  documentCopy.editMode = editModeAfterSave

  return { documentCopy, allOpenedDocuments }
}

export const addFieldToDocument = async (targetDocumentID: string, fieldID: string, blueprintID: string) => {
  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint: {extraFields: I_ExtraFields[], _id: string} = await BlueprintsDB.get(blueprintID)

  window.FA_dbs[currentBlueprint._id] = new PouchDB(currentBlueprint._id)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const targetDocument: { extraFields: any[]} = await window.FA_dbs[currentBlueprint._id].get(targetDocumentID)

  const newField = {
    id: fieldID,
    value: ""
  }

  targetDocument.extraFields.push(newField)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs[currentBlueprint._id].put(targetDocument)
}
