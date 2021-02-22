import { KeyManagementInterface } from "./store/module-keybinds/state"
import { I_OpenedDocument } from "./interfaces/I_OpenedDocument"
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { remote } from "electron"
// @ts-ignore
import replicationStream from "pouchdb-replication-stream/dist/pouchdb.replication-stream.min.js"
// @ts-ignore
import load from "pouchdb-load"
import PouchDB from "pouchdb"
import fs from "fs"
import path from "path"

import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_NewObjectTrigger } from "src/interfaces/I_NewObjectTrigger"
import { uid } from "quasar"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"
import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"

const Blueprints = namespace("blueprintsModule")
const OpenedDocuments = namespace("openedDocumentsModule")
const Keybinds = namespace("keybindsModule")

@Component
export default class BaseClass extends Vue {
  /****************************************************************/
  // Keybinds management
  /****************************************************************/

  @Keybinds.Getter("getCurrentKeyBindData") SGET_getCurrentKeyBindData!: KeyManagementInterface

  @Keybinds.Mutation("registerDefaultKeybind") SSET_registerDefaultKeybind!: (input: I_KeyPressObject) => void
  @Keybinds.Mutation("deregisterDefaultKeybind") SSET_deregisterDefaultKeybind!: (input: I_KeyPressObject) => void
  @Keybinds.Mutation("registerUserKeybind") SSET_registerUserKeybind!: (input: I_KeyPressObject) => void
  @Keybinds.Mutation("deregisterUserKeybind") SSET_deregisterUserKeybind!: (input: I_KeyPressObject) => void
  @Keybinds.Mutation("updatePressedKey") SSET_updatePressedKey!: (input: I_KeyPressObject) => void

  /**
   * Builds a humanly redable represetation of the keybind in string form
   * @param keybindId - Keybind object to build the string out of
   */
  retrieveKeybindString (keybind: I_KeyPressObject): string {
    let keybindString = ""

    if (keybind.ctrlKey) {
      keybindString += "CTRL + "
    }

    if (keybind.altKey) {
      keybindString += "ALT + "
    }

    if (keybind.shiftKey) {
      keybindString += "SHIFT + "
    }

    const keybinds = [37, 38, 39, 40, 9, 32, 13]

    if (keybinds.includes(keybind.keyCode)) {
      if (keybind.keyCode === 13) {
        keybindString += "ENTER"
      }
      if (keybind.keyCode === 9) {
        keybindString += "TAB"
      }
      if (keybind.keyCode === 32) {
        keybindString += "SPACE"
      }
      if (keybind.keyCode === 37) {
        keybindString += "LEFT ARROW"
      }
      if (keybind.keyCode === 38) {
        keybindString += "UP ARROW"
      }
      if (keybind.keyCode === 39) {
        keybindString += "RIGHT ARROW"
      }
      if (keybind.keyCode === 40) {
        keybindString += "DOWN ARROW"
      }
    }
    else {
      keybindString += String.fromCharCode(keybind.keyCode)
    }

    if (keybind.note) {
      keybindString += `<div class="text-italic keybindNote">${keybind.note}</div>`
    }

    return keybindString
  }

  /**
   * Determines if the keybind triggered the proper condition
   * @param keybindId - ID of the keybind to determine what to match
   */
  determineKeyBind (keybindId: string): boolean {
    const currentKeybindData = this.SGET_getCurrentKeyBindData

    const currentKeyPress = currentKeybindData.currentKeyPress
    const pairedDefaultKeybind = currentKeybindData.defaults.find(e => e.id === keybindId)
    const pairedCustomKeybind = currentKeybindData.userKeybinds.find(e => e.id === keybindId)

    // Kill the script if no keybind exists of this anywhere
    if (!pairedDefaultKeybind) {
      return false
    }

    const fieldToCheck = (pairedCustomKeybind) || pairedDefaultKeybind

    if (
      currentKeyPress.altKey === fieldToCheck.altKey &&
      currentKeyPress.ctrlKey === fieldToCheck.ctrlKey &&
      currentKeyPress.shiftKey === fieldToCheck.shiftKey &&
      currentKeyPress.keyCode === fieldToCheck.keyCode
    ) {
      return true
    }
    else {
      return false
    }
  }

  /****************************************************************/
  // Project management
  /****************************************************************/

  /**
   * Creates a brand new project and deleted any present data avaiable right now
   * @param projectName The name of the new project
   */
  async createNewProject (projectName: string) {
    await this.removeCurrentProject()

    const ProjectDB = new PouchDB("project-data")
    const newProject = { _id: projectName }
    await ProjectDB.put(newProject)

    this.$router.push({ path: "/project" }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }

  /**
   * Open an file dialog asking the use for location where to export the project
   * @param projectName The name of the project to export
   */
  exportProject (projectName: string) {
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
  async removeCurrentProject () {
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

  openExistingProject () {
    /*eslint-disable */
    remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    }).then(async (result) => {

      const folderPath = result.filePaths[0]

      if(!folderPath){return}

      await this.removeCurrentProject()

      //@ts-ignore
      PouchDB.plugin({
        loadIt: load.load
      })

      const allFiles = fs.readdirSync(folderPath)

      for (const file of allFiles) {
        const currentDBName = path.parse(file).name
        const CurrentDB = new PouchDB(currentDBName)

        const fileContents = fs.readFileSync(`${folderPath}/${file}`, {encoding: 'utf8'})
        // @ts-ignore
        await CurrentDB.loadIt(fileContents)
        
      }
    }).catch(err => {
      console.log(err)
    })
    /* eslint-enable */
  }

  async retrieveCurrentProjectName () {
    const ProjectDB = new PouchDB("project-data")
    const projectData = await ProjectDB.allDocs({ include_docs: true })
    return projectData?.rows[0]?.id
  }

  /****************************************************************/
  // Blueprint management
  /****************************************************************/

  @Blueprints.Getter("getAllBlueprints") SGET_allBlueprints !: I_Blueprint[]
  @Blueprints.Getter("getBlueprint") SGET_blueprint!: (type: string) => I_Blueprint

  @Blueprints.Mutation("setAllBlueprints") SSET_allBlueprints!: (input: I_Blueprint[]) => void
  @Blueprints.Mutation("setBlueprint") SSET_blueprint!: (input: I_Blueprint) => void

  /**
   * Generates a brand new route for the new object with individual ID
   * @param newObject A new object to be creared
   */
  addNewObjectRoute (newObject: I_NewObjectTrigger) {
    const parentID = (newObject?.parent) || ""

    this.$router.push({
      path: `/project/display-content/${newObject._id}/${uid()}`,
      query: { parent: parentID }
    }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }

  /**
   * Open a new route for an already existing object
   * @param existingObject An already existing object passed in
   */
  openExistingDocumentRoute (existingObject:I_OpenedDocument | I_FieldRelationship) {
    this.$router.push({ path: existingObject.url }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }

  /****************************************************************/
  // Open documents management
  /****************************************************************/

  @OpenedDocuments.Getter("getAllDocuments") SGET_allOpenedDocuments !: {timestamp: string, docs: I_OpenedDocument[]}
  @OpenedDocuments.Getter("getDocument") SGET_openedDocument!: (id: string) => I_OpenedDocument

  @OpenedDocuments.Mutation("addDocument") SSET_addOpenedDocument!: (input: I_OpenedDocument) => void
  @OpenedDocuments.Mutation("updateDocument") SSET_updateOpenedDocument!: (input: I_OpenedDocument) => void
  @OpenedDocuments.Mutation("removeDocument") SSET_removeOpenedDocument!: (input: I_OpenedDocument) => void

  /**
   * Retrieves value of requested field. If the field doesn't exist, returns false instead
   * @param document - Document object that is expected to contain the field
   * @param fieldID - ID of the field to check
   */
  retrieveFieldValue (document: I_OpenedDocument, fieldID: string) : string | number | [] | false | I_FieldRelationship {
    const fieldData = document?.extraFields

    // Fizzle if field doesnt exist
    if (!fieldData) {
      return false
    }
    const fieldValue = fieldData.find(f => f.id === fieldID)?.value as unknown as string
    return fieldValue
  }

  /**
   * Retrieves array length of requested field. If the field doesn't exist or isn't array, returns false instead
   * @param document - Document object that is expected to contain the field
   * @param fieldID - ID of the field to check
   */
  retrieveFieldLength (document: I_OpenedDocument, fieldID: string) : number | false {
    const fieldData = document?.extraFields

    // Fizzle if field doesnt exist
    if (!fieldData) {
      return false
    }
    const fieldValue = fieldData.find(f => f.id === fieldID)?.value

    // Fizzle if the value isn't an array
    if (!Array.isArray(fieldValue)) {
      return false
    }
    return fieldValue.length
  }

  /**
   * Refreshes the route
   */
  refreshRoute () {
    const remainingDocuments = this.SGET_allOpenedDocuments.docs

    // Assuming there are any documents in the current list
    if (remainingDocuments.length > 0) {
      const lastDocument = remainingDocuments[remainingDocuments.length - 1]
      const currentRoute = this.$router.currentRoute.path
      const existingDocument = this.SGET_allOpenedDocuments.docs.find(e => {
        return e.url === currentRoute
      })

      // Prevent infite route cycling by checking if this actually exists in the open tabs
      if (existingDocument) {
        return
      }

      // Load a new route if the new route isnt the one we are already on
      const newRoute = `/project/display-content/${lastDocument.type}/${lastDocument._id}`
      if (currentRoute !== newRoute) {
        this.$router.push({ path: newRoute }).catch(e => console.log(e))
      }
    }
    // If there are no documents inthe list, just navigate to the front page of the project
    else {
      this.$router.push({ path: "/project" }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      }
      )
    }
  }
}
