<template>

  <div
    :class="{'AppControl': isProject}"
  >
    <!-- Project close dialog -->
    <projectCloseCheckDialog
     :dialog-trigger="projectCloseCheckDialogTrigger"
     :dialog-mode="'projectClose'"
      @trigger-dialog-close="projectCloseCheckDialogClose"
    />

    <!-- Keybind dialog -->
    <keybindCheatsheetDialog
      :dialog-trigger="keybindsDialogTrigger"
      @trigger-dialog-close="keybindsDialogClose"
    />

    <!-- Import project dialog -->
    <importProjectCheckDialog
      :dialog-trigger="importProjectDialogTrigger"
      @trigger-dialog-close="importProjectDialogClose"
    />

    <!-- New project dialog -->
    <newProjectCheckDialog
      :dialog-trigger="newProjectDialogTrigger"
      @trigger-dialog-close="newProjectDialogClose"
    />

    <q-btn-group
      flat
      class="AppControl__buttons"
    >

      <!-- Options button -->
      <q-btn
        flat
        v-if="true === false"
        :ripple="false"
        dark
        size='md'
        no-caps
       >
        Options
      </q-btn>

      <!-- Project button-->
      <q-btn
        flat
        :ripple="false"
        dark
        size='md'
        no-caps
       >
        Project

        <q-menu
          @show="checkProjectStatus"
          anchor="bottom left"
          class="bg-gunmetal-light"
          dark
          square
          >
          <q-list class="bg-gunmetal-light" dark>

             <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              @click="newProjectAssignUID"
            >
              <q-item-section>New project</q-item-section>
            </q-item>

            <q-separator dark />

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              @click="exportProject(projectName)"
              :disable="!projectExists"
            >
              <q-item-section>Export current project</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              @click="importProjectAssignUID"
            >
              <q-item-section>Import existing project</q-item-section>
            </q-item>

            <q-separator dark />

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              @click="navigateToProjectPage"
              :disable="!projectExists || isProjectPage"
            >
              <q-item-section>Resume project</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              @click="projectCloseCheckDialogAssignUID"
              :disable="!projectExists || isFrontpage"
            >
              <q-item-section>Close project</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <!-- Help button-->
      <q-btn
        flat
        :ripple="false"
        dark
        size='md'
        no-caps
       >
        Help
        <q-menu
          anchor="bottom left"
          class="bg-gunmetal-light"
          dark
          square
        >
          <q-list class="bg-gunmetal-light" dark>
            <q-item
              @click="keybindsDialogAssignUID"
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              >
              <q-item-section>Show keybind cheatsheet</q-item-section>
            </q-item>

            <q-separator dark />

            <q-item
              @click="toggleDevTools"
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              class="noHigh"
              >
              <q-item-section>Toggle developer tools</q-item-section>
            </q-item>

          </q-list>
        </q-menu>

      </q-btn>
    </q-btn-group>

  </div>

</template>

<script lang="ts">

import { Component, Prop, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import projectCloseCheckDialog from "src/components/dialogs/ProjectCloseCheck.vue"
import keybindCheatsheetDialog from "src/components/dialogs/KeybindCheatsheet.vue"
import importProjectCheckDialog from "src/components/dialogs/ImportProjectCheck.vue"
import newProjectCheckDialog from "src/components/dialogs/NewProjectCheck.vue"

import { retrieveCurrentProjectName, exportProject } from "src/scripts/projectManagement/projectManagent"

import { toggleDevTools } from "src/scripts/utilities/devTools"
@Component({
  components: {
    projectCloseCheckDialog,
    keybindCheatsheetDialog,
    importProjectCheckDialog,
    newProjectCheckDialog
  }
})
export default class AppControl extends BaseClass {
  @Prop() readonly isProject!: boolean

  toggleDevTools = toggleDevTools
  retrieveCurrentProjectName = retrieveCurrentProjectName
  exportProject = exportProject
  projectExists: undefined | string | boolean = false
  isFrontpage = true
  isProjectPage = true
  projectName = ""

  created () {
    this.checkProjectStatus().catch(e => console.log(e))
  }

  async checkProjectStatus () {
    this.projectName = await retrieveCurrentProjectName()
    this.projectExists = !!(await retrieveCurrentProjectName())
    this.isFrontpage = (this.$route.path === "/")
    this.isProjectPage = (this.$route.path === "/project")
  }

  projectCloseCheckDialogTrigger: string | false = false
  projectCloseCheckDialogClose () {
    this.projectCloseCheckDialogTrigger = false
  }

  projectCloseCheckDialogAssignUID () {
    this.projectCloseCheckDialogTrigger = this.generateUID()
  }

  navigateToProjectPage () {
    this.$router.push({ path: "/project" }).catch((e: {name: string}) => {
      if (e && e.name !== "NavigationDuplicated") {
        console.log(e)
      }
    })
  }

  importProjectDialogTrigger: string | false = false
  importProjectDialogClose () {
    this.importProjectDialogTrigger = false
  }

  importProjectAssignUID () {
    this.importProjectDialogTrigger = this.generateUID()
  }

  newProjectDialogTrigger: string | false = false
  newProjectDialogClose () {
    this.newProjectDialogTrigger = false
  }

  newProjectAssignUID () {
    this.newProjectDialogTrigger = this.generateUID()
  }

  /**
   * Local keybinds
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Keybind cheatsheet
    if (this.determineKeyBind("openKeybindsCheatsheet")) {
      this.keybindsDialogAssignUID()
    }
  }

  /****************************************************************/
  // Keybings cheatsheet dialog
  /****************************************************************/

  keybindsDialogTrigger: string | false = false
  keybindsDialogClose () {
    this.keybindsDialogTrigger = false
  }

  keybindsDialogAssignUID () {
    this.keybindsDialogTrigger = this.generateUID()
  }
}
</script>

<style lang="scss" scoped>
.AppControl {
  background: rgba(0, 0, 0, 0.1);

  &__buttons {
    height: 40px;
    -webkit-app-region: no-drag;
  }
}
</style>
