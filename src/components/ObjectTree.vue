<template>

  <span>

    <!-- Delele document dialog -->
    <deleteDocumentCheckDialog
      :dialog-trigger="deleteObjectDialogTrigger"
      :document-id="toDeleteID"
      :document-type="toDeleteType"
      @trigger-dialog-close="deleteObjectDialogClose"
    />

    <div
      class="treeSearchWrapper"
      :class="{'fullWidth': disableDocumentControlBar}"
    >
      <q-input
        ref="treeFilter"
        filled
        dark
        debounce="200"
        v-model="treeFilter"
        label="Filter document tree..."
      >
        <template v-slot:append>
          <q-icon name="mdi-text-search" />
        </template>
        <template v-slot:prepend>
          <q-icon v-if="treeFilter !== ''" name="clear" class="cursor-pointer text-secondary" @click="resetTreeFilter" />
        </template>
      </q-input>
    </div>

    <h6 class="projectTitle text-cultured" v-if="!noProjectName">
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
      :class="{'hasTextShadow': textShadow}"
      :nodes="hierarchicalTree"
      node-key="key"
      no-connectors
      ref="tree"
      dark
      :duration="0"
      :filter="treeFilter"
      :selected.sync="selectedTreeNode"
      :expanded.sync="expandedTreeNodes"
      no-nodes-label="Loading your project..."
      no-results-label="Nothing matches your request"
      >
      <template v-slot:default-header="prop">
        <div
          class="row items-center col-grow documentWrapper"
          :class="{'isMinor': prop.node.isMinor, 'isDeadTree': prop.node.isDead}"
          :style="`background-color: ${prop.node.bgColor};`"
          @click.stop.prevent="processNodeClick(prop.node)"
          @click.stop.prevent.middle="processNodeLabelMiddleClick(prop.node)"
        >
          <div class="documentLabel"
            :style="`color: ${prop.node.color};`"
           >
          <q-icon
            :style="`color: ${determineNodeColor(prop.node)}; width: 22px !important;`"
            :size="(prop.node.icon.includes('fas')? '16px': '21px')"
            :name="prop.node.icon"
            class="q-mr-sm self-center" />
            <span v-if="prop.node.isDead" class="documentLabel__isDeadMarker">†</span>
            <span :class="{'documentLabel__content': !hideDeadCrossThrough}">
              {{ prop.node.label }}
            </span>

            <span
              class="text-grey-5 text-weight-medium q-ml-xs"
              v-if="(prop.node.isRoot || prop.node.isTag) && !disableDocumentCounts">
                <span v-html="determineCategoryString(prop.node)"/>
                <q-tooltip
                  :delay="500"
                >
                Document & Categories count: <span class="text-bold text-satin-sheen-gold-dark">{{prop.node.allCount}}</span>
                <br>
                Document count: <span class="text-bold text-satin-sheen-gold-dark">{{prop.node.documentCount}}</span>
                <br>
                Category count: <span class="text-bold text-satin-sheen-gold-dark">{{prop.node.categoryCount}}</span>
                </q-tooltip>
              </span>
            <q-badge
              class="treeBadge"
              :class="{'noChilden': prop.node.children.length === 0}"
              v-if="prop.node.sticker && !hideTreeOrderNumbers"
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
                v-if="((prop.node.children && prop.node.children.length > 0) || !hideTreeExtraIcons) && !prop.node.isRoot && !prop.node.isTag && !hideTreeIconView && !prop.node.specialLabel"
                round
                flat
                dense
                color="dark"
                class="z-1 q-ml-sm treeButton treeButton--edit"
                icon="mdi-book-open-page-variant-outline"
                size="10px"
                @click.stop.prevent="openExistingDocumentRoute(prop.node)"
              >
                <q-tooltip
                  :delay="300"
                >
                Open {{ prop.node.label }}
                </q-tooltip>
              </q-btn>
              <q-btn
                tabindex="-1"
                v-if="!prop.node.isRoot && !prop.node.isTag && !hideTreeIconEdit && !prop.node.specialLabel"
                round
                flat
                dense
                color="dark"
                class="z-1 q-ml-sm treeButton treeButton--edit"
                icon="mdi-pencil"
                size="10px"
                @click.stop.prevent="openExistingDocumentRouteWithEdit(prop.node)"
              >
                <q-tooltip
                  :delay="300"
                >
                Edit {{ prop.node.label }}
                </q-tooltip>
              </q-btn>
              <q-btn
                tabindex="-1"
                v-if="!prop.node.specialLabel && !prop.node.isRoot && !prop.node.isTag && !hideTreeIconAddUnder"
                round
                flat
                dense
                color="dark"
                class="z-1 q-ml-sm treeButton treeButton--add"
                icon="mdi-file-tree"
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
            <q-menu
              touch-position
              context-menu
            >

              <q-list class="bg-gunmetal-light text-accent" v-if="!prop.node.isTag">

                <template v-if="prop.node.isRoot || prop.node.children.length > 0">
                  <q-item clickable v-close-popup @click="recursivelyExpandNodeDownwards(prop.node.key)">
                    <q-item-section>Expand all under this node</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-expand-all-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="collapseAllNodesForce(prop.node)">
                    <q-item-section>Collapse all under this node</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-collapse-all-outline" />
                    </q-item-section>
                  </q-item>
                </template>

                <template v-if="prop.node.isRoot">
                  <q-separator dark />
                  <q-item clickable v-close-popup @click="addNewObjectRoute(prop.node)">
                    <q-item-section>Add new document of type: {{prop.node.label}}</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-plus" />
                    </q-item-section>
                  </q-item>
                </template>

                <template v-if="!prop.node.isRoot">
                  <q-separator dark />
                  <q-item clickable v-close-popup @click="copyName(prop.node)">
                    <q-item-section>Copy name</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-text-recognition" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="copyTextColor(prop.node)">
                    <q-item-section>Copy text color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-eyedropper" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="copyBackgroundColor(prop.node)">
                    <q-item-section>Copy background color</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-format-color-fill" />
                    </q-item-section>
                  </q-item>
                  <q-separator dark />
                    <q-item clickable v-close-popup @click="openExistingDocumentRoute(prop.node)">
                    <q-item-section>Open document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-page-variant-outline" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openExistingDocumentRouteWithEdit(prop.node)">
                    <q-item-section>Edit document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addNewUnderParent(prop.node)">
                    <q-item-section>Create new document with this document as parent</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-file-tree" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="copyTargetDocument(prop.node)">
                    <q-item-section>Copy this document</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="mdi-content-copy" />
                    </q-item-section>
                  </q-item>
                  <q-separator dark />
                  <q-item clickable v-close-popup @click="deleteTabDocument(prop.node)">
                    <q-item-section class="text-secondary"><b>Delete this document</b></q-item-section>
                    <q-item-section avatar class="text-secondary">
                      <q-icon name="mdi-text-box-remove-outline" />
                    </q-item-section>
                  </q-item>
                </template>

              </q-list>

            </q-menu>
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
import deleteDocumentCheckDialog from "src/components/dialogs/DeleteDocumentCheck.vue"

import { extend, colors } from "quasar"
import { tagListBuildFromBlueprints } from "src/scripts/utilities/tagListBuilder"
import { retrieveCurrentProjectName } from "src/scripts/projectManagement/projectManagent"
import { createNewWithParent } from "src/scripts/documentActions/createNewWithParent"
import { copyDocumentName, copyDocumentTextColor, copyDocumentBackgroundColor } from "src/scripts/documentActions/uniqueFieldCopy"
import { copyDocument } from "src/scripts/documentActions/copyDocument"

@Component({
  components: { deleteDocumentCheckDialog }
})
export default class ObjectTree extends BaseClass {
  /****************************************************************/
  // KEYBINDS MANAGEMENT
  /****************************************************************/
  @Watch("SGET_getCurrentKeyBindData", { deep: true })
  processKeyPush () {
    // Focus left tree search
    if (this.determineKeyBind("focusHierarchicalTree") && !this.SGET_getDialogsState) {
      const treeFilterDOM = this.$refs.treeFilter as unknown as HTMLInputElement
      treeFilterDOM.focus()
    }

    // Clear input in the left tree search
    if (this.determineKeyBind("clearInputHierarchicalTree") && !this.SGET_getDialogsState) {
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

    // Unfuck the rendering by giving the app some time to load first
    await this.$nextTick()
  }

  tagsAtTop = false
  compactTags = false
  noTags = false
  noProjectName = false
  invertTreeSorting = false
  doNotcollaseTreeOptions = false
  disableDocumentControlBar = false
  textShadow = false
  disableDocumentCounts = false
  compactDocumentCount = false
  invertCategoryPosition = false
  doubleDashDocCount = false
  hideDeadCrossThrough = false
  hideTreeOrderNumbers = false
  hideTreeExtraIcons = false
  hideTreeIconAddUnder = false
  hideTreeIconEdit = false
  hideTreeIconView = false

  @Watch("SGET_options", { immediate: true, deep: true })
  onSettingsChange () {
    const options = this.SGET_options
    this.tagsAtTop = options.tagsAtTop
    this.compactTags = options.compactTags
    this.noTags = options.noTags
    this.noProjectName = options.noProjectName
    this.invertTreeSorting = options.invertTreeSorting
    this.doNotcollaseTreeOptions = options.doNotcollaseTreeOptions
    this.disableDocumentControlBar = options.disableDocumentControlBar
    this.textShadow = options.textShadow
    this.disableDocumentCounts = options.disableDocumentCounts
    this.compactDocumentCount = options.compactDocumentCount
    this.invertCategoryPosition = options.invertCategoryPosition
    this.doubleDashDocCount = options.doubleDashDocCount
    this.hideDeadCrossThrough = options.hideDeadCrossThrough
    this.hideTreeOrderNumbers = options.hideTreeOrderNumbers
    this.hideTreeExtraIcons = options.hideTreeExtraIcons
    this.hideTreeIconAddUnder = options.hideTreeIconAddUnder
    this.hideTreeIconEdit = options.hideTreeIconEdit
    this.hideTreeIconView = options.hideTreeIconView
    this.buildCurrentObjectTree()
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
  reactToDocumentListChange (val: { treeAction: boolean, docs: I_OpenedDocument[]}) {
    if (val.treeAction) {
      this.buildCurrentObjectTree()
      this.buildTreeExpands(val?.docs)
      this.lastDocsSnapShot = extend(true, [], val.docs)
    }
    else if (val.docs.length !== this.lastDocsSnapShot.length) {
      this.lastDocsSnapShot = extend(true, [], val.docs)
    }
  }

  lastDocsSnapShot:I_OpenedDocument[] = []

  /**
   *
   */
  @Watch("SGET_allDocuments", { deep: true })
  reactToAllDocumentListChange (val: { docs: I_OpenedDocument[]}) {
    if (!this.SGET_allDocumentsFirstRunState) {
      this.buildCurrentObjectTree()
    }
  }

  /**
   *
   */
  @Watch("SGET_allDocumentsFirstRunState")
  reactToFirstRunFinish (val: boolean) {
    if (!val) {
      this.buildCurrentObjectTree()
    }
  }

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
  expandedTreeNodes: string[] = []

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
        let order1 = 0
        let order2 = 0

        if (!this.invertTreeSorting) {
          order1 = a.extraFields.find(e => e.id === "order")?.value
          order2 = b.extraFields.find(e => e.id === "order")?.value
        }
        else {
          order2 = a.extraFields.find(e => e.id === "order")?.value
          order1 = b.extraFields.find(e => e.id === "order")?.value
        }

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
  buildCurrentObjectTree () {
    const allBlueprings = this.SGET_allBlueprints
    let treeObject: any[] = []
    let allTreeDocuments: I_ShortenedDocument[] = []

    // Process all documents, build hieararchy out of the and sort them via name and custom order
    for (const blueprint of allBlueprings) {
      const allDocuments = this.SGET_allDocumentsByType(blueprint._id)
      let allDocumentsRows: I_ShortenedDocument[] = []

      if (allDocuments && allDocuments.docs) {
        allDocumentsRows = allDocuments.docs
          .map((doc) => {
            const parentDocID = doc.extraFields.find(e => e.id === "parentDoc")?.value.value as unknown as {_id: string}
            const color = doc.extraFields.find(e => e.id === "documentColor")?.value as unknown as string
            const bgColor = doc.extraFields.find(e => e.id === "documentBackgroundColor")?.value as unknown as string

            const isCategory = doc.extraFields.find(e => e.id === "categorySwitch")?.value as unknown as boolean
            const isMinor = doc.extraFields.find(e => e.id === "minorSwitch")?.value as unknown as boolean
            const isDead = doc.extraFields.find(e => e.id === "deadSwitch")?.value as unknown as boolean

            return {
              label: doc.extraFields.find(e => e.id === "name")?.value,
              icon: (isCategory) ? "fas fa-folder-open" : doc.icon,
              isCategory: !!(isCategory),
              isMinor: isMinor,
              isDead: isDead,
              sticker: doc.extraFields.find(e => e.id === "order")?.value,
              parentDoc: (parentDocID) ? parentDocID._id : false,
              handler: this.openExistingDocumentRoute,
              expandable: true,
              color: color,
              bgColor: bgColor,
              type: doc.type,
              children: [],
              hasEdits: false,
              isNew: false,
              url: doc.url,
              extraFields: (doc?.extraFields) || [],
              _id: doc._id,
              key: doc._id
            } as I_ShortenedDocument
          })
      }
      const documentCount = allDocumentsRows.filter(e => !e.isCategory).length
      const categoryCount = allDocumentsRows.filter(e => e.isCategory).length
      const allCount = allDocumentsRows.length

      // @ts-ignore
      allTreeDocuments = [...allTreeDocuments, ...extend(true, [], allDocumentsRows)]

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

    if (!this.noTags) {
      const tagList = tagListBuildFromBlueprints(this.SGET_allDocuments.docs)

      let allTags = 0
      let allTagsCategories = 0
      let allTagsDocuments = 0

      let tagNodeList = tagList.map((tag: string) => {
        const tagDocs = allTreeDocuments
          .filter(doc => {
            const docTags = doc.extraFields.find(e => e.id === "tags")?.value as unknown as string[]
            return (docTags && docTags.includes(tag))
          })
          .map((doc:I_ShortenedDocument) => {
          // @ts-ignore
            doc.key = `${tag}${doc._id}`
            // @ts-ignore
            // doc.isTag = true
            return doc
          })
          .sort((a, b) => a.label.localeCompare(b.label))

        const documentCount = tagDocs.filter(e => !e.isCategory).length
        const categoryCount = tagDocs.filter(e => e.isCategory).length
        const allCount = tagDocs.length

        allTags += allCount
        allTagsCategories += categoryCount
        allTagsDocuments += documentCount

        return {
          label: `${tag}`,
          icon: "mdi-tag",
          _id: `tag-${tag}`,
          key: `tag-${tag}`,
          allCount: allCount,
          documentCount: documentCount,
          categoryCount: categoryCount,
          isRoot: true,
          isTag: true,
          children: this.sortDocuments(tagDocs)
        }
      })

      if (this.compactTags && tagNodeList.length > 0) {
        tagNodeList = [
          {
            label: "Tags",
            icon: "mdi-tag",
            _id: "tagsList",
            key: "tagList",
            isRoot: true,
            allCount: allTags,
            documentCount: allTagsDocuments,
            categoryCount: allTagsCategories,
            isTag: true,
            // @ts-ignore
            children: tagNodeList.map(e => {
              e.isRoot = false
              return e
            })
          }
        ]
      }

      if (this.tagsAtTop) {
        treeObject = [...tagNodeList, ...treeObject]
      }
      else {
        treeObject = [...treeObject, ...tagNodeList]
      }
    }

    // Assign the finished object to the render model
    treeObject.forEach(cat => this.recursivelyFreezeChildren(cat.children))
    // @ts-ignore
    this.hierarchicalTree = Object.freeze(treeObject)
  }

  recursivelyFreezeChildren (children: {children: []}) {
    Object.freeze(children)
    if (children.children) {
      // @ts-ignore
      this.recursivelyFreezeChildren(children.children)
    }
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

    let newDocsSnapshot: I_OpenedDocument[] = extend(true, [], newDocs)

    // Check for parent changes
    newDocsSnapshot.forEach((s, index) => {
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
    newDocsSnapshot.forEach(s => {
      const newParentDocField = this.retrieveFieldValue(s, "parentDoc")
      const oldParentDoc = this.lastDocsSnapShot.find(doc => doc._id === s._id)
      // @ts-ignore
      const oldParentDocField = this.retrieveFieldValue(oldParentDoc, "parentDoc")

      // @ts-ignore
      const oldParentDocID = (oldParentDocField?.value) ? oldParentDocField.value.value : false

      // @ts-ignore
      const newParentDocID = (newParentDocField?.value) ? newParentDocField.value.value : false

      if (!newParentDocID && oldParentDocID !== newParentDocID) {
        expandIDs.push(s.type)
      }
    })

    // @ts-ignore
    newDocsSnapshot = null

    expandIDs.forEach(s => {
      this.recursivelyExpandNodeUpwards(s)
    })
  }

  recursivelyExpandNodeUpwards (nodeID: string) {
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
      this.recursivelyExpandNodeUpwards(currentTreeNode.parentDoc)
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

  recursivelyExpandNodeDownwards (nodeID: string) {
    const treeDOM = this.$refs.tree as unknown as {
      setExpanded: (key:string, state: boolean)=> void
      getNodeByKey: (key:string)=> void
    }

    // @ts-ignore
    this.expandedTreeNodes = [...new Set([
      ...this.expandedTreeNodes,
      nodeID
    ])]

    const currentTreeNode = (treeDOM.getNodeByKey(nodeID)) as unknown as {children: any[], type: string}

    // Dig into the upper hierarchy
    if (currentTreeNode?.children && currentTreeNode?.children.length > 0) {
      for (const child of currentTreeNode.children) {
        this.recursivelyExpandNodeDownwards(child.key)
      }
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

  expandeCollapseNode (node: {key: string, children: []}) {
    const treeDOM = this.$refs.tree as unknown as {
      setExpanded: (key:string, state: boolean)=> void,
      isExpanded: (key:string)=> boolean
    }

    const isExpanded = treeDOM.isExpanded(node.key)

    if (isExpanded) {
      this.collapseAllNodes(node)
    }
    else {
      treeDOM.setExpanded(node.key, true)
    }
  }

  determineNodeColor (node: {color: string, isTag: boolean, isRoot: boolean}) {
    // @ts-ignore
    return (node?.isTag) ? colors.getBrand("primary") : node.color
  }

  collapseAllNodes (node: {key: string, children: []}) {
    if (node.children && !this.doNotcollaseTreeOptions) {
      for (const child of node.children) {
        if (this.expandedTreeNodes.includes(node.key)) {
          this.collapseAllNodes(child)
        }
      }
    }
    if (this.expandedTreeNodes.includes(node.key)) {
      this.expandedTreeNodes = this.expandedTreeNodes.filter(n => n !== node.key)
    }
  }

  collapseAllNodesForce (node: {key: string, children: []}) {
    if (node.children) {
      for (const child of node.children) {
        if (this.expandedTreeNodes.includes(node.key)) {
          this.collapseAllNodesForce(child)
        }
      }
    }
    if (this.expandedTreeNodes.includes(node.key)) {
      this.expandedTreeNodes = this.expandedTreeNodes.filter(n => n !== node.key)
    }
  }

  determineCategoryString (node: {
    documentCount: string
    categoryCount: string
  }) {
    let extraDivider = ""
    if (this.doubleDashDocCount) {
      extraDivider = "|"
    }

    if (this.compactDocumentCount) {
      return `(<span class="docCount">${node.documentCount}</span>)`
    }
    if (this.invertCategoryPosition) {
      return `(<span class="catCount">${node.categoryCount}</span>&nbsp;|${extraDivider}&nbsp;<span class="docCount">${node.documentCount}</span>)`
    }
    else {
      return `(<span class="docCount">${node.documentCount}</span>&nbsp;|${extraDivider}&nbsp;<span class="catCount">${node.categoryCount}</span>)`
    }
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

  /****************************************************************/
  // Document copy
  /****************************************************************/

  documentPass = null as unknown as I_OpenedDocument

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

  /****************************************************************/
  // Add new document under parent
  /****************************************************************/
  addNewUnderParent (currentDoc: I_OpenedDocument) {
    createNewWithParent(currentDoc, this)
  }

  /****************************************************************/
  // Delete dialog
  /****************************************************************/

  deleteObjectDialogTrigger: string | false = false
  deleteObjectDialogClose () {
    this.deleteObjectDialogTrigger = false
  }

  deleteObjectAssignUID () {
    this.deleteObjectDialogTrigger = this.generateUID()
  }

  toDeleteID = ""
  toDeleteType = ""

  deleteTabDocument (targetDocument: I_OpenedDocument) {
    this.toDeleteID = targetDocument._id
    this.toDeleteType = targetDocument.type
    this.deleteObjectAssignUID()
  }
}
</script>

<style lang="scss">

.projectTitle {
  margin: 0 0 -5px 0;
  padding: 10px 10px 0;
}

.objectTree {
  &.hasTextShadow {
    .documentLabel {
      font-weight: 500;
      $shadowColorOutline: #000;
      $shadowColorSurround: #000;

      filter: drop-shadow(0 0 4px #000);
      text-shadow:
        -2px -2px 0 $shadowColorSurround,
        2px -2px 0 $shadowColorSurround,
        -2px 2px 0 $shadowColorSurround,
        2px 2px 0 $shadowColorSurround,
        -1px -1px 0 $shadowColorOutline,
        1px -1px 0 $shadowColorOutline,
        -1px 1px 0 $shadowColorOutline,
        1px 1px 0 $shadowColorOutline;
    }
  }

  .catCount {
    color: var(--q-color-accent);
  }

  .docCount {
    color: var(--q-color-primary);
  }

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

  .documentWrapper {
    border-radius: 3px;

    &.isMinor {
      filter: grayscale(100) brightness(0.7);
    }

    &.isDeadTree {
      .documentLabel__content {
        text-decoration: line-through;
        text-decoration-color: #fff;
      }

      .documentLabel__isDeadMarker {
        margin-right: 5px;
        font-weight: 600;
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
  top: -55px;
  left: 0;
  position: fixed;
  width: 375px;
  z-index: 555;
  background-color: $dark;

  &.fullWidth {
    width: 100%;
  }

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

body.body--dark {
  .objectTree {
    .documentLabel {
      color: #dcdcdc;
    }
  }

  .projectTitle {
    color: #dcdcdc;
  }
}
</style>
