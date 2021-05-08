<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Discard changes to <span class="text-primary">{{retrieveFieldValue(dialogDocument,'name')}}</span>?</h6>
        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="accent"
          v-close-popup />
          <q-btn
            outline
            label="Discard changes"
            color="secondary"
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
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      this.checkForCloseOpenedDocument()
    }
  }

  /**
   * Current document being processed by the dialog
   */
  @Prop() readonly dialogDocument!: I_OpenedDocument

  /**
   * Determine if the document has edits or not. Based on this either skip this dialog altogether or show it.
   */
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

  /**
   * Closes the document and removes it from the list
   */
  closeDocument (input: I_OpenedDocument) {
    const dataPass = { doc: input, treeAction: false }
    this.SSET_removeOpenedDocument(dataPass)

    this.dialogModel = false
    this.SSET_setDialogState(false)
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
