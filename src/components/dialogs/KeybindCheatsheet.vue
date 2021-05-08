<template>

  <q-dialog
    v-model="dialogModel"
    @before-hide="triggerDialogClose"
    >
    <q-card
      class="keyBindsDialog"
      dark
    >
      <q-card-section class="row items-center">
        <h6 class="text-center q-mt-lg q-mb-xs">Keybind list</h6>
      </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <q-scroll-area
              class="q-mx-xl q-my-xs"
              visible
              dark
              :thumb-style="thumbStyle"
              style="max-height: calc(100vh - 260px); height: 775px; width: 100%;">
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
                  <tr v-for="keybind in localCheatSheet" :key="keybind.id">
                    <td class="text-left" v-html="keybind.tooltip"/>
                    <td class="text-left" v-html="retrieveKeybindString(keybind)"/>
                  </tr>
                </tbody>
              </q-markup-table>
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

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"
@Component({
  components: { }
})
export default class KeybindCheatsheet extends DialogBase {
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

      // Remap the cheetcheet based on available input settings
      this.localCheatSheet = this.SGET_getCurrentKeyBindData.defaults.map((bind, index) => {
        const userKb = this.SGET_getCurrentKeyBindData.userKeybinds.find(userKb => userKb.id === bind.id)
        const mappedKeybind = (
          userKb &&
          userKb.which
        )
          // If user keybind
          ? {
            altKey: userKb.altKey,
            ctrlKey: userKb.ctrlKey,
            shiftKey: userKb.shiftKey,
            which: userKb.which,
            id: bind.id,
            tooltip: bind.tooltip,
            note: bind.note
          }
          // If default keybind
          : {
            altKey: bind.altKey,
            ctrlKey: bind.ctrlKey,
            shiftKey: bind.shiftKey,
            which: bind.which,
            id: bind.id,
            tooltip: bind.tooltip,
            note: bind.note
          }

        return mappedKeybind
      })
    }
  }

  /**
   * Local, remaped cheatsheet
   */
  localCheatSheet: I_KeyPressObject[] = []
}
</script>

<style lang="scss">
.keyBindsDialog {
  width: 1000px;
  max-width: calc(100vw - 95px) !important;

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
