<template>

  <q-header
    elevated
    class="bg-dark text-cultured"
  >

    <div class="appHeaderInner">
      <appControl
        class="appControl"
        :is-project="isProject"
      />
      <topTabs
        class="topTabs"
      />
    </div>

  </q-header>

</template>

<script lang="ts">

import { Component, Prop } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import topTabs from "src/components/appHeader/TopTabs.vue"
import appControl from "src/components/appHeader/AppControl.vue"

@Component({
  components: {
    topTabs: topTabs,
    appControl: appControl
  }
})
export default class AppHeader extends BaseClass {
  @Prop() readonly isProject!: boolean
}
</script>

<style lang="scss" scoped>
.appHeaderInner {
  display: flex;
  width: 100%;
  min-height: 40px;

  .appControl {
    width: 375px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .topTabs {
    max-width: calc(100% - 535px);
  }

  .appWindowButtons {
    //width: 200px;
    flex-shrink: 0;
    flex-grow: 0;
    margin-left: auto;
  }
}
</style>
