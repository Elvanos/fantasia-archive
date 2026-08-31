import type { Meta, StoryObj } from '@storybook/vue3-vite'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_SUBVIEW_ONLINE_URLS,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'
import DialogProjectMediaPanelsColumn from '../DialogProjectMediaPanelsColumn.vue'

const meta = {
  component: DialogProjectMediaPanelsColumn,
  parameters: {
    docs: {
      story: {
        iframeHeight: '420px'
      }
    },
    layout: 'padded'
  },
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/dialogs/DialogProjectMediaPanelsColumn'
} satisfies Meta<typeof DialogProjectMediaPanelsColumn>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    searchQuery: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
  }
}

export const MediaAddition: StoryObj<typeof meta> = {
  args: {
    searchQuery: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
  }
}

export const AddOnlineUrls: StoryObj<typeof meta> = {
  args: {
    addSubView: FA_DIALOG_PROJECT_MEDIA_ADD_SUBVIEW_ONLINE_URLS,
    searchQuery: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
  }
}
