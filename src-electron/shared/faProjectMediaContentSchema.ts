import { z } from 'zod'

import {
  faProjectContentDisplayNameSchema,
  faProjectContentIdSchema,
  parseFaProjectContentPlainRecord
} from 'app/src-electron/shared/faProjectContentSchemaShared'
import { dropUndefinedRecordValues } from 'app/src-electron/shared/faExactOptionalRecordCompat'
import type {
  I_faProjectMedia,
  I_faProjectMediaCreateInput,
  I_faProjectMediaPatch
} from 'app/types/I_faProjectMediaDomain'

export const faProjectMediaCreateInputSchema = z.object({
  displayName: faProjectContentDisplayNameSchema
}).strict()

export const faProjectMediaPatchSchema = z.object({
  displayName: faProjectContentDisplayNameSchema.optional()
}).strict()

export const faProjectMediaIdPayloadSchema = z.object({
  id: faProjectContentIdSchema
}).strict()

export function parseFaProjectMediaCreateInput (
  payload: unknown
): I_faProjectMediaCreateInput {
  return faProjectMediaCreateInputSchema.parse(parseFaProjectContentPlainRecord(payload))
}

export function parseFaProjectMediaPatch (payload: unknown): I_faProjectMediaPatch {
  const parsed = faProjectMediaPatchSchema.parse(parseFaProjectContentPlainRecord(payload))
  return dropUndefinedRecordValues(parsed) as I_faProjectMediaPatch
}

export function parseFaProjectMediaIdPayload (payload: unknown): string {
  return faProjectMediaIdPayloadSchema.parse(parseFaProjectContentPlainRecord(payload)).id
}

export const faProjectMediaUpdatePayloadSchema = z.object({
  id: faProjectContentIdSchema,
  patch: faProjectMediaPatchSchema
}).strict()

export function parseFaProjectMediaUpdatePayload (
  payload: unknown
): { id: string, patch: I_faProjectMediaPatch } {
  const parsed = faProjectMediaUpdatePayloadSchema.parse(parseFaProjectContentPlainRecord(payload))
  return {
    id: parsed.id,
    patch: dropUndefinedRecordValues(parsed.patch) as I_faProjectMediaPatch
  }
}

export const faProjectMediaPersistedRowSchema = z.object({
  id: faProjectContentIdSchema,
  displayName: z.string().min(1),
  type: z.enum(['external', 'internal']),
  internalType: z.enum(['', 'embedded', 'linked_outside', 'linked_in_project']),
  externalType: z.enum(['', 'linked']),
  externalLink: z.string(),
  internalLink: z.string(),
  internalEmbed: z.instanceof(Uint8Array).nullable(),
  createdAtMs: z.number(),
  updatedAtMs: z.number()
}).strict()

export function parseFaProjectMediaPersistedRow (payload: unknown): I_faProjectMedia {
  return faProjectMediaPersistedRowSchema.parse(payload)
}
