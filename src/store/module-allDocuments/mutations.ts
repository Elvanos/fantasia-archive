import { MutationTree } from "vuex"
import { AllDocumentsStateInterface } from "./state"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

import { uid } from "quasar"

const mutation: MutationTree<AllDocumentsStateInterface> = {

  markAsNonFirstRun (state: AllDocumentsStateInterface) {
    state.firstTime = false
  },

  addDocument (state: AllDocumentsStateInterface, input: {
    doc: I_ShortenedDocument,
  }) {
    const timestamp = uid()

    // Docs
    const toAddIndexDocs = state.docs.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    if (toAddIndexDocs < 0) {
      state.docs.docs.push(input.doc)
      state.docs.timestamp = timestamp
    }

    // Docs, no cat
    const toAddIndexDocsWithoutCategory = state.docsWithoutCategories.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    if (toAddIndexDocsWithoutCategory < 0) {
      state.docsWithoutCategories.docs.push(input.doc)
      state.docsWithoutCategories.timestamp = timestamp
    }

    // Docs each cat
    const typeIndex = state.docByType.findIndex(type => type.id === input.doc.type)
    const toAddTypeIndexDocs = state.docByType[typeIndex].docs.findIndex(doc => doc._id === input.doc._id)
    if (toAddTypeIndexDocs < 0) {
      state.docByType[typeIndex].docs.push(input.doc)
      state.docByType[typeIndex].timestamp = timestamp
    }

    // Docs each cat, no cat
    const typeIndexWithoutCats = state.docbyTypeWithoutCategories.findIndex(type => type.id === input.doc.type)
    const toAddTypeIndexDocsWithoutCats = state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.findIndex(doc => doc._id === input.doc._id)
    if (toAddTypeIndexDocsWithoutCats < 0) {
      state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.push(input.doc)
      state.docbyTypeWithoutCategories[typeIndex].timestamp = timestamp
    }
  },

  updateDocument (state: AllDocumentsStateInterface, input: {
    doc: I_ShortenedDocument,
  }) {
    const timestamp = uid()
    const isCategory = input.doc.extraFields.find(e => e.id === "categorySwitch")?.value

    // Docs
    const toUpdateIndexDocs = state.docs.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    state.docs.docs[toUpdateIndexDocs] = input.doc
    state.docs.timestamp = timestamp

    // Docs, no cat
    const toUpdateIndexDocsWithoutCategory = state.docsWithoutCategories.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    if (!isCategory) {
      state.docsWithoutCategories.docs[toUpdateIndexDocsWithoutCategory] = input.doc
    }
    else {
      state.docsWithoutCategories.docs.splice(toUpdateIndexDocsWithoutCategory, 1)
    }
    state.docsWithoutCategories.timestamp = timestamp

    // Docs each cat
    const typeIndex = state.docByType.findIndex(type => type.id === input.doc.type)
    const toUpdateTypeIndexDocs = state.docByType[typeIndex].docs.findIndex(doc => doc._id === input.doc._id)
    state.docByType[typeIndex].docs[toUpdateTypeIndexDocs] = input.doc
    state.docByType[typeIndex].timestamp = timestamp

    // Docs each cat, no cat
    const typeIndexWithoutCats = state.docbyTypeWithoutCategories.findIndex(type => type.id === input.doc.type)
    const toUpdateTypeIndexDocsWithoutCats = state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.findIndex(doc => doc._id === input.doc._id)
    if (!isCategory) {
      state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs[toUpdateTypeIndexDocsWithoutCats] = input.doc
    }
    else {
      state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.splice(toUpdateTypeIndexDocsWithoutCats, 1)
    }
    state.docbyTypeWithoutCategories[typeIndex].timestamp = timestamp
  },

  removeDocument (state: AllDocumentsStateInterface, input: {
    doc: I_ShortenedDocument
  }) {
    const timestamp = uid()

    // Docs
    const toRemoveIndexDocs = state.docs.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    state.docs.docs.splice(toRemoveIndexDocs, 1)
    state.docs.timestamp = timestamp

    // Docs, no cat
    const toRemoveIndexDocsWithoutCategory = state.docsWithoutCategories.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    state.docsWithoutCategories.docs.splice(toRemoveIndexDocsWithoutCategory, 1)
    state.docsWithoutCategories.timestamp = timestamp

    // Docs each cat
    const typeIndex = state.docByType.findIndex(type => type.id === input.doc.type)
    const toRemoveTypeIndexDocs = state.docByType[typeIndex].docs.findIndex(doc => doc._id === input.doc._id)
    state.docByType[typeIndex].docs.splice(toRemoveTypeIndexDocs, 1)
    state.docByType[typeIndex].timestamp = timestamp

    // Docs each cat, no cat
    const typeIndexWithoutCats = state.docbyTypeWithoutCategories.findIndex(type => type.id === input.doc.type)
    const toRemoveTypeIndexDocsWithoutCats = state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.findIndex(doc => doc._id === input.doc._id)
    state.docbyTypeWithoutCategories[typeIndexWithoutCats].docs.splice(toRemoveTypeIndexDocsWithoutCats, 1)
    state.docbyTypeWithoutCategories[typeIndex].timestamp = timestamp
  },

  mapNewDocumentType (state: AllDocumentsStateInterface, input:{
    id: string,
    timestamp: string
    docs: I_ShortenedDocument[]
  }) {
    const timestamp = uid()
    input.timestamp = timestamp

    // Docs each cat
    state.docByType.push(input)

    // Docs each cat, no cat
    const docsWithoutCats = {
      id: input.id,
      timestamp: timestamp,
      docs: input.docs.filter(doc => !doc.extraFields.find(e => e.id === "categorySwitch")?.value)
    }
    state.docbyTypeWithoutCategories.push(docsWithoutCats)

    // Docs
    state.docs.docs = [...state.docs.docs, ...input.docs]
    state.docs.timestamp = timestamp

    // Docs, no cat
    state.docsWithoutCategories.docs = [...state.docsWithoutCategories.docs, ...docsWithoutCats.docs]
    state.docsWithoutCategories.timestamp = timestamp
  },

  resetDocuments (state: AllDocumentsStateInterface) {
    state.firstTime = true

    // Docs
    state.docs.docs = []
    state.docs.timestamp = uid()

    // Docs, no cat
    state.docsWithoutCategories.docs = []
    state.docsWithoutCategories.timestamp = uid()

    // Docs each cat
    state.docByType = []

    // Docs each cat, no cat
    state.docbyTypeWithoutCategories = []
  }
}

export default mutation
