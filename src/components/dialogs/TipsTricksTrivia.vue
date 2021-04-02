<template>

  <q-dialog
    v-model="dialogModel"
    @hide="triggerDialogClose"
    >
    <q-card
      class="tipsTricksTriviaDialog"
      dark
    >
      <q-card-section>
        <div class="flex justify-center">
          <q-scroll-area
            class="q-mx-xl q-my-lg"
            visible
            dark
            :thumb-style="thumbStyle"
            style="max-height: calc(100vh - 235px); height: 800px; width: 100%;">

          <h6>Tips, Tricks & Trivia</h6>

          <ul>
            <li
              v-for="(tip,index) in tipsTricks"
              :key="index"
              >
                {{tip}}
            </li>
          </ul>

          </q-scroll-area>
        </div>
       </q-card-section>

      <q-card-actions align="around" class="q-mb-lg">
          <q-btn flat label="Close" color="accent" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"
import { tipsTricks } from "src/scripts/utilities/tipsTricks"

import DialogBase from "src/components/dialogs/_DialogBase"
@Component({
  components: { }
})
export default class ChangeLog extends DialogBase {
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
    }
  }

  /**
   * An array of string with the trivia
   */
  tipsTricks = tipsTricks
}
</script>

<style lang="scss">
.tipsTricksTriviaDialog {
  width: 1000px;
  max-width: calc(100vw - 100px) !important;

  li {
    margin: 10px 0;
  }

  h6 {
    display: block;
  }
}
</style>
