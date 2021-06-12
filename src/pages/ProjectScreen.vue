<template>
  <q-page
  class="column items-center justify-center no-wrap projectScreen"
  :class="{
    'q-pb-xl q-pl-xl q-pr-xl': disableDocumentControlBar,
    'q-pa-xl': !disableDocumentControlBar,
    }"
  >
      <!-- New document dialog -->
      <newDocumentDialog
        :dialog-trigger="newObjectDialogTrigger"
        @trigger-dialog-close="newObjectDialogClose"
      />

      <!-- Delele document dialog -->
      <deleteDocumentCheckDialog
        :dialog-trigger="deleteObjectDialogTrigger"
        :document-id="toDeleteID"
        :document-type="toDeleteType"
        @trigger-dialog-close="deleteObjectDialogClose"
      />

      <div class="col-12">
        <h5 class="mainProjectSubTitle">Project overview for </h5>
      </div>
      <div class="col-12">
        <h2 class="mainProjectTitle"> {{projectName}}</h2>
      </div>
      <div class="hintWrapper" v-if="!hideTooltipsProject && allDocuments > 0">

        <div v-if="hidePlushes">
          <q-icon name="mdi-help" size="30px" class="q-mr-md" />
        </div>

        <div class="mascotWrapper" v-if="!hidePlushes">
          <q-img
          :src="plusheForm"
          style="max-width: 135px; height: 100%;"
          contain
        />
        </div>
        <div>
          <div class="text-subtitle1 text-dark text-bold text-left">
            Did you know?
          </div>
          <div class="text-weight-medium text-dark text-left">
            {{tipTrickMessage}}
          </div>
        </div>

      </div>

    <div class="projectContentWrapper">
      <div
        class="documentGraphParent"
        :class="{'-fullsize': !graphDataShowing}"
        >
        <q-card
          dark
          class="documentGraphWrapper"
          :class="{'-fullsize': !graphDataShowing}"
        >
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            :duration="600"
          >
            <q-card-section
              v-show="!graphDataLoaded"
              transition-show="scale"
              transition-hide="scale"
              style="height: 500px;"
              class="flex justify-center flex-center"
            >
              <q-spinner-gears
                color="primary"
                size="160px"
              />
            </q-card-section>
          </transition>

          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            :duration="600"
          >
            <q-card-section
              v-show="graphDataShowing && allDocuments === 0"
              transition-show="scale"
              transition-hide="scale"
              style="height: 500px;"
              class="flex justify-center flex-center column"
            >
            <div class="row justify-center flex-center">
              <div class="col-12 q-mb-xl">
                <h6 class="q-my-xs text-center">Welcome to your new project! Feel free to look around or...</h6>
              </div>
              <div class="col-12 q-mt-md q-mb-xl text-center">
                <q-btn
                  color="primary"
                  size="lg"
                  outline
                  class="q-px-xl q-py-xs"
                  @click="newObjectAssignUID"
                >
                Create your first document!
                </q-btn>
              </div>
            </div>

            </q-card-section>
          </transition>

          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            appear
            :duration="600"
          >
            <q-card-section
              v-show="graphDataShowing && allDocuments > 0"
              transition-show="scale"
              transition-hide="scale"
            >
              <h5 class="q-px-xl q-my-lg">
                Document distribution - <span class="text-bold text-primary">{{allDocuments}}</span> total
              </h5>
              <apexchart v-if="graphDataShowing" type="bar" height="350" width="900" :options="chartOptions" :series="series" />
            </q-card-section>
          </transition>

        </q-card>
      </div>

      <div class="lastOpenedList" v-if="allDocuments > 0 && graphDataShowing">
        <q-card
          dark
        >
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            :duration="600"
            >
              <q-card-section
                v-show="!graphDataLoaded"
                transition-show="scale"
                transition-hide="scale"
                style="height: 500px;"
                class="flex justify-center flex-center"
              >
                <q-spinner-gears
                  color="primary"
                  size="160px"
                />
              </q-card-section>
            </transition>

          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            :duration="600"
            >
            <q-card-section
              v-show="graphDataShowing"
            >

              <h5 class="q-px-md q-mt-lg q-mb-xs">Last opened</h5>

              <q-list
                v-if="lastOpenedDocuments.length > 0"
                class="q-pa-md lastOpenedListInner"
                >
                <div
                  v-for="single in lastOpenedDocuments"
                  :key="single._id"
                  class="lastOpenedItem"
                >

                <q-item
                  clickable
                  class="text-accent q-px-sm"
                  @mouseleave="setDocumentPreviewClose"
                  :to="single.url"
                >
                  <documentPreview
                    v-if="!preventPreviewsDocuments"
                    :custom-anchor="'center left'"
                    :custom-self="'center right'"
                    :document-id="single._id"
                    :external-close-trigger="documentPreviewClose"
                  />
                  <q-item-section avatar class="q-px-sm">
                    <q-icon
                      :size="((single.icon.includes('fas') || single.icon.includes('fab')) ? '16px': '21px')"
                      :name="(single.isCategory) ? 'fas fa-folder-open' : single.icon"
                    />
                  </q-item-section>
                  <q-item-section
                    >
                      <span class="text-weight-medium">
                        <span class="isDeadIndicator" v-if="single.isDead">
                          †
                        </span>
                        <span :class="{'isDead': (single.isDead && !hideDeadCrossThrough)}">
                            {{stripTags(single.label)}}
                        </span>
                      </span>
                  </q-item-section>
                  <q-menu
                    touch-position
                    context-menu
                    auto-close
                    separate-close-popup
                  >

                    <q-list class="bg-gunmetal-light text-accent">

                      <template>
                        <q-item clickable @click="copyName(single)">
                          <q-item-section>Copy name</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-text-recognition" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="copyTextColor(single)">
                          <q-item-section>Copy text color</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-eyedropper" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="copyBackgroundColor(single)">
                          <q-item-section>Copy background color</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-format-color-fill" />
                          </q-item-section>
                        </q-item>
                        <q-separator dark />
                        <q-item clickable @click="openExistingInput(single)">
                          <q-item-section>Open document</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-book-open-page-variant-outline" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="editExistingInput(single)">
                          <q-item-section>Edit document</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-pencil" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="openDocumentPreviewPanel(single._id)">
                          <q-item-section>Preview document in split-view mode</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-file-search-outline" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="addNewUnderParent(single)">
                          <q-item-section>Create new document with this document as parent</q-item-section>
                          <q-item-section avatar>
                            <q-icon color="primary" name="mdi-file-tree" />
                          </q-item-section>
                        </q-item>
                        <q-item clickable @click="copyTargetDocument(single)">
                          <q-item-section>Copy this document</q-item-section>
                          <q-item-section avatar>
                            <q-icon color="primary" name="mdi-content-copy" />
                          </q-item-section>
                        </q-item>
                        <q-separator dark />
                        <q-item clickable v-close-popup @click="triggerExport(single)">
                          <q-item-section>Export document</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="mdi-database-export-outline" />
                          </q-item-section>
                        </q-item>
                        <q-separator dark />
                        <q-item clickable v-close-popup @click="deleteTabDocument(single)">
                          <q-item-section class="text-secondary"><b>Delete this document</b></q-item-section>
                          <q-item-section avatar class="text-secondary">
                            <q-icon name="mdi-text-box-remove-outline" />
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-list>

                  </q-menu>

                </q-item>

                <q-separator dark />

                </div>

              </q-list>
            </q-card-section>
          </transition>

        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { Loading, colors, uid, extend } from "quasar"
import newDocumentDialog from "src/components/dialogs/NewDocument.vue"
import { retrieveLastOpenedDocuments } from "src/scripts/projectManagement/projectManagent"
import { tipsTricks } from "src/scripts/utilities/tipsTricks"
import { summonAllPlusheForms } from "src/scripts/utilities/plusheMascot"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { copyDocumentBackgroundColor, copyDocumentName, copyDocumentTextColor } from "src/scripts/documentActions/uniqueFieldCopy"
import { copyDocument } from "src/scripts/documentActions/copyDocument"
import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import deleteDocumentCheckDialog from "src/components/dialogs/DeleteDocumentCheck.vue"
import documentPreview from "src/components/DocumentPreview.vue"

@Component({
  components: {
    newDocumentDialog,
    deleteDocumentCheckDialog,
    documentPreview
  }
})
export default class ProjectScreen extends BaseClass {
  /****************************************************************/
  // LOCAL SETTINGS
  /****************************************************************/

  /**
   * React to changes on the options store
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.hideTooltipsProject = options.hideTooltipsProject
    this.hidePlushes = options.hidePlushes
    this.disableDocumentControlBar = options.disableDocumentControlBar

    this.hideDeadCrossThrough = this.SGET_options.hideDeadCrossThrough
    this.preventPreviewsDocuments = this.SGET_options.preventPreviewsDocuments
  }

  hideDeadCrossThrough = false

  preventPreviewsDocuments = false

  /**
   * Hides the mascot... nooo :(
   */
  hidePlushes = false

  /**
   * Determines if the document control bar is show or hidden
   */
  disableDocumentControlBar = false

  /**
   * Determines if the project overview help hint should show or not
   */
  hideTooltipsProject = false

  /****************************************************************/
  // BASIC DATA & FUNCTIONALITY
  /****************************************************************/

  /**
   * Setup of the page
   */
  created () {
    this.projectName = this.SGET_getProjectName
    Loading.hide()

    this.tipTrickMessage = tipsTricks[Math.floor(Math.random() * tipsTricks.length)]
    this.plusheForm = summonAllPlusheForms[Math.floor(Math.random() * summonAllPlusheForms.length)]

    if (this.SGET_getProjectLoadedStatus) {
      this.loadGraphData().catch(e => console.log(e))
      this.loadLastOpenedList().catch(e => console.log(e))
    }
  }

  @Watch("SGET_getProjectName")
  checkProjectStatus () {
    this.projectName = this.SGET_getProjectName
  }

  @Watch("SGET_getProjectLoadedStatus")
  reactToProjectLoaded () {
    if (this.SGET_getProjectLoadedStatus) {
      this.loadGraphData().catch(e => console.log(e))
      this.loadLastOpenedList().catch(e => console.log(e))
    }
  }

  /**
   * Name of the current project
   */
  projectName = ""

  /**
   * Loaded trivia message
   */
  tipTrickMessage = ""

  /**
   * Current form the majestic Fantasia desided to take this fine day!
   */
  plusheForm = ""

  /****************************************************************/
  // GRAPH FUNCTIONALITY
  /****************************************************************/

  /**
   * Amount of all documents
   */
  allDocuments = 0

  /**
   * Determines if the graph data finished loaded
   */
  graphDataLoaded = false

  /**
   * Determines if the graph is showing or not
   */
  graphDataShowing = false

  /**
   * Loads graph data
   */
  async loadGraphData () {
    this.populateChartOptions()

    const allBlueprings = this.SGET_allBlueprints

    // Retrieve all documents
    for (const blueprint of allBlueprings) {
      const docCount = this.SGET_allDocumentsByType(blueprint._id).docs.length

      this.allDocuments = this.allDocuments + docCount

      this.series[0].data.push(docCount)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.chartOptions.xaxis.categories.push(blueprint.namePlural)
    }
    this.graphDataLoaded = true

    await this.sleep(600)
    this.graphDataShowing = true
  }

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent (currentDoc: I_ShortenedDocument) {
    createNewWithParent(currentDoc, this)
  }

  @Watch("SGET_allDocuments", { deep: true })
  reactToAllDocumentListChange () {
    if (!this.SGET_allDocumentsFirstRunState) {
      this.loadLastOpenedList().catch(e => console.log(e))
    }
  }

  /**
   * Loads graph data
   */
  async loadLastOpenedList () {
    const idList = await retrieveLastOpenedDocuments()
    this.lastOpenedDocuments = idList.map(id => this.SGET_document(id)).filter(e => (e))
  }

  lastOpenedDocuments: I_ShortenedDocument[] = []

  copyName (currentDoc: I_ShortenedDocument) {
    copyDocumentName(currentDoc)
  }

  copyTextColor (currentDoc: I_ShortenedDocument) {
    copyDocumentTextColor(currentDoc)
  }

  copyBackgroundColor (currentDoc: I_ShortenedDocument) {
    copyDocumentBackgroundColor(currentDoc)
  }

  documentPass = null as unknown as I_ShortenedDocument

  copyTargetDocument (currentDoc: I_ShortenedDocument) {
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

  /**
   * Opened the existing input
   */
  openExistingInput (e: I_ShortenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    this.openExistingDocumentRoute(e)
  }

  /**
   * Opened the existing input in two modes
   * Either as a focus with closure of the dialog.
   * Or as a background tab without closing of the dialog.
   */
  editExistingInput (e: I_ShortenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    // @ts-ignore
    this.openExistingDocumentRouteWithEdit(e)
  }

  triggerExport (node: {_id: string}) {
    this.SSET_setExportDialogState([node._id])
  }

  setDocumentPreviewClose () {
    this.documentPreviewClose = uid()
  }

  documentPreviewClose = ""
  /**
   * Graph series data
   */
  series = [{
    name: "Documents",
    data: [] as number[]
  }]

  /**
   * Empty chart options
   * This needs to load after load, otherwise the graph doesn't reload properly if the settings for dark/light mode change
   */
  chartOptions = {} as any

  /**
   * Loads up proper chart options into the object
   */
  populateChartOptions () {
    this.chartOptions = {
      colors: [colors.getBrand("primary")],
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000
      },
      grid: {
        show: false
      },
      states: {
        hover: {
          filter: {
            type: "none"
          }
        },
        active: {
          filter: {
            type: "none"
          }
        }
      },
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          dataLabels: {
            position: "center" // top, center, bottom
          }
        }
      },
      dataLabels: {
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.65
        },
        enabled: true,
        formatter: function (val: string) {
          return val
        },
        offsetY: 20,
        style: {
          fontSize: "14px",
          fontFamily: "Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;",
          colors: ["#fff"]
        }
      },
      xaxis: {
        categories: [] as string[],
        position: "bottom",
        labels: {
          style: {
            fontFamily: "Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;",
            colors: colors.getBrand("accent"),
            cssClass: "docCountLabel"
          }
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        crosshairs: {

          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "transparent",
              colorTo: "transparent",
              stops: [0, 100],
              opacityFrom: 0,
              opacityTo: 0
            }
          }
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function (val: string) {
            return val
          },
          style: {
            fontSize: "14px",
            fontFamily: "Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;",
            colors: "#dcdcdc"
          }
        }
      }
    }
  }

  /****************************************************************/
  // NEW DOCUMENT DIALOG
  /****************************************************************/

  newObjectDialogTrigger: string | false = false
  newObjectDialogClose () {
    this.newObjectDialogTrigger = false
  }

  newObjectAssignUID () {
    this.newObjectDialogTrigger = this.generateUID()
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

  deleteTabDocument (targetDocument: I_ShortenedDocument) {
    this.toDeleteID = targetDocument._id
    this.toDeleteType = targetDocument.type
    this.deleteObjectAssignUID()
  }
}
</script>

<style lang="scss">

.projectScreen {
  max-width: 1450px;
  margin: auto;
}

.mascotWrapper {
  height: 135px;
  width: 135px;
  margin-right: 30px;
  flex-shrink: 0;
}

.hintWrapper {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: lighten(#d7ac47, 35);
  border-radius: 5px;
  margin-bottom: 30px;
  color: var(--q-color-dark);
  border: 2px solid var(--q-color-dark);
}

.mainProjectTitle {
  margin-bottom: 30px;
  color: var(--q-color-dark);
}

body.body--dark {
  .mainProjectTitle {
    color: var(--q-color-primary);
  }
}

.apexcharts-tooltip {
  display: none !important;
}

.apexcharts-canvas {
  padding-bottom: 50px;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: content-box !important;

  path {
    stroke: none !important;
  }

  svg {
    height: 425px;
    overflow: visible;
  }

  .apexcharts-series path {
    fill: var(--q-color-primary);
  }
}

.projectContentWrapper {
  width: 100%;
  display: flex;
}

.documentGraphParent {
  min-height: 525px;
  max-height: 525px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100% - 110px);
  width: 990px;

  &.-fullsize {
    width: 100%;
    max-width: 100%;
  }
}

.documentGraphWrapper {
  min-height: 525px;
  max-height: 525px;
  overflow: hidden;
  width: 990px;

  &.-fullsize {
    width: 100%;
  }
}

.lastOpenedList {
  width: 334px;
  margin-left: 30px;
  flex-grow: 0;
  flex-shrink: 0;

  > div {
    height: 100%;
  }
}

.lastOpenedListInner {
  max-height: 425px;
  overflow: auto;
}

.docCountLabel {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>

<style scoped lang="scss">

.mainProjectSubTitle {
  margin-top: 40px;
  margin-bottom: 0;
  opacity: 0.8;
}

.mainProjectTitle {
  position: relative;
  margin-top: 10px;
  font-weight: 500;
}

.lastOpenedItem {
  position: relative;

  .q-item__section--avatar {
    min-width: 44px;
  }
}
</style>
