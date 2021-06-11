<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="deleteTagDialog">
         <q-card-section class="column justify-center items-center">
          <h6 class="text-center q-my-sm">Delete <span class="text-bold text-primary">{{targetTag}}</span>?</h6>
        </q-card-section>

         <q-card-section class="row justify-center q-mx-xl">
          <div>
            The tag will be deleted <span class="text-bold text-secondary">FOREVER</span> with no way to revert this change.
            <br>
            <span class="text-caption">(unless a previous save of the project exists from earlier time that cointains it)</span>
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
            label="Delete tag"
            color="secondary"
            @click="deleteTag" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch, Prop } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { massDeleteTag } from "src/scripts/documentActions/tagManager"
import { saveDocument } from "src/scripts/databaseManager/documentManager"

import { Loading, QSpinnerGears, extend } from "quasar"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: { }
})
export default class DeleteTagPrompt extends DialogBase {
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

  @Prop(({
    default () {
      return []
    }
  })) readonly documentIdList!: string[]

  @Prop(({ default: "" })) readonly targetTag!: ""

  documentsCopy:I_OpenedDocument[] = []

  /**
   * Create new project
   */
  async deleteTag () {
    Loading.show({
      message: "<h4>Deleting tags in all affected documents...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    })

    const documentList = this.documentIdList.map(id => {
      return this.SGET_document(id)
    })

    const updatedDocumentList = massDeleteTag(this.targetTag, documentList)

    for (let index = 0; index < updatedDocumentList.length; index++) {
      const allDocuments = this.SGET_allOpenedDocuments
      this.documentsCopy = extend(true, [], allDocuments.docs)

      // @ts-ignore
      const savedDocument: {
        documentCopy: I_OpenedDocument,
        allOpenedDocuments: I_OpenedDocument[]
      } = await saveDocument(
        // @ts-ignore
        updatedDocumentList[index],
        this.documentsCopy,
        this.SGET_allDocuments.docs,
        null,
        this,
        true
      ).catch((err:any) => console.log(err))

      const updateTree = (index + 1 === updatedDocumentList.length)

      // Update the opened document
      const dataPass = { doc: savedDocument.documentCopy, treeAction: updateTree }
      this.SSET_updateOpenedDocument(dataPass)

      // Update non-openeddocuments
      // @ts-ignore
      this.SSET_updateDocument({ doc: this.mapShortDocument(savedDocument.documentCopy, this.SGET_allDocumentsByType(savedDocument.documentCopy.type).docs) })
    }

    Loading.hide()
    this.triggerDialogClose()
  }
}
</script>

<style lang="scss">

.deleteTagDialog {
  min-width: 700px;

  .q-field__messages {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
