import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

export const copyDocumentName = (targetDocument: I_OpenedDocument | I_ShortenedDocument) => {
  const returnValue = targetDocument.extraFields.find(e => e.id === "name")?.value

  const el = document.createElement("textarea")
  el.value = returnValue
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export const copyDocumentTextColor = (targetDocument: I_OpenedDocument | I_ShortenedDocument) => {
  const returnValue = targetDocument.extraFields.find(e => e.id === "documentColor")?.value

  const el = document.createElement("textarea")
  el.value = (returnValue) || ""
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export const copyDocumentBackgroundColor = (targetDocument: I_OpenedDocument | I_ShortenedDocument) => {
  const returnValue = targetDocument.extraFields.find(e => e.id === "documentBackgroundColor")?.value

  const el = document.createElement("textarea")
  el.value = (returnValue) || ""
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}
