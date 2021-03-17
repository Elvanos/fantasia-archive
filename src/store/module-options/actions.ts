import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { OptionsStateInteface } from "./state"
import PouchDB from "pouchdb"

const actions: ActionTree<OptionsStateInteface, StateInterface> = {

  async setOptions (state, input: OptionsStateInteface) {
    const SettingsDB = new PouchDB("fa-settings")
    const FASettings = input

    let currentSettings = false as unknown as OptionsStateInteface
    try {
      currentSettings = await SettingsDB.get("settings")
      FASettings._rev = currentSettings?._rev
    }
    catch (error) {}

    await SettingsDB.put(FASettings)
    state.commit("setOptions", input)
  }
}

export default actions
