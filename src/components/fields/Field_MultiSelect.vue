<template>
  <div>
  <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon"  :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
    {{inputDataBluePrint.name}}
     <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
  </div>

    <q-list
      v-if="!editMode"
      class="fieldMultiSelect_list"
      dense>
      <q-item v-for="(input,index) in localInput" :key="index">
        <q-item-section
          class="fieldMultiSelect_itemDot"
          side
          >
          <q-icon
            color="primary"
            name="mdi-menu-right"
          />
        </q-item-section>
        <q-item-section>
          <span class="text-weight-medium">
            {{input}}
          </span>
        </q-item-section>
      </q-item>
    </q-list>

    <q-select
      v-if="editMode"
      style="width: 100%;"
      dense
      dark
      :ref="`multiSelectField${this.inputDataBluePrint.id}`"
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="multiSelect"
      :options="extraInput"
      use-input
      :outlined="!isDarkMode"
      :filled="isDarkMode"
      use-chips
      @filter="filterFn"
      input-debounce="0"
      new-value-mode="add"
      multiple
      v-model="localInput"
      @input="signalInput"
      @keydown="signalInput"
    >
      <template v-slot:selected-item="scope">
        <q-chip
          removable
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          color="accent"
          text-color="dark"
          class="text-bold"
        >
          {{ stripTags(scope.opt) }}
        </q-chip>
      </template>

    </q-select>

    <table class="q-mt-sm">
      <tr
        v-for="(single,index) in localInput"
        :key="index"
      >
        <td>
          <div class="flex">
            <q-btn
              tabindex="-1"
              round
              flat
              dense
              :disable="index === 0"
              icon="mdi-arrow-up-bold"
              class="q-mr-xs self-center"
              size="10px"
              :color="(index !== 0) ? 'primary' : ''"
              @click="moveItem(index, 'up')"
            >
              <q-tooltip
                :delay="300"
                anchor="center left"
                self="center right"
              >
              Move the item one place up
              </q-tooltip>
            </q-btn>

            <q-btn
              tabindex="-1"
              round
              flat
              dense
              :disable="index === localInput.length - 1"
              icon="mdi-arrow-down-bold"
              class="q-mr-xs self-center"
              size="10px"
              :color="(index !== localInput.length - 1) ? 'primary' : ''"
              @click="moveItem(index, 'down')"
            >
              <q-tooltip
                :delay="300"
                anchor="center left"
                self="center right"
              >
              Move the item one place down
              </q-tooltip>
            </q-btn>
            <div class="grow-1 q-mt-sm q-mb-sm">
              {{stripTags(single)}}
            </div>
          </div>
        </td>

      </tr>
    </table>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import FieldBase from "src/components/fields/_FieldBase"

@Component({
  components: { }
})
export default class Field_MultiSelect extends FieldBase {
  /****************************************************************/
  // BASIC FIELD DATA
  /****************************************************************/

  /**
   * Already existing value in the input field (IF one is there right now)
   */
  @Prop({
    default: () => {
      return []
    }
  }) readonly inputDataValue!: []

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges () {
    this.localInput = (this.inputDataValue) ? this.inputDataValue : []
  }

  /**
   * Model for the local input
   */
  localInput = []

  /**
   * List of extra input values
   */
  extraInput: string[] = []

  /**
   * Load data into the extra input
   */
  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  populateExtraInput () {
    if (this.inputDataBluePrint?.predefinedSelectValues) {
      this.extraInput = this.inputDataBluePrint?.predefinedSelectValues
    }
  }

  /**
   * Defocus after filtering to avoid un-intuitive focus
   */
  async defocusSelectRef () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore
    this.$refs[`multiSelectField${this.inputDataBluePrint.id}`].setOptionIndex(-1)     
    /* eslint-enable */
  }

  /**
   * Filter the input list
   */
  filterFn (val: string, update: (fn: any) => void) {
    if (val === "") {
      update(() => {
        if (this.inputDataBluePrint?.predefinedSelectValues) {
          this.extraInput = this.inputDataBluePrint.predefinedSelectValues
        }
      })
      this.defocusSelectRef().catch(e => console.log(e))
      return
    }

    update(() => {
      if (this.inputDataBluePrint?.predefinedSelectValues) {
        const needle = val.toLowerCase()
        this.extraInput = this.inputDataBluePrint.predefinedSelectValues.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }
      this.defocusSelectRef().catch(e => console.log(e))
    })
  }

  moveItem (index: number, direction: "up" | "down") {
    const to = (direction === "up") ? index - 1 : index + 1
    const from = index

    this.localInput.splice(to, 0, this.localInput.splice(from, 1)[0])

    this.signalInput()
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    return this.localInput
  }
}
</script>

<style lang="scss">
.fieldMultiSelect_list {
  .q-item {
    padding-right: 10px;
    padding-left: 0;
  }

  .q-item__section {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .fieldMultiSelect_itemDot {
    padding-right: 10px;
  }
}

</style>
