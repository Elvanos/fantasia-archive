<template>

  <div
    :class="{'AppControl': isProject}"
  >
    <projectCloseCheckDialog
     :dialog-trigger="projectCloseCheckDialogTrigger"
     :dialog-mode="'projectClose'"
      @trigger-dialog-close="projectCloseCheckDialogClose"
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
          >
          <q-list class="bg-gunmetal-light" dark>
            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              @click="navigateToProjectPage"
              :disable="!projectExists || isProjectPage"
            >
              <q-item-section>Go to project screen</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
              @click="exportProject(projectName)"
              :disable="!projectExists"
            >
              <q-item-section>Export project</q-item-section>
            </q-item>

            <q-separator dark />

            <q-item
              v-close-popup
              clickable
              active
              active-class="bg-gunmetal-light text-cultured"
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

        <q-menu anchor="bottom left" class="bg-gunmetal-light" dark>
          <q-list class="bg-gunmetal-light" dark>
            <q-item
            @click="toggleDevTools"
            v-close-popup
            clickable
            active
            active-class="bg-gunmetal-light text-cultured"
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

import { Component, Prop } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import projectCloseCheckDialog from "src/components/dialogs/ProjectCloseCheck.vue"

import { retrieveCurrentProjectName, exportProject } from "src/scripts/projectManagement/projectManagent"

import { toggleDevTools } from "src/scripts/utilities/devTools"
@Component({
  components: { projectCloseCheckDialog }
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
}
</script>

<style lang="scss" scoped>
.AppControl {
  background: rgba(0, 0, 0, 0.1);

  &__buttons {
    height: 40px;
  }
}
</style>
