<template>
  <q-select
    v-model="selected"
    data-cy="select"
    label="test options selection"
    :options="options"
    :loading="loading"
    :disable="disable"
  />

  <span data-cy="select-value">{{ selected }}</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

const syncOptions = ['Option 1', 'Option 2', 'Option 3']

export default defineComponent({
  name: 'QuasarSelect',
  props: {
    loadOptionsAsync: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const selected = ref()
    const loading = ref(false)

    const options = ref()

    if (props.loadOptionsAsync) {
      loading.value = true
      setTimeout(() => {
        options.value = syncOptions
        loading.value = false
      }, 2000)
    } else {
      options.value = syncOptions
    }

    return {
      loading,
      selected,
      options
    }
  }
})
</script>
