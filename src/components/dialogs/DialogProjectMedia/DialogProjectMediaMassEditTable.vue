<template>
  <div class="dialogProjectMediaMassEditTable">
    <q-table
      class="dialogProjectMediaMassEditTable__table hasScrollbar"
      dark
      dense
      flat
      hide-bottom
      hide-pagination
      row-key="id"
      :columns="columns"
      :rows="massEditRows"
      :rows-per-page-options="[0]"
      data-test-locator="dialogProjectMedia-massEditTable"
    >
      <template #body="bodyProps">
        <q-tr :props="bodyProps">
          <q-td
            key="displayName"
            :props="bodyProps"
          >
            <q-input
              v-model="bodyProps.row.displayName"
              class="dialogProjectMediaMassEditTable__cellInput"
              color="primary-bright"
              dark
              dense
              filled
              hide-bottom-space
              :data-test-locator="`dialogProjectMedia-massEdit-title-${bodyProps.row.id}`"
            />
          </q-td>
          <q-td
            key="type"
            :props="bodyProps"
          >
            <FaSelectInput
              :model-value="selectOptionById(typeOptions, bodyProps.row.type)"
              :chip-removable="false"
              dark
              dense
              filled
              mode="otherType"
              :options="typeOptions"
              selection-presentation="inline"
              :test-locator="`dialogProjectMedia-massEdit-type-${bodyProps.row.id}`"
              @update:model-value="(value) => patchRowType(bodyProps.row, value)"
            />
          </q-td>
          <q-td
            key="internalType"
            :props="bodyProps"
          >
            <FaSelectInput
              :disable="!fieldEnablement(bodyProps.row).internalType"
              :model-value="selectOptionById(internalTypeOptions, bodyProps.row.internalType)"
              :chip-removable="false"
              dark
              dense
              filled
              mode="otherType"
              :options="internalTypeOptions"
              selection-presentation="inline"
              :test-locator="`dialogProjectMedia-massEdit-internalType-${bodyProps.row.id}`"
              @update:model-value="(value) => patchRowInternalType(bodyProps.row, value)"
            />
          </q-td>
          <q-td
            key="externalType"
            :props="bodyProps"
          >
            <FaSelectInput
              :disable="!fieldEnablement(bodyProps.row).externalType"
              :model-value="selectOptionById(externalTypeOptions, bodyProps.row.externalType)"
              :chip-removable="false"
              dark
              dense
              filled
              mode="otherType"
              :options="externalTypeOptions"
              selection-presentation="inline"
              :test-locator="`dialogProjectMedia-massEdit-externalType-${bodyProps.row.id}`"
              @update:model-value="(value) => patchRowExternalType(bodyProps.row, value)"
            />
          </q-td>
          <q-td
            key="internalLink"
            :props="bodyProps"
          >
            <q-input
              v-model="bodyProps.row.internalLink"
              class="dialogProjectMediaMassEditTable__cellInput"
              color="primary-bright"
              dark
              dense
              :disable="!fieldEnablement(bodyProps.row).internalLink"
              filled
              hide-bottom-space
              :data-test-locator="`dialogProjectMedia-massEdit-internalLink-${bodyProps.row.id}`"
            />
          </q-td>
          <q-td
            key="externalLink"
            :props="bodyProps"
          >
            <q-input
              v-model="bodyProps.row.externalLink"
              class="dialogProjectMediaMassEditTable__cellInput"
              color="primary-bright"
              dark
              dense
              :disable="!fieldEnablement(bodyProps.row).externalLink"
              filled
              hide-bottom-space
              :data-test-locator="`dialogProjectMedia-massEdit-externalLink-${bodyProps.row.id}`"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      class="dialogProjectMediaMassEditTable__save"
      color="primary-bright"
      data-test-locator="dialogProjectMedia-massEditSave"
      :label="$t('dialogs.projectMedia.massEditSaveButton')"
      outline
      unelevated
    />
  </div>
</template>

<script setup lang="ts">
import type { I_faProjectMediaMassEditRow } from 'app/types/I_faProjectMediaDomain'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FaSelectInput from 'app/src/components/elements/FaSelectInput/FaSelectInput.vue'
import {
  applyFaProjectMediaMassEditExternalTypePatch,
  applyFaProjectMediaMassEditInternalTypePatch,
  applyFaProjectMediaMassEditTypePatch,
  buildFaProjectMediaMassEditSelectOptionLists,
  buildFaProjectMediaMassEditTableColumns,
  resolveFaProjectMediaMassEditFieldEnablement,
  selectFaProjectMediaMassEditOptionById
} from 'app/src/scripts/faProjectMedia/faProjectMedia_manager'

defineOptions({
  name: 'DialogProjectMediaMassEditTable'
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

const columns = computed(() => {
  return buildFaProjectMediaMassEditTableColumns(t)
})

const fieldEnablement = resolveFaProjectMediaMassEditFieldEnablement
const selectOptionById = selectFaProjectMediaMassEditOptionById
const patchRowType = applyFaProjectMediaMassEditTypePatch
const patchRowInternalType = applyFaProjectMediaMassEditInternalTypePatch
const patchRowExternalType = applyFaProjectMediaMassEditExternalTypePatch
</script>

<style lang="scss" scoped src="./styles/DialogProjectMedia.massEditTable.scoped.scss"></style>
