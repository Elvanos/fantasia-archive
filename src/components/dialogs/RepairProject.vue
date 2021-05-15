<template>
    <q-dialog
      v-model="dialogModel"
      @before-hide="triggerDialogClose"
      no-route-dismiss
      :persistent="repairOngoing || repairFinished"
      >
      <q-card v-if="!repairOngoing && !repairFinished" dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Repair legacy project</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            If you are working with project created (or added via Merge) before version 0.1.7, this process might significantly improve your performance.
            <br>
            <br>
            However, before proceeding, please export your current project first to prevent a <span class="text-bold text-secondary">POSSIBLE CORRUPTION</span> of your current project data!
          </div>
        </q-card-section>

        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
          flat
          label="Cancel"
          color="accent"
          v-close-popup />
          <q-btn
          flat
          label="Export project"
          color="primary"
          @click="commenceSave"
           />
          <q-btn
            flat
            label="Repair project"
            color="primary"
            v-close-popup
            @click="repairProject" />
        </q-card-actions>
      </q-card>
      <q-card v-if="repairOngoing && !repairFinished" dark class="documentCloseDialog">
         <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Repairing...</h6>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            <b>Processing document types: <span class="text-primary">{{processedBlueprints}}/{{blueprintCount}}</span></b>
          </div>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl">
          <div>
            <b><span class="text-primary">{{currectDocumentType}}</span></b>
          </div>
        </q-card-section>

        <q-card-section class="row justify-center q-mx-xl q-mb-lg">
            <q-linear-progress stripe round dark size="20px" :value="progressCounter" color="primary" class="q-mt-sm">
              <div class="absolute-full flex flex-center">
                <q-badge text-color="accent" color="dark" :label="`${processedDocument}/${documentCount}`" />
              </div>
            </q-linear-progress>
        </q-card-section>
      </q-card>

      <q-card v-if="!repairOngoing && repairFinished" dark class="documentCloseDialog">
        <q-card-section class="row justify-center">
          <h6 class="text-center q-my-sm">Project succesfully repaired!</h6>
        </q-card-section>
        <q-card-actions align="around" class="q-mx-xl q-mt-lg q-mb-md">
          <q-btn
            flat
            label="Reload Fantasia Archive"
            color="primary"
            v-close-popup
            @click="reloadFA" />
          </q-card-actions>
      </q-card>

    </q-dialog>
</template>

<script lang="ts">

import { remote } from "electron"
import { extend, Loading, QSpinnerGears } from "quasar"

import { Component, Watch } from "vue-property-decorator"

import DialogBase from "src/components/dialogs/_DialogBase"
import { retrieveCurrentProjectName, saveProject } from "src/scripts/projectManagement/projectManagent"

import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_Blueprint } from "src/interfaces/I_Blueprint"

@Component({
  components: { }
})
export default class RepairProjectDialog extends DialogBase {
  /**
   * React to dialog opening request
   */
  @Watch("dialogTrigger")
  checkForOpenedProject (val: string|false) {
    if (val) {
      this.openDialog()
    }
  }

  /**
   * Open the the dialog if project is present on the window
   */
  openDialog () {
    if (this.SGET_getDialogsState) {
      return
    }
    this.repairOngoing = false
    this.repairFinished = false
    this.SSET_setDialogState(true)
    this.dialogModel = true
  }

  processedBlueprints = 0
  blueprintCount = 0
  processedDocument = 0
  documentCount = 0
  currectDocumentType = ""

  get progressCounter () {
    return (this.processedDocument / this.documentCount)
  }

  repairFinished = false
  repairOngoing = false

  /**
  * Repair a new project
  */
  async repairProject () {
    this.repairOngoing = true

    this.processedBlueprints = 0
    this.blueprintCount = this.SGET_allBlueprints.length

    for (const blueprint of this.SGET_allBlueprints) {
      this.processedBlueprints++

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const dbRows = await window.FA_dbs[blueprint._id].allDocs({ include_docs: true })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // eslint-disable-next-line
      const dbDocuments = dbRows.rows.map((d:any) => d.doc)

      this.documentCount = dbDocuments.length
      this.processedDocument = 0
      this.currectDocumentType = blueprint.namePlural

      await this.sleep(800)

      for (let document of dbDocuments) {
        document = await this.remapDocument(document, blueprint)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await window.FA_dbs[blueprint._id].put(document)
      }

      await this.sleep(600)
    }

    this.repairOngoing = false
    this.repairFinished = true

    const optionsSnapShot = extend(true, {}, this.SGET_options)
    // @ts-ignore
    optionsSnapShot.pre017check = false
    // @ts-ignore
    this.SSET_options(optionsSnapShot)
  }

  async remapDocument (document: I_ShortenedDocument, blueprint: I_Blueprint) {
    // Fix any old, hanging icons
    document.icon = blueprint.icon

    const statFieldIDS = [
      "strength",
      "constitution",
      "dexterity",
      "intellect",
      "wisdom",
      "charisma"
    ]

    const transeferedStats = {
      id: "statsList",
      value: []
    }

    const obsoleteFieldIDs: string[] = []

    const allSingleToNoneFields = blueprint.extraFields.filter(e => e.type === "singleToNoneRelationship")
    const allSingleToSingleFields = blueprint.extraFields.filter(e => e.type === "singleToSingleRelationship")
    const allSingleToManyFields = blueprint.extraFields.filter(e => e.type === "singleToManyRelationship")

    const allManyToNoneFields = blueprint.extraFields.filter(e => e.type === "manyToNoneRelationship")
    const allManyToSingleFields = blueprint.extraFields.filter(e => e.type === "manyToSingleRelationship")
    const allManyToManyFields = blueprint.extraFields.filter(e => e.type === "manyToManyRelationship")

    for (const field of document.extraFields) {
      // Single field remap
      if (allSingleToNoneFields.find(e => e.id === field.id) ||
      allSingleToSingleFields.find(e => e.id === field.id) ||
      allSingleToManyFields.find(e => e.id === field.id)) {
        if (field.value && field.value.value) {
          const blueprintField = blueprint.extraFields.find(e => e.id === field.id)
          field.value.value = {
            _id: field.value.value._id,
            id: field.value.value._id,
            type: field.value.value.type,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            url: `/project/display-content/${field.value.value.type}/${field.value.value._id}`,
            pairedField: (blueprintField?.relationshipSettings?.connectedField) || ""
          }
        }
      }

      // Many field remap
      if (allManyToNoneFields.find(e => e.id === field.id) ||
      allManyToSingleFields.find(e => e.id === field.id) ||
      allManyToManyFields.find(e => e.id === field.id)) {
        if (field.value && field.value.value) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          for (const [i, subValue] of field.value.value.entries()) {
            const blueprintField = blueprint.extraFields.find(e => e.id === field.id)
            field.value.value[i] = {
              _id: subValue._id,
              id: subValue._id,
              type: subValue.type,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              url: `/project/display-content/${subValue.type}/${subValue._id}`,
              pairedField: (blueprintField?.relationshipSettings?.connectedField) || ""
            }
          }
        }
      }

      // Fix stat fields
      if (statFieldIDS.includes(field.id)) {
        if (field.value.length > 0) {
          transeferedStats.value.push({
          // @ts-ignore
            value: field.value,
            // @ts-ignore
            affix: field.id.charAt(0).toUpperCase() + field.id.slice(1)
          })
        }

        obsoleteFieldIDs.push(field.id)
      }
    }

    if (transeferedStats.value.length > 0) {
      const statFieldIndex = document.extraFields.findIndex(e => e.id === "statsList")
      // If new stats/attributes field doesn't exist yet, create a new one
      if (statFieldIndex === -1) {
        document.extraFields.push(transeferedStats)
      }
      // If the field already exists
      else {
        document.extraFields[statFieldIndex].value = [
          ...document.extraFields[statFieldIndex].value,
          ...transeferedStats.value]
      }
    }

    if (document._id === "e1e24951-e2af-4513-8e4c-50fb93fd94d9") {
      console.log(obsoleteFieldIDs)
    }

    // Clean out obsolete fields that will cause bugs if left alone
    obsoleteFieldIDs.forEach(i => {
      const fieldIndex = document.extraFields.findIndex(e => e.id === i)
      // Cut out the legacy field
      document.extraFields.splice(fieldIndex, 1)
    })

    this.processedDocument++

    await this.sleep(25)

    return document
  }

  reloadFA () {
    remote.getCurrentWindow().reload()
  }

  /**
   * Export the current project
   */
  async commenceSave () {
    const projectName = await retrieveCurrentProjectName()
    const setup = {
      message: "<h4>Exporting current project...</h4>",
      spinnerColor: "primary",
      messageColor: "cultured",
      spinnerSize: 120,
      backgroundColor: "dark",
      // @ts-ignore
      spinner: QSpinnerGears
    }
    saveProject(projectName, Loading, setup, this.$q)
  }
}
</script>

<style lang="scss" scoped>

.documentCloseDialog {
  min-width: 600px;
}
</style>
