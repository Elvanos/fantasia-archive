<template>
  <q-page class="column items-center justify-center">

      <div class="col-12">
        <h3>Project screen for {{projectName}}</h3>
      </div>

  </q-page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { Loading } from "quasar"

import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: { }
})
export default class ProjectScreen extends BaseClass {
  projectName = ""

  async created () {
    this.projectName = await retrieveCurrentProjectName()
    Loading.hide()
  }
}
</script>
