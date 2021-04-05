<template>
    <q-dialog
      v-model="dialogModel"
      @hide="triggerDialogClose"
      >
      <q-card dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Delete <span class="text-primary">{{retrieveFieldValue(currentDocument, 'name')}}</span>?</h6>
        </q-card-section>

         <q-card-section class="row justify-center q-mx-xl">
          <div>
            The document will be delete <span class="text-bold text-secondary">FOREVER</span> with no way to retrieve it.
            <br>
            <span class="text-caption">(unless a previous export of the project exists from earlier time that cointains it)</span>
            <br>
            <br>

            Proceed?
          </div>
        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="accent"
          v-close-popup />
          <q-btn
            outline
            label="Delete document"
            color="secondary"
            @click="deleteDocument()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import PouchDB from "pouchdb"

@Component({
  components: { }
})
export default class DeleteDocumentCheckDialog extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  async openDialog (val: string|false) {
    if (val && this.SGET_allOpenedDocuments.docs.length > 0) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
      const CurrentObjectDB = new PouchDB(this.$route.params.type)
      this.currentDocument = await CurrentObjectDB.get(this.$route.params.id)
      await CurrentObjectDB.close()
    }
  }

  /**
   * Current document for deletion
   */
  currentDocument = false as unknown as I_OpenedDocument

  /**
   * Delete the document
   */
  async deleteDocument () {
    const CurrentObjectDB = new PouchDB(this.$route.params.type)

    // @ts-ignore
    await CurrentObjectDB.remove(this.currentDocument)

    const dataPass = { doc: this.currentDocument, treeAction: true }

    this.dialogModel = false
    this.SSET_setDialogState(false)

    this.SSET_removeOpenedDocument(dataPass)
    await CurrentObjectDB.close()
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
