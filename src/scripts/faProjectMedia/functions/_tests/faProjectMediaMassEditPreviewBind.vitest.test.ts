import { expect, test } from 'vitest'

import { createFaProjectMediaMassEditPreviewBind } from '../../faProjectMedia_manager'

function box<T> (value: T): { value: T } {
  return { value }
}

function createBind (
  url: string,
  opts?: {
    embedBody?: string
    isEmbedPreview?: boolean
  }
) {
  const previewUrl = box(url)
  const embedBody = box(opts?.embedBody ?? '')
  const isEmbedPreview = box(opts?.isEmbedPreview ?? false)
  const pendingTimeouts = new Map<number, () => void>()
  let nextTimeoutId = 0
  const watchCbs: Array<() => void> = []
  let unmountHook: () => void = () => undefined

  const bind = createFaProjectMediaMassEditPreviewBind({
    clearTimeoutFn (id) {
      pendingTimeouts.delete(id as number)
    },
    computedFn (getter) {
      return {
        get value () {
          return getter()
        }
      }
    },
    debounceMs: 300,
    embedBody,
    isEmbedPreview,
    onBeforeUnmountFn (hook) {
      unmountHook = hook
    },
    previewUrl,
    refFn: box,
    setTimeoutFn (handler) {
      nextTimeoutId += 1
      pendingTimeouts.set(nextTimeoutId, handler)
      return nextTimeoutId
    },
    watchFn (_source, cb) {
      watchCbs.push(cb)
    }
  })

  return {
    bind,
    embedBody,
    isEmbedPreview,
    pendingTimeouts,
    previewUrl,
    runWatch: () => {
      for (const cb of watchCbs) {
        cb()
      }
    },
    unmount: () => {
      unmountHook()
    }
  }
}

/**
 * createFaProjectMediaMassEditPreviewBind
 * Bind delays probe URL swap and keeps a fail until load.
 */
test('Test that createFaProjectMediaMassEditPreviewBind debounces probe URL swaps', () => {
  const harness = createBind('https://cdn.example.com/a.png')
  const { bind, pendingTimeouts, previewUrl } = harness

  bind.onPreviewLoad()
  expect(bind.showPreviewWarning.value).toBe(false)
  expect(bind.previewImagePending.value).toBe(false)
  expect(bind.showPreviewImage.value).toBe(true)
  expect(bind.showPreviewTypeIcon.value).toBe(false)

  previewUrl.value = 'https://cdn.example.com/b.png'
  harness.runWatch()
  expect(bind.probeSrc.value).toBe('https://cdn.example.com/a.png')

  previewUrl.value = 'https://cdn.example.com/c.png'
  harness.runWatch()
  expect(pendingTimeouts.size).toBe(1)
  const queued = [...pendingTimeouts.values()][0]
  queued?.()
  pendingTimeouts.clear()
  expect(bind.probeSrc.value).toBe('https://cdn.example.com/c.png')
  expect(bind.previewImagePending.value).toBe(true)

  bind.onPreviewError()
  expect(bind.showPreviewWarning.value).toBe(true)

  previewUrl.value = 'https://cdn.example.com/d.png'
  harness.runWatch()
  expect(pendingTimeouts.size).toBe(1)
  harness.unmount()
  expect(pendingTimeouts.size).toBe(0)
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * Empty preview URL starts in the warning state.
 */
test('Test that createFaProjectMediaMassEditPreviewBind warns on an empty URL', () => {
  const harness = createBind('')

  expect(harness.bind.showPreviewImage.value).toBe(false)
  expect(harness.bind.showPreviewWarning.value).toBe(true)
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * A video URL shows the type icon after load, not an image.
 */
test('Test that createFaProjectMediaMassEditPreviewBind uses a video type icon', () => {
  const harness = createBind('https://cdn.example.com/clip.mp4')

  expect(harness.bind.showPreviewImage.value).toBe(false)
  expect(harness.bind.showPreviewVideo.value).toBe(true)
  expect(harness.bind.showPreviewTypeIcon.value).toBe(false)

  harness.bind.onPreviewLoad()
  expect(harness.bind.showPreviewTypeIcon.value).toBe(true)
  expect(harness.bind.previewTypeIconName.value).toBe('video_file')
  expect(harness.bind.showPreviewWarning.value).toBe(false)
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * An audio URL shows the audio type icon after load.
 */
test('Test that createFaProjectMediaMassEditPreviewBind uses an audio type icon', () => {
  const harness = createBind('https://cdn.example.com/track.mp3')

  harness.bind.onPreviewLoad()
  expect(harness.bind.showPreviewAudio.value).toBe(true)
  expect(harness.bind.previewTypeIconName.value).toBe('audio_file')
  expect(harness.bind.showPreviewTypeIcon.value).toBe(true)
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * Text-like extensions try as an image, not a type icon.
 */
test('Test that createFaProjectMediaMassEditPreviewBind treats text URLs as images', () => {
  const harness = createBind('https://cdn.example.com/note.md')

  expect(harness.bind.showPreviewImage.value).toBe(true)
  expect(harness.bind.showPreviewTypeIcon.value).toBe(false)
  expect(harness.bind.previewTypeIconName.value).toBe('')
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * Embed preview uses the file-code icon when the body is nonempty.
 */
test('Test that createFaProjectMediaMassEditPreviewBind uses an embed type icon', () => {
  const harness = createBind('https://cdn.example.com/a.png', {
    embedBody: '<iframe src="https://www.youtube.com/embed/x"></iframe>',
    isEmbedPreview: true
  })

  expect(harness.bind.showPreviewImage.value).toBe(false)
  expect(harness.bind.showPreviewTypeIcon.value).toBe(true)
  expect(harness.bind.previewTypeIconName.value).toBe('fa-solid fa-file-code')
  expect(harness.bind.showPreviewWarning.value).toBe(false)
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * Empty embed body shows the invalid preview warning.
 */
test('Test that createFaProjectMediaMassEditPreviewBind warns on an empty embed body', () => {
  const harness = createBind('https://cdn.example.com/a.png', {
    isEmbedPreview: true
  })

  expect(harness.bind.showPreviewImage.value).toBe(false)
  expect(harness.bind.showPreviewTypeIcon.value).toBe(false)
  expect(harness.bind.showPreviewWarning.value).toBe(true)
  harness.unmount()
})

/**
 * createFaProjectMediaMassEditPreviewBind
 * Embed preview does not queue a URL probe.
 */
test('Test that createFaProjectMediaMassEditPreviewBind skips URL probes for embed', () => {
  const harness = createBind('https://cdn.example.com/a.png')
  harness.isEmbedPreview.value = true
  harness.runWatch()
  expect(harness.pendingTimeouts.size).toBe(0)
  expect(harness.bind.showPreviewImage.value).toBe(false)
  harness.unmount()
})
