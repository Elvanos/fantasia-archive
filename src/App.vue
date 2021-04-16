<template>
  <div id="q-app">
    <appWindowButtons />
    <router-view />
     <q-window
      v-model="advSearchWindowVisible"
      no-resize
      title="Advanced Search Cheatsheet"
      :height="480"
      :width="425"
      :start-x="50"
      :start-y="150"
      :actions="['close']"
      content-class="bg-gunmetal-light text-accent advSearchWindow"
    >
      <div class="q-pa-md fit">
        <q-markdown no-heading-anchor-links>
          {{$t('documents.advancedSearchCheatSheet')}}
        </q-markdown>
      </div>
    </q-window>
  </div>
</template>

<script lang="ts">
import BaseClass from "src/BaseClass"
import { Component, Watch } from "vue-property-decorator"
import { defaultKeybinds } from "src/scripts/appSettings/defaultKeybinds"
import appWindowButtons from "src/components/appHeader/AppWindowButtons.vue"
import PouchDB from "pouchdb"
import { OptionsStateInteface } from "./store/module-options/state"
import { colors } from "quasar"
import { tipsTricks } from "src/scripts/utilities/tipsTricks"
import { shell } from "electron"
import { summonAllPlusheForms } from "src/scripts/utilities/plusheMascot"

@Component({
  components: {
    appWindowButtons: appWindowButtons
  }
})
export default class App extends BaseClass {
  /****************************************************************/
  // APP START & END SETUP
  /****************************************************************/

  created () {
    // Catch middle clicks
    window.addEventListener("auxclick", this.reactToMiddleClick)

    // Add a secondary blocker to prevent the middle-mouse button scrolling
    document.body.onmousedown = function (e) {
      if (e.button === 1) {
        e.preventDefault()
        return false
      }
    }

    // Catch normal clicks inside wysiwyg
    window.addEventListener("click", this.openWysiwygLink)

    // Load settings
    this.loadSettings().catch(e => console.log(e))

    // React to keybind presses
    window.addEventListener("keydown", this.triggerKeyPush)

    // Load the popup hint on start
    this.loadHintPopup()
  }

  destroyed () {
    window.removeEventListener("auxclick", this.reactToMiddleClick)

    this.deregisterCustomKeybinds()
    this.deregisterDefaultKeybinds()
    window.removeEventListener("keydown", this.triggerKeyPush)
  }

  /****************************************************************/
  // START NOTIFICATION
  /****************************************************************/

  /**
   * Model for the startup notification
   */
  starupNotif = null as any

  /**
   * Notification checker
   * Can go up to 3
   */
  popupCheck = 0

  /**
   * Show the actual popup
   */
  loadHintPopup () {
    const options = this.SGET_options

    // Considering there is a bit of a delay between the initial load of the store DB content, we give the program 3 attempts to load the data over 3 seconds. If no is loaded in that time, we assume that the settings are not set at all and display the hint as normal.
    if ((!options._id || !options._rev) && this.popupCheck < 3) {
      setTimeout(() => {
        this.popupCheck++
        this.loadHintPopup()
      }, 1000)
      return
    }

    if (options.hideTooltipsStart) {
      return
    }

    const messageToShow = tipsTricks[Math.floor(Math.random() * tipsTricks.length)]
    const plusheForm = summonAllPlusheForms[Math.floor(Math.random() * summonAllPlusheForms.length)]
    this.starupNotif = this.$q.notify({

      timeout: 15000,
      icon: (this.hidePlushes) ? "mdi-help" : undefined,
      color: "info",
      message: "Did you know?",
      avatar: (!this.hidePlushes) ? plusheForm : undefined,
      caption: messageToShow,
      actions: [{ icon: "mdi-close", color: "white" }]
    })
  }

  /**
   * Hide the startup notification if the user changed the route before it disappeared
   */
  @Watch("$route", { deep: true })
  onUrlChange () {
    if (typeof this.starupNotif === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.starupNotif()
    }
  }

  /****************************************************************/
  // KEYBIND HANDLING
  /****************************************************************/

  /**
   * React to keybind combinations being pushed and submit them to the store
   */
  triggerKeyPush (e:any) {
    // console.log("")
    // console.log(`Key: ${e.key}`)
    // console.log(`Ctrl: ${e.ctrlKey}`)
    // console.log(`Shift: ${e.shiftKey}`)
    // console.log(`Alt: ${e.altKey}`)
    // console.log(e)

    if (e?.altKey === true || e?.ctrlKey || e?.shiftKey) {
      const ouputKeycombo = {
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        which: e.which
      }

      this.SSET_updatePressedKey(ouputKeycombo)
    }
  }

  /**
   * Registers a default keybind into the store
   */
  registerDefaultKeybinds () {
    // @ts-ignore
    defaultKeybinds.forEach(e => this.SSET_registerDefaultKeybind(e))
  }

  /**
   * Removes a default keybind from the store
   */
  deregisterDefaultKeybinds () {
    // @ts-ignore
    defaultKeybinds.forEach(e => this.SSET_deregisterDefaultKeybind(e))
  }

  /**
   * Registers a custom keybind into the store
   */
  registerCustomKeybinds () {
    setTimeout(() => {
      this.SGET_options.userKeybindList.forEach(e => this.SSET_registerUserKeybind(e))
    }, 1000)
  }

  /**
   * Removes a custom keybind from the store
   */
  deregisterCustomKeybinds () {
    // @ts-ignore
    defaultKeybinds.forEach(e => this.SSET_deregisterUserKeybind(e))
  }

  /****************************************************************/
  // VARIOUS APP FUNCTIONALITY
  /****************************************************************/

  /**
   * Open wysiwyg links in default browser window
   */
  openWysiwygLink (event: MouseEvent) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (event.target && event.target.tagName.toLowerCase() === "a" && event.target.closest(".fieldWysiwyg")) {
      // @ts-ignore
      shell.openExternal(event.target.href).catch(e => console.log(e))
    }
  }

  /**
   * React to middle mouse button clicks
   */
  reactToMiddleClick (e: {button: number, preventDefault: ()=> void}) {
    if (e.button === 1) {
      e.preventDefault()
      return false
    }
  }

  /**
   * Load settings for the first time upon app load
   */
  async loadSettings () {
    const SettingsDB = new PouchDB("fa-settings")
    const settingsData = await SettingsDB.allDocs({ include_docs: true })
    const settings = settingsData?.rows[0]?.doc as unknown as OptionsStateInteface

    if (settings) {
      this.SSET_options(settings)
    }

    this.registerDefaultKeybinds()
    this.registerCustomKeybinds()

    await SettingsDB.close()
  }

  /**
   * Update dark/light mode across the app based on what is currently in the store
   */
  @Watch("SGET_options", { deep: true })
  onSettingsChange () {
    const options = this.SGET_options

    this.hidePlushes = options.hidePlushes
    this.$q.dark.set(options.darkMode)
    if (options.darkMode) {
      colors.setBrand("dark", "#1b333e")
      colors.setBrand("primary", "#ffd673")
    }
    else {
      colors.setBrand("dark", "#18303a")
      colors.setBrand("primary", "#e8bb50")
    }
  }

  /**
   * Hides the mascot... nooo :(
   */
  hidePlushes = false

  @Watch("SGET_getAdvSearchWindowVisible")
  onAdvSearchWindowOpen () {
    this.advSearchWindowVisible = true
  }

  advSearchWindowVisible = false

  /****************************************************************/
  // Local keybinds
  /****************************************************************/

  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Toggle the Advanced search cheatsheet
    if (this.determineKeyBind("toggleAdvSearchCheatsheet")) {
      this.advSearchWindowVisible = !this.advSearchWindowVisible
    }
  }
}
</script>
