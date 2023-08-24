<template>
  <q-date
    v-model="date"
    data-cy="date-picker"
  />

  <div>
    <q-input
      v-model="date"
      label="Scegli data"
    >
      <template #append>
        <q-btn
          data-cy="open-date-picker-popup-button"
          icon="event"
          flat
          round
          @click="dateDialogRef.show()"
        />
      </template>
    </q-input>
    <q-dialog ref="dateDialogRef">
      <q-date
        v-model="date"
        @update:model-value="dateDialogRef.hide()"
      />
    </q-dialog>
  </div>

  <span data-cy="date-value">{{ date }}</span>
</template>

<script lang="ts">
import type { QDialog } from 'quasar'
import type { Ref } from 'vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'QuasarDate',
  setup () {
    const date = ref('')
    const dateDialogRef = ref() as Ref<QDialog>

    return {
      date,
      dateDialogRef
    }
  }
})
</script>
