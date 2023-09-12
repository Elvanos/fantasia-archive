<template>
  <q-page class="row">
    <FantasiaMascotImage width="400px" />
    <div>
      <q-btn
        class="q-mt-xl"
        color="primary"
        outline
        size="xl"
        @click="toggle()"
      >
        Toggle
      </q-btn>
    </div>

    <div>
      <div
        v-for="n in 1000"
        :key="n"
      >
        {{ n }}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import FantasiaMascotImage from 'src/components/FantasiaMascotImage/FantasiaMascotImage.vue'

const toggle = () => {
  window.faDevToolsControlAPI.toggleDevTools()
}

</script>
