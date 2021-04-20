import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const locationsBlueprint: I_Blueprint = {
  _id: "locations",
  order: 17,
  namePlural: "Locations/Geography",
  nameSingular: "Location/Geography",
  icon: "mdi-map-marker-radius",
  extraFields: [
    {
      id: "breakDocumentSettings",
      name: "Document settings",
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
      id: "documentColor",
      name: "Text color",
      type: "colorPicker",
      icon: "mdi-eyedropper",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show on the icon and name of the document both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
    },
    {
      id: "documentBackgroundColor",
      name: "Background color",
      type: "colorPicker",
      icon: "mdi-format-color-fill",
      tooltip:
        `This field allows for custom-coloring your document to any available HEX or RBG color.
        <br>The selected color will show as a background both in the hierarchical tree on the left and in the top tabs.
        `,
      sizing: 2
    },
    {
      id: "finishedSwitch",
      name: "Is finished",
      type: "switch",
      icon: "mdi-check-bold",
      tooltip:
        `This setting allows for setting the current document to finished document mode.
        <br>
        A document with finished document mode toggled on will not show any un-filled fields in view mode and will function as if "Hide empty fields" was turned on in the settings.      
        `,
      sizing: 2
    },
    {
      id: "minorSwitch",
      name: "Is a minor document",
      type: "switch",
      icon: "mdi-magnify-minus-outline",
      tooltip:
        `This setting allows for setting the current document to minor document mode.
        <br>
        A document with minor document mode toggled on will not show in any other relationship searches.<br>
        The idea behind this setting is to allow for creation of documents that will not clutter the search, but could be theoretically relevant in some very specific cases to the story (eg: distant relatives of a character).
        `,
      sizing: 3
    },
    {
      id: "deadSwitch",
      name: "Is Dead/Gone/Destroyed",
      type: "switch",
      icon: "mdi-skull-crossbones",
      tooltip:
        `This setting allows for setting the current document to dead/gone/destroyed mode.
        <br>
        A document with dead/gone/destroyed mode toggled on will have a crossed-over text modifier applied to it - showing that it is no longer a part of the current timeline.
        `,
      sizing: 3
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
      sizing: 3
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
      sizing: 3
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
      id: "categoryDescription",
      name: "Category description",
      type: "wysiwyg",
      icon: "mdi-folder-edit-outline",
      sizing: 12
    },
    {
      id: "breakBasic",
      name: "Basic information",
      type: "break",
      sizing: 12
    },
    {
      id: "otherNames",
      name: "Other Names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 3
    },
    {
      id: "connectedLocations",
      name: "Connected Locations",
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
        "Galaxy",
        "Landmark",
        "Landmass",
        "Moon",
        "Mountain",
        "Planet",
        "Planetary System",
        "Star System",
        "Structure",
        "Terrain formation",
        "Town",
        "Universe",
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
      name: "Local Languages",
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
      name: "Local Currencies",
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
      name: "Unusual features/Traits",
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
      name: "Other connected Characters",
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
      name: "Local Species/Races/Flora/Faunas",
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
      name: "Governing Ideologies/Political groups",
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
      name: "Connected Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedLocations"
      }
    },
    {
      id: "governOther",
      name: "Governing Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "governLocations"
      }
    },
    {
      id: "connectedOther",
      name: "Connected Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "connectedLocations"
      }
    },

    {
      id: "governReligious",
      name: "Governing Religious groups",
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
      name: "Connected Religious groups",
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
      name: "Governing Magical groups",
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
      name: "Connected Magical groups",
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
      name: "Governing Technological/Scientific groups",
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
      name: "Connected Technological/Scientific groups",
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
      name: "Connected to Events",
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
      name: "Connected to Myths, legends and stories",
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
      name: "Connected to Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedLocations"
      }
    },
    {
      id: "breakNotes",
      name: "Notes",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedNotes",
      name: "Connected to Lore notes/Other notes",
      type: "manyToManyRelationship",
      icon: "mdi-script-text-outline",
      sizing: 12,
      relationshipSettings: {
        connectedObjectType: "loreNotes",
        connectedField: "pairedConnectedLocation"
      }
    }

  ]
}
