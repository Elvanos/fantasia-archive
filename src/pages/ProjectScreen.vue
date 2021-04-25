<template>
  <q-page
  class="column items-center justify-center no-wrap"
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

      <div class="col-12">
        <h5 class="mainProjectSubTitle">Project screen for </h5>
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

      <div class="documentGraphParent">
        <q-card
          dark
          class="documentGraphWrapper"
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
              <h5 class="q-px-lg q-my-lg">
                Document distribution - <span class="text-bold text-primary">{{allDocuments}}</span> total
              </h5>
              <apexchart v-if="graphDataShowing" type="bar" height="350" width="900" :options="chartOptions" :series="series" />
            </q-card-section>
          </transition>

        </q-card>
      </div>

  </q-page>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { Loading, colors } from "quasar"
import newDocumentDialog from "src/components/dialogs/NewDocument.vue"
import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"
import { tipsTricks } from "src/scripts/utilities/tipsTricks"
import { summonAllPlusheForms } from "src/scripts/utilities/plusheMascot"

@Component({
  components: {
    newDocumentDialog
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
  }

  /**
   * Hides the mascot... nooo :(
   */
  hidePlushes = false

  /**
   * Determines if the document control bar is show or hidden
   */
  disableDocumentControlBar = false

  /**
   * Determines if the project screen help hint should show or not
   */
  hideTooltipsProject = false

  /****************************************************************/
  // BASIC DATA & FUNCTIONALITY
  /****************************************************************/

  /**
   * Setup of the page
   */
  async created () {
    this.projectName = await retrieveCurrentProjectName()
    this.loadGraphData().catch(e => console.log(e))
    Loading.hide()

    this.tipTrickMessage = tipsTricks[Math.floor(Math.random() * tipsTricks.length)]
    this.plusheForm = summonAllPlusheForms[Math.floor(Math.random() * summonAllPlusheForms.length)]
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
    if (this.SGET_allDocumentsFirstRunState) {
      await this.sleep(1000)
      this.loadGraphData().catch(e => console.log(e))
      return
    }

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
}
</script>

<style lang="scss">

.mascotWrapper {
  height: 135px;
  width: 135px;
  margin-right: 30px;
  flex-shrink: 0;
}

.hintWrapper {
  max-width: calc(100% - 110px);
  width: 950px;
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
  box-sizing: content-box !important;

  path {
    stroke: none !important;
  }

  svg {
    height: 400px;
  }

  .apexcharts-series path {
    fill: var(--q-color-primary);
  }
}

.documentGraphParent {
  min-height: 500px;
  max-height: 500px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100% - 110px);
  width: 950px;
}

.documentGraphWrapper {
  min-height: 500px;
  max-height: 500px;
  overflow: hidden;
  width: 950px;
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
</style>
