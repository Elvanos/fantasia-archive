<template>

<span>

   <closeDocumentCheckDialog
     :dialog-trigger="closeDocumentCheckDialogTrigger"
     :dialog-document="dialogDoc"
      @trigger-dialog-close="closeDocumentCheckDialogClose"
    />

    <!-- Delele document dialog -->
    <deleteDocumentCheckDialog
      :dialog-trigger="deleteObjectDialogTrigger"
      :document-id="toDeleteID"
      :document-type="toDeleteType"
      @trigger-dialog-close="deleteObjectDialogClose"
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
          :style="`
            color: ${retrieveFieldValue(document,'documentColor')};
            background-color: ${retrieveFieldValue(document,'documentBackgroundColor')};
            filter: ${(retrieveFieldValue(document,'minorSwitch') ? 'grayscale(100) brightness(0.7)' : '')}`"
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
          @mouseleave="setDocumentPreviewClose"
          >
            <span class="isDeadIndicator" v-if="retrieveFieldValue(document,'deadSwitch')">
              †
            </span>
            <div
              class="q-tab__label"
             :class="{'isDead': (retrieveFieldValue(document,'deadSwitch') && !hideDeadCrossThrough)}">
             {{retrieveFieldValue(document,'name')}}
            </div>
            <documentPreview
              v-if="!preventPreviewsTabs"
              :document-id="document._id"
              :external-close-trigger="documentPreviewClose"
              :custom-delay="1750"
            />

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

            <q-menu
              touch-position
              context-menu
            >
              <q-list class="bg-gunmetal-light text-accent">
                <q-item clickable>
                  <q-item-section>All opened tabs</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>
                  <q-menu anchor="top end" self="top start">
                    <q-list class="bg-gunmetal text-accent">
                      <q-item
                        :to="`/project/display-content/${menuDoc.type}/${menuDoc._id}`"
                        v-for="menuDoc in localDocuments"
                        :key="menuDoc._id"
                        clickable
                        :style="`
                          color: ${retrieveFieldValue(menuDoc,'documentColor')};
                          background-color: ${retrieveFieldValue(menuDoc,'documentBackgroundColor')};
                          filter: ${(retrieveFieldValue(menuDoc,'minorSwitch') ? 'grayscale(100) brightness(0.7)' : '')}`"
                      >
                       <q-item-section class="isDeadIndicator grow-0" v-if="retrieveFieldValue(menuDoc,'deadSwitch')">
                          †
                        </q-item-section>
                        <q-item-section
                          :class="{'isDead': (retrieveFieldValue(menuDoc,'deadSwitch') && !hideDeadCrossThrough)}"
                        >{{retrieveFieldValue(menuDoc,'name')}}</q-item-section>
                        <q-item-section avatar>
                          <q-icon :name="(retrieveFieldValue(menuDoc,'categorySwitch') ? 'fas fa-folder-open' : menuDoc.icon)" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator dark />
                <q-item clickable v-close-popup @click="copyName(document)">
                  <q-item-section>Copy name</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-text-recognition" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="copyTextColor(document)">
                  <q-item-section>Copy text color</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-eyedropper" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="copyBackgroundColor(document)">
                  <q-item-section>Copy background color</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-format-color-fill" />
                  </q-item-section>
                </q-item>
                <q-separator dark />
                <q-item clickable v-if="!document.isNew"  v-close-popup @click="openDocumentPreviewPanel(document._id)">
                  <q-item-section>Preview document in split-view mode</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-file-search-outline" />
                  </q-item-section>
                </q-item>
                <q-item v-if="!document.isNew" clickable v-close-popup @click="addNewUnderParent(document)">
                  <q-item-section>Create new document with this document as parent</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-file-tree" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-if="!document.isNew"  v-close-popup @click="copyTargetDocument(document)">
                  <q-item-section>Copy this document</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-content-copy" />
                  </q-item-section>
                </q-item>
                <q-separator dark />
                 <q-item clickable v-close-popup @click="tryMoveTabLeft(document)">
                  <q-item-section>Move tab left</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-chevron-left" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="tryMoveTabRight(document)">
                  <q-item-section>Move tab right</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-chevron-right" />
                  </q-item-section>
                </q-item>
                <q-separator v-if="!document.isNew" />
                <q-item clickable v-close-popup @click="tryCloseTab(document)">
                  <q-item-section>Close this tab</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-close" />
                  </q-item-section>
                </q-item>
                 <q-item clickable v-close-popup @click="SSET_closeAllButCurrentDocuments(document)">
                  <q-item-section>Close all tabs without changes except for this</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-close-box-outline" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="SSET_closeAllDocuments">
                  <q-item-section>Close all tabs without changes</q-item-section>
                  <q-item-section avatar>
                    <q-icon name="mdi-close-box-multiple-outline" />
                  </q-item-section>
                </q-item>
                <q-separator dark />
                <q-item clickable v-close-popup @click="SSET_forceCloseAllButCurrentDocuments(document)">
                  <q-item-section class="text-secondary"><b>Force close all tabs except for this</b></q-item-section>
                  <q-item-section avatar class="text-secondary">
                    <q-icon name="mdi-close-box" />
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="SSET_forceCloseAllDocuments">
                  <q-item-section class="text-secondary"><b>Force close all tabs</b></q-item-section>
                  <q-item-section avatar class="text-secondary">
                    <q-icon name="mdi-close-box-multiple" />
                  </q-item-section>
                </q-item>
                <q-separator dark />
                <q-item clickable v-close-popup @click="deleteTabDocument(document)">
                  <q-item-section class="text-secondary"><b>Delete this document</b></q-item-section>
                  <q-item-section avatar class="text-secondary">
                    <q-icon name="mdi-text-box-remove-outline" />
                  </q-item-section>
                </q-item>
              </q-list>

            </q-menu>
        </q-route-tab>

      </transition-group>
    </q-tabs>

  </span>

</template>

<script lang="ts">

import BaseClass from "src/BaseClass"

import { Component, Watch } from "vue-property-decorator"
import deleteDocumentCheckDialog from "src/components/dialogs/DeleteDocumentCheck.vue"

import { I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import closeDocumentCheckDialog from "src/components/dialogs/CloseDocumentCheck.vue"
import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import { copyDocumentName, copyDocumentTextColor, copyDocumentBackgroundColor } from "src/scripts/documentActions/uniqueFieldCopy"
import { copyDocument } from "src/scripts/documentActions/copyDocument"
import { extend, uid } from "quasar"
import documentPreview from "src/components/DocumentPreview.vue"

@Component({
  components: {
    closeDocumentCheckDialog,
    deleteDocumentCheckDialog,
    documentPreview
  }
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
   * Determines if the "dead" document type should have a cross-text decoration or not
   */
  hideDeadCrossThrough = false

  /**
   * Determines document previews should be shown or not
   */
  preventPreviewsTabs = true

  /**
   * Watch changes on options
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.textShadow = options.textShadow
    this.hideDeadCrossThrough = options.hideDeadCrossThrough
    this.preventPreviewsTabs = options.preventPreviewsTabs
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

    // Move tab left - SHIFT + ALT + LEFT ARROW
    if (this.determineKeyBind("moveTabLeft") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument
      this.tryMoveTabLeft(currentDoc)
    }

    // Move tab right - SHIFT + ALT + RIGHT ARROW
    if (this.determineKeyBind("moveTabRight") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument
      this.tryMoveTabRight(currentDoc)
    }

    // Close all tabs without changes except for this - CTRL + ALT + SHIFT + W
    if (this.determineKeyBind("closeAllTabsWithoutChangesButThis") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument
      this.SSET_closeAllButCurrentDocuments(currentDoc)
    }

    // Close all tabs without changes - CTRL + SHIFT + W
    if (this.determineKeyBind("closeAllTabsWithoutChanges") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      this.SSET_closeAllDocuments()
    }

    // Force close all tabs except for this - NONE
    if (this.determineKeyBind("forceCloseAllTabsButThis") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      const currentDoc = this.findRequestedOrActiveDocument() as I_OpenedDocument
      this.SSET_forceCloseAllButCurrentDocuments(currentDoc)
    }

    // Force close all tabs - NONE
    if (this.determineKeyBind("forceCloseAllTabs") && this.localDocuments.length > 0 && !this.SGET_getDialogsState) {
      this.SSET_forceCloseAllDocuments()
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
   * Attempts to move the document to right
   */
  tryMoveTabRight (doc?: I_OpenedDocument) {
    const currentIndex = this.localDocuments.findIndex(localDoc => {
      return localDoc._id === doc?._id
    })

    if (this.localDocuments.length > 1) {
      let newIndex = currentIndex + 1

      if (currentIndex === this.localDocuments.length - 1) {
        newIndex = 0
      }
      /* eslint-disable */
      // @ts-ignore
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0])
        return this
      }
      const copy = this.localDocuments.map(doc => doc)
      // @ts-ignore
      copy.move(currentIndex, newIndex)
      this.localDocuments = copy
    }
  }

  /**
   * Attempts to move the document to left
   */
  tryMoveTabLeft (doc?: I_OpenedDocument) {
    const currentIndex = this.localDocuments.findIndex(localDoc => {
      return localDoc._id === doc?._id
    })

    if (this.localDocuments.length > 1) {
      let newIndex = currentIndex - 1

      if (currentIndex === 0) {
        newIndex = this.localDocuments.length + 1
      }
      /* eslint-disable */
      // @ts-ignore
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0])
        return this
      }
      const copy = this.localDocuments.map(doc => doc)
      // @ts-ignore
      copy.move(currentIndex, newIndex)
      this.localDocuments = copy
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
  // Document field copying
  /****************************************************************/

  copyName (currentDoc: I_OpenedDocument) {
    copyDocumentName(currentDoc)
  }

  copyTextColor (currentDoc: I_OpenedDocument) {
    copyDocumentTextColor(currentDoc)
  }

  copyBackgroundColor (currentDoc: I_OpenedDocument) {
    copyDocumentBackgroundColor(currentDoc)
  }

  /****************************************************************/
  // Document copy
  /****************************************************************/

  documentPass = null as unknown as I_OpenedDocument

  copyTargetDocument (currentDoc: I_OpenedDocument) {
    this.documentPass = extend(true, {}, currentDoc)

    const blueprint = this.SGET_blueprint(this.documentPass.type)
    const newDocument = copyDocument(this.documentPass, this.generateUID(), blueprint)

    const dataPass = {
      doc: newDocument,
      treeAction: false
    }

    // @ts-ignore
    this.SSET_addOpenedDocument(dataPass)
    this.$router.push({
      path: newDocument.url
    }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent (currentDoc: I_OpenedDocument) {
    createNewWithParent(currentDoc, this)
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

  /****************************************************************/
  // Delete dialog
  /****************************************************************/

  deleteObjectDialogTrigger: string | false = false
  deleteObjectDialogClose () {
    this.deleteObjectDialogTrigger = false
  }

  deleteObjectAssignUID () {
    this.deleteObjectDialogTrigger = this.generateUID()
  }

  toDeleteID = ""
  toDeleteType = ""

  deleteTabDocument (targetDocument: I_OpenedDocument) {
    this.toDeleteID = targetDocument._id
    this.toDeleteType = targetDocument.type
    this.deleteObjectAssignUID()
  }

  setDocumentPreviewClose () {
    this.documentPreviewClose = uid()
  }

  documentPreviewClose = ""
}
</script>

<style lang="scss" scoped>
.headerTransitionWrapper {
  display: flex;
}

.tabsWrapper .fas,
.tabsWrapper .fab {
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

      filter: drop-shadow(0 0 1px #000);
      text-shadow:
        //-2px -2px 0 $shadowColorSurround,
        //2px -2px 0 $shadowColorSurround,
        //-2px 2px 0 $shadowColorSurround,
        //2px 2px 0 $shadowColorSurround,
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

  .fas,
  .fab {
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
