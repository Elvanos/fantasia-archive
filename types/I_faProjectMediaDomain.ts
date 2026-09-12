import type {
  I_faProjectContentListResult,
  I_faProjectContentNamedEntity
} from 'app/types/I_faProjectContentShared'

export type T_faProjectMediaType = 'external' | 'internal'

export type T_faProjectMediaInternalType =
  | ''
  | 'embedded'
  | 'linked_in_project'
  | 'linked_outside'

export type T_faProjectMediaExternalType = '' | 'embed' | 'linked'

export type T_faProjectMediaPanel =
  | 'mediaList'
  | 'mediaAdd'
  | 'mediaAddOnlineUrls'
  | 'mediaSingleEdit'
  | 'mediaMassEdit'

/** Mass-edit thumbnail kind from URL extension or External Type Embed. */
export type T_faProjectMediaPreviewKind = 'audio' | 'embed' | 'image' | 'video'

/** Preview well size: mass-edit square, list square, or single-edit player. */
export type T_faProjectMediaPreviewThumbSize = 'list' | 'massEdit' | 'singleEdit'

export interface I_faProjectMedia extends I_faProjectContentNamedEntity {
  type: T_faProjectMediaType
  internalType: T_faProjectMediaInternalType
  externalType: T_faProjectMediaExternalType
  externalLink: string
  externalEmbed: string
  internalLink: string
  internalEmbed: Uint8Array | null
}

/** Session row on Project Media mass-edit. */
export interface I_faProjectMediaMassEditRow extends I_faProjectMedia {
  isNew: boolean
}

/** Fields written on media upsert. Omits blob embed and client timestamps. */
export interface I_faProjectMediaUpsertItem {
  id: string
  displayName: string
  type: T_faProjectMediaType
  internalType: T_faProjectMediaInternalType
  externalType: T_faProjectMediaExternalType
  externalLink: string
  externalEmbed: string
  internalLink: string
}

/** Which mass-edit cells are enabled for the row's type / subtype. */
export interface I_faProjectMediaMassEditFieldEnablement {
  externalEmbed: boolean
  externalLink: boolean
  externalType: boolean
  internalLink: boolean
  internalType: boolean
}

export interface I_faProjectMediaCreateInput {
  displayName: string
}

export interface I_faProjectMediaPatch {
  displayName?: string | undefined
}

export type I_faProjectMediaListResult = I_faProjectContentListResult<I_faProjectMedia>
