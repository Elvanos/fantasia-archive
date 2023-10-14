<template>
  <q-btn
    v-if="hasProperDataInput"
    flat
    class="appControlSingleMenu non-selectable"
    dark
    size="md"
    no-caps
  >
    {{ menuTitle }}

    <!-- Button menu-->
    <q-menu
      anchor="bottom left"
      square
      dark
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-list
        class="appControlSingleMenu__list"
        dark
      >
        <template
          v-for="(menuItem,index) in menuData"
          :key="index"
        >
          <q-separator
            v-if="menuItem.mode === 'separator'"
            class="appControlSingleMenu__separator"
            dark
          />

          <q-item
            v-if="menuItem.mode === 'item'"
            v-close-popup="menuItem.submenu === undefined ? true : false"
            clickable
            :class="['appControlSingleMenu__item', `text-${menuItem.specialColor}`, 'non-selectable']"
            :disable="(!menuItem.conditions)"
            @click="(menuItem.trigger)
              ? menuItem.triggerArguments
                ? menuItem.trigger(...menuItem.triggerArguments)
                : menuItem.trigger()
              : false"
          >
            <q-item-section>{{ menuItem.text }}</q-item-section>
            <q-item-section avatar>
              <q-icon
                class="appControlSingleMenu__icon"
                :name="menuItem.icon"
              />
            </q-item-section>

            <!-- Sub-menu-->
            <q-menu
              v-if="menuItem.submenu !== undefined"
              anchor="top end"
              self="top start"
              square
              dark
              transition-show="jump-right"
              transition-hide="jump-left"
              class="-subMenu"
            >
              <q-list
                class="appControlSingleMenu__list"
                dark
              >
                <template
                  v-for="(submenuItem,subIndex) in menuItem.submenu"
                  :key="subIndex"
                >
                  <q-separator
                    v-if="submenuItem.mode === 'separator'"
                    class="appControlSingleMenu__separator"
                    dark
                  />
                  <q-item
                    v-if="submenuItem.mode === 'item'"
                    v-close-popup
                    clickable
                    :class="['appControlSingleMenu__item', `text-${submenuItem.specialColor}`, 'non-selectable']"
                    :disable="(!submenuItem.conditions)"
                    @click="(submenuItem.trigger) ? submenuItem.trigger() : false"
                  >
                    <q-item-section>{{ submenuItem.text }}</q-item-section>
                    <q-item-section avatar>
                      <q-icon
                        class="appControlSingleMenu__icon"
                        :name="submenuItem.icon"
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-menu>
            <!-- Sub-menu end -->
          </q-item>
        </template>
      </q-list>
    </q-menu>
    <!-- Main menu end -->
  </q-btn>
</template>

<script setup lang="ts">
import { I_appMenusDataList } from 'app/interfaces/I_appMenusDataList'

const props = defineProps<{
  dataInput: I_appMenusDataList
}>()

const hasProperDataInput = (props.dataInput.title && props.dataInput.data)

const menuTitle = props.dataInput.title
const menuData = props.dataInput.data

</script>

<style lang="scss" scoped>
.appControlSingleMenu {
  &:hover,
  &:focus {
    color: $appControlMenus_singleHover;
  }

  &__icon {
    font-size: $iconSize;
  }

  &__list {
    background-color: $appControlMenus_bgColor;
    color: $appControlMenus_color;
  }

  &__item {
    min-height: 42px;

    &:hover,
    &:focus {
      color: $appControlMenus_singleHover;
    }
  }

  &__separator {
    background-color: $appControlMenus_separatorColor;
    height: 0.5px !important;
  }
}
</style>
