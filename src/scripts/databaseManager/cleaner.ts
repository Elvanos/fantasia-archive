import { retrieveAllBlueprints } from "src/scripts/databaseManager/blueprintManager"
import { I_Blueprint } from "../../interfaces/I_Blueprint"
import PouchDB from "pouchdb"

export const cleanDatabases = async () => {
  const allBlueprints = (await retrieveAllBlueprints()).rows.map((blueprint) => {
    return blueprint.doc
  }) as I_Blueprint[]

  allBlueprints.forEach(blueprint => {
    let activeDB = new PouchDB(blueprint._id)
    const cleanedDB = new PouchDB(`${blueprint._id}Clean`)
    let originalTableSize: number
    let cleanedTableSize

    activeDB.info().then((result) => {
      originalTableSize = result.doc_count

      activeDB.replicate.to(cleanedDB, {
        filter: function (doc: {_deleted: boolean}) {
          if (doc._deleted) {
            return false
          }
          else {
            return doc
          }
        }
      }).on("complete", function () {
        cleanedDB.info().then((cleanedResult) => {
          cleanedTableSize = cleanedResult.doc_count
          if (cleanedTableSize === originalTableSize) {
            activeDB.destroy().then(() => {
              activeDB = new PouchDB(blueprint._id)
              cleanedDB.replicate.to(activeDB, {
                filter: function (doc: {_deleted: boolean}) {
                  if (doc._deleted) {
                    return false
                  }
                  else {
                    return doc
                  }
                }
              }).on("complete", function () {
                cleanedDB.destroy().catch((err) => {
                  console.log(err)
                })
              }).catch((err) => {
                console.log(err)
              })
            }).catch((err) => {
              console.log(err)
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
  })
}
