import { addFieldToDocument } from "./documentManager"
import PouchDB from "pouchdb"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"

import { I_ExtraDocumentFields, I_OpenedDocument } from "../../interfaces/I_OpenedDocument"

export const single_changeRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentDocument:I_OpenedDocument,
  previouDocument: I_OpenedDocument) => {
  const currentValue = field.value.value
  const previousValue = (previouDocument?.extraFields?.find(e => e.id === field.id))?.value.value || ""

  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint = await BlueprintsDB.get(currentDocument.type) as I_Blueprint
  const fieldType = (currentBlueprint.extraFields.find(e => e.id === field.id))?.type

  const updatedDocuments:I_OpenedDocument[] = []

  if (!previousValue && typeof currentValue !== "string" && currentValue) {
    if (fieldType === "singleToSingleRelationship") {
      updatedDocuments.push(await single_addRelationshipToAnotherObject(field, currentValue, currentDocument))
    }
    if (fieldType === "singleToManyRelationship") {
      updatedDocuments.push(await many_addRelationshipToAnotherObject(field, currentValue, currentDocument))
    }
  }

  if (previousValue && typeof currentValue !== "string" && currentValue) {
    if (fieldType === "singleToSingleRelationship") {
      const updatedDocument = await single_removeRelationshipFromAnotherObject(currentValue, previousValue)
      if (updatedDocument) {
        updatedDocuments.push(updatedDocument)
      }
      updatedDocuments.push(await single_addRelationshipToAnotherObject(field, currentValue, currentDocument))
    }
    if (fieldType === "singleToManyRelationship") {
      const removedValues = await many_removeRelationshipFromAnotherObject(previousValue, currentDocument)
      if (removedValues) {
        updatedDocuments.push(removedValues)
      }
      updatedDocuments.push(await many_addRelationshipToAnotherObject(field, currentValue, currentDocument))
    }
  }

  if ((previousValue && typeof currentValue === "string") || (previousValue && !currentValue)) {
    if (fieldType === "singleToSingleRelationship") {
      const updatedDocument = await single_removeRelationshipFromAnotherObject(currentValue, previousValue)
      if (updatedDocument) {
        updatedDocuments.push(updatedDocument)
      }
    }
    if (fieldType === "singleToManyRelationship") {
      const removedValues = await many_removeRelationshipFromAnotherObject(previousValue, currentDocument)
      if (removedValues) {
        updatedDocuments.push(removedValues)
      }
    }
  }

  await BlueprintsDB.close()

  return updatedDocuments
}

export const single_addRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = currentValue.type
  const idToFind = currentValue._id

  window.FA_dbs[typeToFind] = new PouchDB(typeToFind)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  let pairedDocument = await window.FA_dbs[typeToFind].get(idToFind) as I_OpenedDocument
  const pairedField = currentValue.pairedField
  let pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  let targetPairedField = pairedDocument.extraFields[pairedFieldIndex]

  // Fix non-existant fields
  if (!targetPairedField) {
    await addFieldToDocument(pairedDocument._id, pairedField, typeToFind)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pairedDocument = await window.FA_dbs[typeToFind].get(idToFind) as I_OpenedDocument
    pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)
    targetPairedField = pairedDocument.extraFields[pairedFieldIndex]
  }

  if (!pairedDocument.extraFields[pairedFieldIndex].value) {
    pairedDocument.extraFields[pairedFieldIndex].value = { value: "", addedValues: "" }
  }

  pairedDocument.extraFields[pairedFieldIndex].value.value = {
    _id: currentDocument._id,
    value: currentDocument._id,
    type: currentDocument.type,
    url: `/project/display-content/${currentDocument.type}/${currentDocument._id}`,
    pairedField: field.id
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs[typeToFind].put(pairedDocument)

  return pairedDocument
}

export const single_removeRelationshipFromAnotherObject = async (
  currentValue: I_FieldRelationship,
  previousValue: I_FieldRelationship
) => {
  const typeToFind = previousValue.type
  const idToFind = previousValue._id

  let pairedDocument = false as unknown as I_OpenedDocument
  try {
    window.FA_dbs[typeToFind] = new PouchDB(typeToFind)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pairedDocument = await window.FA_dbs[typeToFind].get(idToFind)
  }
  catch (error) {
    return pairedDocument
  }

  const pairedField = previousValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  if (currentValue?._id !== previousValue?._id) {
    pairedDocument.extraFields[pairedFieldIndex].value = { value: "", addedValues: "" }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs[typeToFind].put(pairedDocument)

  return pairedDocument
}

export const many_changeRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentDocument:I_OpenedDocument,
  previouDocument: I_OpenedDocument
) => {
  const currentValue: I_FieldRelationship[] = (field.value?.value && typeof field.value?.value !== "string") ? field.value.value : []
  const previousValue: I_FieldRelationship[] = (previouDocument?.extraFields?.find(e => e.id === field.id))?.value?.value || []

  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint = await BlueprintsDB.get(currentDocument.type) as I_Blueprint

  const fieldType = (currentBlueprint.extraFields.find(e => e.id === field.id))?.type

  const addedValues = currentValue.filter(val => !previousValue.find(subVal => subVal._id === val._id))
  const removedValues = previousValue.filter(val => !currentValue.find(subVal => subVal._id === val._id))
  const updatedDocuments:I_OpenedDocument[] = []

  for (const addedValue of addedValues) {
    if (fieldType === "manyToManyRelationship") {
      updatedDocuments.push(await many_addRelationshipToAnotherObject(field, addedValue, currentDocument))
    }

    if (fieldType === "manyToSingleRelationship") {
      updatedDocuments.push(await single_addRelationshipToAnotherObject(field, addedValue, currentDocument))
    }
  }

  for (const removedValue of removedValues) {
    if (fieldType === "manyToManyRelationship") {
      const removedValues = await many_removeRelationshipFromAnotherObject(removedValue, currentDocument)
      if (removedValues) {
        updatedDocuments.push(removedValues)
      }
    }

    if (fieldType === "manyToSingleRelationship") {
      // @ts-ignore
      const removedValues = await single_removeRelationshipFromAnotherObject(removedValue, {})
      if (removedValues) {
        updatedDocuments.push(removedValues)
      }
    }
  }

  await BlueprintsDB.close()

  return updatedDocuments
}

export const many_addRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = currentValue.type
  const idToFind = currentValue._id

  window.FA_dbs[typeToFind] = new PouchDB(typeToFind)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  let pairedDocument = await window.FA_dbs[typeToFind].get(idToFind) as I_OpenedDocument
  const pairedField = currentValue.pairedField
  let pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  let targetPairedField = pairedDocument.extraFields[pairedFieldIndex]

  // Fix non-existant fields
  if (!targetPairedField) {
    await addFieldToDocument(pairedDocument._id, pairedField, typeToFind)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pairedDocument = await window.FA_dbs[typeToFind].get(idToFind) as I_OpenedDocument
    pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)
    targetPairedField = pairedDocument.extraFields[pairedFieldIndex]
  }

  let pairedFieldValue: I_FieldRelationship[] = targetPairedField.value.value

  const newValue = {
    _id: currentDocument._id,
    value: currentDocument._id,
    type: currentDocument.type,
    url: `/project/display-content/${currentDocument.type}/${currentDocument._id}`,
    pairedField: field.id
  }

  pairedFieldValue = (Array.isArray(pairedFieldValue)) ? pairedFieldValue : []

  const valueExistsAlready = (pairedFieldValue.find(e => e._id === newValue._id))

  if (!valueExistsAlready) {
    // @ts-ignore
    pairedFieldValue.push(newValue)
  }

  if (!pairedDocument.extraFields[pairedFieldIndex].value) {
    pairedDocument.extraFields[pairedFieldIndex].value = { value: [], addedValues: [] }
  }

  pairedDocument.extraFields[pairedFieldIndex].value.value = pairedFieldValue

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs[typeToFind].put(pairedDocument)

  return pairedDocument
}

export const many_removeRelationshipFromAnotherObject = async (
  previousValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = previousValue.type
  const idToFind = previousValue._id

  let pairedDocument = false as unknown as I_OpenedDocument
  try {
    window.FA_dbs[typeToFind] = new PouchDB(typeToFind)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    pairedDocument = await window.FA_dbs[typeToFind].get(idToFind)
  }
  catch (e) {
    return pairedDocument
  }

  const pairedField = previousValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  const currentValues: I_FieldRelationship[] = pairedDocument.extraFields[pairedFieldIndex].value.value

  const indexToRemove = currentValues.findIndex(e => e._id === currentDocument._id)

  currentValues.splice(indexToRemove, 1)
  pairedDocument.extraFields[pairedFieldIndex].value.value = currentValues

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await window.FA_dbs[typeToFind].put(pairedDocument)
  return pairedDocument
}
