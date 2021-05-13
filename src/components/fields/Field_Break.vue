<template>
<div>
  <h5 class="text-weight-bolder q-mb-xs q-mt-lg">
    <span :class="(isDarkMode) ? 'text-satin-sheen-gold-bright' : 'text-gunmetal-medium'">
      {{inputDataBluePrint.name}}
    </span>
  </h5>
</div>

</template>

<script lang="ts">
import { Component } from "vue-property-decorator"

import FieldBase from "src/components/fields/_FieldBase"

@Component({
  components: { }
})
export default class Field_Text extends FieldBase {

}
</script>
