<template>
  <q-page class="column items-center justify-center">

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

      <div class="col-12">
        <h3>Welcome to Fantasia Archive</h3>
      </div>

      <div class="col-12 q-mb-lg">
       <q-btn
          v-if="projectExists"
          color="primary"
          size="md"
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
          class="q-px-xl q-py-xs"
          @click="newProjectAssignUID"
        >
         New Project
        </q-btn>
      </div>

      <div class="col-12 q-mb-lg">
       <q-btn
          color="primary"
          size="md"
          class="q-px-xl q-py-xs"
          @click="importProjectAssignUID()"
        >
        Import existing project
       </q-btn>
      </div>

  </q-page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import importProjectCheckDialog from "src/components/dialogs/ImportProjectCheck.vue"
import newProjectCheckDialog from "src/components/dialogs/NewProjectCheck.vue"

import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: {
    importProjectCheckDialog,
    newProjectCheckDialog

  }
})
export default class WelcomeScreen extends BaseClass {
  projectExists: undefined | string | boolean = false
  newProjectName = ""
  newProjectDialog = false

  newProjectDialogTrigger: string | false = false
  newProjectDialogClose () {
    this.newProjectDialogTrigger = false
  }

  newProjectAssignUID () {
    this.newProjectDialogTrigger = this.generateUID()
  }

  importProjectDialogTrigger: string | false = false
  importProjectDialogClose () {
    this.importProjectDialogTrigger = false
  }

  importProjectAssignUID () {
    this.importProjectDialogTrigger = this.generateUID()
  }

  async created () {
    this.projectExists = await retrieveCurrentProjectName()
  }
}
</script>
