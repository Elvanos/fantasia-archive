import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const religionsBlueprint: I_Blueprint = {
  _id: "religions",
  order: 14,
  namePlural: "Religions/Teachings",
  nameSingular: "Religion/Teaching",
  icon: "fas fa-ankh",
  extraFields: [
    {
      id: "breakBasic",
      name: "Basic information",
      type: "break",
      sizing: 12
    },
    {
      id: "name",
      name: "Name",
      type: "text",
      icon: "fas fa-ankh",
      sizing: 3
    },
    {
      id: "documentColor",
      name: "Color",
      type: "colorPicker",
      icon: "mdi-eyedropper",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show on the icon and name of the document both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      tooltip:
        `This field is used to build up custom hierarchical tree structure in the main list of items in the left side of the app.
        <br> You can use this for an infinite amount of sub-levels to the hierarchical structure.
        <br> An example would be multiple sub-groups (provinces) of Roman Empire belonging under the main political group called "Roman Empire".
        `,
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "religions"
      }
    },
    {
      id: "order",
      name: "Order number",
      type: "number",
      icon: "mdi-file-tree",
      tooltip:
        `In case the default sorting via alphabet in the hierarchical tree on the left is inadequite for your needs, this field allows you to fill custom numbers to order by that get placed before the default alphabetical order.
        <br>It is heavily suggested to "pad-out" the custom order numbers by writing for example 100 (or least 10) instead of 1.
        <br>This allows for extra "padding" between the items in case a new one needs to be added in the middle without needing to redo the custom order on all documents.
        `,
      sizing: 2
    },
    {
      id: "categorySwitch",
      name: "Is a category",
      type: "switch",
      icon: "fas fa-folder-open",
      tooltip:
        `This setting allows for setting the current document to category mode.
        <br>
        A document with category mode toggled on will have most of its fields hidden and will not show in any other relationship searches except for "Belongs under".
        `,
      sizing: 2
    },
    {
      id: "otherNames",
      name: "Other names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 6
    },
    {
      id: "headquarters",
      name: "Headquarters",
      type: "singleToNoneRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations"
      }
    },
    {
      id: "followers",
      name: "Follower amount",
      type: "text",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "leaders",
      name: "Leading figures",
      type: "manyToNoneRelationship",
      icon: "mdi-crown",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters"
      }
    },
    {
      id: "formReligion",
      name: "Form of religion",
      type: "multiSelect",
      icon: "fas fa-yin-yang",
      sizing: 3,
      predefinedSelectValues: [
        "Cult",
        "Free-form faith",
        "Individual teaching",
        "Official teaching",
        "Organized faith",
        "Sect",
        "Other"
      ]
    },
    {
      id: "typeReligion",
      name: "Type of religion",
      type: "multiSelect",
      icon: "fas fa-sun",
      sizing: 3,
      predefinedSelectValues: [
        "Ancestor worship",
        "Animism",
        "Atheism",
        "Monotheism",
        "Naturalism",
        "Polytheism",
        "Spritism",
        "Totemism",
        "Virtue teaching",
        "Other"
      ]
    },
    {
      id: "localLanguages",
      name: "Used languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedInReligiousGroups"
      }
    },
    {
      id: "connectedRaces",
      name: "Common species/races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "commonInReligiousGroups"
      }
    },
    {
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "traditions",
      name: "Traditions & Customs",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakRelasionships",
      name: "Diplomatic relationships & Influences",
      type: "break",
      sizing: 12
    },
    {
      id: "governLocations",
      name: "Ruled/Influenced locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "governReligious"
      }
    },
    {
      id: "collectedLocations",
      name: "Connected locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "connectedReligious"
      }
    },
    {
      id: "pairedBelongingCharacter",
      name: "Prominent members",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedBelongingRelGroup"
      }
    },
    {
      id: "pairedAllyCharacter",
      name: "Prominent allies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedAllyRelGroup"
      }
    },
    {
      id: "pairedEnemyCharacter",
      name: "Prominent enemies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedEnemyRelGroup"
      }
    },
    {
      id: "pairedConnectedPolGroups",
      name: "Connected political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedConnectedReligiousGroups"
      }
    },
    {
      id: "pairedAllyPolGroups",
      name: "Allied political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedAllyReligiousGroups"
      }
    },
    {
      id: "pairedEnemyPolGroups",
      name: "Enemy political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedEnemyReligiousGroups"
      }
    },

    {
      id: "pairedConnectedMagicGroups",
      name: "Connected magical groups/ideologies",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectedReligiousGroups"
      }
    },
    {
      id: "pairedAllyMagicGroups",
      name: "Allied magical groups/ideologies",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedAllyReligiousGroups"
      }
    },
    {
      id: "pairedEnemyMagicGroups",
      name: "Enemy magical groups/ideologies",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedEnemyReligiousGroups"
      }
    },
    {
      id: "pairedConnectedTechGroups",
      name: "Connected scientifical/technological groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedConnectedReligiousGroups"
      }
    },
    {
      id: "pairedAllyTechGroups",
      name: "Allied scientifical/technological groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedAllyReligiousGroups"
      }
    },
    {
      id: "pairedEnemyTechGroups",
      name: "Enemy scientifical/technological groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedEnemyReligiousGroups"
      }
    },
    {
      id: "breakOther",
      name: "Other details",
      type: "break",
      sizing: 12
    },
    {
      id: "connectedEvents",
      name: "Connected events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "connectedReligious"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to myths and legends",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedRelGroups"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected to legendary items/artifacts",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedRelGroups"
      }
    }
  ]
}
