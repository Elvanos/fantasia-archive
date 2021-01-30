import PouchDB from "pouchdb"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"

import { I_ExtraDocumentFields, I_OpenedDocument } from "./../interfaces/I_OpenedDocument"

export const single_changeRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentDocument:I_OpenedDocument,
  previouDocument: I_OpenedDocument) => {
  const currentValue = field.value
  const previousValue = (previouDocument?.extraFields?.find(e => e.id === field.id))?.value || ""

  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint = await BlueprintsDB.get(currentDocument.type) as I_Blueprint
  const fieldType = (currentBlueprint.extraFields.find(e => e.id === field.id))?.type

  const updatedDocuments:I_OpenedDocument[] = []

  if (!previousValue && typeof currentValue !== "string" && currentValue) {
    if (fieldType === "singleToSingleRelationship") {
      updatedDocuments.push(await single_addRelationShipToAnotherObject(field, currentValue, currentDocument))
    }
    if (fieldType === "singleToManyRelationship") {
      updatedDocuments.push(await many_addRelationShipToAnotherObject(field, currentValue, currentDocument))
    }
  }

  if (previousValue && typeof currentValue !== "string" && currentValue) {
    if (fieldType === "singleToSingleRelationship") {
      updatedDocuments.push(await single_removeRelationShipFromAnotherObject(previousValue))
      updatedDocuments.push(await single_addRelationShipToAnotherObject(field, currentValue, currentDocument))
    }
    if (fieldType === "singleToManyRelationship") {
      const removedValued = await many_removeRelationShipFromAnotherObject(previousValue, currentDocument)
      if (removedValued) {
        updatedDocuments.push(removedValued)
      }
      updatedDocuments.push(await many_addRelationShipToAnotherObject(field, currentValue, currentDocument))
    }
  }

  if ((previousValue && typeof currentValue === "string") || (previousValue && !currentValue)) {
    if (fieldType === "singleToSingleRelationship") {
      updatedDocuments.push(await single_removeRelationShipFromAnotherObject(previousValue))
    }
    if (fieldType === "singleToManyRelationship") {
      const removedValued = await many_removeRelationShipFromAnotherObject(previousValue, currentDocument)
      if (removedValued) {
        updatedDocuments.push(removedValued)
      }
    }
  }
  return updatedDocuments
}

export const single_addRelationShipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = currentValue.type
  const idToFind = currentValue._id

  const PairedObjectDB = new PouchDB(typeToFind)
  const pairedDocument = await PairedObjectDB.get(idToFind) as I_OpenedDocument
  const pairedField = currentValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  pairedDocument.extraFields[pairedFieldIndex].value = {
    _id: currentDocument._id,
    value: currentDocument._id,
    type: currentDocument.type,
    url: `/project/display-content/${currentDocument.type}/${currentDocument._id}`,
    label: currentDocument.extraFields.find(e => e.id === "name")?.value,
    pairedField: field.id
  }

  await PairedObjectDB.put(pairedDocument)

  return pairedDocument
}

export const single_removeRelationShipFromAnotherObject = async (
  previousValue: I_FieldRelationship
) => {
  const typeToFind = previousValue.type
  const idToFind = previousValue._id

  const PairedObjectDB = new PouchDB(typeToFind)
  const pairedDocument = await PairedObjectDB.get(idToFind) as I_OpenedDocument
  const pairedField = previousValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  pairedDocument.extraFields[pairedFieldIndex].value = ""

  await PairedObjectDB.put(pairedDocument)

  return pairedDocument
}

export const many_changeRelationshipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentDocument:I_OpenedDocument,
  previouDocument: I_OpenedDocument) => {
  const currentValue: I_FieldRelationship[] = (field.value && typeof field.value !== "string") ? field.value : []
  const previousValue: I_FieldRelationship[] = (previouDocument?.extraFields?.find(e => e.id === field.id))?.value || []

  const BlueprintsDB = new PouchDB("blueprints")
  const currentBlueprint = await BlueprintsDB.get(currentDocument.type) as I_Blueprint

  const fieldType = (currentBlueprint.extraFields.find(e => e.id === field.id))?.type

  const addedValues = currentValue.filter(val => !previousValue.find(subVal => subVal._id === val._id))
  const removedValues = previousValue.filter(val => !currentValue.find(subVal => subVal._id === val._id))
  const updatedDocuments:I_OpenedDocument[] = []

  for (const addedValue of addedValues) {
    if (fieldType === "manyToManyRelationship") {
      updatedDocuments.push(await many_addRelationShipToAnotherObject(field, addedValue, currentDocument))
    }

    if (fieldType === "manyToSingleRelationship") {
      updatedDocuments.push(await single_addRelationShipToAnotherObject(field, addedValue, currentDocument))
    }
  }

  for (const removedValue of removedValues) {
    if (fieldType === "manyToManyRelationship") {
      const removedValued = await many_removeRelationShipFromAnotherObject(removedValue, currentDocument)
      if (removedValued) {
        updatedDocuments.push(removedValued)
      }
    }

    if (fieldType === "manyToSingleRelationship") {
      const removedValued = await single_removeRelationShipFromAnotherObject(removedValue)
      if (removedValued) {
        updatedDocuments.push(removedValued)
      }
    }
  }

  return updatedDocuments
}

export const many_addRelationShipToAnotherObject = async (
  field: I_ExtraDocumentFields,
  currentValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = currentValue.type
  const idToFind = currentValue._id

  const PairedObjectDB = new PouchDB(typeToFind)
  const pairedDocument = await PairedObjectDB.get(idToFind) as I_OpenedDocument
  const pairedField = currentValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  let prairedFieldValue: I_FieldRelationship[] = pairedDocument.extraFields[pairedFieldIndex].value

  const newValue = {
    _id: currentDocument._id,
    value: currentDocument._id,
    type: currentDocument.type,
    url: `/project/display-content/${currentDocument.type}/${currentDocument._id}`,
    label: currentDocument.extraFields.find(e => e.id === "name")?.value,
    pairedField: field.id
  }

  prairedFieldValue = (Array.isArray(prairedFieldValue)) ? prairedFieldValue : []

  const valueExistsAlready = (prairedFieldValue.find(e => e._id === newValue._id))

  if (!valueExistsAlready) {
    prairedFieldValue.push(newValue)
  }

  pairedDocument.extraFields[pairedFieldIndex].value = prairedFieldValue

  await PairedObjectDB.put(pairedDocument)

  return pairedDocument
}

export const many_removeRelationShipFromAnotherObject = async (
  previousValue: I_FieldRelationship,
  currentDocument: I_OpenedDocument
) => {
  const typeToFind = previousValue.type
  const idToFind = previousValue._id

  const PairedObjectDB = new PouchDB(typeToFind)
  let pairedDocument = false as unknown as I_OpenedDocument
  try { pairedDocument = await PairedObjectDB.get(idToFind) } catch (e) { return pairedDocument }

  const pairedField = previousValue.pairedField
  const pairedFieldIndex = pairedDocument.extraFields.findIndex(e => e.id === pairedField)

  const currentValues: I_FieldRelationship[] = pairedDocument.extraFields[pairedFieldIndex].value

  const indexToRemove = currentValues.findIndex(e => e._id === currentDocument._id)

  currentValues.splice(indexToRemove, 1)
  pairedDocument.extraFields[pairedFieldIndex].value = currentValues

  await PairedObjectDB.put(pairedDocument)

  return pairedDocument
}
