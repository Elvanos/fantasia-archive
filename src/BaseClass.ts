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

const Blueprints = namespace("blueprintsModule")
const OpenedDocuments = namespace("openedDocumentsModule")

@Component
export default class BaseClass extends Vue {
  /****************************************************************/
  // Project management
  /****************************************************************/
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

  exportProject (projectName: string) {
    /*eslint-disable */
    remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    }).then(async (result) => {
      const folderPath = result.filePaths[0]

      PouchDB.plugin(replicationStream.plugin)
      //@ts-ignore
      PouchDB.adapter("writableStream", replicationStream.adapters.writableStream)

      //@ts-ignore
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

        //@ts-ignore
        await CurrentDB.dump(ws)
      }
    }).catch(err => {
      console.log(err)
    })
    /* eslint-enable */
  }

  async removeCurrentProject () {
    /*eslint-disable */
    //@ts-ignore
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

  addNewObjectType (e: I_NewObjectTrigger) {
    // console.log(e.id)

    this.$router.push({ path: `/project/display-content/${e._id}/${uid()}` }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }

  openExistingDocument (e:I_OpenedDocument | I_FieldRelationship) {
    this.$router.push({ path: e.url }).catch((e: {name: string}) => {
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

  retrieveFieldValue (fieldDataWrapper: I_OpenedDocument, fieldID: string) : string | [] | false | I_FieldRelationship {
    const fieldData = fieldDataWrapper?.extraFields
    if (!fieldData) { return false }
    const fieldValue = fieldData.find(f => f.id === fieldID)?.value as unknown as string
    return fieldValue
  }

  retrieveFieldLength (fieldDataWrapper: I_OpenedDocument, fieldID: string) : number | false {
    /*eslint-disable */
    const fieldData = fieldDataWrapper?.extraFields
    if (!fieldData) { return false } 
    const fieldValueLength = fieldData.find(f => f.id === fieldID)?.value.length as unknown as number
    return fieldValueLength
    /* eslint-enable */
  }

  refreshRoute () {
    const remainingDocuments = this.SGET_allOpenedDocuments.docs

    if (remainingDocuments.length > 0) {
      const lastDocument = remainingDocuments[remainingDocuments.length - 1]
      const currentRoute = this.$router.currentRoute.path

      const existingDocument = this.SGET_allOpenedDocuments.docs.find(e => {
        return e.url === currentRoute
      })

      // Prevent infite route cycling by checking if this actually exists in the open tabs
      if (existingDocument) { return }

      const newRoute = `/project/display-content/${lastDocument.type}/${lastDocument._id}`
      if (currentRoute !== newRoute) {
        this.$router.push({ path: newRoute }).catch(e => console.log(e))
      }
    } else {
      this.$router.push({ path: "/project" }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") { console.log(e) }
      }
      )
    }
  }
}
