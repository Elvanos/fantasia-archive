<template>

<span>

   <closeDocumentCheckDialog
     :dialog-trigger="closeDocumentCheckDialogTrigger"
     :dialog-document="dialogDoc"
      @trigger-dialog-close="closeDocumentCheckDialogClose"
    />

    <q-tabs
      v-if="localDocuments.length > 0"
      align="left"
      inline-label
      outside-arrows
       mobile-arrows
      class="tabsWrapper"
      dense
      no-caps>
      <transition-group
        name="list"
        tag="div"
        class="headerTransitionWrapper"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="150">

        <q-route-tab
          :ripple="false"
          v-for="document in localDocuments"
          :to="`/project/display-content/${document.type}/${document._id}`"
          :key="document.type+document._id"
          :icon="(retrieveFieldValue(document,'categorySwitch') ? 'fas fa-folder-open' : document.icon)"
          :label="retrieveFieldValue(document,'name')"
          :style="`color: ${retrieveFieldValue(document,'documentColor')};`"
          :class="[{'isBold': (retrieveFieldValue(document,'documentColor') !== '#ffffff' && retrieveFieldValue(document,'documentColor') !== '#fff') && retrieveFieldValue(document,'documentColor') !== ''}]"
          :alert="document.hasEdits"
          alert-icon="mdi-feather"
          @click.prevent.middle="tryCloseTab(document)"
          >
            <q-tooltip
              :delay="700"
            >
              {{retrieveFieldValue(document,'name')}}
            </q-tooltip>
            <q-btn
              round
              dense
              flat
              class="z-max q-ml-auto"
              :class="{'q-mr-sm': document.hasEdits}"
              size="xs"
              icon="close"
              style="color: #fff;"
              @click.stop.prevent="tryCloseTab(document)"
            />
        </q-route-tab>

      </transition-group>
    </q-tabs>

  </span>

</template>

<script lang="ts">

import { I_KeyPressObject } from "src/interfaces/I_KeypressObject"

import { Component, Watch, Prop } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import closeDocumentCheckDialog from "src/components/dialogs/CloseDocumentCheck.vue"

@Component({
  components: { closeDocumentCheckDialog }
})
export default class TopTabs extends BaseClass {
  @Watch("SGET_allOpenedDocuments", { deep: true })
  reactToDocumentListChange (val: {docs: I_OpenedDocument[]}) {
    this.localDocuments = []
    this.localDocuments = val.docs

    this.refreshRoute()
  }

  localDocuments: I_OpenedDocument[] = []

  @Prop() readonly pushedKey!: I_KeyPressObject

  closeDocumentCheckDialogTrigger: string | false = false
  closeDocumentCheckDialogClose () {
    this.closeDocumentCheckDialogTrigger = false
  }

  closeDocumentCheckDialogAssignUID () {
    this.closeDocumentCheckDialogTrigger = this.generateUID()
  }

  /****************************************************************/
  // Keybind handling
  /****************************************************************/

  /**
   * React to keypresses passed from the parent document
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Delete dialog
    if (this.determineKeyBind("closeTab") && this.localDocuments.length > 0) {
      this.tryCloseTab()
    }

    // Next tab
    if (this.determineKeyBind("nextTab") && this.localDocuments.length > 0) {
      this.goToNextTab()
    }

    // Previous tab
    if (this.determineKeyBind("previousTab") && this.localDocuments.length > 0) {
      this.goToPreviousTab()
    }
  }

  dialogDoc = null as unknown as I_OpenedDocument

  tryCloseTab (doc?: I_OpenedDocument) {
    const matchingDocument = this.findRequestedOrActiveDocument(doc)

    if (matchingDocument) {
      this.dialogDoc = matchingDocument
      this.closeDocumentCheckDialogAssignUID()
    }
  }

  goToNextTab () {
    let index = -1
    const matchingDocument = this.localDocuments.find((e, i) => {
      index = i
      return e.url === this.$route.path
    })

    if (matchingDocument && index !== this.localDocuments.length - 1) {
      this.$router.push({ path: this.localDocuments[index + 1].url }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      })
    }
    if (matchingDocument && index === this.localDocuments.length - 1) {
      this.$router.push({ path: this.localDocuments[0].url }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      })
    }
  }

  goToPreviousTab () {
    let index = -1
    const matchingDocument = this.localDocuments.find((e, i) => {
      index = i
      return e.url === this.$route.path
    })

    if (matchingDocument && index !== 0) {
      this.$router.push({ path: this.localDocuments[index - 1].url }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      })
    }

    if (matchingDocument && index === 0) {
      this.$router.push({ path: this.localDocuments[this.localDocuments.length - 1].url }).catch((e: {name: string}) => {
        if (e && e.name !== "NavigationDuplicated") {
          console.log(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headerTransitionWrapper {
  display: flex;
}

.tabsWrapper .fas {
  font-size: 16px;
}

.tabsWrapper .mdi {
  font-size: 18px;
}
</style>

<style lang="scss">
.tabsWrapper {
  -webkit-app-region: no-drag;

  .q-tabs__arrow {
    text-shadow: none !important;
  }

  .isBold .q-tab__label {
    font-weight: 500 !important;
  }

  .q-tab {
    padding: 0 10px;

    &__content {
      min-width: 170px;
      width: 170px;
      justify-content: flex-start;
      text-align: left;
    }

    &__label {
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 2px;
      font-weight: 400;
      font-size: 13px;
    }
  }

  .fas {
    font-size: 16px;
  }

  .mdi {
    font-size: 18px;
  }

  &.q-tabs--dense .q-tab {
    min-height: 40px;
  }

  .q-tab__alert-icon {
    font-size: 16px;
    top: 4px;
    right: -10px;
    color: $primary;
  }
}
</style>
