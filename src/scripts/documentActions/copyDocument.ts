import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

export const copyDocument = (currentDoc: I_OpenedDocument, newDocumentID: string) : I_OpenedDocument => {
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

  delete (currentDoc._rev)

  const documentNameIndex = currentDoc.extraFields.findIndex(e => e.id === "name")

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  currentDoc.extraFields[documentNameIndex].value = `Copy of - ${currentDoc.extraFields[documentNameIndex].value}`

  return currentDoc
}
