<template>

  <q-dialog
    v-model="dialogModel"
    @hide="triggerDialogClose"
    >
    <q-card
      class="aboutDialog"
      dark
    >
      <q-card-section>
        <h6 class="text-center q-my-sm">About Fantasia Archive</h6>
      </q-card-section>

        <q-card-section>
          <div>
            Currently running Fantasia Archive version: <span class="text-bold text-primary">{{appVersion}}</span>
          </div>
       </q-card-section>

      <q-card-actions align="around" class="q-mb-lg q-mt-md">
          <q-btn flat label="Close" color="accent" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
@Component({
  components: { }
})
export default class AboutApp extends DialogBase {
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
    }
  }

  appVersion = process.env.npm_package_version
}
</script>

<style lang="scss">
.aboutDialog {
  text-align: center;
  width: 500px;

  h6 {
    display: block;
  }
}
</style>
