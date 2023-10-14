<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

/**
 * Local router variable
 */
const router = useRouter()

/**
 * Testing type currently possibly happening
 */
const testingType = window.extraEnvVariables.TEST_ENV

/**
 * Name of the component being possibly tested via component testing
 */
const testingComponentName = window.extraEnvVariables.COMPONENT_NAME

/**
 * In case of some testing happening:
 * - Reroute to the proper component path route assuming all is properly set.
 * - Otherwise, make sure we are on homepage on load.
 */
if (testingType && testingType === 'components' && testingComponentName) {
  router.push({ path: `/componentTesting/${testingComponentName}` })
} else {
  router.push({ path: '/' })
}

</script>
