<template>
  <q-drawer
    v-model="showDrawer"
    show-if-above
    :width="200"
    :breakpoint="700"
    elevated
    data-cy="drawer"
    class="bg-primary text-white"
  >
    <q-scroll-area class="fit">
      <div class="q-pa-sm">
        <div
          v-for="n in 50"
          :key="n"
        >
          Drawer {{ n }} / 50
        </div>
      </div>
      <q-btn data-cy="button">
        Am I on screen?
      </q-btn>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'QuasarDrawer',
  setup () {
    const showDrawer = ref(true)

    return {
      showDrawer
    }
  }
})
</script>
