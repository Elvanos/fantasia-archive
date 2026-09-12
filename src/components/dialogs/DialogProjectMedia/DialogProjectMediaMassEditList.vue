<template>
  <div class="dialogProjectMediaMassEditList">
    <div
      class="dialogProjectMediaMassEditList__items hasScrollbar"
      data-test-locator="dialogProjectMedia-massEditList"
    >
      <template
        v-for="(row, rowIndex) in massEditRows"
        :key="row.id"
      >
        <q-separator
          v-if="rowIndex > 0"
          class="dialogProjectMediaMassEditList__itemDivider fa-painted-divider--horizontal"
          color="primary"
          data-test-locator="dialogProjectMedia-massEdit-itemDivider"
          horizontal
        />
        <DialogProjectMediaMassEditBlock
          :external-type-options="externalTypeOptions"
          :internal-type-options="internalTypeOptions"
          :type-options="typeOptions"
          :row="row"
          @update:row="replaceMassEditRow"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { buildFaProjectMediaMassEditSelectOptionLists } from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'
import DialogProjectMediaMassEditBlock from './DialogProjectMediaMassEditBlock.vue'

defineOptions({
  name: 'DialogProjectMediaMassEditList'
})

const massEditRows = defineModel<I_faProjectMediaMassEditRow[]>({ required: true })

const { t } = useI18n()

const selectOptionLists = computed(() => {
  return buildFaProjectMediaMassEditSelectOptionLists(t)
})

const typeOptions = computed(() => {
  return selectOptionLists.value.typeOptions
})

const internalTypeOptions = computed(() => {
  return selectOptionLists.value.internalTypeOptions
})

const externalTypeOptions = computed(() => {
  return selectOptionLists.value.externalTypeOptions
})

/**
 * Replace one session row after a mass-edit block emit.
 */
function replaceMassEditRow (next: I_faProjectMediaMassEditRow): void {
  massEditRows.value = massEditRows.value.map((row) => {
    if (row.id === next.id) {
      return next
    }
    return row
  })
}
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.massEditList.scoped.scss"></style>
