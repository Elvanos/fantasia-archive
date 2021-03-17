import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const locationsBlueprint: I_Blueprint = {
  _id: "locations",
  order: 17,
  namePlural: "Locations",
  nameSingular: "Location",
  icon: "mdi-map-marker-radius",
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
      icon: "mdi-map-marker-radius",
      sizing: 3
    },
    {
      id: "documentColor",
      name: "Text Color",
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
        connectedObjectType: "locations"
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
      id: "tags",
      name: "Tags",
      type: "tags",
      icon: "mdi-tag",
      tooltip:
        `Tags are used to sort the same (or even different) document types into a custom groups based on your needs.
        <br>
        A document may have any number of tags, but each tag can be present only once.
        <br>
        This limitation also applies to any variation of lower or upper case iterations of the same tag.
        <br>
        Example: A tag called "Player Party" will be considered the same tag as "player party", "PlAyER PaRtY" or anything similar.
        `,
      sizing: 12
    },
    {
      id: "otherNames",
      name: "Other names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 3
    },
    {
      id: "connectedLocations",
      name: "Connected locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "locationType",
      name: "Location type",
      type: "singleSelect",
      icon: "fas fa-monument",
      sizing: 2,
      predefinedSelectValues: [
        "Area",
        "Body of water",
        "Building",
        "City",
        "Continent",
        "Forest",
        "Landmark",
        "Landmass",
        "Mountain",
        "Terrain formation",
        "Town",
        "Village",
        "Other",
        "Unique"
      ]
    },
    {
      id: "population",
      name: "Population",
      type: "text",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "size",
      name: "Size",
      type: "text",
      icon: "mdi-map",
      sizing: 2
    },
    {
      id: "pairedLanguages",
      name: "Local languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "pairedLocations"
      }
    },
    {
      id: "pairedCurrencies",
      name: "Local currencies",
      type: "manyToManyRelationship",
      icon: "fas fa-coins",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "currencies",
        connectedField: "pairedLocations"
      }
    },
    {
      id: "traits",
      name: "Unusual features/traits",
      type: "list",
      icon: "mdi-guy-fawkes-mask",
      sizing: 4
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
      id: "breakResident",
      name: "Resident information",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedOriginCharacters",
      name: "Characters originated from location",
      type: "manyToSingleRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedOriginLocation"
      }
    },
    {
      id: "pairedCurrentCharacters",
      name: "Characters currently living in location",
      type: "manyToSingleRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedCurrentLocation"
      }
    },
    {
      id: "pairedDemiseCharacters",
      name: "Characters deceased at the location",
      type: "manyToSingleRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedDemiseLocation"
      }
    },
    {
      id: "pairedConnectedCharacter",
      name: "Other connected characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedConnectedPlaces"
      }
    },
    {
      id: "pairedConnectedRaces",
      name: "Local races and species",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedConnectedPlaces"
      }
    },
    {
      id: "breakGroups",
      name: "Involved groups",
      type: "break",
      sizing: 12
    },
    {
      id: "governPolitical",
      name: "Governing political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "governLocations"
      }
    },
    {
      id: "connectedPolitical",
      name: "Connected political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "governReligious",
      name: "Governing religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "governLocations"
      }
    },
    {
      id: "connectedReligious",
      name: "Connected religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "governMagical",
      name: "Governing magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "governLocations"
      }
    },
    {
      id: "connectedMagical",
      name: "Connected magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "governTech",
      name: "Governing tech/scientific groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "governLocations"
      }
    },
    {
      id: "connectedTech",
      name: "Connected tech/scientific groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "breakOther",
      name: "Other details",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedEvent",
      name: "Connected to events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedLocations"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to myths, legends and stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedLocations"
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
        connectedField: "pairedConnectedLocations"
      }
    }

  ]
}
