<template>

  <q-dialog
    v-model="dialogModel"
    @hide="triggerDialogClose"
    >
    <q-card
      class="keyBindsDialog"
    >
      <q-card-section class="row items-center">
        <h6 class="text-center q-my-sm">Keybind list</h6>
      </q-card-section>

        <q-card-section>
        <q-markup-table>
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

      <q-card-actions align="center" class="q-mb-lg q-mt-md">
          <q-btn flat label="Close window" color="primary" v-close-popup />
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

<style lang="scss" scoped>
</style>
