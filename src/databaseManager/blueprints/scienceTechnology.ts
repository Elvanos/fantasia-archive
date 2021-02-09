import { I_Blueprint } from "../../interfaces/I_Blueprint"
export const techBlueprint: I_Blueprint = {
  _id: "tech",
  order: 12,
  namePlural: "Science/Technology",
  nameSingular: "Science/Technology",
  icon: "fas fa-wrench",
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
      icon: "fas fa-wrench",
      sizing: 6
    },
    {
      id: "parentDoc",
      name: "Belongs under",
      type: "singleToNoneRelationship",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech"
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
      id: "headquarters",
      name: "Headquesters",
      type: "singleToNoneRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations"
      }
    },
    {
      id: "users",
      name: "Practicioners/Engineers",
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
      id: "typeTech",
      name: "Type",
      type: "multiSelect",
      icon: "fas fa-cogs",
      sizing: 3,
      predefinedSelectValues: [
        "Technique",
        "Invention",
        "Invention",
        "Machinery",
        "Magi-tech creation",
        "School of technology",
        "Factory/Manufacture",
        "Scientifical/Technological institution",
        "Other"
      ]
    },
    {
      id: "formTech",
      name: "Branch of sciences",
      type: "multiSelect",
      icon: "fas fa-vial",
      sizing: 3,
      predefinedSelectValues: [
        "Logic",
        "Mathematics",
        "Statistics",
        "Physics",
        "Chemistry",
        "Biology",
        "Magicology",
        "Geology",
        "Astrology",
        "Automation & Applied logic",
        "Engineering",
        "Agricultural science",
        "Medicine",
        "Economics",
        "Politology",
        "Sociology",
        "Psychology",
        "Pedagogy",
        "History",
        "Linguistics",
        "Other"
      ]
    },
    {
      id: "pairedCharacter",
      name: "Noteable practitioners/scientists",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedTech"
      }
    },
    {
      id: "pairedTech",
      name: "Related technologies/sciences",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedTech"
      }
    },
    {
      id: "connectedRaces",
      name: "Common species/races among the practicioners",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "commonInTechGroups"
      }
    },
    {
      id: "localLanguages",
      name: "Common languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "usedInTechGroups"
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
      name: "Ruled locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "governTech"
      }
    },
    {
      id: "connectedLocations",
      name: "Connected locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "connectedTech"
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
        connectedField: "pairedBelongingTechGroup"
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
        connectedField: "pairedAllyTechGroup"
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
        connectedField: "pairedEnemyTechGroup"
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
        connectedField: "pairedConnectedTechGroups"
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
        connectedField: "pairedAllyTechGroups"
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
        connectedField: "pairedEnemyTechGroups"
      }
    },
    {
      id: "pairedConnectedReligiousGroups",
      name: "Connected religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedConnectedTechGroups"
      }
    },
    {
      id: "pairedAllyReligiousGroups",
      name: "Allied religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedAllyTechGroups"
      }
    },
    {
      id: "pairedEnemyReligiousGroups",
      name: "Enemy religious groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedEnemyTechGroups"
      }
    },
    {
      id: "pairedConnectedMagicalGroups",
      name: "Connected magical groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectedTechGroups"
      }
    },
    {
      id: "pairedAllyMagicalGroups",
      name: "Allied magical groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedAllyTechGroups"
      }
    },
    {
      id: "pairedEnemyMagicalGroups",
      name: "Enemy magical groups/teachings",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedEnemyTechGroups"
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
        connectedField: "connectedTech"
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
        connectedField: "pairedConnectedTechGroups"
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
        connectedField: "pairedConnectedTechGroups"
      }
    }

  ]
}
