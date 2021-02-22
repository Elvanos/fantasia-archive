import { BlueprintStateInterface } from "./module-blueprints/state"
import { store } from "quasar/wrappers"
import Vuex from "vuex"

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

import blueprintsModule from "./module-blueprints"
import openedDocumentsModule from "./module-openedDocuments"
import keybindsModule from "./module-keybinds"

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  blueprintsModule: BlueprintStateInterface;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      blueprintsModule,
      openedDocumentsModule,
      keybindsModule
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  })

  return Store
})
