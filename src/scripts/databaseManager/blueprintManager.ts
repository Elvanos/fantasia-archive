import { I_Blueprint } from "../../interfaces/I_Blueprint"

import PouchDB from "pouchdb"
import _ from "lodash"

import { charactersBlueprint } from "src/scripts/databaseManager/blueprints/characters"
import { chaptersBlueprint } from "src/scripts/databaseManager/blueprints/chapters"
import { currenciesBlueprint } from "src/scripts/databaseManager/blueprints/currencies"
import { eventsBlueprint } from "src/scripts/databaseManager/blueprints/events"
import { languagesBlueprint } from "src/scripts/databaseManager/blueprints/languages"
import { locationsBlueprint } from "src/scripts/databaseManager/blueprints/locations"
import { loreNotesBlueprint } from "src/scripts/databaseManager/blueprints/loreNotes"
import { politicalGroupsBlueprint } from "src/scripts/databaseManager/blueprints/politicalGroups"
import { racesBlueprint } from "src/scripts/databaseManager/blueprints/races"
import { religionsBlueprint } from "src/scripts/databaseManager/blueprints/religions"
import { mythsBlueprint } from "src/scripts/databaseManager/blueprints/myths"
import { magicBlueprint } from "src/scripts/databaseManager/blueprints/magic"
import { techBlueprint } from "src/scripts/databaseManager/blueprints/scienceTechnology"
import { itemsBlueprint } from "src/scripts/databaseManager/blueprints/items"

/**
 * Loads all the blueprints and processes them apropriatelly
 */
export const engageBlueprints = async () => {
  const BlueprintsDB = new PouchDB("blueprints")

  /**
   * List of all blueprintes needed to get processed
   */
  const allBluePrints: I_Blueprint[] = [
    charactersBlueprint,
    chaptersBlueprint,
    currenciesBlueprint,
    eventsBlueprint,
    languagesBlueprint,
    locationsBlueprint,
    loreNotesBlueprint,
    politicalGroupsBlueprint,
    racesBlueprint,
    religionsBlueprint,
    mythsBlueprint,
    magicBlueprint,
    techBlueprint,
    itemsBlueprint
  ]

  /**
   * Processes all blueprints
   */
  for (const newBlueprint of allBluePrints) {
    try {
    // Try adding a brand new data blueprint
      await BlueprintsDB.put(newBlueprint)
    }
    catch (e) {
      // Proceed with checking of the contents of the blueprint if it already exists
      const currentBlueprint = await BlueprintsDB.get(newBlueprint._id) as I_Blueprint
      const hasChanges = checkBlueprintUpdate(newBlueprint, currentBlueprint)

      // If there are changes, overwrite the old with new
      if (hasChanges) {
        newBlueprint._rev = currentBlueprint._rev
        await BlueprintsDB.put(newBlueprint)
      }
    }
  }
  await BlueprintsDB.close()
}

/**
 * Checks if there are any changes to the blueprint being processed by comparing it with the old one
 * @param newBlueprint The updated blueprint freshly retrieved from the source file
 * @param currentBlueprint The current blueprint existing in the database
 */
export const checkBlueprintUpdate = (newBlueprint: I_Blueprint, currentBlueprint: I_Blueprint): boolean => {
  let hasChanges = false

  // Check for naming and icon changes and compare the extra fields via Lodash
  if (
    newBlueprint?.namePlural !== currentBlueprint?.namePlural ||
    newBlueprint?.nameSingular !== currentBlueprint?.nameSingular ||
    newBlueprint?.icon !== currentBlueprint?.icon ||
    _.isEqual(newBlueprint.extraFields, currentBlueprint.extraFields) === false
  ) {
    hasChanges = true
  }

  return hasChanges
}

/**
 * Retrieves all blueprints
 */
export const retrieveAllBlueprints = async () => {
  const BlueprintsDB = new PouchDB("blueprints")
  const allBlueprints = await BlueprintsDB.allDocs({ include_docs: true })
  await BlueprintsDB.close()

  return allBlueprints
}
