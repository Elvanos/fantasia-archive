import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DialogQuickSearchDocument from '../DialogQuickSearchDocument.vue'
import {
  buildDialogQuickSearchDocumentStoryContentBridgeOverrides,
  dialogQuickSearchDocumentStoryDocuments,
  dialogQuickSearchDocumentStorySingleWorld,
  dialogQuickSearchDocumentStoryTemplates,
  dialogQuickSearchDocumentStoryTwoWorlds
} from './dialogQuickSearchDocumentStoryFixtures'

const meta = {
  title: 'Components/dialogs/DialogQuickSearchDocument',
  component: DialogQuickSearchDocument,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: '520px'
      },
      description: {
        component:
          'Quick-search existing documents: pick world then document. Trailing Edit / Copy / Add under close on left-click; middle-click keeps the dialog open. Select/Enter honors disableCloseAfterSelectQuickSearch (stay open + background append).'
      }
    }
  }
} satisfies Meta<typeof DialogQuickSearchDocument>

export default meta

/**
 * Single world with documents — world select hidden, document select populated.
 * VRT baseline required (no skip-visual).
 */
export const Default: StoryObj<typeof meta> = {
  args: {
    directInput: 'QuickSearchDocument'
  },
  parameters: {
    contentBridgeOverrides: buildDialogQuickSearchDocumentStoryContentBridgeOverrides({
      documents: dialogQuickSearchDocumentStoryDocuments,
      templates: dialogQuickSearchDocumentStoryTemplates,
      worlds: [dialogQuickSearchDocumentStorySingleWorld]
    })
  }
}

/** Two worlds — showWorldSelect true with colored world options. */
export const MultiWorldSelect: StoryObj<typeof meta> = {
  name: 'States/MultiWorldSelect',
  args: {
    directInput: 'QuickSearchDocument'
  },
  parameters: {
    contentBridgeOverrides: buildDialogQuickSearchDocumentStoryContentBridgeOverrides({
      documents: dialogQuickSearchDocumentStoryDocuments,
      templates: dialogQuickSearchDocumentStoryTemplates,
      worlds: dialogQuickSearchDocumentStoryTwoWorlds
    })
  }
}
