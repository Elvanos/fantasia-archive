import PouchDB from "pouchdb"
import PouchDBFind from "pouchdb-find"

PouchDB.plugin(PouchDBFind)

const CharactersDB = new PouchDB("characters")

export const charactersStartup = async (): Promise<void> => {
  // await createCharacter("Sariine")
  // await createCharacter("Liarni")

  await CharactersDB.createIndex({
    index: { fields: ["name", "age"] }
  })

  const indexes = await CharactersDB.getIndexes()

  console.log(indexes)

  const foundCharacters = await CharactersDB.find({
    selector: { name: "Sariine" },
    fields: ["name", "age"],
    sort: ["name"]
  })
  console.log(foundCharacters)
}

export const createCharacter = async (name: string): Promise<void> => {
  const newCharacter = {
    name: name,
    age: 56
  }

  await CharactersDB.post(
    newCharacter
  )
}
