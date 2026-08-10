import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogQuickAddDocument from '../DialogQuickAddDocument.vue'
import {
  buildDialogQuickAddDocumentStoryContentBridgeOverrides,
  dialogQuickAddDocumentStorySingleWorld,
  dialogQuickAddDocumentStoryTemplates,
  dialogQuickAddDocumentStoryTwoWorlds
} from './dialogQuickAddDocumentStoryFixtures'

const meta = {
  title: 'Components/dialogs/DialogQuickAddDocument',
  component: DialogQuickAddDocument,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '520px'
      },
      description: {
        component:
          'Quick-add a temporary document: pick world then template. Storybook opens via directInput; create needs a project content bridge with worlds and templates.'
      }
    }
  }
} satisfies Meta<typeof DialogQuickAddDocument>

export default meta

/**
 * Single world with templates — world select hidden, template select populated.
 * VRT baseline required (no skip-visual).
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    directInput: 'QuickAddDocument'
  },
  parameters: {
    contentBridgeOverrides: buildDialogQuickAddDocumentStoryContentBridgeOverrides({
      templates: dialogQuickAddDocumentStoryTemplates,
      worlds: [dialogQuickAddDocumentStorySingleWorld]
    })
  }
}

/** Two worlds — showWorldSelect true with colored world options. */
export const MultiWorldSelect: StoryObj<typeof meta> = {
  name: 'States/MultiWorldSelect',
  args: {
    directInput: 'QuickAddDocument'
  },
  parameters: {
    contentBridgeOverrides: buildDialogQuickAddDocumentStoryContentBridgeOverrides({
      templates: dialogQuickAddDocumentStoryTemplates,
      worlds: dialogQuickAddDocumentStoryTwoWorlds
    })
  }
}
