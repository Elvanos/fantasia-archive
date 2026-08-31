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

export type T_faProjectMediaExternalType = '' | 'linked'

export type T_faProjectMediaPanel =
  | 'mediaList'
  | 'mediaAdd'
  | 'mediaSingleEdit'
  | 'mediaMassEdit'

/** Add-panel inner view: drop zone vs paste-URLs form. */
export type T_faProjectMediaAddSubView = 'dropZone' | 'onlineUrls'

export interface I_faProjectMedia extends I_faProjectContentNamedEntity {
  type: T_faProjectMediaType
  internalType: T_faProjectMediaInternalType
  externalType: T_faProjectMediaExternalType
  externalLink: string
  internalLink: string
  internalEmbed: Uint8Array | null
}

/** Session row on Project Media mass-edit (intake only; not persisted this pass). */
export interface I_faProjectMediaMassEditRow extends I_faProjectMedia {
  isNew: boolean
}

/** Which mass-edit cells are enabled for the row's type / subtype. */
export interface I_faProjectMediaMassEditFieldEnablement {
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
