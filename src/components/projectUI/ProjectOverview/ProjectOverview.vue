<template>
  <section
    class="projectOverview column items-center full-width"
    data-test-locator="projectOverview"
    :style="{
      '--fa-projectOverview-graph-apex-svg-height': `${chartHeightPx + 2}px`,
      '--fa-projectOverview-graph-card-height': `${graphCardHeightPx}px`
    }"
  >
    <h5
      class="projectOverview__subtitle text-white text-center q-my-none"
      data-test-locator="projectOverview-subtitle"
    >
      {{ $t('projectUI.projectOverview.projectOverviewFor') }}
    </h5>

    <h2
      class="projectOverview__title text-primary-bright text-center q-my-none"
      data-test-locator="projectOverview-projectName"
    >
      {{ projectDisplayName }}
    </h2>

    <!-- Tips & tricks callout -->
    <div
      v-if="showTipCard"
      class="projectOverview__hint row items-center no-wrap full-width"
      data-test-locator="projectOverview-tipCard"
    >
      <FantasiaMascotImage
        v-if="showMascotInTipCard"
        class="projectOverview__hintMascot"
        fantasia-image=""
        height="135px"
        width="135px"
      />

      <div class="projectOverview__hintBody col">
        <div
          class="projectOverview__hintHeading text-subtitle1 text-bold text-left"
          data-test-locator="projectOverview-tipHeading"
        >
          {{ $t('globalFunctionality.unsortedAppTexts.didYouKnow') }}
        </div>
        <div
          class="projectOverview__hintMessage text-weight-medium text-left"
          data-test-locator="projectOverview-tipMessage"
        >
          {{ randomTipCaption }}
        </div>
      </div>
    </div>

    <!-- Chart (+ empty CTA inside card) and optional last opened -->
    <div
      class="projectOverview__content row items-start no-wrap full-width"
      :class="{ 'projectOverview__content--emptyCta': showEmptyCta }"
      data-test-locator="projectOverview-content"
    >
      <ProjectOverviewChartPanel
        :chart-height-px="chartHeightPx"
        :chart-loading="chartLoading"
        :chart-options="chartOptions"
        :chart-series="chartSeries"
        :empty-cta-mode="emptyCtaMode"
        :fullsize="!showContentRow || lastOpenedItems.length === 0"
        :graph-card-width-px="graphCardWidthPx"
        :on-empty-cta-click="onEmptyCtaClick"
        :show-empty-cta="showEmptyCta"
        :total-document-count="totalDocumentCount"
      />

      <ProjectOverviewLastOpenedList
        v-if="showContentRow && lastOpenedItems.length > 0"
        :items="lastOpenedItems"
        :on-context-add-under="onLastOpenedContextAddUnder"
        :on-context-copy-background-color="onLastOpenedContextCopyBackgroundColor"
        :on-context-copy-document="onLastOpenedContextCopyDocument"
        :on-context-copy-name="onLastOpenedContextCopyName"
        :on-context-copy-text-color="onLastOpenedContextCopyTextColor"
        :on-context-delete="onLastOpenedContextDelete"
        :on-context-edit="onLastOpenedContextEdit"
        :on-context-open="onLastOpenedContextOpen"
        :on-row-aux-click="onLastOpenedRowAuxClick"
        :on-row-click="onLastOpenedRowClick"
        :resolve-item-chrome-style="resolveLastOpenedItemChromeStyle"
        :resolve-world-indicator-color="resolveLastOpenedWorldIndicatorColor"
        :show-world-indicators="showWorldIndicators"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import FantasiaMascotImage from 'app/src/components/elements/FantasiaMascotImage/FantasiaMascotImage.vue'

import ProjectOverviewChartPanel from './ProjectOverviewChartPanel.vue'
import ProjectOverviewLastOpenedList from './ProjectOverviewLastOpenedList.vue'
import { useProjectOverview } from './scripts/projectOverview_manager'

defineOptions({
  name: 'ProjectOverview'
})

const {
  chartHeightPx,
  chartLoading,
  chartOptions,
  chartSeries,
  emptyCtaMode,
  graphCardHeightPx,
  graphCardWidthPx,
  lastOpenedItems,
  onEmptyCtaClick,
  onLastOpenedContextAddUnder,
  onLastOpenedContextCopyBackgroundColor,
  onLastOpenedContextCopyDocument,
  onLastOpenedContextCopyName,
  onLastOpenedContextCopyTextColor,
  onLastOpenedContextDelete,
  onLastOpenedContextEdit,
  onLastOpenedContextOpen,
  onLastOpenedRowAuxClick,
  onLastOpenedRowClick,
  projectDisplayName,
  randomTipCaption,
  resolveLastOpenedItemChromeStyle,
  resolveLastOpenedWorldIndicatorColor,
  showContentRow,
  showEmptyCta,
  showMascotInTipCard,
  showTipCard,
  showWorldIndicators,
  totalDocumentCount
} = useProjectOverview()
</script>

<style scoped lang="scss">
.projectOverview {
  margin: 0 auto;
  max-width: $projectOverview-maxWidth;

  &__subtitle {
    margin-top: $projectOverview-subtitle-marginTop;
    opacity: $projectOverview-subtitle-opacity;
  }

  &__title {
    font-weight: $projectOverview-title-fontWeight;
    margin-bottom: $projectOverview-title-marginBottom;
    margin-top: $projectOverview-title-marginTop;
  }

  &__hintMascot {
    flex-shrink: 0;
    height: $projectOverview-hint-mascot-height;
    margin-right: $projectOverview-hint-mascot-marginRight;
    width: $projectOverview-hint-mascot-width;
  }
}
</style>

<style lang="scss" src="./styles/ProjectOverview.hint.unscoped.scss"></style>
<style lang="scss" src="./styles/ProjectOverview.chart.unscoped.scss"></style>
<style lang="scss" src="./styles/ProjectOverview.lastOpened.unscoped.scss"></style>
