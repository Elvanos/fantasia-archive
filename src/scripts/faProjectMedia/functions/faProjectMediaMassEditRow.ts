import type {
  I_faProjectMediaMassEditFieldEnablement,
  I_faProjectMediaMassEditRow,
  T_faProjectMediaExternalType,
  T_faProjectMediaInternalType,
  T_faProjectMediaType
} from 'app/types/I_faProjectMediaDomain'

const mediaTypeInternal: T_faProjectMediaType = 'internal'
const mediaTypeExternal: T_faProjectMediaType = 'external'
const internalTypeEmbedded: T_faProjectMediaInternalType = 'embedded'
const internalTypeLinkedOutside: T_faProjectMediaInternalType = 'linked_outside'
const internalTypeLinkedInProject: T_faProjectMediaInternalType = 'linked_in_project'
const externalTypeLinked: T_faProjectMediaExternalType = 'linked'
const emptyDisplayName = ''
const emptyInternalLink = ''
const createdAtMs = 0
const updatedAtMs = 0
const isNew = true

export function splitFaProjectMediaOnlineUrlDraftLines (draft: string): string[] {
  const lines = draft.split(/\r?\n/)
  const urls: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length > 0) {
      urls.push(trimmed)
    }
  }
  return urls
}

function pathAfterHost (href: string): string {
  const schemeEnd = href.indexOf('://')
  const afterScheme = schemeEnd === -1 ? href : href.slice(schemeEnd + 3)
  const firstSlash = afterScheme.indexOf('/')
  if (firstSlash === -1) {
    return emptyDisplayName
  }
  return afterScheme.slice(firstSlash + 1)
}

function decodePathSegment (segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function stripLastSuffix (segment: string): string {
  const lastDot = segment.lastIndexOf('.')
  if (lastDot <= 0) {
    return segment
  }
  return segment.slice(0, lastDot)
}

/**
 * Last URL path segment after query/hash; last suffix dropped; no segment → empty.
 */
export function resolveFaProjectMediaDisplayNameFromUrl (rawUrl: string): string {
  const noHash = rawUrl.split('#')[0] ?? rawUrl
  const noQuery = noHash.split('?')[0] ?? noHash
  const path = pathAfterHost(noQuery)
  const trimmedPath = path.replace(/\/+$/, '')
  if (trimmedPath.length === 0) {
    return emptyDisplayName
  }
  const parts = trimmedPath.split('/')
  const segment = parts[parts.length - 1] ?? emptyDisplayName
  if (segment.length === 0) {
    return emptyDisplayName
  }
  const decoded = decodePathSegment(segment)
  return stripLastSuffix(decoded)
}

export function createFaProjectMediaMassEditRowFromOnlineUrl (deps: {
  createId: () => string
  url: string
}): I_faProjectMediaMassEditRow {
  const id = deps.createId()
  const displayName = resolveFaProjectMediaDisplayNameFromUrl(deps.url)
  const type = mediaTypeExternal
  const internalType = internalTypeLinkedOutside
  const externalType = externalTypeLinked
  const externalLink = deps.url
  const internalLink = emptyInternalLink
  const internalEmbed = null
  return {
    id,
    displayName,
    type,
    internalType,
    externalType,
    externalLink,
    internalLink,
    internalEmbed,
    createdAtMs,
    updatedAtMs,
    isNew
  }
}

export function createFaProjectMediaMassEditRowsFromOnlineUrlsDraft (deps: {
  createId: () => string
  draft: string
}): I_faProjectMediaMassEditRow[] {
  const urls = splitFaProjectMediaOnlineUrlDraftLines(deps.draft)
  const rows: I_faProjectMediaMassEditRow[] = []
  for (const url of urls) {
    rows.push(createFaProjectMediaMassEditRowFromOnlineUrl({
      createId: deps.createId,
      url
    }))
  }
  return rows
}

export function appendFaProjectMediaMassEditIntakeRows (
  current: readonly I_faProjectMediaMassEditRow[],
  incoming: readonly I_faProjectMediaMassEditRow[]
): I_faProjectMediaMassEditRow[] {
  return [...current, ...incoming]
}

export function resolveFaProjectMediaMassEditFieldEnablement (
  row: Pick<I_faProjectMediaMassEditRow, 'externalType' | 'internalType' | 'type'>
): I_faProjectMediaMassEditFieldEnablement {
  const isInternal = row.type === mediaTypeInternal
  const isExternal = row.type === mediaTypeExternal
  const internalType = isInternal
  const externalType = isExternal
  const internalLink = isInternal && (
    row.internalType === internalTypeLinkedOutside ||
    row.internalType === internalTypeLinkedInProject
  )
  const externalLink = isExternal && row.externalType === externalTypeLinked
  return {
    externalLink,
    externalType,
    internalLink,
    internalType
  }
}

export function isFaProjectMediaType (value: string): value is T_faProjectMediaType {
  return value === mediaTypeInternal || value === mediaTypeExternal
}

export function isFaProjectMediaInternalType (
  value: string
): value is T_faProjectMediaInternalType {
  return (
    value === '' ||
    value === internalTypeEmbedded ||
    value === internalTypeLinkedOutside ||
    value === internalTypeLinkedInProject
  )
}

export function isFaProjectMediaExternalType (
  value: string
): value is T_faProjectMediaExternalType {
  return value === '' || value === externalTypeLinked
}

export function applyFaProjectMediaMassEditTypePatch (
  row: I_faProjectMediaMassEditRow,
  value: unknown
): void {
  const id = readFaSelectInputObjectId(value)
  if (id !== null && isFaProjectMediaType(id)) {
    row.type = id
  }
}

export function applyFaProjectMediaMassEditInternalTypePatch (
  row: I_faProjectMediaMassEditRow,
  value: unknown
): void {
  const id = readFaSelectInputObjectId(value)
  if (id !== null && isFaProjectMediaInternalType(id)) {
    row.internalType = id
  }
}

export function applyFaProjectMediaMassEditExternalTypePatch (
  row: I_faProjectMediaMassEditRow,
  value: unknown
): void {
  const id = readFaSelectInputObjectId(value)
  if (id !== null && isFaProjectMediaExternalType(id)) {
    row.externalType = id
  }
}

export function readFaSelectInputObjectId (value: unknown): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  if (!('id' in value)) {
    return null
  }
  const id = value.id
  if (typeof id !== 'string' || id.length === 0) {
    return null
  }
  return id
}
