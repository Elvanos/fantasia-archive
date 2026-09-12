<template>
  <div class="dialogProjectMediaMassEditBlockFields">
    <q-input
      v-model="displayName"
      class="dialogProjectMediaMassEditBlockFields__cellInput"
      color="primary-bright"
      dark
      :dense="fieldDense"
      filled
      hide-bottom-space
      :label="$t('dialogs.projectMedia.massEditColumnTitle')"
      :data-test-locator="`${locatorPrefix}-title-${row.id}`"
    />

    <div
      class="dialogProjectMediaMassEditBlockFields__typeRow"
      :class="{
        'dialogProjectMediaMassEditBlockFields__typeRow--stack': stackTypeRow
      }"
    >
      <FaSelectInput
        :model-value="selectOptionById(typeOptions, row.type)"
        :chip-removable="false"
        dark
        :dense="fieldDense"
        filled
        :label="$t('dialogs.projectMedia.massEditColumnType')"
        mode="otherType"
        :options="typeOptions"
        selection-presentation="inline"
        :test-locator="`${locatorPrefix}-type-${row.id}`"
        @update:model-value="patchType"
      />
      <FaSelectInput
        v-if="isInternal"
        :disable="!fieldEnablement.internalType"
        :model-value="selectOptionById(internalTypeOptions, row.internalType)"
        :chip-removable="false"
        dark
        :dense="fieldDense"
        filled
        :label="$t('dialogs.projectMedia.massEditColumnInternalType')"
        mode="otherType"
        :options="internalTypeOptions"
        selection-presentation="inline"
        :test-locator="`${locatorPrefix}-internalType-${row.id}`"
        @update:model-value="patchInternalType"
      />
      <FaSelectInput
        v-else
        :disable="!fieldEnablement.externalType"
        :model-value="selectOptionById(externalTypeOptions, row.externalType)"
        :chip-removable="false"
        dark
        :dense="fieldDense"
        filled
        :label="$t('dialogs.projectMedia.massEditColumnExternalType')"
        mode="otherType"
        :options="externalTypeOptions"
        selection-presentation="inline"
        :test-locator="`${locatorPrefix}-externalType-${row.id}`"
        @update:model-value="patchExternalType"
      />
    </div>

    <q-input
      v-if="isInternal"
      v-model="internalLink"
      class="dialogProjectMediaMassEditBlockFields__cellInput"
      color="primary-bright"
      dark
      :dense="fieldDense"
      :disable="!fieldEnablement.internalLink"
      filled
      hide-bottom-space
      :label="$t('dialogs.projectMedia.massEditColumnInternalLink')"
      :data-test-locator="`${locatorPrefix}-internalLink-${row.id}`"
    />
    <q-input
      v-else-if="fieldEnablement.externalEmbed"
      v-model="externalEmbed"
      class="dialogProjectMediaMassEditBlockFields__cellInput dialogProjectMediaMassEditBlockFields__embedBody"
      color="primary-bright"
      dark
      :dense="fieldDense"
      filled
      hide-bottom-space
      :label="$t('dialogs.projectMedia.massEditColumnExternalEmbedBody')"
      :rows="4"
      :data-test-locator="`${locatorPrefix}-externalEmbed-${row.id}`"
      type="textarea"
    />
    <q-input
      v-else
      v-model="externalLink"
      class="dialogProjectMediaMassEditBlockFields__cellInput"
      color="primary-bright"
      dark
      :dense="fieldDense"
      :disable="!fieldEnablement.externalLink"
      filled
      hide-bottom-space
      :label="$t('dialogs.projectMedia.massEditColumnExternalLink')"
      :data-test-locator="`${locatorPrefix}-externalLink-${row.id}`"
    />
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import type { I_faSelectInputObjectItem } from 'app/types/I_faSelectInput'
import { computed } from 'vue'

import FaSelectInput from 'app/src/components/elements/FaSelectInput/FaSelectInput.vue'
import {
  applyFaProjectMediaMassEditExternalTypePatch,
  applyFaProjectMediaMassEditInternalTypePatch,
  applyFaProjectMediaMassEditTypePatch,
  resolveFaProjectMediaMassEditFieldEnablement,
  selectFaProjectMediaMassEditOptionById
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'

defineOptions({
  name: 'DialogProjectMediaMassEditBlockFields'
})

const row = defineModel<I_faProjectMediaMassEditRow>('row', { required: true })

const props = withDefaults(defineProps<{
  dense?: boolean
  externalTypeOptions: I_faSelectInputObjectItem[]
  internalTypeOptions: I_faSelectInputObjectItem[]
  locatorPrefix?: string
  stackTypeRow?: boolean
  typeOptions: I_faSelectInputObjectItem[]
}>(), {
  dense: true,
  locatorPrefix: 'dialogProjectMedia-massEdit',
  stackTypeRow: false
})

const fieldDense = computed(() => {
  return props.dense ?? true
})

const selectOptionById = selectFaProjectMediaMassEditOptionById

const isInternal = computed(() => {
  return row.value.type === 'internal'
})

const fieldEnablement = computed(() => {
  return resolveFaProjectMediaMassEditFieldEnablement(row.value)
})

const displayName = computed({
  get (): string {
    return row.value.displayName
  },
  set (value: string): void {
    row.value = {
      ...row.value,
      displayName: value
    }
  }
})

const internalLink = computed({
  get (): string {
    return row.value.internalLink
  },
  set (value: string): void {
    row.value = {
      ...row.value,
      internalLink: value
    }
  }
})

const externalEmbed = computed({
  get (): string {
    return row.value.externalEmbed
  },
  set (value: string): void {
    row.value = {
      ...row.value,
      externalEmbed: value
    }
  }
})

const externalLink = computed({
  get (): string {
    return row.value.externalLink
  },
  set (value: string): void {
    row.value = {
      ...row.value,
      externalLink: value
    }
  }
})

/**
 * Apply Type select and emit a replaced row object.
 */
function patchType (value: unknown): void {
  const next = { ...row.value }
  applyFaProjectMediaMassEditTypePatch(next, value)
  row.value = next
}

/**
 * Apply Internal Type select and emit a replaced row object.
 */
function patchInternalType (value: unknown): void {
  const next = { ...row.value }
  applyFaProjectMediaMassEditInternalTypePatch(next, value)
  row.value = next
}

/**
 * Apply External Type select and emit a replaced row object.
 */
function patchExternalType (value: unknown): void {
  const next = { ...row.value }
  applyFaProjectMediaMassEditExternalTypePatch(next, value)
  row.value = next
}
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.massEditBlockFields.scoped.scss"></style>
