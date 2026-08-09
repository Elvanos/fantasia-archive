import { z } from 'zod'

import {
  faProjectContentIdSchema,
  parseFaProjectContentPlainRecord
} from 'app/src-electron/shared/faProjectContentSchemaShared'
import type { I_faProjectRecordDocumentLastOpenedInput } from 'app/types/I_faProjectDocumentLastOpenedDomain'

export const faProjectRecordDocumentLastOpenedPayloadSchema = z.object({
  documentId: faProjectContentIdSchema
}).strict()

export function parseFaProjectRecordDocumentLastOpenedPayload (
  payload: unknown
): I_faProjectRecordDocumentLastOpenedInput {
  return faProjectRecordDocumentLastOpenedPayloadSchema.parse(
    parseFaProjectContentPlainRecord(payload)
  )
}
