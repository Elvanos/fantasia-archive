<template>

   <div
      class="appSearchBox bg-dark"
   >

  </div>

</template>

<script lang="ts">

import { Component } from "vue-property-decorator"
import { remote } from "electron"

import BaseClass from "src/BaseClass"
import projectCloseCheckDialog from "src/components/dialogs/ProjectCloseCheck.vue"

// @ts-ignore
import { FindInPage } from "electron-find"

interface I_FindInPage{
  openFindWindow: () => void
  closeFindWindow: () => void
  destroy: () => void
  options?: {
    preload?: boolean
    parentElement?: HTMLElement
    duration?: number
    offsetTop?: number
    offsetRight?: number
    boxBgColor?: string
    boxShadowColor?: string
    inputColor?: string
    inputBgColor?: string
    inputFocusColor?: string
    textColor?: string
    textHoverBgColor?: string
    caseSelectedColor?: string
  }
}

@Component({
  components: { projectCloseCheckDialog }
})
export default class AppWindowButtons extends BaseClass {
  findInPageInstance = null as unknown as I_FindInPage
  findInPageDOM = null as unknown as HTMLElement

  mounted () {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.findInPageInstance = new FindInPage(remote.getCurrentWebContents(), {
      preload: true,
      duration: 0,
      parentElement: document.querySelector(".appSearchBox")
    })

    this.findInPageInstance.openFindWindow()
    this.findInPageDOM = document.querySelector(".find-box") as HTMLElement

    setTimeout(() => {
      setInterval(() => {
        if (this.findInPageDOM.style.visibility === "hidden") {
          this.findInPageInstance.destroy()
        }
      }, 100)
    }, 350)
  }

  beforeUnmount () {
    this.findInPageInstance.destroy()
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss" >

</style>
