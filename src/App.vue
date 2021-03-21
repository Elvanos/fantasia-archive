<template>
  <div id="q-app">
    <appWindowButtons />
    <router-view />
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

@Component({
  components: {
    appWindowButtons: appWindowButtons
  }
})
export default class App extends BaseClass {
  created () {
    window.addEventListener("auxclick", this.reactToMiddleClick)

    document.body.onmousedown = function (e) {
      if (e.button === 1) {
        e.preventDefault()
        return false
      }
    }

    this.loadSettings().catch(e => console.log(e))
    window.addEventListener("keydown", this.triggerKeyPush)
    this.loadHintPopup()
  }

  popupCheck = 0

  starupNotif = null as any

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

    this.starupNotif = this.$q.notify({
      timeout: 15000,
      icon: "mdi-help",
      type: "info",
      message: "Did you know?",
      caption: messageToShow,
      actions: [{ icon: "mdi-close", color: "white" }]
    })
  }

  @Watch("$route", { deep: true })
  onUrlChange () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.starupNotif()
  }

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

  destroyed () {
    window.removeEventListener("auxclick", this.reactToMiddleClick)

    this.deregisterCustomKeybinds()
    this.deregisterDefaultKeybinds()
    window.removeEventListener("keydown", this.triggerKeyPush)
  }

  reactToMiddleClick (e: {button: number, preventDefault: ()=> void}) {
    if (e.button === 1) {
      e.preventDefault()
    }
  }

  registerDefaultKeybinds () {
    defaultKeybinds.forEach(e => this.SSET_registerDefaultKeybind(e))
  }

  deregisterDefaultKeybinds () {
    defaultKeybinds.forEach(e => this.SSET_deregisterDefaultKeybind(e))
  }

  registerCustomKeybinds () {
    setTimeout(() => {
      this.SGET_options.userKeybindList.forEach(e => this.SSET_registerUserKeybind(e))
    }, 1000)
  }

  deregisterCustomKeybinds () {
    defaultKeybinds.forEach(e => this.SSET_deregisterUserKeybind(e))
  }

  async loadSettings () {
    const SettingsDB = new PouchDB("fa-settings")
    const settingsData = await SettingsDB.allDocs({ include_docs: true })
    const settings = settingsData?.rows[0]?.doc as unknown as OptionsStateInteface

    if (settings) {
      this.SSET_options(settings)
    }

    this.registerDefaultKeybinds()
    this.registerCustomKeybinds()
  }

  @Watch("SGET_options", { deep: true })
  onSettingsChange () {
    const options = this.SGET_options
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
}
</script>
