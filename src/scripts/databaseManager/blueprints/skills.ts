import { RPGSystemsStats } from "./../extraFieldLists/RPGSystemsStats"
import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const skillsBlueprint: I_Blueprint = {
  _id: "skills",
  order: 180,
  namePlural: "Skills/Spells/Other",
  nameSingular: "Skill/Spell/Other",
  icon: "mdi-sword-cross",
  category: "Details",
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
      icon: "mdi-sword-cross",
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
        connectedObjectType: "skills"
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
      id: "otherNames",
      name: "Other Names & Epithets",
      type: "list",
      icon: "mdi-book-plus",
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
      id: "statsListRequired",
      name: "Stats/Attributes required",
      type: "list",
      icon: "mdi-sword",
      sizing: 12,
      predefinedListExtras: {
        reverse: true,
        affix: "Stat/Attribute",
        extraSelectValueList: RPGSystemsStats
      }
    },
    {
      id: "statsListProvided",
      name: "Stats/Attributes provided",
      type: "list",
      icon: "mdi-sword",
      sizing: 12,
      predefinedListExtras: {
        reverse: true,
        affix: "Stat/Attribute",
        extraSelectValueList: RPGSystemsStats
      }
    },
    {
      id: "traits",
      name: "Unique/Defining Features",
      type: "list",
      icon: "mdi-guy-fawkes-mask",
      sizing: 6
    },
    {
      id: "levelSkill",
      name: "Complexity to use",
      type: "multiSelect",
      icon: "mdi-meditation",
      sizing: 3,
      tooltip: "This field determines how complex is this Skill/Spell/Other to learn/use.",
      predefinedSelectValues: [
        "Trainee",
        "Apprentice",
        "Capable",
        "Advanced",
        "Expert",
        "Master",
        "Grand-master",
        "Genius",
        "Prodigy",
        "Off-the-scale"
      ]
    },
    {
      id: "typeSkill",
      name: "Type",
      type: "multiSelect",
      icon: "fas fa-hand-sparkles",
      sizing: 3,
      predefinedSelectValues: [
        "Ability",
        "Athletic skill",
        "Blessing",
        "Crafting skill",
        "Creative ability",
        "Curse",
        "Destructive ability",
        "Feature/Feat",
        "Fighting skill",
        "Magical skill",
        "Martial skill",
        "Mental skill",
        "Passive ability",
        "Physical skill",
        "Production skill",
        "Psychic skill",
        "Skill",
        "Spell",
        "Other"
      ]
    },
    {
      id: "pairedSkills",
      name: "Related Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "prerequisiteSkills",
      name: "Prerequisites Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "postrequisiteSkills"
      }
    },
    {
      id: "postrequisiteSkills",
      name: "Required by Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "prerequisiteSkills"
      }
    },
    {
      id: "pairedItemsCommon",
      name: "Commonly used with Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 6,
      tooltip: "This field is meant for things like swords for sword fighting.",
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedSkillsCommon"
      }
    },
    {
      id: "pairedItemsUsing",
      name: "Items capable of using this Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 6,
      tooltip: "This field is meant for items like a fire-wand that allow one to cast fireballs.",
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedSkillsUsing"
      }
    },
    {
      id: "pairedItemsRequire",
      name: "Required Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedSkillsRequire"
      }
    },
    {
      id: "pairedItemsCreate",
      name: "Created Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedSkillsCreate"
      }
    },
    {
      id: "pairedConnectedProfessions",
      name: "Commonly used by Occupations/Classes",
      type: "manyToManyRelationship",
      icon: "fab fa-pied-piper-hat",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "professions",
        connectedField: "pairedConnectedSkills"
      }
    },
    {
      id: "relatedCultures",
      name: "Connected to Cultures/Art",
      type: "manyToManyRelationship",
      icon: "fas fa-archway",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "culture",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedResourcesRequire",
      name: "Required Resources/Materials",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedResourcesRequire"
      }
    },
    {
      id: "pairedResourcesCreate",
      name: "Created Resources/Materials",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedResourcesCreate"
      }
    },
    {
      id: "pairedConditionsPositive",
      name: "Causing following Boons",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedSkillsPositive"
      }
    },
    {
      id: "pairedConditionsNegative",
      name: "Causing following Afflictions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedSkillsNegative"
      }
    },
    {
      id: "pairedConditionsOther",
      name: "Causing following Other conditions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedSkillsOther"
      }
    },
    {
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      icon: "mdi-book-open-page-variant-outline",
      sizing: 12
    },
    {
      id: "traditions",
      name: "Traditions & customs connected to the Skill/Spell/other",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakStory",
      name: "Connections - Story/Lore",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedConnectedNotes",
      name: "Connected to Lore notes/Other notes",
      type: "manyToManyRelationship",
      icon: "mdi-script-text-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "loreNotes",
        connectedField: "pairedConnectedSkills"
      }
    },
    {
      id: "pairedMyths",
      name: "Connected to Myths/Legends/Stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "breakWorld",
      name: "Connections - World",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedCharacterSkills",
      name: "Connected to Characters",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "pairedSkills"
      },
      tooltip:
        `This field is meant to be used as a way to connect people like inventors, famous users or similar to the skill/spell.
        <br>
        For everyday users, please consider using the designated one-way relationships in the character document type.
        `
    },
    {
      id: "pairedLocationsSkills",
      name: "Connected to Locations/Geography",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedRacesSkills",
      name: "Connected to Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedEventSkills",
      name: "Skills/Other connected to Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedSkills"
      },
      tooltip:
        `Use this field to connect non-magical skills or other abilites to events.
        `
    },
    {
      id: "pairedEventSpells",
      name: "Spells connected to Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedSpells"
      },
      tooltip:
        `Use this field to connect magical skills or other abilites to events.
        `
    },
    {
      id: "breakGroups",
      name: "Connections - Groups/Teachings",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedPoliticalGroupsSkills",
      name: "Connected to Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedReligiousGroupsSkills",
      name: "Connected to Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedOtherGroupsSkills",
      name: "Connected to Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedMagicGroupsSkills",
      name: "Connected to Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "pairedTechGroupsSkills",
      name: "Connected to Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedSkills"
      }
    },
    {
      id: "breakDetails",
      name: "Secrets/Spoilers/DM notes",
      type: "break",
      sizing: 12,
      isSpoiler: true
    },
    {
      id: "spoilerNotes",
      name: "Secrets/Spoilers/DM notes",
      type: "wysiwyg",
      icon: "fas fa-mask",
      sizing: 12,
      isSpoiler: true,
      tooltip:
        `This field will not export by default when using the Export document functionality.
        <br>
        Instead it needs to be manually included if the user wishes to export it.
        `
    }
  ]
}
