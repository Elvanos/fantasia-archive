import { I_Blueprint } from "./../../interfaces/I_Blueprint"
import PouchDB from "pouchdb"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"

/**
 * Build a tag list of all know database documents
 */
export const tagListBuildFromBlueprints = async (blueprintList: I_Blueprint[]) => {
  let allTags: string[] = []
  for (const blueprint of blueprintList) {
    const CurrentObjectDB = new PouchDB(blueprint._id)

    let dbDocuments = await CurrentObjectDB.allDocs({ include_docs: true })
    const docsTagsArray = dbDocuments.rows.map(singleDocument => {
      const doc = singleDocument.doc as unknown as I_ShortenedDocument
      const tags: string[] = doc.extraFields.find(e => e.id === "tags")?.value

      return (tags) || []
    })

    // @ts-ignore
    allTags = [...allTags, ...docsTagsArray] as unknown as string[]
    // @ts-ignore
    dbDocuments = null
    await CurrentObjectDB.close()
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  allTags = allTags.flat()

  return [...new Set([
    ...allTags
  ])].sort((a, b) => a.localeCompare(b))
}
