import { MutationTree } from "vuex"
import { OpenDocumentsStateInterface } from "./state"
import { I_OpenedDocument } from "./../../interfaces/I_OpenedDocument"

import { uid } from "quasar"

const mutation: MutationTree<OpenDocumentsStateInterface> = {
  addDocument (state: OpenDocumentsStateInterface, input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) {
    if (!state.documents.docs.find(doc => {
      return doc.type === input.doc.type && doc._id === input.doc._id
    })) {
      state.documents.docs.push(input.doc)
      state.documents.treeAction = input.treeAction
      state.documents.timestamp = uid()
    }
  },

  updateDocument (state: OpenDocumentsStateInterface, input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) {
    const toUpdateDocIndex = state.documents.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)

    state.documents.docs[toUpdateDocIndex] = input.doc
    state.documents.treeAction = input.treeAction
    state.documents.timestamp = uid()
  },

  removeDocument (state: OpenDocumentsStateInterface, input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) {
    const toRemoveIndex = state.documents.docs.findIndex(doc => doc.type === input.doc.type && doc._id === input.doc._id)
    state.documents.docs.splice(toRemoveIndex, 1)
    state.documents.treeAction = input.treeAction
    state.documents.timestamp = uid()
  },

  resetTreeAction (state: OpenDocumentsStateInterface) {
    state.documents.treeAction = false
  },

  triggerTreeAction (state: OpenDocumentsStateInterface) {
    state.documents.treeAction = true
  },

  resetDocuments (state: OpenDocumentsStateInterface) {
    state.documents.docs = []
    state.documents.treeAction = true
    state.documents.timestamp = uid()

    setTimeout(() => {
      state.documents.treeAction = false
    }, 200)
  }
}

export default mutation
