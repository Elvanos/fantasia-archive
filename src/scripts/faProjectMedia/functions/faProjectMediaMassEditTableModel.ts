import type { I_faSelectInputObjectItem } from 'app/types/I_faSelectInput'

export function buildFaProjectMediaMassEditSelectOptionLists (t: (key: string) => string): {
  externalTypeOptions: I_faSelectInputObjectItem[]
  internalTypeOptions: I_faSelectInputObjectItem[]
  typeOptions: I_faSelectInputObjectItem[]
} {
  const typeInternal: I_faSelectInputObjectItem = {
    id: 'internal',
    name: t('dialogs.projectMedia.massEditTypeInternal')
  }
  const typeExternal: I_faSelectInputObjectItem = {
    id: 'external',
    name: t('dialogs.projectMedia.massEditTypeExternal')
  }
  const internalEmbedded: I_faSelectInputObjectItem = {
    id: 'embedded',
    name: t('dialogs.projectMedia.massEditInternalTypeEmbedded')
  }
  const internalLinkedOutside: I_faSelectInputObjectItem = {
    id: 'linked_outside',
    name: t('dialogs.projectMedia.massEditInternalTypeLinkedOutside')
  }
  const internalLinkedInProject: I_faSelectInputObjectItem = {
    id: 'linked_in_project',
    name: t('dialogs.projectMedia.massEditInternalTypeLinkedInProject')
  }
  const externalLinked: I_faSelectInputObjectItem = {
    id: 'linked',
    name: t('dialogs.projectMedia.massEditExternalTypeLinked')
  }
  const typeOptions = [typeInternal, typeExternal]
  const internalTypeOptions = [
    internalEmbedded,
    internalLinkedOutside,
    internalLinkedInProject
  ]
  const externalTypeOptions = [externalLinked]
  return {
    externalTypeOptions,
    internalTypeOptions,
    typeOptions
  }
}

export function buildFaProjectMediaMassEditTableColumns (t: (key: string) => string): Array<{
  align: 'left'
  field: string
  label: string
  name: string
}> {
  const displayName = {
    align: 'left' as const,
    field: 'displayName',
    label: t('dialogs.projectMedia.massEditColumnTitle'),
    name: 'displayName'
  }
  const type = {
    align: 'left' as const,
    field: 'type',
    label: t('dialogs.projectMedia.massEditColumnType'),
    name: 'type'
  }
  const internalType = {
    align: 'left' as const,
    field: 'internalType',
    label: t('dialogs.projectMedia.massEditColumnInternalType'),
    name: 'internalType'
  }
  const externalType = {
    align: 'left' as const,
    field: 'externalType',
    label: t('dialogs.projectMedia.massEditColumnExternalType'),
    name: 'externalType'
  }
  const internalLink = {
    align: 'left' as const,
    field: 'internalLink',
    label: t('dialogs.projectMedia.massEditColumnInternalLink'),
    name: 'internalLink'
  }
  const externalLink = {
    align: 'left' as const,
    field: 'externalLink',
    label: t('dialogs.projectMedia.massEditColumnExternalLink'),
    name: 'externalLink'
  }
  return [displayName, type, internalType, externalType, internalLink, externalLink]
}

export function selectFaProjectMediaMassEditOptionById (
  options: I_faSelectInputObjectItem[],
  id: string
): I_faSelectInputObjectItem | null {
  for (const option of options) {
    if (option.id === id) {
      return option
    }
  }
  return null
}
