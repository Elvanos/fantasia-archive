import { single_changeRelationshipToAnotherObject, many_changeRelationshipToAnotherObject } from "src/scripts/databaseManager/relationshipManager"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_ExtraFields } from "src/interfaces/I_Blueprint"
import { extend } from "quasar"
import PouchDB from "pouchdb"

/**
 * Saves the given project and handles all the needed procedures
 */
export const saveDocument = async (document: I_OpenedDocument, allOpenedDocuments: I_OpenedDocument[]) => {
  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint: {extraFields: I_ExtraFields[]} = await BlueprintsDB.get(document.type)

  let CurrentObjectDB = new PouchDB(document.type)

  let currentDocument = false as unknown as I_OpenedDocument
  try {
    currentDocument = await CurrentObjectDB.get(document._id)
  }
  catch (error) {}

  let documentCopy = {} as unknown as I_OpenedDocument
  if (currentDocument) {
    documentCopy = extend(true, {}, document)
    documentCopy._rev = currentDocument?._rev
  }
  else {
    documentCopy = extend(true, {}, document)
  }

  allOpenedDocuments = allOpenedDocuments.filter(doc => doc._id !== document._id)

  // Handle relatinship fields
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

    const filteredDocuments = single_updatedDocuments.filter(doc => {
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
  }

  documentCopy.isNew = false
  documentCopy.hasEdits = false
  documentCopy.editMode = false

  if (documentCopy.scrollDistance) {
    delete (documentCopy.scrollDistance)
  }

  // Save the document
  try {
    await CurrentObjectDB.put(documentCopy)
  }
  // This exists here as a backup in case the databases closes the connection from elsewhere in the meantime
  catch (error) {
    await CurrentObjectDB.close()
    CurrentObjectDB = new PouchDB(document.type)
    await CurrentObjectDB.put(documentCopy)
  }

  await BlueprintsDB.close()
  await CurrentObjectDB.close()

  return { documentCopy, allOpenedDocuments }
}

export const addFieldToDocument = async (targetDocumentID: string, fieldID: string, blueprintID: string) => {
  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint: {extraFields: I_ExtraFields[], _id: string} = await BlueprintsDB.get(blueprintID)

  // @ts-ignore
  // const fieldBluePrint: I_ExtraFields = currentBlueprint.extraFields.find(e => e.id === fieldID)

  const TargetObjectTypDB = new PouchDB(currentBlueprint._id)
  const targetDocument: { extraFields: any[]} = await TargetObjectTypDB.get(targetDocumentID)

  const newField = {
    id: fieldID,
    value: ""
  }

  // singleToNoneRelationship
  // singleToManyRelationship
  // singleToSingleRelationship
  // manyToNoneRelationship
  // manyToSingleRelationship
  // manyToManyRelationship

  targetDocument.extraFields.push(newField)

  await TargetObjectTypDB.put(targetDocument)

  await BlueprintsDB.close()
  await TargetObjectTypDB.close()
}
