<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import BaseClass from "src/BaseClass"
import { Component } from "vue-property-decorator"

@Component
export default class App extends BaseClass {

}
</script>
