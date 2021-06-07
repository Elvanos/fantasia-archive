<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      >
      <q-card dark class="renameTagDialog">
         <q-card-section class="column justify-center items-center">
          <h6 class="text-center q-my-sm">Rename tag </h6>
          <h5 class="text-center q-my-sm"><span class="text-bold text-primary">{{targetTag}}</span></h5>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            If you input a tag name that already exists, the documents will be added to it and different text cases will be unified to the form of the already existing tag.
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-center">
            <q-input
              filled
              dark
              ref="renameTagInput"
              style="width: 400px;"
              label="New tag name"
              v-model="newTagName"
            />
          </div>

        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="accent"
          v-close-popup />
          <q-btn
            flat
            label="Rename tag"
            :disable="newTagName.length <= 0"
            color="primary"
            @click="renameTags" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">

import { Component, Watch, Prop } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { massRenameTag } from "src/scripts/documentActions/tagManager"
import { saveDocument } from "src/scripts/databaseManager/documentManager"

import { Loading, QSpinnerGears, extend } from "quasar"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: { }
})
export default class RenameTagPrompt extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  async openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
      this.newTagName = ""

      await this.sleep(300)

      /*eslint-disable */
      // @ts-ignore
      this.$refs.renameTagInput.focus()
      /* eslint-enable */
    }
  }

  @Prop(({
    default () {
      return []
    }
  })) readonly allTags!: string[]

  @Prop(({
    default () {
      return []
    }
  })) readonly documentIdList!: string[]

  @Prop(({ default: "" })) readonly targetTag!: ""

  /**
   * Model for the new project name
   */
  newTagName = ""

  documentsCopy:I_OpenedDocument[] = []

  /**
   * Create new project
   */
  async renameTags () {
    Loading.show({
      message: "<h4>Renaming tags in all affected documents...</h4>",
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

    const updatedDocumentList = massRenameTag(this.newTagName, this.targetTag, this.allTags, documentList)

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

.renameTagDialog {
  min-width: 700px;

  .q-field__messages {
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
