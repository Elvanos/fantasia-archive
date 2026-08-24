<template>
  <div class="projectAppControlBarFixedStripLeft">
    <template v-if="showGuideButtons">
      <q-btn
        color="primary-bright"
        data-test-locator="projectAppControlBar-keyboardShortcutsButton"
        icon="mdi-keyboard-settings"
        outline
        @click="onKeyboardShortcutsClick"
      >
        <q-tooltip
          anchor="bottom middle"
          class="projectAppControlBar__buttonTooltip"
          self="top middle"
        >
          <div class="fa-tooltip-keybind-stack">
            <span class="fa-tooltip-keybind-stack__label">
              {{ keyboardShortcutsTooltip }}
            </span><div
              v-if="keyboardShortcutsKeybindLabel !== null"
              class="fa-tooltip-keybind-hint fa-text-keybind-hint"
              data-test-locator="projectAppControlBar-keyboardShortcutsButton-keybind"
            >
              ({{ keyboardShortcutsKeybindLabel }})
            </div>
          </div>
        </q-tooltip>
      </q-btn>
      <q-btn
        color="primary-bright"
        data-test-locator="projectAppControlBar-advancedSearchGuideButton"
        icon="mdi-file-question"
        outline
        @click="onAdvancedSearchGuideClick"
      >
        <q-tooltip
          anchor="bottom middle"
          class="projectAppControlBar__buttonTooltip"
          self="top middle"
        >
          <div class="fa-tooltip-keybind-stack">
            <span class="fa-tooltip-keybind-stack__label">
              {{ advancedSearchGuideTooltip }}
            </span><div
              v-if="advancedSearchGuideKeybindLabel !== null"
              class="fa-tooltip-keybind-hint fa-text-keybind-hint"
              data-test-locator="projectAppControlBar-advancedSearchGuideButton-keybind"
            >
              ({{ advancedSearchGuideKeybindLabel }})
            </div>
          </div>
        </q-tooltip>
      </q-btn>
      <q-btn
        color="primary-bright"
        data-test-locator="projectAppControlBar-tipsTricksTriviaButton"
        icon="mdi-fire-alert"
        outline
        @click="onTipsTricksTriviaClick"
      >
        <q-tooltip
          anchor="bottom middle"
          class="projectAppControlBar__buttonTooltip"
          self="top middle"
        >
          {{ tipsTricksTriviaTooltip }}
        </q-tooltip>
      </q-btn>
      <q-separator
        v-if="showFunctionButtons || showContentButtons"
        vertical
        aria-hidden="true"
        class="projectAppControlBar__actionSeparator"
        data-test-locator="projectAppControlBar-leftGuidesSeparator"
      />
    </template>
    <template v-if="showFunctionButtons">
      <ProjectAppControlBarStripIconButton
        icon="mdi-page-layout-sidebar-left"
        keybind-test-locator="projectAppControlBar-toggleHierarchyTreeButton-keybind"
        :keybind-label="toggleHierarchyTreeKeybindLabel"
        locator="projectAppControlBar-toggleHierarchyTreeButton"
        :on-click="onToggleHierarchyTreeClick"
        :tooltip="toggleHierarchyTreeTooltip"
      />
      <ProjectAppControlBarStripIconButton
        icon="fa-solid fa-photo-film"
        keybind-test-locator="projectAppControlBar-openProjectMediaButton-keybind"
        :keybind-label="openProjectMediaKeybindLabel"
        locator="projectAppControlBar-openProjectMediaButton"
        :on-click="onOpenProjectMediaClick"
        :tooltip="openProjectMediaTooltip"
      />
      <ProjectAppControlBarStripIconButton
        button-class="projectAppControlBarFixedStripLeft__noteboardButton"
        content-dot-locator="projectAppControlBar-toggleAppNoteboardButton-contentDot"
        :content-dot-visible="showAppNoteboardContentDot"
        icon="mdi-clipboard-edit-outline"
        keybind-test-locator="projectAppControlBar-toggleAppNoteboardButton-keybind"
        :keybind-label="toggleAppNoteboardKeybindLabel"
        locator="projectAppControlBar-toggleAppNoteboardButton"
        :on-click="onToggleAppNoteboardClick"
        :tooltip="toggleAppNoteboardTooltip"
      />
      <ProjectAppControlBarStripIconButton
        button-class="projectAppControlBarFixedStripLeft__noteboardButton"
        content-dot-locator="projectAppControlBar-toggleProjectNoteboardButton-contentDot"
        :content-dot-visible="showProjectNoteboardContentDot"
        icon="mdi-notebook-edit-outline"
        keybind-test-locator="projectAppControlBar-toggleProjectNoteboardButton-keybind"
        :keybind-label="toggleProjectNoteboardKeybindLabel"
        locator="projectAppControlBar-toggleProjectNoteboardButton"
        :on-click="onToggleProjectNoteboardClick"
        :tooltip="toggleProjectNoteboardTooltip"
      />
      <q-separator
        v-if="showContentButtons"
        vertical
        aria-hidden="true"
        class="projectAppControlBar__actionSeparator"
        data-test-locator="projectAppControlBar-leftTreeNoteboardSeparator"
      />
    </template>
    <template v-if="showContentButtons">
      <q-btn
        color="primary-bright"
        data-test-locator="projectAppControlBar-quickSearchButton"
        icon="mdi-database-search"
        outline
        @click="onQuickSearchClick"
      >
        <q-tooltip
          anchor="bottom middle"
          class="projectAppControlBar__buttonTooltip"
          self="top middle"
        >
          <ProjectAppControlBarButtonKeybindTooltip
            :keybind-label="quickSearchKeybindLabel"
            keybind-test-locator="projectAppControlBar-quickSearchButton-keybind"
            :label="quickSearchTooltip"
          />
        </q-tooltip>
      </q-btn>
      <q-btn
        color="primary-bright"
        data-test-locator="projectAppControlBar-quickAddButton"
        icon="mdi-text-box-plus-outline"
        outline
        @click="onQuickAddClick"
      >
        <q-tooltip
          anchor="bottom middle"
          class="projectAppControlBar__buttonTooltip"
          self="top middle"
        >
          <ProjectAppControlBarButtonKeybindTooltip
            :keybind-label="quickAddKeybindLabel"
            keybind-test-locator="projectAppControlBar-quickAddButton-keybind"
            :label="quickAddTooltip"
          />
        </q-tooltip>
      </q-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import ProjectAppControlBarButtonKeybindTooltip from './ProjectAppControlBarButtonKeybindTooltip.vue'
import ProjectAppControlBarStripIconButton from './ProjectAppControlBarStripIconButton.vue'

defineOptions({
  name: 'ProjectAppControlBarFixedStripLeft'
})

defineProps<{
  advancedSearchGuideKeybindLabel: string | null
  advancedSearchGuideTooltip: string
  keyboardShortcutsKeybindLabel: string | null
  keyboardShortcutsTooltip: string
  onAdvancedSearchGuideClick: () => void
  onKeyboardShortcutsClick: () => void
  onOpenProjectMediaClick: () => void
  onQuickAddClick: () => void
  onQuickSearchClick: () => void
  onTipsTricksTriviaClick: () => void
  onToggleAppNoteboardClick: () => void
  onToggleHierarchyTreeClick: () => void
  onToggleProjectNoteboardClick: () => void
  openProjectMediaKeybindLabel: string | null
  openProjectMediaTooltip: string
  quickAddKeybindLabel: string | null
  quickAddTooltip: string
  quickSearchKeybindLabel: string | null
  quickSearchTooltip: string
  showAppNoteboardContentDot: boolean
  showContentButtons: boolean
  showFunctionButtons: boolean
  showGuideButtons: boolean
  showProjectNoteboardContentDot: boolean
  tipsTricksTriviaTooltip: string
  toggleAppNoteboardKeybindLabel: string | null
  toggleAppNoteboardTooltip: string
  toggleHierarchyTreeKeybindLabel: string | null
  toggleHierarchyTreeTooltip: string
  toggleProjectNoteboardKeybindLabel: string | null
  toggleProjectNoteboardTooltip: string
}>()
</script>
