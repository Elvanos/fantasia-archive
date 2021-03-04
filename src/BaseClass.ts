import { KeyManagementInterface } from "./store/module-keybinds/state"
import { I_OpenedDocument, I_ShortenedDocument } from "./interfaces/I_OpenedDocument"
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_NewObjectTrigger } from "src/interfaces/I_NewObjectTrigger"
import { uid, colors } from "quasar"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"
import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"

const Blueprints = namespace("blueprintsModule")
const OpenedDocuments = namespace("openedDocumentsModule")
const Keybinds = namespace("keybindsModule")

@Component
export default class BaseClass extends Vue {
  generateUID () : string {
    return uid()
  }

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

  @OpenedDocuments.Getter("getAllDocuments") SGET_allOpenedDocuments !: {treeAction: boolean, timestamp: string, docs: I_OpenedDocument[]}
  @OpenedDocuments.Getter("getDocument") SGET_openedDocument!: (id: string) => I_OpenedDocument

  @OpenedDocuments.Action("addDocument") SSET_addOpenedDocument!: (input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) => void

  @OpenedDocuments.Action("updateDocument") SSET_updateOpenedDocument!: (input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) => void

  @OpenedDocuments.Action("removeDocument") SSET_removeOpenedDocument!: (input: {
    doc: I_OpenedDocument,
    treeAction: boolean
  }) => void

  @OpenedDocuments.Action("triggerTreeAction") SSET_triggerTreeAction!: () => void
  @OpenedDocuments.Action("resetDocuments") SSET_resetDocuments!: () => void

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

  /****************************************************************/
  // Document list management
  /****************************************************************/
  getDocumentHieararchicalPath (document: I_OpenedDocument, list: I_OpenedDocument[]): string {
    let hierarchiString = ""

    // @ts-ignore
    const parentDoc = (this.retrieveFieldValue(document, "parentDoc"))?.value
    if (!parentDoc) {
      const singleBlueprintName = this.SGET_allBlueprints.find(e => e._id === document.type)?.nameSingular
      hierarchiString += singleBlueprintName
      return hierarchiString
    }
    const matchingDoc = list.find((doc:I_OpenedDocument) => {
      // @ts-ignore
      return doc.id === parentDoc._id
    }) as I_OpenedDocument

    // @ts-ignore
    hierarchiString += this.retrieveFieldValue(matchingDoc.doc, "name")

    // @ts-ignore
    const connectedReturn = this.getDocumentHieararchicalPath(matchingDoc.doc, list)
    if (connectedReturn) {
      hierarchiString = `${connectedReturn} > ${hierarchiString}`
    }

    return hierarchiString
  }

  retrieveIconColor (document: I_ShortenedDocument): string {
    // @ts-ignore
    return (document.activeTypeSearch) ? colors.getBrand("primary") : document.color
  }

  sleep (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
