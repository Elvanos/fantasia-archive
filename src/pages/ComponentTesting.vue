<template>
  <q-page class="row items-center justify-evenly">
    <component :is="currentComponent" />
  </q-page>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

/**
 * Current route
 */
const route = useRoute()

/**
 * Currently tested component's name based on the last part of the route
 */
const componentName = route.params.componentName

/**
 * Auto-import all components from the automatic matching via the route path
 */
const componentList = import.meta.globEager('components/**/*.vue')

/**
 * Placeholder variable for the matched component
 */
let currentComponent = null as unknown

/**
 * Loops through the component list
 */
for (const loopPath in componentList) {
  /**
   * Current component from the loop
   */
  const loopComponent = componentList[loopPath].default

  /**
   * If the route-component-name matches the name of component in the loop, load it as the curently displayed one
   */
  if (loopComponent.__name === componentName) {
    currentComponent = loopComponent
  }
}

</script>
