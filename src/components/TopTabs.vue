<template>

  <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
      appear
      :duration="600"
      >
      <q-header
        v-if="localDocuments.length > 0"
        elevated
        class="bg-dark text-cultured"
      >
<q-dialog
      v-if="currentlyCheckedDocument"
      v-model="documentCloseDialogConfirm"
      persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Discard changes to {{retrieveFieldValue(currentlyCheckedDocument,'name')}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Discard changes"
            color="primary"
            v-close-popup
            @click="closeDocument(currentlyCheckedDocument)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-tabs
        align="left"
        inline-label
        no-caps>
          <transition-group
            name="list"
            tag="div"
            class="headerTransitionWrapper"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            appear
            :duration="300">
          <q-route-tab
              :ripple="false"
              v-for="document in localDocuments"
              :to="`/project/display-content/${document.type}/${document._id}`"
              :key="document.type+document._id"
              :icon="document.icon"
              :label="retrieveFieldValue(document,'name')"
              :alert="document.hasEdits"
              alert-icon="mdi-feather"
              >
                <q-btn
                    round
                    dense
                    class="z-max q-ml-sm"
                    :class="{'q-mr-sm': document.hasEdits}"
                    size="xs"
                    icon="close"
                    @click.stop.prevent="checkForCloseOpenedDocument(document)"
                  />
            </q-route-tab>
          </transition-group>
        </q-tabs>

      </q-header>
    </transition>

</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"

@Component({
  components: { }
})
export default class TppTabs extends BaseClass {
  documentCloseDialogConfirm = false
  currentlyCheckedDocument = null as unknown as I_OpenedDocument

  checkForCloseOpenedDocument (input: I_OpenedDocument) {
    this.currentlyCheckedDocument = input
    if (input.hasEdits) {
      this.documentCloseDialogConfirm = true
    } else {
      this.closeDocument(input)
    }
  }

  closeDocument (input: I_OpenedDocument) {
    this.SSET_removeOpenedDocument(input)
    setTimeout(() => {
      this.refreshRoute()
    }, 100)
  }

  @Watch("SGET_allOpenedDocuments", { deep: true })
  reactToDocumentListChange (val: {docs: I_OpenedDocument[]}) {
    this.localDocuments = []
    this.localDocuments = val.docs

    this.refreshRoute()
  }

  localDocuments: I_OpenedDocument[] = []
}
</script>

<style lang="scss" scoped>
.headerTransitionWrapper {
  display: flex;
}

</style>
