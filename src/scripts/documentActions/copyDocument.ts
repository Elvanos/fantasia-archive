import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

export const copyDocument = (currentDoc: I_OpenedDocument | I_ShortenedDocument, newDocumentID: string, documentBlueprint: I_Blueprint) : I_OpenedDocument => {
  currentDoc._id = newDocumentID
  currentDoc.isNew = true
  currentDoc.editMode = true
  currentDoc.hasEdits = false
  currentDoc.url = `/project/display-content/${currentDoc.type}/${newDocumentID}`

  // @ts-ignore
  if (currentDoc.key) {
    // @ts-ignore
    delete (currentDoc.key)
  }

  // @ts-ignore
  if (currentDoc.handler) {
    // @ts-ignore
    delete (currentDoc.handler)
  }

  // @ts-ignore
  if (currentDoc.children) {
    // @ts-ignore
    delete (currentDoc.children)
  }

  // @ts-ignore
  if (currentDoc.sticker) {
    // @ts-ignore
    delete (currentDoc.sticker)
  }

  // @ts-ignore
  delete (currentDoc._rev)

  const documentNameIndex = currentDoc.extraFields.findIndex(e => e.id === "name")

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  currentDoc.extraFields[documentNameIndex].value = `Copy of - ${currentDoc.extraFields[documentNameIndex].value}`

  currentDoc.extraFields.map(field => {
    const fieldType = documentBlueprint.extraFields.find(blueprintField => field.id === blueprintField.id)?.type

    if (fieldType === "singleToSingleRelationship") {
      field.value = ""
    }

    if (fieldType === "manyToSingleRelationship") {
      field.value = ""
    }

    return field
  })

  // @ts-ignore
  return currentDoc
}
