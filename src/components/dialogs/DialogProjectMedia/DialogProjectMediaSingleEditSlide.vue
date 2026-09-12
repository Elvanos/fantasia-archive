<template>
  <div
    class="dialogProjectMediaSingleEditSlide"
    data-test-locator="dialogProjectMedia-singleEditSlide"
  >
    <div
      class="dialogProjectMediaSingleEditSlide__backdrop"
      data-test-locator="dialogProjectMedia-singleEditSlide-backdrop"
    />
    <div class="dialogProjectMediaSingleEditSlide__panel">
      <div class="dialogProjectMediaSingleEditSlide__bodyViewport">
        <div
          ref="navTrackRef"
          class="dialogProjectMediaSingleEditSlide__track"
          :class="navTrackClassList"
          data-test-locator="dialogProjectMedia-singleEditSlide-navTrack"
          @transitionend="onNavTrackTransitionEnd"
        >
          <div
            v-for="pane in navPanes"
            :key="`${pane.kind}-${pane.id}`"
            class="dialogProjectMediaSingleEditSlide__pane hasScrollbar"
            :data-test-nav-kind="pane.kind"
            data-test-locator="dialogProjectMedia-singleEditSlide-navPane"
          >
            <DialogProjectMediaSingleEditForm
              v-if="pane.kind === 'live' && row !== null"
              :dense="false"
              :row="row"
              @update:row="applyLiveRow"
            />
            <DialogProjectMediaSingleEditForm
              v-else-if="outgoingRow !== null"
              v-model:row="outgoingRow"
              :dense="false"
            />
          </div>
        </div>
      </div>
      <div class="q-mb-lg q-px-md dialogProjectMedia__cardActions dialogProjectMediaSingleEditSlide__footer">
        <div class="dialogProjectMediaSingleEditSlide__nav">
          <q-btn
            :aria-label="$t('dialogs.projectMedia.singleEditPreviousTooltip')"
            class="dialogProjectMedia__cardActionButton dialogProjectMediaSingleEditSlide__navBtn"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-previous"
            :disable="isPreviousNavLocked"
            icon="keyboard_arrow_left"
            no-wrap
            outline
            @click="onPreviousClick"
          />
          <q-btn
            :aria-label="$t('dialogs.projectMedia.singleEditNextTooltip')"
            class="dialogProjectMedia__cardActionButton dialogProjectMediaSingleEditSlide__navBtn"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-next"
            :disable="isNextNavLocked"
            icon="keyboard_arrow_right"
            no-wrap
            outline
            @click="onNextClick"
          />
        </div>
        <div class="dialogProjectMediaSingleEditSlide__actions">
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="accent"
            data-test-locator="dialogProjectMedia-singleEditSlide-close"
            flat
            :label="$t('dialogs.projectMedia.closeButton')"
            no-wrap
            @click="emit('close')"
          />
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-saveStay"
            :label="$t('dialogs.projectMedia.singleEditSaveWithoutCloseButton')"
            no-wrap
            outline
            @click="emit('saveStay')"
          />
          <q-btn
            class="dialogProjectMedia__cardActionButton"
            color="primary-bright"
            data-test-locator="dialogProjectMedia-singleEditSlide-save"
            :label="$t('dialogs.projectMedia.singleEditSaveAndCloseButton')"
            no-wrap
            outline
            @click="emit('save')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

import {
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS,
  resolveDialogProjectMediaSingleEditNavPanes,
  resolveDialogProjectMediaSingleEditNavTrackClassList,
  shouldFinishDialogProjectMediaSingleEditNavTrackTransition,
  shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate
} from './scripts/dialogProjectMedia_manager'
import DialogProjectMediaSingleEditForm from './DialogProjectMediaSingleEditForm.vue'

defineOptions({
  name: 'DialogProjectMediaSingleEditSlide'
})

const row = defineModel<I_faProjectMediaMassEditRow | null>('row', { required: true })

const props = defineProps<{
  nextDisabled: boolean
  previousDisabled: boolean
}>()

const emit = defineEmits<{
  close: []
  next: []
  previous: []
  save: []
  saveStay: []
}>()

const outgoingRow = ref<I_faProjectMediaMassEditRow | null>(null)
const navDirection = ref<'next' | 'previous' | null>(null)
const isNavTrackMoving = ref(false)
const navTrackRef = ref<HTMLElement | null>(null)
let navFinishTimer = 0

const isNavAnimating = computed(() => {
  return outgoingRow.value !== null
})

const isPreviousNavLocked = computed(() => {
  return props.previousDisabled || isNavAnimating.value
})

const isNextNavLocked = computed(() => {
  return props.nextDisabled || isNavAnimating.value
})

const navPanes = computed(() => {
  return resolveDialogProjectMediaSingleEditNavPanes({
    direction: navDirection.value,
    liveId: row.value?.id ?? null,
    outgoingId: outgoingRow.value?.id ?? null
  })
})

const navTrackClassList = computed(() => {
  return resolveDialogProjectMediaSingleEditNavTrackClassList({
    direction: navDirection.value,
    isMoving: isNavTrackMoving.value,
    isSplit: outgoingRow.value !== null
  })
})

function clearNavFinishTimer (): void {
  if (navFinishTimer === 0) {
    return
  }
  window.clearTimeout(navFinishTimer)
  navFinishTimer = 0
}

function finishNavAnimation (): void {
  clearNavFinishTimer()
  outgoingRow.value = null
  navDirection.value = null
  isNavTrackMoving.value = false
}

function beginNavTrackMove (): void {
  const track = navTrackRef.value
  if (track !== null) {
    void track.offsetWidth
  }
  isNavTrackMoving.value = true
}

function applyLiveRow (nextRow: I_faProjectMediaMassEditRow): void {
  const ignoreStale = shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: row.value?.id ?? null,
    nextId: nextRow.id,
    outgoingId: outgoingRow.value?.id ?? null
  })
  if (ignoreStale) {
    return
  }
  row.value = nextRow
}

function onNavTrackTransitionEnd (event: TransitionEvent): void {
  const shouldFinish = shouldFinishDialogProjectMediaSingleEditNavTrackTransition({
    currentTarget: event.currentTarget,
    propertyName: event.propertyName,
    target: event.target
  })
  if (!shouldFinish) {
    return
  }
  finishNavAnimation()
}

function emitNav (direction: 'next' | 'previous'): void {
  if (direction === 'previous') {
    emit('previous')
    return
  }
  emit('next')
}

function startNavSlide (direction: 'next' | 'previous'): void {
  const current = row.value
  if (current === null) {
    emitNav(direction)
    return
  }
  clearNavFinishTimer()
  outgoingRow.value = { ...current }
  navDirection.value = direction
  isNavTrackMoving.value = false
  emitNav(direction)
  navFinishTimer = window.setTimeout(
    finishNavAnimation,
    FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_SLIDE_MS
  )
  void nextTick(beginNavTrackMove)
}

function onPreviousClick (): void {
  if (isPreviousNavLocked.value) {
    return
  }
  startNavSlide('previous')
}

function onNextClick (): void {
  if (isNextNavLocked.value) {
    return
  }
  startNavSlide('next')
}

onBeforeUnmount(clearNavFinishTimer)
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.singleEditSlide.scoped.scss"></style>
<style lang="scss" src="./styles/DialogProjectMedia.singleEditSlide.unscoped.scss"></style>
