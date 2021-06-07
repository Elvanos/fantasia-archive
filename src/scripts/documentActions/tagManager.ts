import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { extend } from "quasar"

export const massRenameTag = (newTag: string, oldTag: string, allTags: string[], documentList: I_ShortenedDocument[]): I_ShortenedDocument[] => {
  // Check for existing duplicates from the input and fix before any further steps
  allTags.forEach(tag => {
    if (tag.toLowerCase() === newTag.toLowerCase() && newTag.toLowerCase() !== oldTag.toLowerCase()) {
      newTag = tag
    }
  })

  const updatedDocList: I_ShortenedDocument[] = []

  for (const document of documentList) {
    const docSnapshot: I_ShortenedDocument = extend(true, {}, document)
    const tagFieldIndex = docSnapshot.extraFields.findIndex(e => e.id === "tags")
    const docTags: string[]|undefined = docSnapshot.extraFields[tagFieldIndex]?.value

    if (docTags) {
      const addMode = docTags.some(tag => newTag.toLowerCase() === tag.toLowerCase())

      // If adding
      if (addMode === true) {
        docTags.push(newTag)
        const indexToRemove = docTags.findIndex(tag => tag === oldTag)
        docTags.splice(indexToRemove, 1)
      }

      // If merging
      if (addMode === false) {
        const indexToModify = docTags.findIndex(tag => tag === oldTag)
        docTags[indexToModify] = newTag
      }

      // Assign updated taglist
      docSnapshot.extraFields[tagFieldIndex].value = [...new Set([...docTags])]
      updatedDocList.push(docSnapshot)
    }
  }

  return updatedDocList
}

export const massDeleteTag = (toDeleteTag: string, documentList: I_ShortenedDocument[]): I_ShortenedDocument[] => {
  const updatedDocList: I_ShortenedDocument[] = []

  for (const document of documentList) {
    const docSnapshot: I_ShortenedDocument = extend(true, {}, document)
    const tagFieldIndex = docSnapshot.extraFields.findIndex(e => e.id === "tags")
    const docTags: string[]|undefined = docSnapshot.extraFields[tagFieldIndex]?.value

    if (docTags) {
      const indexToRemove = docTags.findIndex(tag => tag === toDeleteTag)
      docTags.splice(indexToRemove, 1)

      // Assign updated taglist
      docSnapshot.extraFields[tagFieldIndex].value = [...new Set([...docTags])]
      updatedDocList.push(docSnapshot)
    }
  }

  return updatedDocList
}
