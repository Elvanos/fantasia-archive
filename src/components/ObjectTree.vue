<template>

  <span>
    <q-input ref="treeFilter" dark filled v-model="treeFilter" label="Search...">
      <template v-slot:prepend>
        <q-icon name="mdi-text-search" />
      </template>
      <template v-slot:append>
        <q-icon v-if="treeFilter !== ''" name="clear" class="cursor-pointer" @click="resetTreeFilter" />
      </template>
    </q-input>

    <q-tree
      class="objectTree q-pa-sm"
      :nodes="treeList"
      node-key="label"
      no-connectors
      ref="tree"
      dark
      :filter="treeFilter"
      :selected.sync="selectedTreeNode"
      >
      <template v-slot:default-header="prop">
        <div class="row items-center col-grow">
          <q-icon
            :size="(prop.node.icon.includes('fas')? '16px': '21px')"
            :name="prop.node.icon"
            class="q-mr-sm" />
          <div class="documentLabel">
            {{ prop.node.label }}
            <span
              class="text-primary text-weight-medium"
              v-if="prop.node.isRoot">
                ({{prop.node.documentCount}})
              </span>
            <q-badge
            class="q-ml-xs"
            style="font-size: 12px;"
            v-if="prop.node.sticker"
            color="primary"
            outline
            align="top">{{prop.node.sticker}}
              <q-tooltip>
                Order priority of the document
              </q-tooltip>
            </q-badge>
          </div>
          <q-tooltip v-if="prop.node.specialLabel">
            Add new {{ prop.node.specialLabel }}
          </q-tooltip>
        </div>
      </template>
    </q-tree>

      <!--
            <q-list>
              <q-separator
              color="white"
              inset
              class="q-mt-md"
            />
            <q-item
              v-ripple
              clickable
              class="q-mt-md"
              >
              <q-item-section avatar>
                <q-icon :name="menuAddNewItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuAddNewItem.label }}
              </q-item-section>
            </q-item>

            </q-list>

      -->
  </span>

</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator"

import BaseClass from "src/BaseClass"
import { I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import { I_NewObjectTrigger } from "src/interfaces/I_NewObjectTrigger"
import PouchDB from "pouchdb"
import { engageBlueprints, retrieveAllBlueprints } from "src/databaseManager/blueprintManager"
// import { cleanDatabases } from "src/databaseManager/cleaner"
import { I_Blueprint } from "src/interfaces/I_Blueprint"

const menuAddNewItem = {
  icon: "mdi-plus",
  label: "Add new object type"
}

@Component({
  components: { }
})
export default class ObjectTree extends BaseClass {
  menuAddNewItem = menuAddNewItem

  treeList: {children: I_ShortenedDocument[], icon: string, label: string}[] = []

  firstTimeExpand = true

  /**
   * A resetter for the currently selected node
   */
  selectedTreeNode = null

  treeFilter = ""

  @Watch("SGET_allBlueprints", { deep: true })
  reactToBluePrintRefresh () {
    this.buildCurrentObjectTree().catch((e) => { console.log(e) })
  }

  resetTreeFilter () {
    this.treeFilter = ""
    // @ts-ignore
    const treeFilterDOM = this.$refs.treeFilter as unknown as HTMLInputElement
    treeFilterDOM.focus()
  }

  /**
   * Since we are using the object tree as URLs intead of selecting, this resets the select every time a node is clicked
   */
  @Watch("selectedTreeNode")
  onNodeChange (val: I_NewObjectTrigger) {
    if (val !== null) {
      this.selectedTreeNode = null
    }
  }

  @Watch("SGET_allOpenedDocuments", { deep: true })
  async reactToDocumentListChange () {
    await this.buildCurrentObjectTree()
  }

  sortDocuments (input: I_ShortenedDocument[]) {
    input
      .sort((a, b) => a.label.localeCompare(b.label))
      .sort((a, b) => {
        const order1 = a.extraFields.find(e => e.id === "order")?.value
        const order2 = b.extraFields.find(e => e.id === "order")?.value

        if (order1 < order2) { return 1 }
        if (order1 > order2) { return -1 }

        return 0
      })

    input.forEach((e, i) => {
      if (e.children.length > 0) { input[i].children = this.sortDocuments(input[i].children) }
    })

    return input
  }

  buildTreeHierarchy (input: I_ShortenedDocument[]) {
    const map: number[] = []
    let node
    const roots = []
    let i

    for (i = 0; i < input.length; i += 1) {
      map[input[i]._id] = i // initialize the map
    }

    for (i = 0; i < input.length; i += 1) {
      node = input[i]
      if (node.parentDoc !== false) {
      // if you have dangling branches check that map[node.parentId] exists
        if (input[map[node.parentDoc]]) {
          input[map[node.parentDoc]].children.push(node)
        } else {
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    }

    const sortedRoots = this.sortDocuments(roots)

    return sortedRoots
  }

  async buildCurrentObjectTree () {
    const allBlueprings = this.SGET_allBlueprints
    const treeObject: any[] = []

    for (const blueprint of allBlueprings) {
      const CurrentObjectDB = new PouchDB(blueprint._id)

      const allDocuments = await CurrentObjectDB.allDocs({ include_docs: true })

      const allDocumentsRows = allDocuments.rows
        .map((singleDocument) => {
          const doc = singleDocument.doc as unknown as I_ShortenedDocument

          const parentDocID = doc.extraFields.find(e => e.id === "parentDoc")?.value.value as unknown as {_id: string}

          return {
            label: doc.extraFields.find(e => e.id === "name")?.value,
            icon: doc.icon,
            sticker: doc.extraFields.find(e => e.id === "order")?.value,
            parentDoc: (parentDocID) ? parentDocID._id : false,
            handler: this.openExistingDocument,
            expandable: true,
            type: doc.type,
            children: [],
            hasEdits: false,
            isNew: false,
            url: doc.url,
            extraFields: (doc?.extraFields) || [],
            _id: singleDocument.id
          } as I_ShortenedDocument
        })

      const documentCount = allDocumentsRows.length

      const hierarchicalTreeContent = this.buildTreeHierarchy(allDocumentsRows)

      const treeRow = {
        label: blueprint.namePlural,
        icon: blueprint.icon,
        order: blueprint.order,
        _id: blueprint._id,
        handler: this.addNewObjectType,
        specialLabel: blueprint.nameSingular.toLowerCase(),
        isRoot: true,
        documentCount: documentCount,
        children: [
          ...hierarchicalTreeContent,
          {
            label: `Add new ${blueprint.nameSingular.toLowerCase()}`,
            icon: "mdi-plus",
            handler: this.addNewObjectType,
            _id: blueprint._id
          }
        ]
      }

      treeObject.push(treeRow)
    }

    treeObject.sort((a, b) => {
      if (a.order < b.order) {
        return 1
      }

      if (a.order > b.order) {
        return -1
      }
      return 0
    })

    this.treeList = treeObject

    if (this.firstTimeExpand) {
      this.firstTimeExpand = false
      // await this.$nextTick()
      // this.$refs.tree.expandAll()
    }
  }

  async created () {
    // await cleanDatabases()
    await this.processBluePrints()

    setTimeout(() => {
      this.buildCurrentObjectTree().catch((e) => { console.log(e) })
    }, 1000)
  }

  /**
   * Processes all blueprints and redies the store for population of the app
   */
  async processBluePrints (): Promise<void> {
    await engageBlueprints()

    const allObjectBlueprints = (await retrieveAllBlueprints()).rows.map((blueprint) => {
      return blueprint.doc
    }) as I_Blueprint[]

    this.SSET_allBlueprints(allObjectBlueprints)
  }
}
</script>

<style lang="scss">
.objectTree {
  .q-tree__arrow {
    width: 28px;
    height: 28px;
    margin: 0;
  }

  .documentLabel {
    max-width: calc(100% - 30px);
  }
}

</style>
