<template>

  <q-dialog
    v-model="dialogModel"
    @hide="triggerDialogClose"
    >
    <q-card
      class="aboutDialog"
      dark
    >
      <q-card-section>
        <h6 class="text-center q-mt-lg q-mb-sm">About Fantasia Archive</h6>
      </q-card-section>

        <q-card-section>
          <div>
            Currently running Fantasia Archive version: <span class="text-bold text-primary">{{appVersion}}</span>
          </div>
       </q-card-section>

      <q-separator color="primary" horizonatal dark class="q-my-lg q-mx-auto" style="opacity: 0.5; width: 400px;" />

       <q-card-section>
        <div class="col-12 q-mx-sm q-my-md">
          <div class="patreonButton shadow-1" @click="openPatreonLink">
            Support Fantasia Archive on Patreon!
          </div>
        </div>

        <div class="col-12 q-mb-lg">
          <div class="row justify-center">

            <div class="q-mx-sm q-my-md">
              <div class="discordButton shadow-1" @click="openDiscordInviteLink">
                Discord
              </div>
            </div>

            <div class="q-mx-sm q-my-md">
              <div class="redditButton shadow-1" @click="openRedditLink"></div>
            </div>

            <div class="q-mx-sm q-my-md">
              <div class="websiteButton shadow-1" @click="openWebsiteLink">
                Website
              </div>
            </div>

            <div class="q-mx-sm q-my-md">
              <div class="githubButton shadow-1" @click="openGithubLink">
                GitHub
              </div>
            </div>

          </div>
        </div>

       </q-card-section>

      <q-card-actions align="around" class="q-mb-lg q-mt-md">
          <q-btn flat label="Close" color="accent" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import { shell, remote } from "electron"

import DialogBase from "src/components/dialogs/_DialogBase"
@Component({
  components: { }
})
export default class AboutApp extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
    }
  }

  /**
   * Current app version
   * NOTE: Show Electon version in DEV mode instead of NPM package version
   */
  appVersion = remote.app.getVersion()

  /**
   * Open Discord invite link in thw default browser window
   */
  openDiscordInviteLink () {
    shell.openExternal("https://discord.gg/JQDBvsN9Te").catch(e => console.log(e))
  }

  /**
   * Open Patreon link in thw default browser window
   */
  openPatreonLink () {
    shell.openExternal("https://www.patreon.com/elvanos").catch(e => console.log(e))
  }

  /**
   * Open Reddit link in thw default browser window
   */
  openRedditLink () {
    shell.openExternal("https://www.reddit.com/r/FantasiaArchive/").catch(e => console.log(e))
  }

  /**
   * Open Website link in thw default browser window
   */
  openWebsiteLink () {
    shell.openExternal("http://fantasiaarchive.com/").catch(e => console.log(e))
  }

  /**
   * Open GitHub link in thw default browser window
   */
  openGithubLink () {
    shell.openExternal("https://github.com/Elvanos/fantasia-archive").catch(e => console.log(e))
  }
}
</script>

<style lang="scss">
.aboutDialog {
  text-align: center;
  width: 650px;
  max-width: 650px !important;

  h6 {
    display: block;
  }
}
</style>
