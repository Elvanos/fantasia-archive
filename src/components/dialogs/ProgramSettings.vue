<template>

  <q-dialog
    v-model="dialogModel"
    persistent
    @hide="triggerDialogClose"
    >
    <q-card
      class="programSettingsDialog"
      dark
    >

      <h4 class="programSettingsTitle">Fantasia Archive Settings</h4>
      <q-card-section horizontal class="programSettingsTabs">
        <q-tabs
          v-model="activeTab"
          class="text-accent"
          active-color="primary"
          indicator-color="primary"
          vertical
          style="width: 100%;"

        >
          <q-tab name="uiSettings" label="Visuals & Functionality" />
          <q-separator dark />

          <q-tab name="keybinds" label="Keybinds" />
        </q-tabs>

      </q-card-section>
      <q-separator vertical dark />

      <q-card-section horizontal class="programSettingsTabContent">
        <q-tab-panels
          dark
          v-model="activeTab"
          animated
          style="width: 100%;"
          vertical
          transition-prev="jump-up"
          transition-next="jump-down"
         >

          <q-tab-panel name="uiSettings" dark class="q-pt-sm">
            <q-scroll-area
              class="programSettingsScrollArea"
              visible
              dark
              :thumb-style="thumbStyle"
              >
                <div class="row justify-start">

                  <div class="col-12">
                    <div class="text-h6">
                      Program looks & Accessibility
                    </div>
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Dark mode
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Turn between light and dark mode of the app
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.darkMode"
                      />
                  </div>

                   <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Accessibility - Text shadow
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        This setting toggles text shadows in the hieratchical tree, relationship search popups and in tabs; allowing for most "standout" looks of the text from the background.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.textShadow"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Accessibility - Pronounced count divider
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        This setting adds another | character between the category and document count in the hierarchival tree.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.doubleDashDocCount"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide Welcome screen social links
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Hides all the social links on the Welcome screen.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.hideWelcomeScreenSocials"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide tips popup on start screen
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Hides the start screen tips & tricks popup.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.hideTooltipsStart"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide tips on project screen
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Hides the project screen tips & tricks info card.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.hideTooltipsProject"
                      />
                  </div>

                  <div class="col-12">
                    <div class="text-h6 q-mt-lg">
                      Document view settings
                    </div>
                  </div>

                  <div class="col-3 optionWrapper">
                    <div class="optionTitle">
                      Disable document control bar
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        In case you wish to maximize you working space on the document, you can disable the top button bar with the setting.
                        <br>
                        The necesarry control buttons will be moved to the top of the main document body while the rest of the functionality will be accesible via keybinds or thought the app menu on the top left.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableDocumentControlBar"
                      />
                  </div>

                  <div class="col-3 optionWrapper">
                    <div class="optionTitle">
                      Disable document guides
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                       Toggles the newbie-friendly guides on/off from the document control bar
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableDocumentControlBarGuides"
                      />
                  </div>

                  <div class="col-3 optionWrapper">
                    <div class="optionTitle">
                      Disable document tooltips
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        If you dislike the document-view tooltips, you can turn them off globally here
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableDocumentToolTips"
                      />
                  </div>

                  <div class="col-3 optionWrapper">
                    <div class="optionTitle">
                      Hide empty fields
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Hides fields without any filled in value in view (non-edit) mode.
                        <br>
                        Please note that this may result into a relatively wild layout shifts which might make the document look unruly in some cases.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.hideEmptyFields"
                      />
                  </div>

                  <div class="col-12">
                    <div class="text-h6 q-mt-lg">
                      Quick-search & Quick-add popups
                    </div>
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Stop quick-search close after selection
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Normally the quick-search closes after an item is selected from it.
                        <br>
                        Turning this feature on prevents this behavior; allowing for opening multiple search results one after the other.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableCloseAftertSelectQuickSearch"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Don't precheck category filter
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Normally, the categories are included in the quick-search.
                        <br>
                        Enabling this option reverses the behavior.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableQuickSearchCategoryPrecheck"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Close quick popups with same key
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        This allows for closing of the quick-search and quick-add popups with the same key combination that was used to open them to begin with.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.allowQuickPopupSameKeyClose"
                      />
                  </div>

                  <div class="col-12">
                    <div class="text-h6 q-mt-lg">
                      Hierarchy tree
                    </div>
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Stop sublevel collapse in tree
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        This option prevents sub-category closing in the hierarchical tree upon parent category closure
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.doNotcollaseTreeOptions"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide project name in tree
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Determines if the the project name shows in the hierarchical tree at all
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.noProjectName"
                      />
                  </div>

                   <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Invert tree custom order sorting
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Sorts the documents in the hiearachical tree the other way around than normally:
                        <br>
                        From highest to lowest
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.invertTreeSorting"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide document count entirely
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Hides all the document count information in the hiearachical tree
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.disableDocumentCounts"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide category count
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Display the document count without adding the secondary category number.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.compactDocumentCount"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Invert category position
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Switches the place of category and document numbers.
                      </q-tooltip>
                    </q-icon>
                    </div>

                      <q-toggle
                        v-model="options.invertCategoryPosition"
                      />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Hide tags in tree
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Determines if the tags show in the hierarchical tree at all
                      </q-tooltip>
                    </q-icon>
                    </div>

                    <q-toggle
                      v-model="options.noTags"
                    />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Top tags in tree
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Show tags at the top of the hierarchical tree
                      </q-tooltip>
                    </q-icon>
                    </div>

                    <q-toggle
                      v-model="options.tagsAtTop"
                    />
                  </div>

                  <div class="col-4 optionWrapper">
                    <div class="optionTitle">
                      Compact tags
                    <q-icon name="mdi-help-circle" size="16px" class="q-ml-md">
                      <q-tooltip :delay="500">
                        Determine if the tags should be shown as individual categories or they should show as one big category with each tag as a subcategory.
                      </q-tooltip>
                    </q-icon>
                    </div>

                    <q-toggle
                      v-model="options.compactTags"
                      />
                  </div>

                </div>
           </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="keybinds" dark>
            <q-table
              class="keybindsTable"
              virtual-scroll
              dark
              flat
              title="Keybinds"
              :filter="filter"
              hide-bottom
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              :virtual-scroll-sticky-size-start="48"
              row-key="index"
              :data="keybindList"
              :columns="keybindListCollums"
            >
            <template v-slot:top-right>
              <q-input clearable dark dense debounce="300" v-model="filter" placeholder="Filter the keybinds">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="name"
                  :props="props"
                  v-html="props.row.name"
                >
                </q-td>
                <q-td
                  key="userKeybinds"
                  :props="props"
                >
                  <template
                    v-if="props.row.editable"
                  >
                    <q-btn
                      :color="(props.row.userKeybind && props.row.userKeybind.which) ? 'accent' : 'primary'"
                      size="12px"
                      outline
                    >
                      {{(props.row.userKeybind && props.row.userKeybind.which) ? retrieveKeybindString(props.row.userKeybind) : 'Add New'}}
                    <q-popup-edit
                      content-class="darkBg"
                      v-model="props.row.userKeybind"
                      @before-show="prepareKeybindSetting(props.row)"
                      @before-hide="processKeybindSetting()"
                    >
                      <q-btn
                        color="dark"
                        round
                        dense
                        flat
                        v-close-popup
                        class="keybindPopupCloseButton"
                        size="md"
                        icon="close"
                      />
                      <div class="keybindUpdateField">
                        <div class="text-center q-mt-xs q-mb-lg text-dark darkBg__title">{{currentRowData.name}}</div>
                        <q-field filled readonly
                          dense
                          class="q-ml-lg"
                          :dark="false"
                          :label="(tempKeybindString.length === 0)? '> Type your keybind <' : ''"
                          :error="keybindError"
                          :error-message="keybindErrorMessage">
                          <template v-slot:after>
                            <q-icon name="mdi-help-circle" size="23px" class="keybindsTooltipIcon">
                              <q-tooltip :delay="500" content-class="keybindToolTip">
                                Allow keys combination and modifiers:
                                <br>
                                - CTRL + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                - ALT + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                - CTRL + ALT + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                - CTRL + SHIFT + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                - ALT + SHIFT + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                - CTRL + ALT + SHIFT + <span class="text-italic text-caption">YOUR KEYBIND HERE</span>
                                <br>
                                <br>
                                - Your desired keybind can contain any symbol of the alphanumerical part of the keyboard along with all of the F keys and arrow keys.
                              </q-tooltip>
                            </q-icon>
                          </template>
                          <template v-slot:control>
                            <div class="self-center full-width no-outline">{{tempKeybindString}}</div>
                          </template>
                        </q-field>
                        <div class="flex justify-around q-mt-md">
                            <q-btn
                            label="Clear keybind"
                            color="secondary"
                            size="14px"
                            v-close-popup
                            @click="resetKeybind"
                            :disable="!(tempKeybindString && tempKeybindString.length > 0)"
                          />
                          <q-btn
                            label="Set keybind"
                            color="dark"
                            size="14px"
                            v-close-popup
                            @click="setKeybind"
                            :disable="!tempHasChange || (!tempKeybindString || tempKeybindString.length === 0)"
                          />
                        </div>
                      </div>
                    </q-popup-edit>
                    </q-btn>

                  </template>
                  <template
                    v-if="!props.row.editable"
                    >
                    <span class="text-secondary text-bold">
                      Built-in & uneditable functionality
                    </span>
                  </template>
                </q-td>
                <q-td
                  key="defaultKeybinds"
                  :class="{'text-blue-grey-6':props.row.userKeybind && props.row.userKeybind.which}"
                  :props="props"
                  v-html="retrieveKeybindString(props.row.defaultKeybind)"
                >
                </q-td>
              </q-tr>
            </template>

            </q-table>
          </q-tab-panel>

        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="q-mb-lg q-mt-md closeButton">
          <q-btn flat label="Close without saving" color="accent" class="q-mr-xl" v-close-popup />
          <q-btn label="Save settings" color="primary" class="q-mx-lg" outline v-close-popup @click="saveSettings" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { extend } from "quasar"

import { OptionsStateInteface } from "src/store/module-options/state"
@Component({
  components: { }
})
export default class ProgramSettings extends DialogBase {
  /****************************************************************/
  // DIALOG CONTROL
  /****************************************************************/

  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  openDialog (val: string|false) {
    if (val) {
      if (this.SGET_getDialogsState) {
        return
      }
      this.SSET_setDialogState(true)
      this.dialogModel = true
      this.activeTab = "uiSettings"
      this.options = extend(true, {}, this.SGET_options)
      this.mapKeybinds()
    }
  }

  /**
   * Currently active tab model of the options\
   * "uiSettings" by default
   */
  activeTab = "uiSettings"

  /**
   * Save settings and keybings
   */
  saveSettings () {
    const optionsSnapShot: OptionsStateInteface = extend(true, {}, this.options)
    optionsSnapShot.userKeybindList = []

    this.keybindList.forEach(e => {
      // Deregister all custom user keybinds
      this.SSET_deregisterUserKeybind({
        id: e.id,
        altKey: e.defaultKeybind.altKey,
        ctrlKey: e.defaultKeybind.ctrlKey,
        shiftKey: e.defaultKeybind.shiftKey,
        which: e.defaultKeybind.which
      })

      // Re-register new user keybinds if there are any present
      if (e.userKeybind && e.userKeybind.which) {
        const tempkey = {
          id: e.id,
          altKey: e.userKeybind.altKey,
          ctrlKey: e.userKeybind.ctrlKey,
          shiftKey: e.userKeybind.shiftKey,
          which: e.userKeybind.which
        }

        optionsSnapShot.userKeybindList.push(tempkey)
        this.SSET_registerUserKeybind(tempkey)
      }
    })

    this.SSET_options(optionsSnapShot)
  }

  /****************************************************************/
  // OPTIONS TAB
  /****************************************************************/

  /**
   * Default options list state
   */
  options: OptionsStateInteface = {
    _id: "settings",
    darkMode: false,
    textShadow: false,
    doubleDashDocCount: false,
    tagsAtTop: false,
    noTags: false,
    compactTags: false,
    noProjectName: false,
    invertTreeSorting: false,
    hideEmptyFields: false,
    disableDocumentToolTips: false,
    doNotcollaseTreeOptions: false,
    disableDocumentControlBar: false,
    disableDocumentControlBarGuides: false,
    disableCloseAftertSelectQuickSearch: false,
    disableQuickSearchCategoryPrecheck: false,
    allowQuickPopupSameKeyClose: false,
    disableDocumentCounts: false,
    compactDocumentCount: false,
    invertCategoryPosition: false,
    hideWelcomeScreenSocials: false,
    hideTooltipsStart: false,
    hideTooltipsProject: false,
    userKeybindList: []
  }

  /****************************************************************/
  // KEYBINDS MANAGEMENT
  /****************************************************************/

  /**
   * Keybinds table pagination settings
   */
  pagination = {
    rowsPerPage: 0
  }

  /**
   * Keybinds table settings
   */
  keybindListCollums = [
    {
      name: "name",
      required: true,
      label: "Action",
      align: "left",
      field: (row: {name: string}) => row.name,
      format: (val: string) => `${val}`,
      sortable: true
    },
    {
      name: "userKeybinds",
      align: "left",
      label: "User Keybinds",
      field: "userKeybind"
    },
    {
      name: "defaultKeybinds",
      align: "left",
      label: "Default keybinds",
      field: "defaultKeybind"
    }
  ]

  /**
   * Keybinds table string filter
   */
  filter = ""

  /**
   * Temporary keybind string value entered by the user
   * EG: "CTRL + V"
   */
  tempKeybindString = ""

  /**
   * Temporary keybind object details entered by the user
   */
  tempKeybindData = null as any

  /**
   * Determines if any change has been done to the input entered by the user after it was lodead
   */
  tempHasChange = false

  /**
   * A list of all keybinds
   */
  keybindList: any[] = []

  /**
   * Determines if the keybinds popup has any error right now
   */
  keybindError = false

  /**
   * Current error message
   */
  keybindErrorMessage = ""

  /**
   * Temporary variable for holding on to currently active row data
   */
  currentRowData = {} as any

  /**
   * Resets the particular keybind
   */
  async resetKeybind () {
    this.tempKeybindString = ""
    this.tempKeybindData = null
    this.keybindError = false

    this.currentRowData.userKeybind = ""

    const temp: any[] = extend(true, [], this.keybindList)

    this.keybindList = []

    await this.$nextTick()

    this.keybindList = temp
  }

  /**
   * Sets the particular keybind
   */
  async setKeybind () {
    this.currentRowData.userKeybind = this.tempKeybindData
    const temp: any[] = extend(true, [], this.keybindList)

    this.keybindList = []

    await this.$nextTick()

    this.keybindList = temp
  }

  /**
   * Process all needed actions after the keybind window popup closes
   */
  processKeybindSetting () {
    window.removeEventListener("keydown", this.triggerKeyPush)
  }

  /**
   * Process all needed actions before the keybind window popup opens
   */
  prepareKeybindSetting (row: any) {
    this.keybindError = false
    this.tempHasChange = false
    this.tempKeybindData = (row.userKeybind && row.userKeybind.which) ? this.tempKeybindData : null
    this.tempKeybindString = (row.userKeybind && row.userKeybind.which) ? this.retrieveKeybindString(row.userKeybind) : ""
    this.currentRowData = row
    window.addEventListener("keydown", this.triggerKeyPush)
  }

  /**
   * Register keybind input for the keybind popup
   */
  triggerKeyPush (e:any) {
    this.keybindError = false

    const ignoredKeys = [16, 17, 18, 27]
    const allowedKeys = [186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]

    // Prevent all non-permitted key presses
    if ((e?.altKey || e?.ctrlKey) && e?.keyCode && !ignoredKeys.includes(e.which)) {
      if (allowedKeys.includes(e.which)) {
        // Check for duplicates already existing in the list
        const compareList = this.keybindList
          .filter(e => e.id !== this.currentRowData.id)
          .map(bind => {
            const mappedKeybind = (bind.userKeybind && bind.userKeybind.which)
              ? {
                altKey: bind.userKeybind.altKey,
                ctrlKey: bind.userKeybind.ctrlKey,
                shiftKey: bind.userKeybind.shiftKey,
                which: bind.userKeybind.which,
                id: this.currentRowData.id
              }
              : {
                altKey: bind.defaultKeybind.altKey,
                ctrlKey: bind.defaultKeybind.ctrlKey,
                shiftKey: bind.defaultKeybind.shiftKey,
                which: bind.defaultKeybind.which,
                id: this.currentRowData.id
              }

            return mappedKeybind
          })

        let duplicate = false
        compareList.forEach(bind => {
          if (
            bind.altKey === e.altKey &&
            bind.ctrlKey === e.ctrlKey &&
            bind.shiftKey === e.shiftKey &&
            bind.which === e.which
          ) {
            duplicate = true
          }
        })

        if (duplicate) {
          this.keybindError = true
          this.keybindErrorMessage = "This keybind is already present among the existing ones. Please chose a different one."
          return
        }

        // Continue the script if no duplicates were found
        this.tempHasChange = true
        this.keybindError = false
        const keybindString = this.retrieveKeybindString(e)
        this.tempKeybindString = keybindString
        this.tempKeybindData = {
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          which: e.which,
          id: this.currentRowData.id
        }
      }
      else {
        this.keybindError = true
        this.keybindErrorMessage = "Only alphanumerical keys, arrows keys and F keys are allowed for keybinds."
      }
    }
    else if (!ignoredKeys.includes(e.keyCode)) {
      this.keybindError = true
      this.keybindErrorMessage = "Only combination containing ALT and/or CTRL allowed."
    }
  }

  /**
   * Map all existing keybinds to something useable for the table
   */
  mapKeybinds () {
    this.keybindList = this.SGET_getCurrentKeyBindData.defaults.map((keybind, index) => {
      return {
        name: keybind.tooltip,
        id: keybind.id,
        editable: keybind.editable,
        defaultKeybind: keybind,
        userKeybind: (this.options.userKeybindList[index]) || ""
      }
    })
  }
}
</script>

<style lang="scss">

.keybindsTooltipIcon {
  right: 0;
  margin-left: 10px;
  top: 4px;
}

.keybindToolTip {
  background-color: white !important;
  border: 1px solid $dark;
}

.keybindPopupCloseButton {
  position: absolute;
  right: 10px;
  top: 10px;
}

.keybindUpdateField {
  width: 550px;
  padding: 40px;

  .q-field--filled .q-field__control {
    background-color: transparent;
  }

  .q-field__label {
    text-align: center;
    margin-top: 7px;
  }

  .q-field__native > div {
    text-align: center;
  }

  .q-field__append {
    position: absolute;
    right: 0;
    top: 5px;
  }
}

.darkBg {
  background: $accent;

  .darkBg__title {
    font-weight: 500;
    font-size: 16px;
  }
}

.keybindsTable {
  max-height: calc(100vh - 340px);
  height: calc(100vh - 340px);
  margin-top: -25px;

  .q-field__control {
    background-color: transparent;
  }

  .q-table__control,
  .q-table__control label {
    width: 200px;
  }

  th,
  td {
    white-space: normal;
  }

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: var(--q-color-dark);
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:last-child th {
    top: 48px;
  }

  thead tr:first-child th {
    top: 0;
  }
}

body.body--dark {
  .programSettingsDialog {
    .optionTitle,
    .text-h5,
    h4 {
      color: #dcdcdc;
    }
  }
}

.programSettingsDialog {
  width: 1400px;
  max-width: calc(100vw - 100px) !important;
  max-height: calc(100vh - 85px);
  display: flex;
  flex-wrap: wrap;

  .closeButton {
    width: 100%;
  }

  .optionWrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .q-toggle__inner {
      max-width: 150px;
    }
  }

  .optionTitle {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 500;
    align-items: center;
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;
  }

  .programSettingsTabs {
    width: 250px;
  }

  .programSettingsTabContent {
    width: calc(100% - 270px);
  }

  .programSettingsTitle {
    width: 100%;
    text-align: center;
  }

  .programSettingsScrollArea {
    max-height: calc(100vh - 357px);
    margin: auto;
    height: 740px;
    width: calc(100% - 80px);
  }

  h6 {
    display: block;
  }
}
</style>
