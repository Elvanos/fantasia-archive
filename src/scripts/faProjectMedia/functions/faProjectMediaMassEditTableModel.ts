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
  const externalEmbed: I_faSelectInputObjectItem = {
    id: 'embed',
    icon: 'fa-solid fa-file-code',
    name: t('dialogs.projectMedia.massEditExternalTypeEmbed')
  }
  const typeOptions = [typeInternal, typeExternal]
  const internalTypeOptions = [
    internalEmbedded,
    internalLinkedOutside,
    internalLinkedInProject
  ]
  const externalTypeOptions = [externalLinked, externalEmbed]
  return {
    externalTypeOptions,
    internalTypeOptions,
    typeOptions
  }
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
