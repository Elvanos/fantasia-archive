<template>
  <div id="q-app">
    <appWindowButtons />
    <router-view />
  </div>
</template>

<script lang="ts">
import BaseClass from "src/BaseClass"
import { Component } from "vue-property-decorator"
import { defaultKeybinds } from "src/scripts/appSettings/defaultKeybinds"
import appWindowButtons from "src/components/appHeader/AppWindowButtons.vue"

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

    this.registerDefaultKeybinds()
    window.addEventListener("keyup", this.triggerKeyPush)
  }

  triggerKeyPush (e:any) {
    if (e?.altKey === true || e?.ctrlKey || e?.shiftKey) {
      const ouputKeycombo = {
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        keyCode: e.keyCode
      }

      this.SSET_updatePressedKey(ouputKeycombo)
    }
  }

  destroyed () {
    window.removeEventListener("auxclick", this.reactToMiddleClick)

    this.deregisterDefaultKeybinds()
    window.removeEventListener("keyup", this.triggerKeyPush)
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
}
</script>
