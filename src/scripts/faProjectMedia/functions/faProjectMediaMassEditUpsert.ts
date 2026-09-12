import type {
  I_faProjectMediaMassEditRow,
  I_faProjectMediaUpsertItem
} from 'app/types/I_faProjectMediaDomain'

export function mapFaProjectMediaMassEditRowToUpsertItem (
  row: I_faProjectMediaMassEditRow,
  untitledDisplayName: string
): I_faProjectMediaUpsertItem {
  const trimmed = row.displayName.trim()
  const displayName = trimmed.length > 0 ? trimmed : untitledDisplayName
  return {
    displayName,
    externalEmbed: row.externalEmbed,
    externalLink: row.externalLink,
    externalType: row.externalType,
    id: row.id,
    internalLink: row.internalLink,
    internalType: row.internalType,
    type: row.type
  }
}

export function mapFaProjectMediaMassEditRowsToUpsertItems (
  rows: I_faProjectMediaMassEditRow[],
  untitledDisplayName: string
): I_faProjectMediaUpsertItem[] {
  return rows.map((row) => {
    return mapFaProjectMediaMassEditRowToUpsertItem(row, untitledDisplayName)
  })
}
