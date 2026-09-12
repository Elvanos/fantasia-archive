import type {
  I_faProjectMedia,
  I_faProjectMediaMassEditRow
} from 'app/types/I_faProjectMediaDomain'

/**
 * Copy a saved medium into a mass-edit session row. isNew is always false.
 */
export function mapFaProjectMediaToMassEditRow (
  item: I_faProjectMedia
): I_faProjectMediaMassEditRow {
  return {
    createdAtMs: item.createdAtMs,
    displayName: item.displayName,
    externalEmbed: item.externalEmbed,
    externalLink: item.externalLink,
    externalType: item.externalType,
    id: item.id,
    internalEmbed: item.internalEmbed,
    internalLink: item.internalLink,
    internalType: item.internalType,
    isNew: false,
    type: item.type,
    updatedAtMs: item.updatedAtMs
  }
}

function isPersistFieldDirty (
  draft: I_faProjectMediaMassEditRow,
  baseline: I_faProjectMediaMassEditRow
): boolean {
  if (draft.displayName !== baseline.displayName) {
    return true
  }
  if (draft.type !== baseline.type) {
    return true
  }
  if (draft.internalType !== baseline.internalType) {
    return true
  }
  if (draft.externalType !== baseline.externalType) {
    return true
  }
  if (draft.externalLink !== baseline.externalLink) {
    return true
  }
  if (draft.externalEmbed !== baseline.externalEmbed) {
    return true
  }
  return draft.internalLink !== baseline.internalLink
}

/**
 * True when persist fields differ. Ignores timestamps, isNew, and internalEmbed.
 * Missing draft or baseline is not dirty.
 */
export function isFaProjectMediaMassEditRowDirty (
  draft: I_faProjectMediaMassEditRow | null,
  baseline: I_faProjectMediaMassEditRow | null
): boolean {
  if (draft === null || baseline === null) {
    return false
  }
  return isPersistFieldDirty(draft, baseline)
}
