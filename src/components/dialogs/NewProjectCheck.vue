<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="newProjectCheckDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">New project</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl" v-if="oldProjectName.length > 0">
          <div>
            Please note that the new project will <span class="text-bold text-secondary">COMPLETELY OVERWRITE</span> the currently opened project.
            <br>
            If you haven't done so already, please save your current project first to prevent a <span class="text-bold text-secondary">FULL LOSS</span> of all your current project data!
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-center">
            <q-input
              filled
              dark
              ref="newProjectInput"
              style="width: 400px;"
              label="New project name"
              v-model.trim="newProjectName"
              :error="isInvalid && newProjectName.length > 0"
              :error-message="'Your project name contains invalid characters'"
              @keydown.enter.prevent="createNewProject"
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
          v-if="oldProjectName.length > 0"
          label="Save project"
          color="primary"
          @click="commenceSave"
           />
          <q-btn
            flat
            label="Create new project"
            :disable="isInvalid"
            color="primary"
            v-close-popup
            @click="createNewProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { saveProject, createNewProject } from "src/scripts/projectManagement/projectManagent"

import { Loading, QSpinnerGears, extend } from "quasar"

@Component({
  components: { }
})
export default class NewProjectCheck extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  async openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
      this.newProjectName = ""
      this.oldProjectName = this.SGET_getProjectName

      await this.sleep(300)

      /*eslint-disable */
      // @ts-ignore
      this.$refs.newProjectInput.focus()
      /* eslint-enable */
    }
  }

  /**
   * Determines if any project currently exists or not
   */
  oldProjectName = ""

  /**
   * Model for the new project name
   */
  newProjectName = ""

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
    if (this.newProjectName.length === 0) {
      isValid = false
    }

    this.reservedCharacterList.forEach(char => {
      if (this.newProjectName.includes(char)) {
        isValid = false
      }
    })

    return !isValid
  }

  /**
   * Create new project
   */
  createNewProject () {
    if (this.isInvalid) return

    Loading.show({
      message: "<h4>Setting up a new project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    })

    const optionsSnapShot = extend(true, {}, this.SGET_options)
    // @ts-ignore
    optionsSnapShot.legacyFieldsCheck018 = false
    // @ts-ignore
    this.SSET_options(optionsSnapShot)

    this.SSET_setProjectName(this.newProjectName)
    this.SSET_setProjecLoadingState(false)

    createNewProject(this.newProjectName, this.$router, this.$q, this).catch(e => console.log(e))
  }

  /**
   * Export current project
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

<style lang="scss">

.newProjectCheckDialog {
  min-width: 600px;

  .q-field__messages {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
