import type {
  I_faProjectContentListResult,
  I_faProjectContentNamedEntity
} from 'app/types/I_faProjectContentShared'

export type T_faProjectMediaType = 'external' | 'internal'

export type T_faProjectMediaInternalType = '' | 'embedded' | 'linked'

export type T_faProjectMediaExternalType = '' | 'linked'

export type T_faProjectMediaPanel =
  | 'mediaList'
  | 'mediaAdd'
  | 'mediaSingleEdit'
  | 'mediaMassEdit'

export interface I_faProjectMedia extends I_faProjectContentNamedEntity {
  type: T_faProjectMediaType
  internalType: T_faProjectMediaInternalType
  externalType: T_faProjectMediaExternalType
  externalLink: string
  internalLink: string
  internalEmbed: Uint8Array | null
  internalIsProjectIncluded: boolean
}

export interface I_faProjectMediaCreateInput {
  displayName: string
}

export interface I_faProjectMediaPatch {
  displayName?: string | undefined
}

export type I_faProjectMediaListResult = I_faProjectContentListResult<I_faProjectMedia>
