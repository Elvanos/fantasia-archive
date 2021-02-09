import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const racesBlueprint: I_Blueprint = {
  _id: "races",
  order: 11,
  namePlural: "Species/Races",
  nameSingular: "Species/Race",
  icon: "fas fa-dragon",
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
      icon: "fas fa-dragon",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races"
      }
    },
    {
      id: "order",
      name: "Order number",
      type: "number",
      icon: "mdi-file-tree",
      sizing: 2
    },
    {
      id: "otherNames",
      name: "Other names",
      type: "list",
      icon: "mdi-book-plus",
      sizing: 6
    },
    {
      id: "relatedRaces",
      name: "Related races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "relatedRaces"
      }
    },
    {
      id: "memberCount",
      name: "Estimated population",
      type: "text",
      icon: "mdi-account-group",
      sizing: 2
    },
    {
      id: "age",
      name: "Average lifespan",
      type: "text",
      icon: "mdi-timer-sand",
      sizing: 2
    },
    {
      id: "height",
      name: "Average height",
      type: "text",
      icon: "mdi-human-male-height-variant",
      sizing: 2
    },
    {
      id: "weight",
      name: "Average weight",
      type: "text",
      icon: "mdi-weight",
      sizing: 2
    },
    {
      id: "beingType",
      name: "Type of being",
      type: "multiSelect",
      icon: "fas fa-paw",
      sizing: 3,
      predefinedSelectValues: [
        "Animal",
        "Mammal",
        "Bird",
        "Reptile",
        "Amphibian",
        "Fish",
        "Insect",
        "Plant",
        "Mushroom",
        "Lichen",
        "Bacteria",
        "Virus",
        "Elemental",
        "Sprititual",
        "Atrificial",
        "Other"
      ]
    },
    {
      id: "sentience",
      name: "Level of sentience",
      type: "multiSelect",
      icon: "fas fa-brain",
      sizing: 3,
      predefinedSelectValues: [
        "Ascended",
        "Sentient",
        "Half-sentient",
        "Non-sentient",
        "Hivemind",
        "Other"
      ]
    },
    {
      id: "strength",
      name: "Strength",
      type: "text",
      icon: "fas fa-dumbbell",
      sizing: 2
    },
    {
      id: "constitution",
      name: "Constitution",
      type: "text",
      icon: "mdi-shield",
      sizing: 2
    },
    {
      id: "dexterity",
      name: "Dexterity",
      type: "text",
      icon: "mdi-run-fast",
      sizing: 2
    },
    {
      id: "intellect",
      name: "Intellect",
      type: "text",
      icon: "mdi-brain",
      sizing: 2
    },
    {
      id: "wisdom",
      name: "Wisdom/Willpower",
      type: "text",
      icon: "fas fa-yin-yang",
      sizing: 2
    },
    {
      id: "charisma",
      name: "Charisma",
      type: "text",
      icon: "mdi-drama-masks",
      sizing: 2
    },
    {
      id: "traits",
      name: "Defining features/traits",
      type: "list",
      icon: "fas fa-dragon",
      sizing: 12
    },
    {
      id: "strengths",
      name: "Strengths",
      type: "list",
      icon: "fas fa-plus-square",
      sizing: 6,
      predefinedListExtras: {
        affix: "Impact",
        extraSelectValueList: [
          "Barely noticeable",
          "Minor",
          "Medium",
          "Strong",
          "Powerful",
          "Overwhelming"
        ]
      }
    },
    {
      id: "weaknesses",
      name: "Weaknesses",
      type: "list",
      icon: "fas fa-minus-square",
      sizing: 6,
      predefinedListExtras: {
        affix: "Severity",
        extraSelectValueList: [
          "Barely noticeable",
          "Minor",
          "Medium",
          "Severe",
          "Impacitating",
          "Deadly"
        ]
      }
    },
    {
      id: "commonNames",
      name: "Common names",
      type: "list",
      icon: "fas fa-signature",
      sizing: 6,
      predefinedListExtras: {
        affix: "Normally used for",
        extraSelectValueList: [
          "Male",
          "Female",
          "Child",
          "Honorary",
          "Other"
        ]
      }
    },
    {
      id: "commonFamilyNames",
      name: "Common family/clan names",
      type: "list",
      icon: "mdi-family-tree",
      sizing: 6,
      predefinedListExtras: {
        affix: "Note",
        extraSelectValueList: [
        ]
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
      name: "Race members & other connections",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedCharacter",
      name: "Characters of race",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedRace"
      }
    },
    {
      id: "pairedConnectedPlaces",
      name: "Inhabited locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "localCurrencies",
      name: "Commonly used currencies",
      type: "manyToManyRelationship",
      icon: "fas fa-coins",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "currencies",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "localLanguages",
      name: "Commonly spoken languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedByRaces"
      }
    },
    {
      id: "commonInPoliticalGroups",
      name: "Common in political groups/ideologies",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInReligiousGroups",
      name: "Common in religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInMagicGroups",
      name: "Common in magical groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "connectedRaces"
      }
    },
    {
      id: "commonInTechGroups",
      name: "Common in science/technology groups/institutions",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "connectedRaces"
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
      name: "Connected to important events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedRaces"
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
        connectedField: "pairedConnectedRaces"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected legendary items/artifacts",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedRaces"
      }
    }
  ]
}
