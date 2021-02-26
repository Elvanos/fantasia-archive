import { MutationTree } from "vuex"
import { OpenDocumentsStateInterface } from "./state"
import { I_OpenedDocument } from "./../../interfaces/I_OpenedDocument"

import { uid } from "quasar"

const mutation: MutationTree<OpenDocumentsStateInterface> = {
  addDocument (state: OpenDocumentsStateInterface, input: I_OpenedDocument) {
    if (!state.documents.docs.find(doc => {
      return doc.type === input.type && doc._id === input._id
    })) {
      state.documents.docs.push(input)
      state.documents.timestamp = uid()
    }
  },

  updateDocument (state: OpenDocumentsStateInterface, input: I_OpenedDocument) {
    const toUpdateDocIndex = state.documents.docs.findIndex(doc => doc.type === input.type && doc._id === input._id)

    state.documents.docs[toUpdateDocIndex] = input
    state.documents.timestamp = uid()
  },

  removeDocument (state: OpenDocumentsStateInterface, input: I_OpenedDocument) {
    const toRemoveIndex = state.documents.docs.findIndex(doc => doc.type === input.type && doc._id === input._id)
    state.documents.docs.splice(toRemoveIndex, 1)
    state.documents.timestamp = uid()
  },

  resetDocuments (state: OpenDocumentsStateInterface) {
    state.documents.docs = []
    state.documents.timestamp = uid()
  }
}

export default mutation
