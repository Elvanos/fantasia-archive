<template>
    <q-dialog
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

import { Component, Watch } from "vue-property-decorator"
interface NewObjectDocument {
  label: string
  icon: string
  order: number
  _id: string
  specialLabel: string
}
import DialogBase from "src/components/dialogs/_DialogBase"
@Component({
  components: { }
})
export default class NewDocumentDialog extends DialogBase {
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
    }
  }

  newObjectList = [] as NewObjectDocument[]

  newDocumentModel = null

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

  filteredNewInput = null as unknown as NewObjectDocument[]

  async refocusSelect () {
    await this.$nextTick()
    /*eslint-disable */
    // @ts-ignore 
    this.$refs.ref_newDocument.setOptionIndex(-1)
    // @ts-ignore 
    this.$refs.ref_newDocument.moveOptionSelection(1, true) 
    /* eslint-enable */
  }

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

  triggerNewInput (e: NewObjectDocument) {
    this.dialogModel = false
    this.addNewObjectRoute(e)
    this.newDocumentModel = null
  }

  isCloseAbleViaKeybind = false
  closeWithSameClick = false
  textShadow = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    this.reloadOptions()
  }

  reloadOptions () {
    const options = this.SGET_options
    this.closeWithSameClick = options.allowQuickPopupSameKeyClose
    this.textShadow = options.textShadow
  }

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
