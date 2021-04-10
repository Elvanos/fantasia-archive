import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

export const copyDocument = (currentDoc: I_OpenedDocument, newDocumentID: string) : I_OpenedDocument => {
  currentDoc._id = newDocumentID
  currentDoc.isNew = true
  currentDoc.editMode = true
  currentDoc.hasEdits = false
  currentDoc.url = `/project/display-content/${currentDoc.type}/${newDocumentID}`

  delete (currentDoc._rev)

  const documentNameIndex = currentDoc.extraFields.findIndex(e => e.id === "name")

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  currentDoc.extraFields[documentNameIndex].value = `Copy of - ${currentDoc.extraFields[documentNameIndex].value}`

  return currentDoc
}
