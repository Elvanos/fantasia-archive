<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Load existing project</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            Please note that the loaded project will <span class="text-bold text-secondary">COMPLETELY OVERWRITE</span> the currently opened project.
            <br>
            If you haven't done so already, please save your current project first to prevent a <span class="text-bold text-secondary">FULL LOSS</span> of all your current project data!
          </div>
        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="accent"
          v-close-popup />
          <q-btn
          flat
          label="Save project"
          color="primary"
          @click="commenceSave"
           />
          <q-btn
            flat
            label="Load project"
            color="primary"
            v-close-popup
            @click="saveProject()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { retrieveCurrentProjectName, saveProject, importExistingProject } from "src/scripts/projectManagement/projectManagent"
import { Loading, QSpinnerGears } from "quasar"

@Component({
  components: { }
})
export default class LoadProjectCheck extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  async checkForOpenedProject (val: string|false) {
    if (val) {
      const projectName = await retrieveCurrentProjectName()

      if (projectName) {
        this.openDialog()
      }
      else {
        this.saveProject()
      }
    }
  }

  /**
   * Open the the dialog if project is present on the window
   */
  openDialog () {
    if (this.SGET_getDialogsState) {
      return
    }
    this.SSET_setDialogState(true)
    this.dialogModel = true
  }

  /**
  * Import a new project
  */
  saveProject () {
    const setup = {
      message: "<h4>Loading selected project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }

    importExistingProject(this.$router, Loading, setup, this.$q, this)
  }

  /**
   * Export the current project
   */
  async commenceSave () {
    const projectName = await retrieveCurrentProjectName()
    const setup = {
      message: "<h4>Saving current project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }
    saveProject(projectName, Loading, setup, this.$q)
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
