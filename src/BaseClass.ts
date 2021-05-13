import { OptionsStateInteface } from "./store/module-options/state"
import { KeyManagementInterface } from "./store/module-keybinds/state"
import { I_OpenedDocument, I_ShortenedDocument } from "./interfaces/I_OpenedDocument"
import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { I_NewObjectTrigger } from "src/interfaces/I_NewObjectTrigger"
import { uid, colors, extend } from "quasar"
import { I_FieldRelationship } from "src/interfaces/I_FieldRelationship"
import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"

const Blueprints = namespace("blueprintsModule")
const AllDocuments = namespace("allDocumentsModule")
const OpenedDocuments = namespace("openedDocumentsModule")
const Keybinds = namespace("keybindsModule")
const Options = namespace("optionsModule")
const Dialogs = namespace("dialogsModule")
const FloatingWindows = namespace("floatingWindowsModule")

@Component
export default class BaseClass extends Vue {
  /****************************************************************/
  // UTILITY FUNCTIONS
  /****************************************************************/

  /**
   * Generates unique ID string
   */
  generateUID () : string {
    return uid()
  }

  /**
   * Retrieves icon color for relationship searches
   * If the current document has "activeTypeSearch" property, then return "primary" color instead
   */
  retrieveIconColor (document: I_ShortenedDocument): string {
    // @ts-ignore
    return (document.activeTypeSearch) ? colors.getBrand("primary") : document.color
  }

  /**
   * Async wait for XY miliseconds
   */
  sleep (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Strip all tags from a string
   */
  stripTags (input: string) {
    return (input) ? input.replace(/<[^>]+>/g, "") : input
  }

  /****************************************************************/
  // FLOATING WINDOWS
  /****************************************************************/

  @FloatingWindows.Getter("getAdvSearchWindowVisible") SGET_getAdvSearchWindowVisible!: string
  @FloatingWindows.Mutation("setAdvSearchWindowVisible") SSET_setAdvSearchWindowVisible!: () => void

  @FloatingWindows.Getter("getNoteCorkboardhWindowVisible") SGET_getNoteCorkboardhWindowVisible!: string
  @FloatingWindows.Mutation("setNoteCorkboardWindowVisible") SSET_setNoteCorkboardWindowVisible!: () => void

  /****************************************************************/
  // KEYBINDS MANAGEMENT
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

    if (!keybind) {
      return keybindString
    }

    if (keybind.ctrlKey) {
      keybindString += "CTRL + "
    }

    if (keybind.altKey) {
      keybindString += "ALT + "
    }

    if (keybind.shiftKey) {
      keybindString += "SHIFT + "
    }

    const keybinds = [37, 38, 39, 40, 9, 32, 13, 192, 189, 187, 219, 221, 220, 186, 222, 188, 190, 191, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]

    if (keybinds.includes(keybind.which)) {
      if (keybind.which === 13) {
        keybindString += "ENTER"
      }
      if (keybind.which === 9) {
        keybindString += "TAB"
      }
      if (keybind.which === 32) {
        keybindString += "SPACE"
      }
      if (keybind.which === 37) {
        keybindString += "LEFT ARROW"
      }
      if (keybind.which === 38) {
        keybindString += "UP ARROW"
      }
      if (keybind.which === 39) {
        keybindString += "RIGHT ARROW"
      }
      if (keybind.which === 40) {
        keybindString += "DOWN ARROW"
      }
      if (keybind.which === 192) {
        keybindString += "`"
      }
      if (keybind.which === 189) {
        keybindString += "-"
      }
      if (keybind.which === 187) {
        keybindString += "+"
      }
      if (keybind.which === 219) {
        keybindString += "["
      }
      if (keybind.which === 221) {
        keybindString += "]"
      }
      if (keybind.which === 220) {
        keybindString += "\\"
      }
      if (keybind.which === 186) {
        keybindString += ";"
      }
      if (keybind.which === 222) {
        keybindString += "'"
      }
      if (keybind.which === 188) {
        keybindString += ","
      }
      if (keybind.which === 190) {
        keybindString += "."
      }
      if (keybind.which === 191) {
        keybindString += "/"
      }
      if (keybind.which === 112) {
        keybindString += "F1"
      }
      if (keybind.which === 113) {
        keybindString += "F2"
      }
      if (keybind.which === 114) {
        keybindString += "F3"
      }
      if (keybind.which === 115) {
        keybindString += "F4"
      }
      if (keybind.which === 116) {
        keybindString += "F5"
      }
      if (keybind.which === 117) {
        keybindString += "F6"
      }
      if (keybind.which === 118) {
        keybindString += "F7"
      }
      if (keybind.which === 119) {
        keybindString += "F8"
      }
      if (keybind.which === 120) {
        keybindString += "F9"
      }
      if (keybind.which === 121) {
        keybindString += "F10"
      }
      if (keybind.which === 122) {
        keybindString += "F11"
      }
      if (keybind.which === 123) {
        keybindString += "F12"
      }
    }
    else {
      keybindString += String.fromCharCode(keybind.which)
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
      currentKeyPress.which === fieldToCheck.which
    ) {
      return true
    }
    else {
      return false
    }
  }

  /****************************************************************/
  // BLUEPRINT MANAGEMENT
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
  openExistingDocumentRouteWithEdit (existingObject:I_OpenedDocument | I_FieldRelationship) {
    const currentDoc = this.findRequestedOrActiveDocument()

    if (currentDoc && existingObject._id === currentDoc._id && !currentDoc.editMode) {
      const dataCopy: I_OpenedDocument = extend(true, {}, currentDoc)
      dataCopy.editMode = true
      const dataPass = { doc: dataCopy, treeAction: false }
      this.SSET_updateOpenedDocument(dataPass)
      return
    }

    this.$router.push({
      path: existingObject.url,
      query: { editMode: "editMode" }
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
  // OPTION MANAGEMENT
  /****************************************************************/

  @Options.Getter("getOptions") SGET_options!: OptionsStateInteface

  @Options.Action("setOptions") SSET_options!: (input: OptionsStateInteface) => void

  toggleHierarchicalTree (): void {
    const optionsSnapshot: OptionsStateInteface = extend(true, {}, this.SGET_options)

    optionsSnapshot.hideHierarchyTree = !optionsSnapshot.hideHierarchyTree

    this.SSET_options(optionsSnapshot)
  }

  /****************************************************************/
  // ALL DOCUMENTS MANAGEMENT
  /****************************************************************/

  @AllDocuments.Getter("getFirstRunState") SGET_allDocumentsFirstRunState!: boolean

  @AllDocuments.Action("markAsNonFirstRun") SSET_allDocumentsMarkAsNonFirstRun!: () => void

  @AllDocuments.Getter("getAllDocuments") SGET_allDocuments !: {
    timestamp: string,
    docs: I_ShortenedDocument[]
  }

  @AllDocuments.Getter("getAllDocumentsWithoutCategories") SGET_allDocumentsWithoutCategories !: {
    timestamp: string,
    docs: I_ShortenedDocument[]
  }

  @AllDocuments.Getter("getDocumentsByType") SGET_allDocumentsByType!: (documentTypeID: string) => {
    timestamp: string,
    id: string,
    docs: I_ShortenedDocument[]
  }

  @AllDocuments.Getter("getDocumentsByTypeWithoutCategories") SGET_allDocumentsByTypeWithoutCategories!: (documentTypeID: string) => {
    timestamp: string,
    id: string,
    docs: I_ShortenedDocument[]
  }

  @AllDocuments.Getter("getDocument") SGET_document!: (id: string) => I_ShortenedDocument

  @AllDocuments.Action("addDocument") SSET_addDocument!: (input: {
    doc: I_ShortenedDocument
  }) => void

  @AllDocuments.Action("updateDocument") SSET_updateDocument!: (input: {
    doc: I_ShortenedDocument
  }) => void

  @AllDocuments.Action("removeDocument") SSET_removeDocument!: (input: {
    doc: I_ShortenedDocument
  }) => void

  @AllDocuments.Action("mapNewDocumentType") SSET_mapNewDocumentType!: (input: {
    id: string,
    docs: I_ShortenedDocument[]
  }) => void

  @AllDocuments.Action("resetDocuments") SSET_resetAllDocuments!: () => void

  /****************************************************************/
  // OPEN DOCUMENTS MANAGEMENT
  /****************************************************************/

  @OpenedDocuments.Getter("getAllDocuments") SGET_allOpenedDocuments !: {
    treeAction: boolean,
    lastRemovedIndex: number,
    timestamp: string,
    docs: I_OpenedDocument[]
  }

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

  @OpenedDocuments.Action("closeAllDocuments") SSET_closeAllDocuments!: () => void
  @OpenedDocuments.Action("forceCloseAllDocuments") SSET_forceCloseAllDocuments!: () => void
  @OpenedDocuments.Action("closeAllButCurrentDocuments") SSET_closeAllButCurrentDocuments!: (input: I_OpenedDocument) => void
  @OpenedDocuments.Action("forceCloseAllButCurrentDocuments") SSET_forceCloseAllButCurrentDocuments!: (input: I_OpenedDocument) => void

  @OpenedDocuments.Action("triggerTreeAction") SSET_triggerTreeAction!: () => void
  @OpenedDocuments.Action("resetDocuments") SSET_resetDocuments!: () => void
  @OpenedDocuments.Action("resetRemoveIndex") SSET_resetRemoveIndex!: () => void

  /**
   * If provided with an document, finds it among the opened list
   * Otherwise retireves the currently opened document based on the currently active route
   */
  findRequestedOrActiveDocument (doc?: I_OpenedDocument) {
    if (doc) {
      return (this.SGET_allOpenedDocuments.docs.find(e => e.url === doc.url)) || false
    }
    else {
      return (this.SGET_allOpenedDocuments.docs.find(e => e.url === this.$route.path)) || false
    }
  }

  /**
   * Retrieves value of requested field. If the field doesn't exist, returns false instead
   * @param document - Document object that is expected to contain the field
   * @param fieldID - ID of the field to check
   */
  retrieveFieldValue (document: I_OpenedDocument| I_ShortenedDocument, fieldID: string) : string | number | [] | false | I_FieldRelationship {
    const fieldData = document?.extraFields

    // Fizzle if field doesnt exist
    if (!fieldData) {
      return false
    }
    const fieldValue = fieldData.find(f => f.id === fieldID)?.value as unknown as string
    return fieldValue
  }

  /**
   * Retrieves value of requested field. If the field doesn't exist, returns false instead
   * @param document - Document object that is expected to contain the field
   * @param fieldID - ID of the field to check
   */
  retrieveFieldType (document: I_OpenedDocument| I_ShortenedDocument, fieldID: string) : string | number | [] | false | I_FieldRelationship {
    const fieldData = document?.extraFields

    // Fizzle if field doesnt exist
    if (!fieldData) {
      return false
    }

    const documentBlueprint = this.SGET_blueprint(document.type)

    const fieldType = documentBlueprint.extraFields.find(f => f.id === fieldID)?.type as unknown as string
    return fieldType
  }

  /**
   * Retrieves value of requested field. If the field doesn't exist, returns false instead
   * @param document - Document object that is expected to contain the field
   * @param fieldID - ID of the field to check
   */
  determineLegacyField (document: I_OpenedDocument| I_ShortenedDocument, fieldID: string) : string | number | [] | false | I_FieldRelationship {
    const fieldData = document?.extraFields

    // Fizzle if field doesnt exist
    if (!fieldData) {
      return false
    }

    const documentBlueprint = this.SGET_blueprint(document.type)

    const legacyField = documentBlueprint.extraFields.find(f => f.id === fieldID)?.isLegacy as unknown as string
    return (legacyField)
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

  @Dialogs.Getter("getDialogsState") SGET_getDialogsState!: boolean

  /**
   * Refreshes the route
   */
  refreshRoute () {
    if (this.SGET_options.disableCloseAftertSelectQuickSearch && this.SGET_getDialogsState) {
      return
    }

    const remainingDocuments = this.SGET_allOpenedDocuments.docs

    const lastIndex = this.SGET_allOpenedDocuments.lastRemovedIndex

    const newIndex = (lastIndex > -1 && lastIndex < remainingDocuments.length) ? lastIndex : remainingDocuments.length - 1

    if (lastIndex > -1) {
      this.SSET_resetRemoveIndex()
    }

    // Assuming there are any documents in the current list
    if (remainingDocuments.length > 0) {
      const lastDocument = remainingDocuments[newIndex]
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
  // DOCUMENT LIST MANAGEMENT
  /****************************************************************/

  /**
   * Recursively retrieves a full hieararchical path from a full list
   */
  getDocumentHieararchicalPath (document: I_OpenedDocument, list: I_OpenedDocument[]) {
    let hierarchicalString = ""

    // @ts-ignore
    const parentDoc = (this.retrieveFieldValue(document, "parentDoc"))?.value

    const parentDocInDB = (list.find(p => p._id === parentDoc?._id))

    if (!parentDoc || (parentDoc && !parentDocInDB)) {
      const singleBlueprintName = this.SGET_allBlueprints.find(e => e._id === document.type)?.nameSingular
      hierarchicalString += singleBlueprintName
      return hierarchicalString
    }

    const matchingDoc = list.find((doc:I_OpenedDocument) => {
      return doc._id === parentDoc._id
    }) as I_OpenedDocument

    // @ts-ignore
    hierarchicalString += this.retrieveFieldValue(matchingDoc, "name")

    // @ts-ignore
    const connectedReturn = this.getDocumentHieararchicalPath(matchingDoc, list)
    if (connectedReturn) {
      hierarchicalString = `${connectedReturn} > ${hierarchicalString}`
    }

    return hierarchicalString
  }

  mapShortDocument (doc: I_ShortenedDocument, dbDocuments: I_OpenedDocument[]) : I_ShortenedDocument {
    return {
      label: doc.extraFields.find(e => e.id === "name")?.value,
      icon: doc.icon,
      // @ts-ignore
      id: doc._id,
      _id: doc._id,
      url: doc.url,
      type: doc.type,
      extraFields: doc.extraFields,
      hasEdits: false,
      // @ts-ignore
      hierarchicalPath: this.getDocumentHieararchicalPath(doc, dbDocuments),
      tags: doc.extraFields.find(e => e.id === "tags")?.value,
      color: doc.extraFields.find(e => e.id === "documentColor")?.value,
      bgColor: doc.extraFields.find(e => e.id === "documentBackgroundColor")?.value,
      isCategory: doc.extraFields.find(e => e.id === "categorySwitch")?.value,
      isMinor: doc.extraFields.find(e => e.id === "minorSwitch")?.value,
      isDead: doc.extraFields.find(e => e.id === "deadSwitch")?.value

    }
  }

  deepFreeze (object: object) {
  // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object)

    // Freeze properties before freezing self

    for (const name of propNames) {
      const value = object[name]

      if (value && typeof value === "object") {
        this.deepFreeze(value)
      }
    }

    return Object.freeze(object)
  }
}
