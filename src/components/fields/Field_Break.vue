<template>
<div>
  <h4 class="flex justify-start items-center text-weight-bolder q-mb-xs q-mt-xl">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-sm"/>
    {{inputDataBluePrint.name}}
  </h4>
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
