<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="projectSettingsDialog">
         <q-card-section class="column justify-center items-center">
          <h6 class="text-center q-my-sm">Project settings for {{projectName}}</h6>
        </q-card-section>

        <q-card-section>
          <div class="row justify-center">
            <q-input
              filled
              dark
              style="width: 400px;"
              label="Project name"
              v-model="projectName"
              :error="isInvalid"
              :error-message="'Your project name contains invalid characters or is empty'"
              @keydown.enter.prevent="saveProjectSettings"
            />
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
            :disable="isInvalid"
            label="Save project settings"
            color="primary"
            @click="saveProjectSettings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { changeCurrentProjectSettings } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: { }
})
export default class ProjectSettingsDialog extends DialogBase {
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

      this.reloadProjectSettings()
    }
  }

  projectName = ""

  reservedCharacterList = [
    "/",
    ">",
    "<",
    "|",
    ":",
    "&",
    "\\",
    "-",
    "[",
    "]",
    "{",
    "}",
    "*",
    "?",
    "'",
    "\"",
    "#",
    "%",
    "$",
    "!",
    "@"
  ]

  get isInvalid () {
    let isValid = true
    if (this.projectName.length === 0) {
      isValid = false
    }

    this.reservedCharacterList.forEach(char => {
      if (this.projectName.includes(char)) {
        isValid = false
      }
    })

    return !isValid
  }

  reloadProjectSettings () {
    this.projectName = this.SGET_getProjectName
  }

  async saveProjectSettings () {
    if (this.isInvalid) return

    const newSettings = {
      projectName: this.projectName
    }

    await changeCurrentProjectSettings(newSettings)
    this.SSET_setProjectName(this.projectName)

    this.triggerDialogClose()
  }
}
</script>

<style lang="scss">

.renameTagDialog {
  min-width: 700px;

  .q-field__messages {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
