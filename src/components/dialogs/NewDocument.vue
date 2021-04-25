<template>
    <q-dialog
      no-route-dismiss
      v-model="dialogModel"
      @hide="triggerDialogClose"
      >
      <q-card
        dark
        class="newDocumentPopup"
      >

      <q-card-section class="row items-center">
          <h6 class="text-center q-my-sm">Add new document</h6>
        </q-card-section>

        <q-card-section class="row items-center">
           <q-select
              dark
              ref="ref_newDocument"
              style="flex-grow: 1;"
              dense
              menu-anchor="bottom middle"
              menu-self="top middle"
              class="newDocumentSelect"
              :options="filteredNewInput"
              use-input
              filled
              input-debounce="0"
              v-model="newDocumentModel"
              @filter="filterNewSelect"
              @input="triggerNewInput"
            >
              <template v-slot:option="{ itemProps, itemEvents, opt }">
                  <q-item
                    :class="{'hasTextShadow': textShadow}"
                    v-bind="itemProps"
                    v-on="itemEvents"
                  >
                  <q-item-section avatar>
                    <q-icon :name="opt.icon" />
                  </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="opt.label" ></q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
        </q-card-section>

      <q-card-section>
        <q-card-actions align="around" class="q-mb-sm">
          <q-btn flat label="Close" color="accent" v-close-popup />
        </q-card-actions>
      </q-card-section>

      </q-card>
    </q-dialog>
</template>

<script lang="ts">

interface NewObjectDocument {
  label: string
  icon: string
  order: number
  _id: string
  specialLabel: string
}

import { Component, Watch } from "vue-property-decorator"
import DialogBase from "src/components/dialogs/_DialogBase"

@Component({
  components: { }
})
export default class NewDocumentDialog extends DialogBase {
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
      this.isCloseAbleViaKeybind = false
      this.SSET_setDialogState(true)
      this.dialogModel = true
      this.populateNewObjectDialog().catch(e => console.log(e))
      this.reloadOptions()
    }
  }

  /****************************************************************/
  // COMPONENT SETTINGS
  /****************************************************************/

  /**
   * Watch options and react to changes
   */
  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    this.reloadOptions()
  }

  /**
   * Reloads local options
   */
  reloadOptions () {
    this.closeWithSameClick = this.SGET_options.allowQuickPopupSameKeyClose
    this.textShadow = this.SGET_options.textShadow
  }

  /**
   * A local lock that prevents double-triggering and instant re-closing of the dialog via keybinds
   */
  isCloseAbleViaKeybind = false

  /**
   * Determines if the popup is closeable with the same keybind that summoned it
   */
  closeWithSameClick = false

  /**
   * Determines if text shadow will be shows for accesiblity reasons or not
   */
  textShadow = false

  /****************************************************************/
  // LOCAL KEYBINDS
  /****************************************************************/

  /**
   * Local keybinds
   */
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Keybind cheatsheet
    if (this.determineKeyBind("quickNewDocument") && this.dialogModel && this.closeWithSameClick && this.isCloseAbleViaKeybind && this.SGET_getDialogsState) {
      this.dialogModel = false
      this.SSET_setDialogState(false)
      // @ts-ignore
      this.existingDocumentModel = null
    }
  }

  /****************************************************************/
  // SELECT LIST MANAGEMENT
  /****************************************************************/

  /**
   * List of all possible new objects
   */
  newObjectList = [] as NewObjectDocument[]

  /**
   * Currently selected new object type
   */
  newDocumentModel = null

  /**
   * Map the object types based on what is currently loaded into the blueprint list
   */
  async populateNewObjectDialog () {
    // @ts-ignore
    this.newObjectList = this.SGET_allBlueprints.map(blueprint => {
      return {
        label: blueprint.namePlural,
        icon: blueprint.icon,
        order: blueprint.order,
        _id: blueprint._id,
        specialLabel: blueprint.nameSingular.toLowerCase()
      }
    })

    await this.$nextTick()
    await this.sleep(300)
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_newDocument.focus()
    /* eslint-enable */

    this.isCloseAbleViaKeybind = true
  }

  /**
   * Refocuses the first value in the selct upon filtering for intuitive keyboard control
   */
  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_newDocument.setOptionIndex(-1)
    // @ts-ignore 
    this.$refs.ref_newDocument.moveOptionSelection(1, true) 
    /* eslint-enable */
  }

  /**
   * Filtered list of new document types
   */
  filteredNewInput = null as unknown as NewObjectDocument[]

  /**
   * Filtering of the value list
   */
  filterNewSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredNewInput = this.newObjectList
        if (this.$refs.ref_newDocument && this.filteredNewInput.length > 0) {
          this.refocusSelect().catch(e => console.log(e))
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filteredNewInput = this.newObjectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      if (this.$refs.ref_newDocument && this.filteredNewInput.length > 0) {
        this.refocusSelect().catch(e => console.log(e))
      }
    })
  }

  /****************************************************************/
  // TRIGGER ACTIONS
  /****************************************************************/

  /**
   * Add new document
   */
  triggerNewInput (e: NewObjectDocument) {
    this.dialogModel = false
    this.addNewObjectRoute(e)
    this.newDocumentModel = null
  }
}
</script>

<style lang="scss" scoped>

.newDocumentPopup {
  width: 600px;
  margin-top: 100px;
  align-self: flex-start;

  h6 {
    display: block;
    text-align: center;
    width: 100%;
  }
}
</style>
