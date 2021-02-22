<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import BaseClass from "src/BaseClass"
import { Component } from "vue-property-decorator"
import { defaultKeybinds } from "src/appSettings/defaultKeybinds"
@Component
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
  }

  destroyed () {
    window.removeEventListener("auxclick", this.reactToMiddleClick)

    this.deregisterDefaultKeybinds()
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
