<template>
  <div>
  <div class="documentLabelWrapper text-weight-bolder q-mb-sm q-mt-md">
    <q-icon v-if="inputIcon" :name="inputIcon" :size="(inputIcon.includes('fas') || inputIcon.includes('fab'))? '15px': '20px'" class="documentLabelIcon"/>
    <div class="documentLabelContent">
      {{inputDataBluePrint.name}}
    </div>
    <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="documentLabelTooltip">
        <q-tooltip :delay="500">
          <span v-html="toolTip"/>
      </q-tooltip>
    </q-icon>
  </div>

  <q-list
      v-if="!editMode"
      class="fieldList_list"
      dense>
      <q-item v-for="(input,index) in localInput" :key="index">
        <q-item-section
          class="fieldList_itemDot"
          side>
          <q-icon
            color="primary"
            name="mdi-menu-right"
             />
        </q-item-section>
        <q-item-section>
          <span class="text-weight-medium">
            {{(isReversed) ? `${localInput[index].affix}:` : input.value}}
          </span>
          <span v-if="localInput[index].affix" class="inline-block q-ml-xs text-italic listNote">
            {{(!isReversed) ? `(${localInput[index].affix})` : ` ${input.value}`}}
            </span>
        </q-item-section>
      </q-item>
    </q-list>

  <div v-if="editMode">
    <div class="row q-mb-sm"
      v-for="(singleInput,index) in localInput"
      :key="index"
    >
      <div
       class="col-sm-12 col-md flex"
        >

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
      <template v-if="isReversed">
         <q-input
          v-if="hasExtraInput && localExtraInput.length === 0"
          style="min-width: 350px; width: 350px; max-width: 350px;"
          v-model="localInput[index].affix"
          class="grow-1 q-mr-lg"
          :class="`listField_prefix${index}_${inputDataBluePrint.id}`"
          dense
          autogrow
          :label="(inputAffix) ? inputAffix : ''"
          @keydown="processInput"
          :outlined="!isDarkMode"
          :filled="isDarkMode"
          >
        </q-input>
        <q-select
          style="min-width: 350px; width: 350px;"
          dense
          v-if="hasExtraInput && localExtraInput.length > 0"
          class="listAtributeSelect q-mr-lg"
          :options="filteredLocalExtraInput"
          use-input
          :hide-dropdown-icon="!editMode"
          :outlined="editMode && !isDarkMode"
          :borderless="!editMode"
          :filled="editMode && isDarkMode"
          :readonly="!editMode"
          input-debounce="0"
          new-value-mode="add"
          dark
          virtual-scroll-slice-size="1000"
          :class="`listField_prefix${index}_${inputDataBluePrint.id}`"
          @filter="filterFn"
          @input="processInput"
          @keydown="processInput"
          :label="(inputAffix) ? inputAffix : ''"
          v-model="localInput[index].affix"
        >
          <template v-slot:option="scope">
            <template v-if="typeof scope.opt === 'string'">
               <q-item
                class="list_specialItem"
                :class="{'q-item--active': localInput[index].affix === scope.opt }"
                @click="localInput[index].affix = scope.opt"
                clickable
                v-ripple
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                v-close-popup
              >
                {{scope.opt}}
              </q-item>
            </template>

            <template v-else>
              <q-item
                class="bg-gunmetal-light"
                :label="scope.opt.title"
              >
                <q-item-section >{{ scope.opt.title }}</q-item-section>
                <q-item-section side>
                 <q-btn
                  tabindex="-1"
                  round
                  flat
                  dense
                  dark
                  color="primary"
                  class="z-max q-ml-sm self-center"
                  icon="mdi-plus"
                  size="12px"
                  v-close-popup
                  @click="assignOptionGroupValues(scope.opt.title, index)"
                  >
                    <q-tooltip
                      :delay="300"
                    >
                      Add this category to the field.
                      <br>
                      <b>If there is A LOT of different stats, FA might freeze for a while.</b>
                    </q-tooltip>
                </q-btn>
              </q-item-section>
              </q-item>
              <q-item
                v-for="value in scope.opt.values"
                :key="`${value}_${scope.opt.title}`"
                :class="{'q-item--active': localInput[index].affix === value }"
                clickable
                v-ripple
                v-close-popup
                @click="localInput[index].affix = value"
                >
                <q-item-section>
                  <q-item-label v-html="value" class="q-ml-md" ></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-select>

        <q-input
          v-model="localInput[index].value"
          class="grow-1 q-mr-lg"
          :class="`listField_input${index}_${inputDataBluePrint.id}`"
          dense
          autogrow
          @keydown="processInput"
          :outlined="!isDarkMode"
          :filled="isDarkMode"
          >
        </q-input>
      </template>

      <template v-if="!isReversed">
        <q-input
          v-model="localInput[index].value"
          class="grow-1 q-mr-lg"
          :class="`listField_input${index}_${inputDataBluePrint.id}`"
          dense
          autogrow
          @keydown="processInput"
          :outlined="!isDarkMode"
          :filled="isDarkMode"
          >
        </q-input>
        <q-input
          v-if="hasExtraInput && localExtraInput.length === 0"
          style="min-width: 350px; width: 350px; max-width: 350px;"
          v-model="localInput[index].affix"
          class="grow-1 q-mr-lg"
          :class="`listField_prefix${index}_${inputDataBluePrint.id}`"
          dense
          autogrow
          :label="(inputAffix) ? inputAffix : ''"
          @keydown="processInput"
          :outlined="!isDarkMode"
          :filled="isDarkMode"
          >
        </q-input>
        <q-select
          v-if="hasExtraInput && localExtraInput.length > 0"
          style="min-width: 350px; width: 350px;"
          dense
          class="listAtributeSelect q-mr-lg"
          :options="filteredLocalExtraInput"
          use-input
          :hide-dropdown-icon="!editMode"
          :outlined="editMode && !isDarkMode"
          :borderless="!editMode"
          :filled="editMode && isDarkMode"
          :readonly="!editMode"
          input-debounce="0"
          new-value-mode="add"
          virtual-scroll-slice-size="1000"
          dark
          :class="`listField_prefix${index}_${inputDataBluePrint.id}`"
          @filter="filterFn"
          @input="processInput"
          @keydown="processInput"
          :label="(inputAffix) ? inputAffix : ''"
          v-model="localInput[index].affix"
        >
         <template v-slot:option="scope">
            <template v-if="typeof scope.opt === 'string'">
              <q-item
                class="list_specialItem"
                :class="{'q-item--active': localInput[index].affix === scope.opt }"
                @click="localInput[index].affix = scope.opt"
                clickable
                v-ripple
                v-close-popup
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                {{scope.opt}}
              </q-item>
            </template>

            <template v-else>
              <q-item
                class="bg-gunmetal-light"
                :label="scope.opt.title"
              >
                <q-item-section >{{ scope.opt.title }}</q-item-section>
                <q-item-section side>
                 <q-btn
                  tabindex="-1"
                  round
                  flat
                  dense
                  dark
                  color="primary"
                  class="z-max q-ml-sm self-center"
                  icon="mdi-plus"
                  size="12px"
                  v-close-popup
                  @click="assignOptionGroupValues(scope.opt.title, index)"
                  >
                    <q-tooltip
                      :delay="300"
                    >
                      Add this category to the field.
                      <br>
                      <b>If there is A LOT of different stats, FA might freeze for a while.</b>
                    </q-tooltip>
                </q-btn>
              </q-item-section>
              </q-item>
              <q-item
                :class="{'q-item--active': localInput[index].affix === value }"
                  v-for="value in scope.opt.values"
                :key="`${value}_${scope.opt.title}`"
                clickable
                v-ripple
                v-close-popup
                @click="localInput[index].affix = value"
                >
                <q-item-section>
                  <q-item-label v-html="value" class="q-ml-md" ></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-select>
      </template>

      <div style="width: 60px; align-self: center; height: 35px;" class="justify-end flex">
        <q-btn
          v-if="editMode"
          color="secondary"
          :outline="isDarkMode"
          icon="mdi-close"
          tabindex="-1"
          @click="removeFromList(index)"
          >
            <q-tooltip :delay="500">
              <span style="white-space: nowrap;">Remove "{{(isReversed)? localInput[index].affix : localInput[index].value }}"</span>
            </q-tooltip>
        </q-btn>
      </div>
    </div>
    </div>

    <div class="row q-mt-lg" v-if="editMode">
      <div class="col justify-end flex">
        <q-btn
        color="primary"
        icon="mdi-plus"
        :outline="isDarkMode"
        @click="addNewInput()" >
          <q-tooltip :delay="500">
            Add new
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import FieldBase from "src/components/fields/_FieldBase"
import { extend } from "quasar"

@Component({
  components: { }
})
export default class Field_List extends FieldBase {
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
  }) readonly inputDataValue!: {
    value: string
    affix?: string
  }[]

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
  localInput = [] as {
    value: string
    affix?: string
  }[]

  /**
   * Determine if the input has any extra values attached to it or not
   */
  get hasExtraInput () {
    // @ts-ignore
    this.localExtraInput = this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
    this.filteredLocalExtraInput = extend(true, [], this.localExtraInput)

    return this.inputDataBluePrint?.predefinedListExtras?.extraSelectValueList
  }

  /**
   * Determine if the input is reversed
   */
  get isReversed () {
    // @ts-ignore
    return (this.inputDataBluePrint?.predefinedListExtras?.reverse)
  }

  /**
   * List of extra input values
   */
  localExtraInput:string[] | {
    title: string,
    values: string[]
  } [] = []

  /**
   * List of extra input values - filtered
   */
  filteredLocalExtraInput:string[] | {
    title: string,
    values: string[]
  } [] = []

  /**
   * Label for the extra input
   * EG: "Level" or "Skill tier"
   */
  get inputAffix () {
    return (this.inputDataBluePrint?.predefinedListExtras?.affix) || ""
  }

  filterFn (val:string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        const localListCopy: [] = extend(true, [], this.localExtraInput)
        this.filteredLocalExtraInput = localListCopy
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()

      const returnList: string[] | {
        title: string,
        values: string[]
      } [] = []

      const localListCopy: [] = extend(true, [], this.localExtraInput)

      localListCopy.forEach((value:string | {
        title: string,
        values: string[]
      }) => {
        // For strings
        if (typeof value === "string" && value.toLowerCase().includes(needle)) {
          // @ts-ignore
          returnList.push(value)
        }

        // For lists
        if (typeof value !== "string") {
          // If title matches
          if (value.title.toLowerCase().includes(needle)) {
            // @ts-ignore
            returnList.push(value)
          }
          // Try matching child values
          else {
            const localFilteredSubvalues = value.values.filter(subValue => {
              return subValue.toLowerCase().includes(needle)
            })
            if (localFilteredSubvalues.length > 0) {
              value.values = localFilteredSubvalues
              // @ts-ignore
              returnList.push(value)
            }
          }
        }
      })

      this.filteredLocalExtraInput = returnList
    })
  }

  /**
   * Remove an existing row from the input list
   */
  removeFromList (index: number) {
    this.localInput.splice(index, 1)
    this.processInput()
  }

  /**
   * Adds new row to the input list
   */
  async addNewInput (affixValue = "") {
    this.localInput.push({
      value: "",
      affix: affixValue
    })

    const targetRefStringNamer = (!this.isReversed)
      ? `.listField_input${this.localInput.length - 1}_${this.inputDataBluePrint.id}`
      : `.listField_prefix${this.localInput.length - 1}_${this.inputDataBluePrint.id}`

    await this.$nextTick()

    const newInput = document.querySelector(targetRefStringNamer) as HTMLInputElement

    if (newInput) {
      newInput.focus()
    }

    this.processInput()
  }

  moveItem (index: number, direction: "up" | "down") {
    const to = (direction === "up") ? index - 1 : index + 1
    const from = index

    this.localInput.splice(to, 0, this.localInput.splice(from, 1)[0])

    this.processInput()
  }

  /**
   * Debounce timer to prevent buggy input sync
   */
  pullTimer = null as any

  processInput () {
    clearTimeout(this.pullTimer)
    this.pullTimer = setTimeout(() => {
      this.signalInput()
    }, 500)
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput () {
    const dataCopy: {
      value: string
      affix?: string
    }[] = extend(true, [], this.localInput)

    // Fix hanging whitespaces in inputs
    const returnValue = dataCopy.map(e => {
      e.value = e.value.trim()
      if (e.affix) {
        e.affix = e.affix.trim()
      }
      return e
    })

    return returnValue
  }

  async assignOptionGroupValues (categoryTitle: string, callerIndex: number) {
    const targetCategory:{
      title: string,
      values: string[]
    } = this.localExtraInput
      // @ts-ignore
      .find((e: {title: string}) => e.title === categoryTitle)

    for (const value of targetCategory.values) {
      await this.addNewInput(value)
    }

    if (this.localInput[callerIndex].value === "" && this.localInput[callerIndex].affix === "") {
      this.removeFromList(callerIndex)
    }
  }
}
</script>

<style lang="scss">
.fieldList_list {
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

  .fieldList_itemDot {
    padding-right: 10px;
  }
}

.list_specialItem {
  display: flex;
  align-items: center;
}
</style>
