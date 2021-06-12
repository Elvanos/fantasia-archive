<template>
  <q-page class="column items-center justify-center">

    <!-- Import project dialog -->
    <loadProjectCheckDialog
      :dialog-trigger="loadProjectDialogTrigger"
      @trigger-dialog-close="loadProjectDialogClose"
    />

    <!-- New project dialog -->
    <newProjectCheckDialog
      :dialog-trigger="newProjectDialogTrigger"
      @trigger-dialog-close="newProjectDialogClose"
    />

      <div class="col-12">
        <h5 class="mainSubTitle">Welcome to </h5>
      </div>
      <div class="col-12">
        <h2 class="mainTitle">Fantasia Archive</h2>
      </div>

      <div class="col-12 q-mb-lg">
       <q-btn
          v-if="projectExists"
          color="primary"
          size="md"
          :outline="isDarkMode"
          class="q-px-xl q-py-xs"
          to="/project"
        >
        <div>Resume project </div>
       </q-btn>
      </div>

      <div class="col-12 q-mb-lg">
        <q-btn
          color="primary"
          size="md"
          :outline="isDarkMode"
          class="q-px-xl q-py-xs"
          @click="newProjectAssignUID"
        >
         New Project
        </q-btn>
      </div>

      <div class="col-12">
       <q-btn
          color="primary"
          :outline="isDarkMode"
          size="md"
          class="q-px-xl q-py-xs"
          @click="saveProjectAssignUID()"
        >
        Load existing project
       </q-btn>
      </div>

      <template v-if="!hideWelcomeScreenSocials">
        <q-separator color="primary" horizonatal dark class="q-mt-xl q-mb-lg" style="opacity: 0.5; width: 400px;" />

        <div class="col-12 q-mx-sm q-my-md">
          <div class="patreonButton shadow-1" @click="openPatreonLink">
            Support Fantasia Archive on Patreon!
          </div>
        </div>

        <div class="col-12 q-mb-lg">
          <div class="row">

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

      </template>

  </q-page>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import loadProjectCheckDialog from "src/components/dialogs/LoadProjectCheck.vue"
import newProjectCheckDialog from "src/components/dialogs/NewProjectCheck.vue"
import { shell } from "electron"

@Component({
  components: {
    loadProjectCheckDialog,
    newProjectCheckDialog
  }
})
export default class WelcomeScreen extends BaseClass {
  /****************************************************************/
  // LOCAL SETTINGS
  /****************************************************************/

  /**
   * React to changes on the options store
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.isDarkMode = options.darkMode
    this.hideWelcomeScreenSocials = options.hideWelcomeScreenSocials
  }

  /**
   * Determines if the page should show in dark mode or not
   */
  isDarkMode = false

  /**
   * Determines if the welcome screen social links should show or not
   */
  hideWelcomeScreenSocials = false

  /****************************************************************/
  // BASIC DATA
  /****************************************************************/

  /**
   * Determines if any project exists on the window
   */
  projectExists: undefined | string | boolean = false

  /****************************************************************/
  // COMPONENT FUNCTIONALITY
  /****************************************************************/

  /**
   * Get project name upon creation
   * For the purposes of this component, we only check if the project exists via this
   */
  created () {
    this.checkProjectStatus()
  }

  @Watch("SGET_getProjectName")
  checkProjectStatus () {
    this.projectExists = (this.SGET_getProjectName.length > 0)
  }

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

  /****************************************************************/
  // NEW PROJECT DIALOG
  /****************************************************************/
  newProjectDialogTrigger: string | false = false
  newProjectDialogClose () {
    this.newProjectDialogTrigger = false
  }

  newProjectAssignUID () {
    this.newProjectDialogTrigger = this.generateUID()
  }

  /****************************************************************/
  // IMPORT PROJECT DIALOG
  /****************************************************************/
  loadProjectDialogTrigger: string | false = false
  loadProjectDialogClose () {
    this.loadProjectDialogTrigger = false
  }

  saveProjectAssignUID () {
    this.loadProjectDialogTrigger = this.generateUID()
  }
}
</script>

<style  lang="scss">

.mainTitle {
  color: var(--q-color-dark);
}

body.body--dark {
  .mainTitle {
    color: var(--q-color-primary);
  }
}
</style>

<style scoped lang="scss">

.mainSubTitle {
  margin-top: 0;
  margin-bottom: 0;
  opacity: 0.8;
}

.mainTitle {
  position: relative;
  margin-top: 10px;
  font-weight: 500;

  &::after {
    content: '';
    top: -25px;
    right: -95px;
    position: absolute;
    height: 100px;
    width: 90px;
    background-image: url('../assets/appLogo.png');
    background-repeat: no-repeat;
    background-size: contain;
    transform: scaleX(-1);
    filter: drop-shadow(-1px 1px 2px var(--q-color-dark));
  }

  &::before {
    content: '';
    top: -25px;
    left: -95px;
    position: absolute;
    height: 100px;
    width: 90px;
    background-image: url('../assets/appLogo.png');
    background-repeat: no-repeat;
    background-size: contain;
    filter: drop-shadow(-1px 1px 2px var(--q-color-dark));
  }
}
</style>
