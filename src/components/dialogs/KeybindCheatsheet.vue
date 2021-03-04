<template>

  <q-dialog
    v-model="dialogModel"
    @hide="triggerDialogClose"
    >
    <q-card
      class="keyBindsDialog"
      dark
    >
      <q-card-section class="row items-center">
        <h6 class="text-center q-my-sm">Keybind list</h6>
      </q-card-section>

        <q-card-section>
          <q-markup-table
            dark
            flat
          >
            <thead>
              <tr>
                <th class="text-left">Action</th>
                <th class="text-left">Keybind</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="keybind in SGET_getCurrentKeyBindData.defaults" :key="keybind.id">
                <td class="text-left" v-html="keybind.tooltip"/>
                <td class="text-left" v-html="retrieveKeybindString(keybind)"/>
              </tr>
            </tbody>
          </q-markup-table>
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
export default class KeybindCheatsheet extends DialogBase {
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
}
</script>

<style lang="scss">
.keyBindsDialog {
  width: 100%;
  max-width: 1000px !important;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }

  table {
    td {
      max-width: 300px;
      white-space: inherit;
    }
  }

  .keybindNote {
    opacity: 0.8;
    font-size: 0.9em;
  }
}
</style>
