<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Merge another project into the current one</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            Please note that merging another project will cause <span class="text-bold text-secondary">IRREVERSIBLE CHANGES</span> to the currently opened project.
            <br>
            If you haven't done so already, please save your current project first to prevent <span class="text-bold text-secondary">POSSIBLE COMPLICATIONS</span> concerning your current project data!
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
            label="Merge project"
            color="primary"
            v-close-popup
            @click="mergeProject()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { saveProject, mergeExistingProject } from "src/scripts/projectManagement/projectManagent"
import { Loading, QSpinnerGears } from "quasar"

@Component({
  components: { }
})
export default class MergeProjectCheckDialog extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  checkForOpenedProject (val: string|false) {
    if (val) {
      const projectName = this.SGET_getProjectName

      if (projectName.length > 0) {
        this.openDialog()
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
  * MErge a new project
  */
  mergeProject () {
    const setup = {
      message: "<h4>Merging selected project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }

    this.SSET_setProjecLoadingState(false)
    mergeExistingProject(this.$router, Loading, setup, this.$q, this)
  }

  /**
   * Export the current project
   */
  commenceSave () {
    const projectName = this.SGET_getProjectName
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
