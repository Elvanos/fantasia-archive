import { T_documentList } from 'app/interfaces/T_documentList'

import { S_DialogMarkdown } from 'app/src/stores/S_DialogMarkdown'

export const openDialogMarkdownDocument = (inputDocumentName: T_documentList) => {
  S_DialogMarkdown.documentToOpen = inputDocumentName
  S_DialogMarkdown.generateDialogUUID()
}
