import { remote } from "electron"
// @ts-ignore
import replicationStream from "pouchdb-replication-stream/dist/pouchdb.replication-stream.min.js"
// @ts-ignore
import load from "pouchdb-load"
import PouchDB from "pouchdb"
import fs from "fs"
import path from "path"
import { extend } from "quasar"

/**
   * Creates a brand new project and deleted any present data avaiable right now
   * @param projectName The name of the new project
   * @praram vueRouter The vue router object
   */
export const createNewProject = async (projectName: string, vueRouter: any, quasar: any, vueInstance: any) => {
  await removeCurrentProject()

  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }

  window.FA_dbs["project-data"] = new PouchDB("project-data")
  const newProject = { _id: projectName }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  window.FA_dbs["project-data"].put(newProject)

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

  quasar.notify({
    type: 'positive',
    message: `New project succesfully created`
  })
  vueInstance.SSET_resetDocuments()
  vueInstance.SSET_resetAllDocuments()
  /* eslint-enable */
}

/**
   * Open an file dialog asking the use for location where to export the project
   * @param projectName The name of the project to export
   */
export const exportProject = (projectName: string, Loading: any, loadingSetup: any, quasar: any) => {
  remote.dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (result) => {
    /*eslint-disable */
      const folderPath = result.filePaths[0]

      if (!folderPath) {
        return
      }

      Loading.show(loadingSetup)
    
      PouchDB.plugin(replicationStream.plugin)
      // @ts-ignore
      PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

      // @ts-ignore
      const allDBS = await indexedDB.databases()

      const DBnames: string[] = allDBS
      .filter((d: {name: string}) => d.name !== '_pouch_fa-settings')
      .map((db: {name: string}) => {
        return db.name.replace("_pouch_", "")
      })

      for (const db of DBnames) {
        window.FA_dbs[db] = new PouchDB(db)

        if (!fs.existsSync(`${folderPath}`)) {
          fs.mkdirSync(`${folderPath}`)
        }

        if (!fs.existsSync(`${folderPath}/${projectName}`)) {
          fs.mkdirSync(`${folderPath}/${projectName}`)
        }
        const ws = fs.createWriteStream(`${folderPath}/${projectName}/${db}.txt`)

        // @ts-ignore
        await window.FA_dbs[db].dump(ws)

      }

      Loading.hide()
      quasar.notify({
        type: 'positive',
        message: `Project succesfully exported`
      })
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

    const DBnames: string[] = allDBS
    .filter((d: {name: string}) => d.name !== '_pouch_fa-settings')
    .map((db: {name: string}) => {
      return db.name.replace("_pouch_", "")
    })


    for (const db of DBnames) {
      window.FA_dbs[db] = new PouchDB(db)
      await window.FA_dbs[db].destroy()
    }
    /* eslint-enable */
}

/**
 * Opens a dialog to let user pick whatever project they wish to open and lets them select a directory
 * @param vueRouter The vue router object
 */
export const importExistingProject = (vueRouter: any, Loading: any, loadingSetup: any, quasar: any, vueInstance: any) => {
  /*eslint-disable */
  remote.dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (result) => {
    const folderPath = result.filePaths[0]

    if (!folderPath) {
      return
    }

    Loading.show(loadingSetup)

    await removeCurrentProject()

    // @ts-ignore
    PouchDB.plugin({
      loadIt: load.load
    })

    const allFiles = fs.readdirSync(folderPath)

    for (const file of allFiles) {
      const currentDBName = path.parse(file).name
      window.FA_dbs[currentDBName] = new PouchDB(currentDBName)

      const fileContents = fs.readFileSync(`${folderPath}/${file}`, { encoding: "utf8" })
      // @ts-ignore
      await window.FA_dbs[currentDBName].loadIt(fileContents)

    }

    const optionsSnapShot = extend(true, {}, vueInstance.SGET_options)
    // @ts-ignore
    optionsSnapShot.legacyFieldsCheck = true
    // @ts-ignore
    vueInstance.SSET_options(optionsSnapShot)

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

    quasar.notify({
      type: 'positive',
      message: `Project succesfully imported`
    })

    vueInstance.SSET_resetDocuments()
    vueInstance.SSET_resetAllDocuments()
    /* eslint-enable */
  }).catch(err => {
    console.log(err)
  })
  /* eslint-enable */
}

/**
 * Opens a dialog to let user pick whatever project they wish to open and lets them select a directory
 * @param vueRouter The vue router object
 */
export const mergeExistingProject = (vueRouter: any, Loading: any, loadingSetup: any, quasar: any, vueInstance: any) => {
  /*eslint-disable */
  remote.dialog.showOpenDialog({
    properties: ["openDirectory"]
  }).then(async (result) => {
    const folderPath = result.filePaths[0]

    if (!folderPath) {
      return
    }

    Loading.show(loadingSetup)

    // @ts-ignore
    PouchDB.plugin({
      loadIt: load.load
    })

    let allFiles = fs.readdirSync(folderPath)
    allFiles = allFiles.filter(file => file !== 'project-data.txt')

    for (const file of allFiles) {
      const currentDBName = path.parse(file).name
      window.FA_dbs[currentDBName] = new PouchDB(currentDBName)

      const fileContents = fs.readFileSync(`${folderPath}/${file}`, { encoding: "utf8" })
      // @ts-ignore
      await window.FA_dbs[currentDBName].loadIt(fileContents)
    }

    
    const optionsSnapShot = extend(true, {}, vueInstance.SGET_options)
    // @ts-ignore
    optionsSnapShot.legacyFieldsCheck = true
    // @ts-ignore
    vueInstance.SSET_options(optionsSnapShot)

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

    quasar.notify({
      type: 'positive',
      message: `Data successfully merged into the project`
    })

    vueInstance.SSET_resetDocuments()
    vueInstance.SSET_resetAllDocuments()

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
  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return projectData?.rows[0]?.id
}

/**
 * Save corkboard update
 */
export const saveCorkboard = async (input: string) => {
  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  projectData.rows[0].doc.corkboardText = input.trim()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  window.FA_dbs["project-data"].put(projectData.rows[0].doc)
}

/**
 * Retrieve corkboard
 */
export const retrieveCorkboard = async (): Promise<string> => {
  if (!window.FA_dbs) {
    // @ts-ignore
    window.FA_dbs = {}
  }
  window.FA_dbs["project-data"] = new PouchDB("project-data")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const projectData = await window.FA_dbs["project-data"].allDocs({ include_docs: true })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (projectData.rows[0]?.doc.corkboardText) || ""
}
