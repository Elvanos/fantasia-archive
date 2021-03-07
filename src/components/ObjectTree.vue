<template>

  <span>
    <q-page-sticky position="top-left" class="treeSearchWrapper">

    <q-input ref="treeFilter" dark filled v-model="treeFilter" label="Filter document tree...">
      <template v-slot:append>
        <q-icon name="mdi-text-search" />
      </template>
      <template v-slot:prepend>
        <q-icon v-if="treeFilter !== ''" name="clear" class="cursor-pointer text-secondary" @click="resetTreeFilter" />
      </template>
    </q-input>
    </q-page-sticky>

    <h6 class="projectTitle text-cultured">
      <span>
        {{projectName}}
          <q-tooltip
            :delay="1000"
          >
            This is your currently opened project's name.
          </q-tooltip>
      </span>
    </h6>

    <q-tree
      class="objectTree q-pa-sm"
      :nodes="hierarchicalTree"
      node-key="key"
      no-connectors
      ref="tree"
      dark
      :duration="200"
      :filter="treeFilter"
      :selected.sync="selectedTreeNode"
      :expanded.sync="expandedTreeNodes"
      no-nodes-label="Loading your project..."
      no-results-label="Nothing matches your request"
      >
      <template v-slot:default-header="prop">
        <div class="row items-center col-grow"
        @click.stop.prevent="processNodeClick(prop.node)"
        @click.stop.prevent.middle="processNodeLabelMiddleClick(prop.node)"
        >
          <div class="documentLabel"
            :style="`color: ${prop.node.color}`"
           >
          <q-icon
            :style="`color: ${determineNodeColor(prop.node)}; width: 22px !important;`"
            :size="(prop.node.icon.includes('fas')? '16px': '21px')"
            :name="prop.node.icon"
            class="q-mr-sm self-center" />
            {{ prop.node.label }}
            <span
              class="text-primary text-weight-medium q-ml-xs"
              v-if="prop.node.isRoot">
                ({{prop.node.allCount}})
                <q-tooltip
                  :delay="1000"
                >
                Document count: <span class="text-bold text-satin-sheen-gold-dark">{{prop.node.documentCount}}</span>
                <br>
                Category count: <span class="text-bold text-satin-sheen-gold-dark">{{prop.node.categoryCount}}</span>
                </q-tooltip>
              </span>
            <q-badge
              class="treeBadge"
              :class="{'noChilden': prop.node.children.length === 0}"
              v-if="prop.node.sticker"
              color="primary"
              outline
              floating
            >
              {{prop.node.sticker}}
              <q-tooltip
                :delay="500"
              >
                Order priority of the document
              </q-tooltip>
            </q-badge>
            <div class="treeButtonGroup">
              <q-btn
                tabindex="-1"
                v-if="prop.node.children && prop.node.children.length > 0 && !prop.node.isRoot && !prop.node.isTag"
                round
                flat
                dense
                color="dark"
                class="z-1 q-ml-sm treeButton treeButton--edit"
                icon="mdi-pencil"
                size="10px"
                @click.stop.prevent="openExistingDocumentRoute(prop.node)"
              >
                <q-tooltip
                  :delay="300"
                >
                Open/Edit {{ prop.node.label }}
                </q-tooltip>
              </q-btn>
              <q-btn
                tabindex="-1"
                v-if="(!prop.node.specialLabel && !prop.node.isRoot) || (prop.node.isRoot && !prop.node.isTag)"
                round
                flat
                dense
                color="dark"
                class="z-1 q-ml-sm treeButton treeButton--add"
                icon="mdi-plus"
                size="10px"
                @click.stop.prevent="processNodeNewDocumentButton(prop.node)"
                >
                <q-tooltip
                  :delay="300"
                >
                  Add a new document belonging under {{ prop.node.label }}
                </q-tooltip>
              </q-btn>
            </div>
        </div>
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
import { I_OpenedDocument, I_ShortenedDocument } from "src/interfaces/I_OpenedDocument"
import PouchDB from "pouchdb"
import { engageBlueprints, retrieveAllBlueprints } from "src/scripts/databaseManager/blueprintManager"
// import { cleanDatabases } from "src/scripts/databaseManager/cleaner"
import { I_Blueprint } from "src/interfaces/I_Blueprint"
import { extend, colors } from "quasar"
import { tagListBuildFromBlueprints } from "src/scripts/utilities/tagListBuilder"
import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"

@Component({
  components: { }
})
export default class ObjectTree extends BaseClass {
  /****************************************************************/
  // KEYBINDS MANAGEMENT
  /****************************************************************/
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Focus left tree search
    if (this.determineKeyBind("focusHierarchicalTree")) {
      const treeFilterDOM = this.$refs.treeFilter as unknown as HTMLInputElement
      treeFilterDOM.focus()
    }

    // Clear input in the left tree search
    if (this.determineKeyBind("clearInputHierarchicalTree")) {
      this.resetTreeFilter()
    }
  }

  /****************************************************************/
  // GENERIC FUNCTIONALITY
  /****************************************************************/

  projectName = ""

  /**
   * Load all blueprints and build the tree out of them
   */
  async created () {
    this.projectName = await retrieveCurrentProjectName()

    // await cleanDatabases()
    await this.processBluePrints()

    // Unfuck the rendering by giving the app some time to load first
    await this.$nextTick()

    this.buildCurrentObjectTree().catch((e) => {
      console.log(e)
    })
  }

  /****************************************************************/
  // BLUEPRINT MANAGEMENT
  /****************************************************************/

  /**
   * In case any of the blueprints change, reload the whole tree
   */
  @Watch("SGET_allBlueprints", { deep: true })
  reactToBluePrintRefresh () {
    this.buildCurrentObjectTree().catch((e) => {
      console.log(e)
    })
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

  /****************************************************************/
  // HIERARCHICAL TREE - HELPERS AND MODELS
  /****************************************************************/

  @Watch("$route", { deep: true })
  async reactToRouteChange () {
    // Wait for animations
    await this.sleep(200)
    if (this.SGET_allOpenedDocuments.docs.length > 0) {
      const currentDoc = this.findRequestedOrActiveDocument() as unknown as I_OpenedDocument
      this.selectedTreeNode = currentDoc._id
    }
    else {
      this.selectedTreeNode = null
    }
  }

  /**
   *
   */
  @Watch("SGET_allOpenedDocuments", { deep: true })
  async reactToDocumentListChange (val: { treeAction: boolean, docs: I_OpenedDocument[]}) {
    if (val.treeAction) {
      await this.buildCurrentObjectTree()
      this.buildTreeExpands(val?.docs)
      this.lastDocsSnapShot = extend(true, [], val.docs)
    }
    else if (val.docs.length !== this.lastDocsSnapShot.length) {
      this.lastDocsSnapShot = extend(true, [], val.docs)
    }
  }

  lastDocsSnapShot:I_OpenedDocument[] = []

  /**
   * Generic wrapper for adding of new object types to the tree
   */
  menuAddNewItem = {
    icon: "mdi-plus",
    label: "Add new object type"
  }

  /**
   * Contains all the data for the render in tree
   */
  hierarchicalTree: {children: I_ShortenedDocument[], icon: string, label: string}[] = []

  /**
   * A resetter for the currently selected node
   */
  selectedTreeNode = null as null | string

  /**
   * Holds all currently expanded notes
   */
  expandedTreeNodes = []

  /**
   * Filter model for the tree
   */
  treeFilter = ""

  /**
   * Resets the tree filter and refocuses the search box
   */
  resetTreeFilter () {
    this.treeFilter = ""
    const treeFilterDOM = this.$refs.treeFilter as unknown as HTMLInputElement

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    treeFilterDOM.focus()
  }

  /****************************************************************/
  // HIERARCHICAL TREE - CONTENT CONSTRUCTION
  /****************************************************************/

  /**
   * Sort the whole tree via alphabetical and custom numeric order
   * @param input Hierartchical tree object to sort
   */
  sortDocuments (input: I_ShortenedDocument[]) {
    input

      // Sort by name
      .sort((a, b) => a.label.localeCompare(b.label))

      // Sort by custom order
      .sort((a, b) => {
        const order1 = a.extraFields.find(e => e.id === "order")?.value
        const order2 = b.extraFields.find(e => e.id === "order")?.value

        if (order1 > order2) {
          return 1
        }
        if (order1 < order2) {
          return -1
        }

        return 0
      })

    // Put the number value on top of the list and alphabetical below them
    input = [
      ...input.filter(e => e.extraFields.find(e => e.id === "order")?.value),
      ...input.filter(e => !e.extraFields.find(e => e.id === "order")?.value)
    ]

    input.forEach((e, i) => {
      // Run recursive if the node has any children
      if (e.children.length > 0) {
        input[i].children = this.sortDocuments(input[i].children)
      }
    })

    return input
  }

  /**
   * Builds proper hiearachy for flat array of documents
   * @param input Non-hierarchical tree to build the hiearachy out of
   */
  buildTreeHierarchy (input: I_ShortenedDocument[]) {
    const map: number[] = []
    let node
    const roots = []
    let i

    for (i = 0; i < input.length; i += 1) {
      // Initialize the map
      map[input[i]._id] = i
    }

    for (i = 0; i < input.length; i += 1) {
      node = input[i]
      if (node.parentDoc !== false) {
      // If there are any dangling branches check that map[node.parentDoc] exists
        if (input[map[node.parentDoc]]) {
          input[map[node.parentDoc]].children.push(node)
        }
        else {
          roots.push(node)
        }
      }
      else {
        roots.push(node)
      }
    }

    const sortedRoots = this.sortDocuments(roots)

    return sortedRoots
  }

  /**
   * Builds a brand new sparkling hearchy tree out of available data
   */
  async buildCurrentObjectTree () {
    const allBlueprings = this.SGET_allBlueprints
    const treeObject: any[] = []
    let allTreeDocuments: I_ShortenedDocument[] = []

    // Process all documents, build hieararchy out of the and sort them via name and custom order
    for (const blueprint of allBlueprings) {
      const CurrentObjectDB = new PouchDB(blueprint._id)

      const allDocuments = await CurrentObjectDB.allDocs({ include_docs: true })

      const allDocumentsRows = allDocuments.rows
        .map((singleDocument) => {
          const doc = singleDocument.doc as unknown as I_ShortenedDocument

          const parentDocID = doc.extraFields.find(e => e.id === "parentDoc")?.value.value as unknown as {_id: string}
          const color = doc.extraFields.find(e => e.id === "documentColor")?.value as unknown as string
          const isCategory = doc.extraFields.find(e => e.id === "categorySwitch")?.value as unknown as string

          return {
            label: doc.extraFields.find(e => e.id === "name")?.value,
            icon: (isCategory) ? "fas fa-folder-open" : doc.icon,
            isCategory: !!(isCategory),
            sticker: doc.extraFields.find(e => e.id === "order")?.value,
            parentDoc: (parentDocID) ? parentDocID._id : false,
            handler: this.openExistingDocumentRoute,
            expandable: true,
            color: color,
            type: doc.type,
            children: [],
            hasEdits: false,
            isNew: false,
            url: doc.url,
            extraFields: (doc?.extraFields) || [],
            _id: singleDocument.id,
            key: singleDocument.id
          } as I_ShortenedDocument
        })

      const documentCount = allDocumentsRows.filter(e => !e.isCategory).length
      const categoryCount = allDocumentsRows.filter(e => e.isCategory).length
      const allCount = allDocumentsRows.length

      const listCopy: I_ShortenedDocument[] = extend(true, [], allDocumentsRows)
      allTreeDocuments = [...allTreeDocuments, ...listCopy]

      const hierarchicalTreeContent = this.buildTreeHierarchy(allDocumentsRows)

      const treeRow = {
        label: blueprint.namePlural,
        icon: blueprint.icon,
        order: blueprint.order,
        _id: blueprint._id,
        key: blueprint._id,
        handler: this.addNewObjectRoute,
        specialLabel: blueprint.nameSingular.toLowerCase(),
        isRoot: true,
        allCount: allCount,
        documentCount: documentCount,
        categoryCount: categoryCount,
        children: [
          ...hierarchicalTreeContent,
          {
            label: `Add new ${blueprint.nameSingular.toLowerCase()}`,
            icon: "mdi-plus",
            handler: this.addNewObjectRoute,
            children: false,
            key: `${blueprint._id}_add`,
            _id: blueprint._id,
            specialLabel: blueprint.nameSingular.toLowerCase()

          }
        ]
      }

      treeObject.push(treeRow)
    }

    // Sort the top level of the blueprints
    treeObject.sort((a, b) => {
      if (a.order < b.order) {
        return 1
      }

      if (a.order > b.order) {
        return -1
      }
      return 0
    })

    const tagList = await tagListBuildFromBlueprints(this.SGET_allBlueprints)

    tagList.forEach((tag: string) => {
      const tagDocs = allTreeDocuments
        .filter(doc => {
          const docTags = doc.extraFields.find(e => e.id === "tags")?.value as unknown as string[]
          return (docTags && docTags.includes(tag))
        })
        .map((doc:I_ShortenedDocument) => {
          // @ts-ignore
          doc.key = `${tag}${doc._id}`
          // @ts-ignore
          doc.isTag = true
          return doc
        })
        .sort((a, b) => a.label.localeCompare(b.label))

      const documentCount = tagDocs.filter(e => !e.isCategory).length
      const categoryCount = tagDocs.filter(e => e.isCategory).length
      const allCount = tagDocs.length

      const tagObject = {
        label: `${tag}`,
        icon: "mdi-tag",
        _id: `tag-${tag}`,
        key: `tag-${tag}`,
        allCount: allCount,
        documentCount: documentCount,
        categoryCount: categoryCount,
        isRoot: true,
        isTag: true,
        children: tagDocs
      }
      treeObject.push(tagObject)
    })

    // Assign the finished object to the render model
    this.hierarchicalTree = treeObject
  }

  processNodeNewDocumentButton (node: {
    key: string
    _id: string
    children: []
    type: string
    isRoot: boolean
    specialLabel: string|boolean
  }) {
    // If this is top level blueprint
    if (node.isRoot) {
      // @ts-ignore
      this.addNewObjectRoute(node)
    }
    // If this is a custom document
    else {
      const routeObject = {
        _id: node.type,
        parent: node._id
      }
      // @ts-ignore
      this.addNewObjectRoute(routeObject)
    }
  }

  buildTreeExpands (newDocs: I_OpenedDocument[]) {
    const expandIDs: string[] = []

    // Check for parent changes
    newDocs.forEach(s => {
      const oldParentDoc = this.lastDocsSnapShot.find(doc => doc._id === s._id)
      // Fizzle if the parent doesn't exist in the old version
      if (!oldParentDoc) {
        return false
      }

      const oldParentDocField = this.retrieveFieldValue(oldParentDoc, "parentDoc")
      // @ts-ignore
      const oldParentDocID = (oldParentDocField?.value) ? oldParentDocField.value.value : ""

      const newParentDocField = this.retrieveFieldValue(s, "parentDoc")

      // @ts-ignore
      const newParentDocID = (newParentDocField?.value) ? newParentDocField.value.value : ""
      if ((newParentDocID !== oldParentDocID) || (newParentDocID && oldParentDoc.isNew)) {
        expandIDs.push(newParentDocID)
      }
    })

    // Process top level documents
    newDocs.forEach(s => {
      const newParentDocField = this.retrieveFieldValue(s, "parentDoc")

      // @ts-ignore
      const newParentDocID = (newParentDocField?.value) ? newParentDocField.value.value : false

      if (!newParentDocID) {
        expandIDs.push(s.type)
      }
    })

    expandIDs.forEach(s => {
      this.recursivelyExpandNode(s)
    })
  }

  recursivelyExpandNode (nodeID: string) {
    const treeDOM = this.$refs.tree as unknown as {
      setExpanded: (key:string, state: boolean)=> void
      getNodeByKey: (key:string)=> void
    }

    // @ts-ignore
    this.expandedTreeNodes = [...new Set([
      ...this.expandedTreeNodes,
      nodeID
    ])]

    const currentTreeNode = (treeDOM.getNodeByKey(nodeID)) as unknown as {parentDoc: string, type: string}

    // Dig into the upper hierarchy
    if (currentTreeNode?.parentDoc) {
      this.recursivelyExpandNode(currentTreeNode.parentDoc)
    }
    // If we are at the top of the tree, expand the top category
    else if (currentTreeNode?.type) {
      // @ts-ignore
      this.expandedTreeNodes = [...new Set([
        ...this.expandedTreeNodes,
        currentTreeNode.type
      ])]
    }
  }

  processNodeLabelMiddleClick (node: {
    key: string
    _id: string
    children: []
    type: string
    isRoot: boolean
    isTag: boolean
    specialLabel: string|boolean
  }) {
    if (node.isRoot && node.isTag) {
      return
    }

    if (!node.specialLabel && !node.isRoot) {
      // @ts-ignore
      this.openExistingDocumentRoute(node)
    }
    else {
      this.addNewObjectRoute(node)
    }
  }

  processNodeClick (node: {
    key: string
    children: []
    specialLabel: string|boolean
  }) {
    // If this is a category or has children
    if (node.children.length > 0) {
      this.expandeCollapseNode(node)
    }
    // If this lacks a "special label" - AKA anything that isn't the "Add new XY" node
    else if (!node.specialLabel) {
      // @ts-ignore
      this.openExistingDocumentRoute(node)
    }
    // If this lacks a "special label" - AKA if this is the "Add new XY" node
    else {
      // @ts-ignore
      this.addNewObjectRoute(node)
    }
  }

  expandeCollapseNode (node: {key: string}) {
    const treeDOM = this.$refs.tree as unknown as {
      setExpanded: (key:string, state: boolean)=> void,
      isExpanded: (key:string)=> boolean
    }

    const isExpanded = treeDOM.isExpanded(node.key)
    treeDOM.setExpanded(node.key, !isExpanded)
  }

  determineNodeColor (node: {color: string, isTag: boolean, isRoot: boolean}) {
    // @ts-ignore
    return (node?.isTag && node?.isRoot) ? colors.getBrand("primary") : node.color
  }
}
</script>

<style lang="scss">

.projectTitle {
  margin: 0 0 -5px 0;
  padding: 65px 10px 0;
}

.objectTree {
  > .q-tree__node {
    padding-left: 0 !important;
  }

  .q-tree__children {
    padding-left: 5px;
  }

  .q-tree__arrow {
    margin-right: 0;
    padding: 4px 4px 4px 0;
    position: absolute;
    pointer-events: none;
  }

  .q-tree__node {
    padding: 0 0 0 22px;
  }

  .q-tree__node-header {
    padding: 0;

    &:focus {
      > .q-focus-helper {
        opacity: 0 !important;
      }
    }

    &:hover {
      > .q-focus-helper {
        opacity: 0.15 !important;
      }
    }

    &.q-tree__node--selected {
      > .q-focus-helper {
        opacity: 0.22 !important;
      }
    }
  }

  .documentLabel {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 4px 4px 4px 25px;
    align-items: center;
  }

  .treeButtonGroup {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    height: fit-content;
    margin-left: auto;
    align-self: center;
  }
}

.treeBadge {
  left: inherit;
  right: calc(100% + 3px);
  padding: 3px 2px;
  border: none;
  background: rgba($primary, 0.15);
  top: 50%;
  transform: translateY(-50%);
  min-width: 24px;
  justify-content: center;

  &.noChilden {
    right: calc(100% + 3px);
  }
}

.treeSearchWrapper {
  top: -40px;
  left: -375px;
  width: 375px;
  z-index: 555;
  background-color: $dark;

  > div {
    width: 100%;
  }

  label {
    background-color: $dark;

    &.q-field--focused {
      width: 100vw;
      max-width: inherit;
    }
  }
}

.treeButton {
  &--add {
    .q-icon {
      font-size: 20px;
      color: $primary;
    }
  }

  &--edit {
    .q-icon {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
