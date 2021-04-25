import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

/**
 * Build a tag list of all know database documents
 */
export const tagListBuildFromBlueprints = (allDocuments: I_ShortenedDocument[]) => {
  let allTags: string[] = []

  const docsTagsArray = allDocuments.map(singleDocument => {
    const tags: string[] = singleDocument.extraFields.find(e => e.id === "tags")?.value

    return (tags) || []
  })

  allTags = [...allTags, ...docsTagsArray] as unknown as string[]

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  allTags = allTags.flat()

  return [...new Set([
    ...allTags
  ])].sort((a, b) => a.localeCompare(b))
}
