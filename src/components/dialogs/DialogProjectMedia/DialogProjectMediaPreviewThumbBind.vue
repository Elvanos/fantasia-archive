<template>
  <DialogProjectMediaMassEditPreviewThumb
    v-bind="previewThumbBind"
    :alt="item.displayName"
    :caption="caption"
    :embed-html="embedHtml"
    :locator-prefix="locatorPrefixBound"
    :row-id="item.id"
    :thumb-size="thumbSizeBound"
    :warning-tooltip="$t('dialogs.projectMedia.massEditPreviewInvalidTooltip')"
    @error="onPreviewError"
    @load="onPreviewLoad"
  />
</template>

<script setup lang="ts">
import type {
  I_faProjectMedia,
  T_faProjectMediaPreviewThumbSize
} from 'app/types/I_faProjectMediaDomain'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import {
  createFaProjectMediaMassEditPreviewBind,
  FA_PROJECT_MEDIA_MASS_EDIT_PREVIEW_DEBOUNCE_MS,
  resolveFaProjectMediaMassEditPreviewUrl,
  resolveFaProjectMediaThumbCaption
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'
import DialogProjectMediaMassEditPreviewThumb from './DialogProjectMediaMassEditPreviewThumb.vue'

defineOptions({
  name: 'DialogProjectMediaPreviewThumbBind'
})

const props = withDefaults(defineProps<{
  debounceMs?: number
  item: I_faProjectMedia
  locatorPrefix?: string
  thumbSize?: T_faProjectMediaPreviewThumbSize
}>(), {
  debounceMs: FA_PROJECT_MEDIA_MASS_EDIT_PREVIEW_DEBOUNCE_MS,
  locatorPrefix: 'dialogProjectMedia-massEdit-preview',
  thumbSize: 'massEdit'
})

const locatorPrefixBound = computed(() => {
  return props.locatorPrefix ?? 'dialogProjectMedia-massEdit-preview'
})
const thumbSizeBound = computed(() => props.thumbSize ?? 'massEdit')

const previewUrl = computed(() => {
  return resolveFaProjectMediaMassEditPreviewUrl(props.item)
})

const caption = computed(() => {
  if (thumbSizeBound.value !== 'list') {
    return ''
  }
  return resolveFaProjectMediaThumbCaption(props.item.displayName, previewUrl.value)
})

const embedBody = computed(() => {
  return props.item.externalEmbed
})

const isEmbedPreview = computed(() => {
  return props.item.type === 'external' && props.item.externalType === 'embed'
})

const embedHtml = computed(() => {
  if (!isEmbedPreview.value) {
    return ''
  }
  return embedBody.value
})

const {
  onPreviewError,
  onPreviewLoad,
  previewImagePending,
  previewTypeIconName,
  probeSrc,
  showPreviewAudio,
  showPreviewImage,
  showPreviewTypeIcon,
  showPreviewVideo,
  showPreviewWarning
} = createFaProjectMediaMassEditPreviewBind({
  clearTimeoutFn (id) {
    clearTimeout(id as ReturnType<typeof setTimeout>)
  },
  computedFn: computed,
  debounceMs: props.debounceMs,
  embedBody,
  isEmbedPreview,
  onBeforeUnmountFn: onBeforeUnmount,
  previewUrl,
  refFn: ref,
  setTimeoutFn (handler, timeout) {
    return setTimeout(handler, timeout)
  },
  watchFn (source, cb) {
    watch(source, cb)
  }
})

const previewThumbBind = computed(() => {
  const pending = previewImagePending.value
  const probeSrcBound = probeSrc.value
  const showAudio = showPreviewAudio.value
  const showImage = showPreviewImage.value
  const showTypeIcon = showPreviewTypeIcon.value
  const showVideo = showPreviewVideo.value
  const showWarning = showPreviewWarning.value
  const typeIconName = previewTypeIconName.value
  return {
    pending,
    probeSrc: probeSrcBound,
    showAudio,
    showImage,
    showTypeIcon,
    showVideo,
    showWarning,
    typeIconName
  }
})
</script>
