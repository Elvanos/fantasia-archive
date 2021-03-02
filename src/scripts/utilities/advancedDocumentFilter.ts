import { I_ShortenedDocument } from "./../../interfaces/I_OpenedDocument"

/**
 * Handles advanced filtering for any kind of search-field involving documents
 */
export const advancedDocumentFilter = (inputString: string, documentList: I_ShortenedDocument[]) => {
  /****************************************************************/
  // Data refresh from previous filters
  /****************************************************************/
  documentList = documentList.map(doc => {
    doc.label = doc.label.replace(/<[^>]+>/g, "")

    // @ts-ignore
    doc.hierarchicalPath = doc.hierarchicalPath.replace(/<[^>]+>/g, "")

    doc.fullWordMatch = 0
    doc.partialWordMatch = 0
    doc.exactMatch = false
    doc.filteredOut = false
    doc.activeTypeSearch = false
    return doc
  })

  /****************************************************************/
  // Refresh sorting to avoid random reshufling from previous searches
  /****************************************************************/
  documentList = documentList.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type)
    }
    else {
      return a.label.localeCompare(b.label)
    }
  })

  /****************************************************************/
  // Build advanced search data
  /****************************************************************/

  const searchWordList = inputString.toLowerCase().split(" ")

  let categorySeach = false as unknown as string
  let tagSeach = false as unknown as string
  let typeSeach = false as unknown as string

  const categorySeachIndex = searchWordList.findIndex(w => w.charAt(0) === ">")
  const tagSeachIndex = searchWordList.findIndex(w => w.charAt(0) === "#")
  const typeSeachIndex = searchWordList.findIndex(w => w.charAt(0) === "$")

  if (categorySeachIndex >= 0) {
    categorySeach = searchWordList[categorySeachIndex].substring(1)
    searchWordList[categorySeachIndex] = ""
  }
  if (tagSeachIndex >= 0) {
    tagSeach = searchWordList[tagSeachIndex].substring(1)
    searchWordList[tagSeachIndex] = ""
  }
  if (typeSeachIndex >= 0) {
    typeSeach = searchWordList[typeSeachIndex].substring(1)
    searchWordList[typeSeachIndex] = ""
  }

  const filteredSearchWordList = searchWordList.filter(w => w !== "")

  /****************************************************************/
  // Category filter
  /****************************************************************/

  if (categorySeach) {
    documentList = documentList.filter((doc, index) => {
      let stringPath = doc.hierarchicalPath as unknown as string
      stringPath = stringPath.toLowerCase()
      stringPath = stringPath.replace(/>/gi, "")
      stringPath = stringPath.replace(/ {2}/gi, "-")
      stringPath = stringPath.replace(/ /gi, "-")

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      doc.hierarchicalPath = `<span class="text-primary">${doc.hierarchicalPath}</span>`

      return (stringPath.includes(categorySeach))
    })
  }

  /****************************************************************/
  // Type filter
  /****************************************************************/

  if (typeSeach) {
    documentList = documentList.filter(doc => {
      let stringPath = doc.type
      stringPath = stringPath.toLowerCase()

      doc.activeTypeSearch = true

      return (stringPath.toLowerCase().includes(typeSeach))
    })
  }

  /****************************************************************/
  // Return list without further lookup for actual text if none is present
  /****************************************************************/
  if (filteredSearchWordList.length === 0) {
    return documentList
  }

  /****************************************************************/
  // Priority search & filtering out non-matching search results
  /****************************************************************/
  documentList.forEach(doc => {
    // If we have a precise matching letter to letter
    if (doc.label.toLowerCase() === filteredSearchWordList.join(" ")) {
      doc.exactMatch = true
      return
    }

    const documentWordList = doc.label.toLowerCase().split(" ")
    let documentWordListColoring = doc.label.split(" ")

    // Safeguards
    let previousWordNotFound = false
    const foundWordList: string[] = []

    // Check for individual word fragments
    filteredSearchWordList.forEach(filterWord => {
      let wordNotFound = true
      documentWordList.forEach(docWord => {
        if (foundWordList.includes(docWord)) {
          return
        }
        if (docWord === filterWord) {
          // @ts-ignore
          doc.fullWordMatch += 1
          wordNotFound = false
          foundWordList.push(docWord)
        }
        if (docWord.includes(filterWord)) {
          // @ts-ignore
          doc.partialWordMatch += 1
          wordNotFound = false
          foundWordList.push(docWord)
        }
      })
      // Safeguards
      doc.filteredOut = !(!wordNotFound && !previousWordNotFound)
      previousWordNotFound = wordNotFound
    })

    // Color the word if they were found
    documentWordListColoring = documentWordListColoring.map(docWord => {
      if (foundWordList.includes(docWord.toLowerCase())) {
        return `<span class="text-primary text-underline">${docWord}</span>`
      }
      return docWord
    })
    doc.label = documentWordListColoring.join(" ")
  })

  /****************************************************************/
  // Sorting
  /****************************************************************/

  // Partial word matching
  // @ts-ignore
  documentList = documentList.sort((a, b) => (a?.partialWordMatch > b?.partialWordMatch) ? -1 : 1)

  // Full word matching
  // @ts-ignore
  documentList = documentList.sort((a, b) => (a?.fullWordMatch > b?.fullWordMatch) ? -1 : 1)

  // Exact matching
  documentList = documentList.sort((a) => (a?.exactMatch) ? -1 : 1)

  /****************************************************************/
  // If there is anything in the search, filter properly
  /****************************************************************/
  if (filteredSearchWordList.length > 0) {
    documentList = documentList.filter(doc => {
      // @ts-ignore
      return ((doc.exactMatch || doc.fullWordMatch > 0 || doc.partialWordMatch > 0) && !doc.filteredOut)
    })
  }

  return documentList
}
