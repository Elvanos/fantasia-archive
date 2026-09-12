import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogProjectMediaMassEditPreviewThumb from '../DialogProjectMediaMassEditPreviewThumb.vue'

const meta = {
  component: DialogProjectMediaMassEditPreviewThumb,
  parameters: {
    docs: {
      description: {
        component:
          'Project Media mass-edit thumbnail well: bitmap for image URLs (including text-like extensions), cultured accent type icons for video/audio/embed, playable single-edit media, raw embed HTML, and the invalid-URL warning otherwise.'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaMassEditPreviewThumb'
} satisfies Meta<typeof DialogProjectMediaMassEditPreviewThumb>

export default meta

export const ImagePending: StoryObj<typeof meta> = {
  args: {
    alt: 'bar',
    pending: true,
    probeSrc: 'https://cdn.example.com/foo/bar.png',
    rowId: '550e8400-e29b-41d4-a716-446655440001',
    showAudio: false,
    showImage: true,
    showTypeIcon: false,
    showVideo: false,
    showWarning: false,
    typeIconName: '',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const InvalidUrl: StoryObj<typeof meta> = {
  args: {
    alt: 'bar',
    pending: false,
    probeSrc: '',
    rowId: '550e8400-e29b-41d4-a716-446655440001',
    showAudio: false,
    showImage: false,
    showTypeIcon: false,
    showVideo: false,
    showWarning: true,
    typeIconName: '',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const VideoIcon: StoryObj<typeof meta> = {
  args: {
    alt: 'clip',
    pending: false,
    probeSrc: 'https://cdn.example.com/clip.mp4',
    rowId: '550e8400-e29b-41d4-a716-446655440002',
    showAudio: false,
    showImage: false,
    showTypeIcon: true,
    showVideo: true,
    showWarning: false,
    typeIconName: 'video_file',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const AudioIcon: StoryObj<typeof meta> = {
  args: {
    alt: 'track',
    pending: false,
    probeSrc: 'https://cdn.example.com/track.mp3',
    rowId: '550e8400-e29b-41d4-a716-446655440003',
    showAudio: true,
    showImage: false,
    showTypeIcon: true,
    showVideo: false,
    showWarning: false,
    typeIconName: 'audio_file',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const ListCaption: StoryObj<typeof meta> = {
  args: {
    alt: 'drive-download.zip',
    caption: 'drive-download-20250923t130833z-1-001.zip',
    pending: false,
    probeSrc: '',
    rowId: '550e8400-e29b-41d4-a716-446655440005',
    showAudio: false,
    showImage: false,
    showTypeIcon: true,
    showVideo: false,
    showWarning: false,
    thumbSize: 'list',
    typeIconName: 'description',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const EmbedIcon: StoryObj<typeof meta> = {
  args: {
    alt: 'embed',
    pending: false,
    probeSrc: '',
    rowId: '550e8400-e29b-41d4-a716-446655440004',
    showAudio: false,
    showImage: false,
    showTypeIcon: true,
    showVideo: false,
    showWarning: false,
    typeIconName: 'fa-solid fa-file-code',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const SingleEditVideoPlayer: StoryObj<typeof meta> = {
  args: {
    alt: 'clip',
    pending: false,
    probeSrc: 'https://cdn.example.com/clip.mp4',
    rowId: '550e8400-e29b-41d4-a716-446655440006',
    showAudio: false,
    showImage: false,
    showTypeIcon: true,
    showVideo: true,
    showWarning: false,
    thumbSize: 'singleEdit',
    typeIconName: 'video_file',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const SingleEditAudioPlayer: StoryObj<typeof meta> = {
  args: {
    alt: 'track',
    pending: false,
    probeSrc: 'https://cdn.example.com/track.mp3',
    rowId: '550e8400-e29b-41d4-a716-446655440007',
    showAudio: true,
    showImage: false,
    showTypeIcon: true,
    showVideo: false,
    showWarning: false,
    thumbSize: 'singleEdit',
    typeIconName: 'audio_file',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}

export const SingleEditEmbedHtml: StoryObj<typeof meta> = {
  args: {
    alt: 'embed',
    embedHtml: '<iframe title="clip" width="560" height="315"></iframe>',
    pending: false,
    probeSrc: '',
    rowId: '550e8400-e29b-41d4-a716-446655440008',
    showAudio: false,
    showImage: false,
    showTypeIcon: true,
    showVideo: false,
    showWarning: false,
    thumbSize: 'singleEdit',
    typeIconName: 'fa-solid fa-file-code',
    warningTooltip: 'Medium not found / Invalid URL'
  }
}
