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
    state.documents.lastRemovedIndex = toRemoveIndex
    state.documents.timestamp = uid()
  },

  resetRemoveIndex (state: OpenDocumentsStateInterface) {
    state.documents.lastRemovedIndex = -1
  },
  resetTreeAction (state: OpenDocumentsStateInterface) {
    state.documents.treeAction = false
  },

  triggerTreeAction (state: OpenDocumentsStateInterface) {
    state.documents.treeAction = true
  },

  closeAllDocuments (state: OpenDocumentsStateInterface) {
    state.documents.docs = state.documents.docs.filter(doc => doc.hasEdits)
    state.documents.treeAction = true
    state.documents.timestamp = uid()
  },

  forceCloseAllDocuments (state: OpenDocumentsStateInterface) {
    state.documents.docs = []
    state.documents.treeAction = true
    state.documents.timestamp = uid()
  },

  closeAllButCurrentDocuments (state: OpenDocumentsStateInterface, input: I_OpenedDocument) {
    state.documents.docs = state.documents.docs.filter(doc => doc.hasEdits || doc._id === input._id)
    state.documents.treeAction = true
    state.documents.timestamp = uid()
  },

  forceCloseAllButCurrentDocuments (state: OpenDocumentsStateInterface, input: I_OpenedDocument) {
    state.documents.docs = state.documents.docs.filter(doc => doc._id === input._id)
    state.documents.treeAction = true
    state.documents.timestamp = uid()
  },

  resetDocuments (state: OpenDocumentsStateInterface) {
    state.documents.docs = []
    state.documents.treeAction = true
    state.documents.timestamp = uid()
  }
}

export default mutation
