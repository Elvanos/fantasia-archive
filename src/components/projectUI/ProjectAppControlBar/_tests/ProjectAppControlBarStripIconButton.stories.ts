import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ProjectAppControlBarStripIconButton from '../ProjectAppControlBarStripIconButton.vue'

const meta = {
  component: ProjectAppControlBarStripIconButton,
  tags: ['autodocs', 'skip-visual'],
  title: 'Components/projectUI/ProjectAppControlBarStripIconButton'
} satisfies Meta<typeof ProjectAppControlBarStripIconButton>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    icon: 'fa-solid fa-photo-film',
    keybindLabel: 'Ctrl + Alt + Shift + M',
    keybindTestLocator: 'projectAppControlBar-openProjectMediaButton-keybind',
    locator: 'projectAppControlBar-openProjectMediaButton',
    onClick: () => {},
    tooltip: 'Project media'
  }
}

export const WithContentDot: StoryObj<typeof meta> = {
  args: {
    buttonClass: 'projectAppControlBarFixedStripLeft__noteboardButton',
    contentDotLocator: 'projectAppControlBar-toggleAppNoteboardButton-contentDot',
    contentDotVisible: true,
    icon: 'mdi-clipboard-edit-outline',
    keybindLabel: null,
    keybindTestLocator: 'projectAppControlBar-toggleAppNoteboardButton-keybind',
    locator: 'projectAppControlBar-toggleAppNoteboardButton',
    onClick: () => {},
    tooltip: 'Toggle app noteboard'
  }
}
