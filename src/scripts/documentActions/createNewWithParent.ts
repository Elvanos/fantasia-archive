import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

/**
 * Toggles dev tools in the current window
 */
export const createNewWithParent = (currentDoc: I_OpenedDocument, callingComponent: any) => {
  if (currentDoc) {
    const routeObject = {
      _id: currentDoc.type,
      // @ts-ignore
      parent: (currentDoc._id) || currentDoc.id
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callingComponent.addNewObjectRoute(routeObject)
  }
}
