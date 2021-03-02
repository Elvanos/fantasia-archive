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
              class="newDocumentSelect"
              :options="filteredNewInput"
              use-input
              outlined
              input-debounce="0"
              v-model="newDocumentModel"
              @filter="filterNewSelect"
              @input="triggerNewInput"
            >
              <template v-slot:option="{ itemProps, itemEvents, opt }">
                  <q-item
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
        <q-card-actions align="center" class="q-mb-sm">
          <q-btn flat label="Close window" color="primary" v-close-popup />
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
      this.SSET_setDialogState(true)
      this.dialogModel = true
      this.populateNewObjectDialog()
    }
  }

  newObjectList = [] as NewObjectDocument[]

  newDocumentModel = null

  populateNewObjectDialog () {
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

    this.$nextTick(function () {
      /*eslint-disable */
      setTimeout( () =>{
        // @ts-ignore 
        this.$refs.ref_newDocument.focus()
      }, 100)
      /* eslint-enable */
    })
  }

  filteredNewInput = null as unknown as NewObjectDocument[]

  filterNewSelect (val: string, update: (e: () => void) => void) {
    if (val === "") {
      update(() => {
        this.filteredNewInput = this.newObjectList
        /*eslint-disable */
        if(this.$refs.ref_newDocument && this.filteredNewInput.length > 0){
          setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_newDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_newDocument.moveOptionSelection(1, true) 
        }, 300)      
        /* eslint-enable */
        }
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.filteredNewInput = this.newObjectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      /*eslint-disable */
      if(this.$refs.ref_newDocument && this.filteredNewInput.length > 0){        
        setTimeout(() => {
          // @ts-ignore 
          this.$refs.ref_newDocument.setOptionIndex(-1)
          // @ts-ignore 
          this.$refs.ref_newDocument.moveOptionSelection(1, true) 
        }, 300)       
      }
      /* eslint-enable */
    })
  }

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
