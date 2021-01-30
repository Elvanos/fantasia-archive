<template>
  <q-page class="column items-center justify-center">

     <q-dialog
      v-model="newProjectDialog"
      persistent>
      <q-card style="width: 500px;">
        <q-card-section class="col items-center">
          <div>
            <h4>
              New project
            </h4>
          </div>
          <div>
            <q-input
              placeholder="Project name"
              v-model="newProjectName"
              outlined
              dense
            />
          </div>

        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn
            label="Create"
            color="primary"
            v-close-popup
            :disable="newProjectName.length === 0"
            @click="createNewProject(newProjectName)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
          @click="openExistingProject"
        >
        <div>Open existing project</div>
          <q-icon
          v-if="projectExists"
          color="red"
          right
          size="30px"
          name="mdi-alert-circle" >
            <q-tooltip>
            All data of the currently opened project will be lost unless it is exported first if an existing project is opened beforehand!
            </q-tooltip>
        </q-icon>
       </q-btn>
      </div>

      <div class="col-12">
       <q-btn
          color="primary"
          size="md"
          class="q-px-xl q-py-xs"
          @click="newProjectDialog = true"
        >
         <div>New Project</div>
          <q-icon
          v-if="projectExists"
          color="red"
          right
          size="30px"
          name="mdi-alert-circle" >
            <q-tooltip>
            All data of the currently opened project will be lost unless it is exported first if a new project is created beforehand!
            </q-tooltip>
        </q-icon>
       </q-btn>
      </div>

  </q-page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator"

import BaseClass from "src/BaseClass"

@Component({
  components: { }
})
export default class WelcomeScreen extends BaseClass {
  projectExists: undefined | string | boolean = false
  newProjectName = ""
  newProjectDialog = false

  async created () {
    this.projectExists = await this.retrieveCurrentProjectName()
  }
}
</script>
