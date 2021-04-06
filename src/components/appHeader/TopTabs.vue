<template>

<span>

   <closeDocumentCheckDialog
     :dialog-trigger="closeDocumentCheckDialogTrigger"
     :dialog-document="dialogDoc"
      @trigger-dialog-close="closeDocumentCheckDialogClose"
    />

    <q-tabs
      v-if="localDocuments.length > 0"
      :class="{'hasTextShadow': textShadow}"
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
        :duration="50">

        <q-route-tab
          :ripple="false"
          v-for="document in localDocuments"
          :to="`/project/display-content/${document.type}/${document._id}`"
          :key="document.type+document._id"
          :icon="(retrieveFieldValue(document,'categorySwitch') ? 'fas fa-folder-open' : document.icon)"
          :style="`color: ${retrieveFieldValue(document,'documentColor')}; background-color: ${retrieveFieldValue(document,'documentBackgroundColor')}; filter: ${(retrieveFieldValue(document,'minorSwitch') ? 'grayscale(100) brightness(0.7)' : '')}`"
          :class="[
            {'isBold':
              (
                retrieveFieldValue(document,'documentColor') !== '#ffffff' &&
                retrieveFieldValue(document,'documentColor') !== '#fff'
              ) &&
              retrieveFieldValue(document,'documentColor') !== ''
              }]"
          :alert="document.hasEdits"
          alert-icon="mdi-feather"
          @click.prevent.middle="tryCloseTab(document)"
          >
            <span class="isDeadIndicator" v-if="retrieveFieldValue(document,'deadSwitch')">
              †
            </span>
            <div
              class="q-tab__label"
             :class="{'isDead': retrieveFieldValue(document,'deadSwitch')}">
             {{retrieveFieldValue(document,'name')}}
            </div>
            <q-tooltip
              :delay="700"
            >
              <span class="isDeadIndicator" v-if="retrieveFieldValue(document,'deadSwitch')">
              †
              </span>
              {{retrieveFieldValue(document,'name')}}
              <br>
              <span class="text-caption">Middle mouse button to close</span>
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

import BaseClass from "src/BaseClass"

import { Component, Watch } from "vue-property-decorator"

import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import closeDocumentCheckDialog from "src/components/dialogs/CloseDocumentCheck.vue"

@Component({
  components: { closeDocumentCheckDialog }
})
export default class TopTabs extends BaseClass {
  /****************************************************************/
  // App options
  /****************************************************************/

  /**
   * Determines if the tabs have text shadow or not
   */
  textShadow = false

  /**
   * Watch changes on options
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.textShadow = options.textShadow
  }

  /****************************************************************/
  // Keybind handling
  /****************************************************************/

  /**
   * React to keypresses passed from the parent document
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Close tab dialog
    if (this.determineKeyBind("closeTab") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      this.tryCloseTab()
    }

    // Next tab
    if (this.determineKeyBind("nextTab") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      this.goToNextTab()
    }

    // Previous tab
    if (this.determineKeyBind("previousTab") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      this.goToPreviousTab()
    }
  }

  /****************************************************************/
  // Tab management
  /****************************************************************/

  /**
   * Refresh the local reference whenever something gets changed
   */
  @Watch("SGET_allOpenedDocuments", { deep: true })
  reactToDocumentListChange (val: {docs: I_OpenedDocument[]}, oldVal: {docs: I_OpenedDocument[]}) {
    this.localDocuments = []
    this.localDocuments = val.docs

    // Re-check the route after a change
    this.refreshRoute()
  }

  /**
   * Local reference to the opened document list
   */
  localDocuments: I_OpenedDocument[] = []

  /**
   * Current document to be closed
   */
  dialogDoc = null as unknown as I_OpenedDocument

  /**
   * Attempts to close the document being closed
   */
  tryCloseTab (doc?: I_OpenedDocument) {
    const matchingDocument = this.findRequestedOrActiveDocument(doc)

    if (matchingDocument) {
      this.dialogDoc = matchingDocument
      this.closeDocumentCheckDialogAssignUID()
    }
  }

  /**
   * Attempt to navigate to next tab
   */
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

  /**
   * Attempt to navigate to previous tab
   */
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

  /****************************************************************/
  // Close document dialog
  /****************************************************************/

  closeDocumentCheckDialogTrigger: string | false = false
  closeDocumentCheckDialogClose () {
    this.closeDocumentCheckDialogTrigger = false
  }

  closeDocumentCheckDialogAssignUID () {
    this.closeDocumentCheckDialogTrigger = this.generateUID()
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

  &.hasTextShadow {
    .q-tab__label,
    .q-tab__icon {
      $shadowColorOutline: #000;
      $shadowColorSurround: #000;

      filter: drop-shadow(0 0 4px #000);
      text-shadow:
        -2px -2px 0 $shadowColorSurround,
        2px -2px 0 $shadowColorSurround,
        -2px 2px 0 $shadowColorSurround,
        2px 2px 0 $shadowColorSurround,
        -1px -1px 0 $shadowColorOutline,
        1px -1px 0 $shadowColorOutline,
        -1px 1px 0 $shadowColorOutline,
        1px 1px 0 $shadowColorOutline;
    }
  }

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

body.body--dark {
  .topTabs {
    .q-tab {
      color: #dcdcdc;
    }
  }
}
</style>
