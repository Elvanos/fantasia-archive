<template>
    <q-dialog
      v-model="dialogModel"
      @hide="triggerDialogClose"
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Discard changes to {{retrieveFieldValue(dialogDocument,'name')}}?</h6>
        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="primary"
          v-close-popup />
          <q-btn
            flat
            label="Discard changes"
            color="red"
            v-close-popup
            @click="closeDocument(dialogDocument)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch, Prop } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: { }
})
export default class CloseDocumentCheckDialog extends DialogBase {
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      this.checkForCloseOpenedDocument()
    }
  }

  @Prop() readonly dialogDocument!: I_OpenedDocument

  checkForCloseOpenedDocument () {
    const input = this.dialogDocument
    if (input?.hasEdits) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
    }
    else {
      this.closeDocument(input)
    }
  }

  closeDocument (input: I_OpenedDocument) {
    const dataPass = { doc: input, treeAction: false }
    this.SSET_removeOpenedDocument(dataPass)
    setTimeout(() => {
      this.refreshRoute()
    }, 100)
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
