<template>
  <div>
    <div class="flex justify-start items-center text-weight-bolder q-mb-sm q-mt-md">
      <q-icon v-if="inputIcon" :name="inputIcon" :size="inputIcon.includes('fas')? '15px': '20px'" class="q-mr-md"/>
      {{inputDataBluePrint.name}}
       <q-icon v-if="toolTip && !disableDocumentToolTips" name="mdi-help-circle" size="16px" class="q-ml-md">
         <q-tooltip :delay="500">
           <span v-html="toolTip"/>
        </q-tooltip>
      </q-icon>
      <q-icon v-if="isOneWayRelationship" name="mdi-arrow-right-bold" size="16px" class="q-ml-md">
        <q-tooltip :delay="500" v-if="!disableDocumentToolTips">
            This is a one-way relationship. <br> Editing this value <span class="text-secondary">WILL NOT</span> have any effect on the connected document/s.
            <br>
            <br>
            Left-clicking the linked document in non-edit mode will open it in new tab and focuses on it.
            <br>
            Middle-clicking the linked document in non-edit mode will open it in new tab and not focus on it.
        </q-tooltip>
      </q-icon>
      <q-icon v-if="!isOneWayRelationship" name="mdi-arrow-left-right-bold" size="16px" class="q-ml-md">
         <q-tooltip :delay="500" v-if="!disableDocumentToolTips">
            This is a two-way relationship. <br> Editing this value <span class="text-secondary">WILL</span> also affect the connected document/s.
            <br>
            <br>
            Left-clicking the linked document in non-edit mode will open it in new tab and focuses on it.
            <br>
            Middle-clicking the linked document in non-edit mode will open it in new tab and not focus on it.
        </q-tooltip>
      </q-icon>

    </div>

    <q-list
      v-if="!editMode && localInput"
      class="connectionList"
      dense>
      <q-item
      v-for="single in localInput"
      :key="single._id"
      clickable
      class="text-primary"
      >
        <q-item-section
          @click.left="openExistingDocumentRoute(single)"
          @click.middle="openNewTab(single)"
          >
            <span class="text-weight-medium">
              <span class="isDeadIndicator" v-if="single.isDead">
                †
              </span>
              <span :class="{'isDead': (single.isDead && !hideDeadCrossThrough)}">
                  {{stripTags(single.label)}}
              </span>
            </span>
            <span class="inline-block q-ml-xs text-italic connectionNote">
              {{retrieveNoteText(single._id)}}
            </span>
            <q-btn
              tabindex="-1"
              round
              flat
              dense
              dark
              color="primary"
              icon="mdi-open-in-new"
              size="12px"
              class="relationshipOpeningButton"
              @click.stop.prevent.left="openNewTab(single)"
              >
              <q-tooltip :delay="500">
                Open in new tab without leaving this one
              </q-tooltip>
            </q-btn>
        </q-item-section>
         <q-menu
              touch-position
              context-menu
              auto-close
              separate-close-popup
            >

              <q-list class="bg-gunmetal-light text-accent">

                <template>
                  <q-item clickable  @click="copyName(fixGetCorrectDocument(single))">
                    <q-item-section>Copy name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-text-recognition" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTextColor(fixGetCorrectDocument(single))">
                    <q-item-section>Copy text color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-eyedropper" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyBackgroundColor(fixGetCorrectDocument(single))">
                    <q-item-section>Copy background color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-format-color-fill" />
                    </q-item-section>
                  </q-item>
                  <q-separator dark />
                    <q-item clickable @click="openExistingInput(fixGetCorrectDocument(single))">
                    <q-item-section>Open document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-page-variant-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="editExistingInput(fixGetCorrectDocument(single))">
                    <q-item-section>Edit document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="addNewUnderParent(fixGetCorrectDocument(single))">
                    <q-item-section>Create new document with this document as parent</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-file-tree" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTargetDocument(fixGetCorrectDocument(single))">
                    <q-item-section>Copy this document</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-content-copy" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>

            </q-menu>
      </q-item>
    </q-list>

  <div class="flex" v-if="editMode">
    <q-select
      menu-anchor="bottom middle"
      menu-self="top middle"
      class="multiRelashionshipSelect"
      dark
      style="flex-grow: 1;"
      dense
      :ref="`multieRelationshipField${this.inputDataBluePrint.id}`"
      :options="filterList"
      use-input
      :option-disable="opt => Object(opt) === opt ? disabledIDList.includes(opt._id) : true"
      :outlined="!isDarkMode"
      :filled="isDarkMode"
      use-chips
      multiple
      option-value="_id"
      input-debounce="500"
      v-model="localInput"
      @filter="filterSelect"
      @input="processInput"
    >
    <template v-slot:append>
        <q-btn round dense flat v-slot:append v-if="!hideAdvSearchCheatsheetButton" icon="mdi-help-rhombus" @click.stop.prevent="SSET_setAdvSearchWindowVisible"
        >
          <q-tooltip :delay="500">
            Open search cheatsheet
          </q-tooltip>
        </q-btn>
      </template>
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
          <template v-if="scope.opt.isDead">
            †
          </template>
          {{ stripTags(scope.opt.label) }}
           <q-btn
            round
            dense
            flat
            class="z-15 relationshipChipNewTab"
            style="color: #000 !important;"
            size="sm"
            icon="mdi-open-in-new"
            @click.stop.prevent="openNewTab(scope.opt)"
          >
           <q-tooltip :delay="500">
              Open in new tab without leaving this one
            </q-tooltip>
          </q-btn>
           <q-menu
              touch-position
              context-menu
              auto-close
              separate-close-popup
            >

              <q-list class="bg-gunmetal-light text-accent">

                <template>
                  <q-item clickable @click="copyName(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Copy name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-text-recognition" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTextColor(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Copy text color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-eyedropper" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyBackgroundColor(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Copy background color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-format-color-fill" />
                    </q-item-section>
                  </q-item>
                  <q-separator dark />
                    <q-item clickable @click="openExistingInput(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Open document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-page-variant-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="editExistingInput(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Edit document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="addNewUnderParent(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Create new document with this document as parent</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-file-tree" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTargetDocument(fixGetCorrectDocument(scope.opt))">
                    <q-item-section>Copy this document</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-content-copy" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>

            </q-menu>
        </q-chip>
      </template>
      <template v-slot:option="{ itemProps, itemEvents, opt }">
        <q-item
          :class="{'hasTextShadow': textShadow, 'isMinor':opt.isMinor}"
          v-bind="itemProps"
          v-on="itemEvents"
          :key="opt.id"
          :style="`background-color: ${opt.bgColor}`"
        >
           <q-item-section avatar>
            <q-icon
              :style="`color: ${retrieveIconColor(opt)}`"
              :name="(opt.isCategory) ? 'fas fa-folder-open' : opt.icon"
              />
          </q-item-section>
          <q-item-section>
            <q-item-label
            :style="`color: ${opt.color}`"
            >
              <span class="isDeadIndicator" v-if="opt.isDead">
                †
              </span>
              <span :class="{'isDead': (opt.isDead && !hideDeadCrossThrough)}" v-html="opt.label">
              </span>
            </q-item-label>
            <q-item-label caption class="text-cultured" v-html="opt.hierarchicalPath"></q-item-label>
            <q-item-label caption class="text-cultured" v-if="opt.tags">
              <q-chip
              v-for="(input,index) in opt.tags" :key="index"
              outline
              style="opacity: 0.8;"
              size="12px"
              class="text-cultured noBounce"
              v-html="`${input}`"
              >
              </q-chip>
            </q-item-label>
          </q-item-section>
          <q-tooltip v-if='opt.disable'>
            This option is unavailable for selection as it is already paired to another.
          </q-tooltip>
           <q-menu
              touch-position
              context-menu
              auto-close
              separate-close-popup
            >

              <q-list class="bg-gunmetal-light text-accent">

                <template>
                  <q-item clickable  @click="copyName(opt)">
                    <q-item-section>Copy name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-text-recognition" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTextColor(opt)">
                    <q-item-section>Copy text color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-eyedropper" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyBackgroundColor(opt)">
                    <q-item-section>Copy background color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-format-color-fill" />
                    </q-item-section>
                  </q-item>
                  <q-separator dark />
                    <q-item clickable @click="openExistingInput(opt)">
                    <q-item-section>Open document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-page-variant-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="editExistingInput(opt)">
                    <q-item-section>Edit document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="addNewUnderParent(opt)">
                    <q-item-section>Create new document with this document as parent</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-file-tree" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="copyTargetDocument(opt)">
                    <q-item-section>Copy this document</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="primary" name="mdi-content-copy" />
                    </q-item-section>
                  </q-item>
                </template>

              </q-list>

            </q-menu>
        </q-item>
      </template>
    </q-select>

    <table class="q-mt-sm">
      <tr
        v-for="(singleNote,index) in inputNotes"
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
            <div class="grow-1">
              {{stripTags(localInput[index].label)}}
            </div>
          </div>
        </td>
        <td>
          <q-input
            label="Note"
            v-model="singleNote.value"
            dense
            @keydown="processInput()"
            :outlined="!isDarkMode"
            :filled="isDarkMode"
            >
          </q-input>
        </td>

      </tr>
    </table>
  </div>

    <div class="separatorWrapper">
      <q-separator color="grey q-mt-md" />
    </div>

  </div>

</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator"

import FieldBase from "src/components/fields/_FieldBase"
import { advancedDocumentFilter } from "src/scripts/utilities/advancedDocumentFilter"
import { extend } from "quasar"
import { I_ShortenedDocument, I_OpenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_FieldRelationship, I_RelationshipPair } from "src/interfaces/I_FieldRelationship"
import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import { copyDocumentName, copyDocumentTextColor, copyDocumentBackgroundColor } from "src/scripts/documentActions/uniqueFieldCopy"
import { copyDocument } from "src/scripts/documentActions/copyDocument"

@Component({
  components: { }
})
export default class Field_MultiRelationship extends FieldBase {
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
  }) readonly inputDataValue!: I_RelationshipPair

  /**
   * ID of the document this field belongs to
   */
  @Prop({ default: "" }) readonly currentId!: ""

  /**
   * Determines if this is a one or two way relationship
   */
  get isOneWayRelationship () {
    return (this.inputDataBluePrint.type === "singleToNoneRelationship" || this.inputDataBluePrint.type === "manyToNoneRelationship")
  }

  /****************************************************************/
  // INPUT HANDLING
  /****************************************************************/

  /**
   * Watch changes to the prefilled data already existing in the field and update local input accordingly
   * Also reload the local object list
   */
  @Watch("inputDataValue", { deep: true, immediate: true })
  reactToInputChanges (val : I_RelationshipPair) {
    const localCopy: I_RelationshipPair = extend(true, {}, val)
    this.localInput = (localCopy?.value) ? localCopy.value : []

    const notes = (!localCopy?.addedValues) ? [] : localCopy.addedValues
    this.inputNotes = notes.filter(single => this.localInput.find(e => single.pairedId === e._id))
    this.checkNotes()

    this.reloadObjectListAndCheckIfValueExists()
  }

  /**
   * Reload the local object list based on blueprint changes
   */
  @Watch("inputDataBluePrint", { deep: true, immediate: true })
  reactToBlueprintChanges () {
    this.reloadObjectListAndCheckIfValueExists()
  }

  /**
   * Reload the local object list based on current document ID changes
   */
  @Watch("currentId")
  reactToIDChanges () {
    this.reloadObjectListAndCheckIfValueExists()
  }

  /**
   * Model for the local input
   */
  localInput = [] as unknown as I_FieldRelationship[]

  /**
   * List of notes paired to the local input
   */
  inputNotes: { pairedId: string; value: string; }[] = []

  /**
   * Retrieves note text
   */
  retrieveNoteText (id: string) {
    const pairedNote = this.inputNotes.find(e => e.pairedId === id)
    return (pairedNote && pairedNote.value.length > 0) ? `(${pairedNote.value})` : ""
  }

  /**
   * A list of all retrieved documents without the current one
   */
  allTypeDocuments: I_ShortenedDocument[] = []

  /**
   * A copy of the list for the filter feed
   * A copy is needed here as the list gets modified as the filter returns highlights and similar
   */
  filterList: I_ShortenedDocument[] = []

  /**
   * Refocus after filtering to avoid un-intuitive focusing
   */
  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`].setOptionIndex(-1)
    // @ts-ignore 
    this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`].moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  /**
   * Filter the document list
   */
  filterSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filterList = this.allTypeDocuments
          .filter((obj) => !obj.isMinor && obj._id !== this.currentId)

        if (this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`] && this.filterList.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filterList = extend(true, [], this.allTypeDocuments)

      // @ts-ignore
      this.filterList = advancedDocumentFilter(needle, this.filterList, this.SGET_allBlueprints, this.filterList)
        .filter((obj) => obj._id !== this.currentId)

      if (this.$refs[`multiRelationshipField${this.inputDataBluePrint.id}`] && this.filterList.length > 0) {
        this.refocusSelect().catch(e => console.log(e))
      }
    })
  }

  /**
   * Prepares the initial loading of the list for filtering and furhter use
   * Also remove the document itself from the list, checks if connected input fields even exist and altogether formats and clears the list
   */
  reloadObjectListAndCheckIfValueExists () {
    if (this.inputDataBluePrint?.relationshipSettings && this.currentId.length > 0) {
      // Get a list of all objects connected to this field and remap them
      const allDbObjects = this.SGET_allDocumentsByTypeWithoutCategories(this.inputDataBluePrint.relationshipSettings.connectedObjectType)

      // Map all of the documents to something more digestible for the select
      allDbObjects.docs.forEach((doc) => {
        const objectDoc = doc as unknown as I_ShortenedDocument

        const pairedField = (this.inputDataBluePrint?.relationshipSettings?.connectedField) || ""
        let isDisabled = false

        // If the paired field exists and if this is "singleToSingleRelationship", set it as disabled since it is already paired
        if (pairedField.length > 0) {
          const pairedFieldObject = objectDoc.extraFields.find(f => f.id === pairedField)

          const pairingType = this.inputDataBluePrint.type
          if (
            pairedFieldObject !== undefined &&
            pairedFieldObject !== null &&
            pairedFieldObject?.value !== undefined &&
            pairedFieldObject?.value !== null &&
            typeof pairedFieldObject?.value !== "string" &&
            pairedFieldObject?.value?.value !== undefined &&
            pairedFieldObject?.value?.value !== null &&
            typeof pairedFieldObject?.value?.value !== "string" &&
            pairingType === "manyToSingleRelationship"
          ) {
            isDisabled = true
          }
        }

        if (isDisabled) {
          this.disabledIDList = [...new Set([
            ...this.disabledIDList,
            doc._id
          ])]
        }
      })

      // Do a quick check on formatting of the current input (if something is wrong with it, set it as empty array)
      this.localInput = (Array.isArray(this.localInput)) ? this.localInput : []

      const toRemoveIndexList: string[] = []

      for (const [index] of this.localInput.entries()) {
        // Proceed only if the local input is properly set up
        if (this.localInput[index]._id) {
          // If the matched object doesn't exist in the object, assume it has been deleted or newer existed and silently emit a signal input which auto-updates the document

          if (!allDbObjects.docs.find(e => e._id === this.localInput[index]._id)) {
            toRemoveIndexList.push(this.localInput[index]._id)
          }
          // If the object does exist, make sure we have the newest available name by reasigning the label if it is different. Then trigger a silent update
          else {
            const matchedFieldContent = allDbObjects.docs.find(e => e._id === this.localInput[index]._id)
            if (matchedFieldContent) {
              this.localInput[index].label = matchedFieldContent.label
              this.localInput[index].isDead = matchedFieldContent.extraFields.find(e => e.id === "deadSwitch")?.value
            }
          }
        }
      }

      this.allTypeDocuments = allDbObjects.docs

      // Remove delete documents paired to this
      if (toRemoveIndexList.length > 0) {
        toRemoveIndexList.forEach((id) => {
          const indexToRemove = this.localInput.findIndex(doc => doc._id === id)
          if (indexToRemove > -1) {
            this.localInput.splice(indexToRemove, 1)
          }
        })
        this.signalInput(true)
      }
    }
  }

  /****************************************************************/
  // FIELD ACTIONS
  /****************************************************************/

  /**
   * Opens a new tab from a connected rleationship
   */
  openNewTab (input: I_FieldRelationship) {
    const retrievedObject = (this.SGET_openedDocument(input._id)) || this.SGET_document(input._id)

    const dataPass = {
      doc: retrievedObject,
      treeAction: false
    }

    // @ts-ignore
    this.SSET_addOpenedDocument(dataPass)
  }

  moveItem (index: number, direction: "up" | "down") {
    const to = (direction === "up") ? index - 1 : index + 1
    const from = index

    this.localInput.splice(to, 0, this.localInput.splice(from, 1)[0])
    this.inputNotes.splice(to, 0, this.inputNotes.splice(from, 1)[0])

    this.processInput()
  }

  disabledIDList: string[] = []

  /**
   * Debounce timer to prevent buggy input sync
   */
  pullTimer = null as any

  processInput () {
    this.checkNotes()
    this.inputNotes = this.inputNotes.filter(single => this.localInput.find(e => single.pairedId === e._id))

    clearTimeout(this.pullTimer)
    this.pullTimer = setTimeout(() => {
      this.signalInput(false)
    }, 500)
  }

  /**
   * Signals the input change to the document body parent component
   */
  @Emit()
  signalInput (isSilent: boolean) {
    this.checkNotes()
    this.inputNotes = this.inputNotes.filter(single => this.localInput.find(e => single.pairedId === e._id))

    return {
      value: this.localInput.map(e => {
        return {
          _id: e._id,
          id: e._id,
          type: e.type,
          url: e.url,
          pairedField: (this.inputDataBluePrint?.relationshipSettings?.connectedField) || ""
        }
      }),
      addedValues: this.inputNotes,
      isSilent: isSilent
    }
  }

  /**
   * Rebuilds the note list to match the input relationships
   */
  checkNotes () {
    this.localInput.forEach(single => {
      if (!this.inputNotes.find(e => single._id === e.pairedId)) {
        this.inputNotes.push({ pairedId: single._id, value: "" })
      }
    })
  }

  /****************************************************************/
  // TRIGGER ACTIONS
  /****************************************************************/

  docToFind = null as unknown as I_OpenedDocument

  fixGetCorrectDocument (e: I_OpenedDocument | I_FieldRelationship) {
    this.docToFind = (this.allTypeDocuments.find(doc => doc._id === e._id)) as unknown as I_OpenedDocument
    return this.docToFind
  }

  /**
   * Opened the existing input
   */
  openExistingInput (e: I_OpenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    this.openExistingDocumentRoute(e)
  }

  /**
   * Opened the existing input in two modes
   * Either as a focus with closure of the dialog.
   * Or as a background tab without closing of the dialog.
   */
  editExistingInput (e: I_OpenedDocument) {
    // @ts-ignore
    e = (Array.isArray(e)) ? e[0] : e
    this.openExistingDocumentRouteWithEdit(e)
  }

  documentPass = null as unknown as I_OpenedDocument

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent (currentDoc: I_OpenedDocument) {
    createNewWithParent(currentDoc, this)
  }

  /****************************************************************/
  // Document field copying
  /****************************************************************/

  copyName (currentDoc: I_OpenedDocument) {
    copyDocumentName(currentDoc)
  }

  copyTextColor (currentDoc: I_OpenedDocument) {
    copyDocumentTextColor(currentDoc)
  }

  copyBackgroundColor (currentDoc: I_OpenedDocument) {
    copyDocumentBackgroundColor(currentDoc)
  }

  copyTargetDocument (currentDoc: I_OpenedDocument) {
    this.documentPass = extend(true, {}, currentDoc)

    const newDocument = copyDocument(this.documentPass, this.generateUID())

    const dataPass = {
      doc: newDocument,
      treeAction: false
    }

    // @ts-ignore
    this.SSET_addOpenedDocument(dataPass)
    this.$router.push({
      path: newDocument.url
    }).catch((e: {name: string}) => {
      const errorName : string = e.name
      if (errorName === "NavigationDuplicated") {
        return
      }
      console.log(e)
    })
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>

<style lang="scss">
.connectionList {
  .q-item {
    padding-right: 30px;
    padding-left: 10px;
  }

  .q-item__section {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .relationshipOpeningButton {
      position: absolute;
      right: -30px;
    }
  }
}

.connectionList .connectionNote {
  color: #000;
  opacity: 0.8;
}

</style>
