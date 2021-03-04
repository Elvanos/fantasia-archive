import { remote } from "electron"
// @ts-ignore
import replicationStream from "pouchdb-replication-stream/dist/pouchdb.replication-stream.min.js"
// @ts-ignore
import load from "pouchdb-load"
import PouchDB from "pouchdb"
import fs from "fs"
import path from "path"

/**
   * Creates a brand new project and deleted any present data avaiable right now
   * @param projectName The name of the new project
   * @praram vueRouter The vue router object
   */
export const createNewProject = async (projectName: string, vueRouter: any) => {
  await removeCurrentProject()

  const ProjectDB = new PouchDB("project-data")
  const newProject = { _id: projectName }
  await ProjectDB.put(newProject)

  /*eslint-disable */
  // @ts-ignore
  vueRouter.push({ path: "/project" }).catch((e: {name: string}) => {
    const errorName : string = e.name
    if (errorName === "NavigationDuplicated") {
      return
    }
    console.log(e)
  })
  /* eslint-enable */
}

/**
   * Open an file dialog asking the use for location where to export the project
   * @param projectName The name of the project to export
   */
export const exportProject = (projectName: string) => {
  remote.dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (result) => {
    /*eslint-disable */
      const folderPath = result.filePaths[0]

      PouchDB.plugin(replicationStream.plugin)
      // @ts-ignore
      PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

      // @ts-ignore
      const allDBS = await indexedDB.databases()

      const DBnames: string[] = allDBS.map((db: {name: string}) => {
        return db.name.replace("_pouch_", "")
      })

      for (const db of DBnames) {
        const CurrentDB = new PouchDB(db)

        if (!fs.existsSync(`${folderPath}/${projectName}`)) {
          fs.mkdirSync(`${folderPath}/${projectName}`)
        }
        const ws = fs.createWriteStream(`${folderPath}/${projectName}/${db}.txt`)

        // @ts-ignore
        await CurrentDB.dump(ws)
      }
    /* eslint-enable */
  }).catch(err => {
    console.log(err)
  })
}

/**
 * Delete the current project and all its data
 */
export const removeCurrentProject = async () => {
  /*eslint-disable */
    // @ts-ignore
    const allDBS = await indexedDB.databases()

    const DBnames: string[] = allDBS.map((db: {name: string}) => {
      return db.name.replace("_pouch_", "")
    })

    for (const db of DBnames) {
      const CurrentDB = new PouchDB(db)
      await CurrentDB.destroy()
    }
    /* eslint-enable */
}

/**
 * Opens a dialog to let user pick whatever project they wish to open and lets them select a directory
 * @param vueRouter The vue router object
 */
export const importExistingProject = (vueRouter: any) => {
  /*eslint-disable */
  remote.dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (result) => {
    const folderPath = result.filePaths[0]

    if (!folderPath) {
      return
    }

    await removeCurrentProject()

    // @ts-ignore
    PouchDB.plugin({
      loadIt: load.load
    })

    const allFiles = fs.readdirSync(folderPath)

    for (const file of allFiles) {
      const currentDBName = path.parse(file).name
      const CurrentDB = new PouchDB(currentDBName)

      const fileContents = fs.readFileSync(`${folderPath}/${file}`, { encoding: "utf8" })
      // @ts-ignore
      await CurrentDB.loadIt(fileContents)
    }

    /*eslint-disable */
    // @ts-ignore
    vueRouter.push({ path: "/" }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
    /* eslint-enable */

    await new Promise(resolve => setTimeout(resolve, 1000))

    /*eslint-disable */
    // @ts-ignore
    vueRouter.push({ path: "/project" }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
    /* eslint-enable */
  }).catch(err => {
    console.log(err)
  })
  /* eslint-enable */
}

/**
 * Retrieves current project name
 */
export const retrieveCurrentProjectName = async () => {
  const ProjectDB = new PouchDB("project-data")
  const projectData = await ProjectDB.allDocs({ include_docs: true })
  return projectData?.rows[0]?.id
}
