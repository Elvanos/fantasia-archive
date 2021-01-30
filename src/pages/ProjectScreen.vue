<template>
  <q-page class="column items-center justify-center">

      <div class="col-12">
        <h3>Project screen for {{projectName}}</h3>
      </div>

       <div class="col-12 q-mb-lg">
       <q-btn
          color="primary"
          size="md"
          label="Go to title screen"
          class="q-px-xl q-py-xs"
          to="/"
        />
      </div>

       <div class="col-12 q-mb-lg">
       <q-btn
          color="primary"
          size="md"
          label="Export project"
          class="q-px-xl q-py-xs"
          @click="exportProject(projectName)"
        />
      </div>
  </q-page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import PouchDB from "pouchdb"

@Component({
  components: { }
})
export default class ProjectScreen extends BaseClass {
  projectName = ""

  async created () {
    this.projectName = await this.retrieveCurrentProjectName()
  }
}
</script>
