<template>
    <q-dialog
      v-model="dialogModel"
      @hide="triggerDialogClose"
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Import existing project</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            Please note that the imported project will <span class="text-bold text-secondary">COMPLETELY OVERWRITE</span> the currently opened project.
            <br>
            If you haven't done so already, please export your current project first to prevent a <span class="text-bold text-secondary">FULL LOSS</span> of all your current project data!
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
          label="Export project"
          color="primary"
          @click="commenceExport"
           />
          <q-btn
            flat
            label="Import project"
            color="primary"
            v-close-popup
            @click="importProject()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { retrieveCurrentProjectName, exportProject, importExistingProject } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: { }
})
export default class ImportProjectCheckDialog extends DialogBase {
  @Watch("dialogTrigger")
  async openDialog (val: string|false) {
    if (val) {
      const projectName = await retrieveCurrentProjectName()

      if (projectName) {
        this.checkForCloseOpenedDocument()
      }
      else {
        this.importProject()
      }
    }
  }

  checkForCloseOpenedDocument () {
    if (this.SGET_getDialogsState) {
      return
    }
    this.SSET_setDialogState(true)
    this.dialogModel = true
  }

  importProject () {
    importExistingProject(this.$router)
  }

  async commenceExport () {
    const projectName = await retrieveCurrentProjectName()
    exportProject(projectName)
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
