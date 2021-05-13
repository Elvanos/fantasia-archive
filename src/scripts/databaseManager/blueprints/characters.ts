import { RPGSystemsStats } from "./../extraFieldLists/RPGSystemsStats"
import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const charactersBlueprint: I_Blueprint = {
  _id: "characters",
  order: 370,
  namePlural: "Characters",
  nameSingular: "Character",
  icon: "mdi-account",
  category: "World",
  extraFields: [
    {
      id: "pairedMagic",
      name: "Known Magic/Spells",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      tooltip: `
        This field is obsolete and no longer serves any purpose.
        <br>
        Pleae move your data to the corresponding new fields.
        <br>
        This field will automatically disappear once all data is gone from it.
      `,
      isLegacy: true,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "pairedTech",
      name: "Known Technologies/Sciences",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      tooltip: `
        This field is obsolete and no longer serves any purpose.
        <br>
        Pleae move your data to the corresponding new fields.
        <br>
        This field will automatically disappear once all data is gone from it.
      `,
      isLegacy: true,
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "skills",
      name: "Skills",
      type: "list",
      icon: "mdi-sword",
      sizing: 12,
      isLegacy: true,
      tooltip: `
        This field is obsolete and no longer serves any purpose.
        <br>
        Pleae move your data to the corresponding new fields.
        <br>
        This field will automatically disappear once all data is gone from it.
      `,
      predefinedListExtras: {
        affix: "Level",
        extraSelectValueList: [
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
      }
    },

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
      icon: "mdi-account",
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
        connectedObjectType: "characters"
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
      id: "titles",
      name: "Titles",
      type: "list",
      icon: "mdi-crown",
      sizing: 12,
      predefinedListExtras: {
        affix: "Note",
        extraSelectValueList: [
        ]
      }
    },
    {
      id: "sex",
      name: "Sex",
      type: "singleSelect",
      icon: "mdi-gender-male-female",
      sizing: 2,
      predefinedSelectValues: [
        "Male",
        "Female",
        "Other",
        "None"
      ]
    },
    {
      id: "age",
      name: "Age",
      type: "text",
      icon: "mdi-timer-sand",
      sizing: 2
    },
    {
      id: "height",
      name: "Height",
      type: "text",
      icon: "mdi-human-male-height-variant",
      sizing: 2
    },
    {
      id: "weight",
      name: "Weight",
      type: "text",
      icon: "mdi-weight",
      sizing: 2
    },
    {
      id: "birthDate",
      name: "Date of birth",
      type: "text",
      icon: "mdi-cake-variant",
      sizing: 2
    },
    {
      id: "deathDate",
      name: "Date of death",
      type: "text",
      icon: "mdi-skull-crossbones",
      sizing: 2
    },
    {
      id: "pairedRace",
      name: "Species/Races",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "pairedProfession",
      name: "Occupation/Class",
      type: "manyToManyRelationship",
      icon: "fab fa-pied-piper-hat",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "professions",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "ethnicity",
      name: "Ethnicity",
      type: "text",
      icon: "fas fa-hand-paper",
      sizing: 6
    },
    {
      id: "powerLevel",
      name: "Combat rating",
      type: "singleSelect",
      icon: "fas fa-fist-raised",
      sizing: 6,
      predefinedSelectValues: [
        /*
        "0 - Civilian",
        "1 - Trainee / Athletic civilian",
        "2 - Trained soldier / Weak magic user",
        "3 - Veteran soldier / Average magic user",
        "4 - Elite soldier / Weak vampire",
        "5 - Top-tier soldier / Strong magic user / Weak nephilim / Average vampire",
        "6 - Exceptional magic user / Average nephilim / Powerful vampire",
        "7 - Genius magic user / Powerful nephilim / Prodigy vampire",
        "8 - Prodigy magic user / Genius nephilim",
        "9 - Weak god / Weak dragon / Prodigy nephilim",
        "10 - Average god / Adult dragon",
        "11 - Powerful god / Poweful and old dragon / Weak ascendant",
        "12 - Prodigy god / Ancient dragon / Medium ascendant / Weak & medium outerplanar entities",
        "13 - World-shaping god / Powerful ascendant / Strong outerplanar entity",
        "14 - New transcendant / Genius ascendant / Powerful outerplanar entity",
        "15 - Established transcendant / Prodigy ascendant / Ancient outerplanar entity",
        "16 & Above - Off the scale / Impossible to even categorize" */
      ]
    },
    {
      id: "pairedCurrentLocation",
      name: "Place of residence",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedCurrentCharacters"
      }
    },
    {
      id: "pairedOriginLocation",
      name: "Place of origin",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedOriginCharacters"
      }
    },
    {
      id: "pairedDemiseLocation",
      name: "Place of demise",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedDemiseCharacters"
      }
    },
    {
      id: "pairedConditionsPositive",
      name: "Affected by Boons",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedCharactersPositive"
      }
    },
    {
      id: "pairedConditionsNegative",
      name: "Affected by Afflictions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedCharactersNegative"
      }
    },
    {
      id: "pairedConditionsOther",
      name: "Affected by Other conditions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedCharactersOther"
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
      id: "breakSkills",
      name: "Skills, Stats, Knowledge & Characteristics",
      type: "break",
      sizing: 12
    },
    {
      id: "personalityTraits",
      name: "Traits & Characteristics",
      type: "multiSelect",
      icon: "mdi-head-cog",
      sizing: 6,
      predefinedSelectValues: [
        "Abrasive",
        "Abrupt",
        "Absentminded",
        "Accessible",
        "Active",
        "Adaptable",
        "Admirable",
        "Adventurous",
        "Aggressive",
        "Agonizing",
        "Agreeable",
        "Aimless",
        "Airy",
        "Alert",
        "Allocentric",
        "Aloof",
        "Ambitious",
        "Amiable",
        "Amoral",
        "Amusing",
        "Angry",
        "Anticipative",
        "Anxious",
        "Apathetic",
        "Appreciative",
        "Arbitrary",
        "Argumentative",
        "Arrogant",
        "Artful",
        "Articulate",
        "Artificial",
        "Ascetic",
        "Asocial",
        "Aspiring",
        "Assertive",
        "Astigmatic",
        "Athletic",
        "Attractive",
        "Authoritarian",
        "Balanced",
        "Barbaric",
        "Benevolent",
        "Bewildered",
        "Big-thinking",
        "Boisterous",
        "Bizarre",
        "Bland",
        "Blunt",
        "Boyish",
        "Breezy",
        "Brilliant",
        "Brittle",
        "Brutal",
        "Businesslike",
        "Busy",
        "Calculating",
        "Callous",
        "Calm",
        "Cantakerous",
        "Capable",
        "Captivating",
        "Careless",
        "Caring",
        "Casual",
        "Cautious",
        "Challenging",
        "Charismatic",
        "Charming",
        "Charmless",
        "Cheerful",
        "Childish",
        "Chummy",
        "Circumspect",
        "Clean",
        "Clear-headed",
        "Clever",
        "Clumsy",
        "Coarse",
        "Cold",
        "Colorful",
        "Colorless",
        "Companionly",
        "Compassionate",
        "Competitive",
        "Complacent",
        "Complaintive",
        "Complex",
        "Compulsive",
        "Conceited",
        "Conciliatory",
        "Condemnatory",
        "Confident",
        "Confidential",
        "Conformist",
        "Confused",
        "Conscientious",
        "Conservative",
        "Considerate",
        "Constant",
        "Contemplative",
        "Contemptible",
        "Contradictory",
        "Conventional",
        "Cooperative",
        "Courageous",
        "Courteous",
        "Cowardly",
        "Crafty",
        "Crass",
        "Crazy",
        "Creative",
        "Cerebral",
        "Criminal",
        "Crisp",
        "Critical",
        "Crude",
        "Cruel",
        "Cultured",
        "Curious",
        "Cute",
        "Cynical",
        "Daring",
        "Debonair",
        "Decadent",
        "Deceitful",
        "Decent",
        "Deceptive",
        "Decisive",
        "Dedicated",
        "Deep",
        "Delicate",
        "Demanding",
        "Dependent",
        "Desperate",
        "Destructive",
        "Determined",
        "Devious",
        "Difficult",
        "Dignified",
        "Directed",
        "Dirty",
        "Disciplined",
        "Disconcerting",
        "Discontented",
        "Discouraging",
        "Discourteous",
        "Discreet",
        "Dishonest",
        "Disloyal",
        "Disobedient",
        "Disorderly",
        "Disorganized",
        "Disputatious",
        "Disrespectful",
        "Disruptive",
        "Dissolute",
        "Dissonant",
        "Distractible",
        "Disturbing",
        "Dogmatic",
        "Dominating",
        "Domineering",
        "Dramatic",
        "Dreamy",
        "Driving",
        "Droll",
        "Dry",
        "Dull",
        "Dutiful",
        "Dynamic",
        "Earnest",
        "Earthy",
        "Easily Discouraged",
        "Ebullient",
        "Eccentric",
        "Educated",
        "Effeminate",
        "Efficient",
        "Egocentric",
        "Elegant",
        "Eloquent",
        "Emotional",
        "Empathetic",
        "Energetic",
        "Enervated",
        "Enigmatic",
        "Enthusiastic",
        "Envious",
        "Erratic",
        "Escapist",
        "Esthetic",
        "Evil",
        "Excitable",
        "Exciting",
        "Expedient",
        "Experimental",
        "Extraordinary",
        "Extravagant",
        "Extreme",
        "Fair",
        "Faithful",
        "Faithless",
        "False",
        "Familial",
        "Fanatical",
        "Fanciful",
        "Farsighted",
        "Fatalistic",
        "Fawning",
        "Fearful",
        "Felicific",
        "Fickle",
        "Fiery",
        "Firm",
        "Fixed",
        "Flamboyant",
        "Flexible",
        "Focused",
        "Folksy",
        "Foolish",
        "Forceful",
        "Forgetful",
        "Forgiving",
        "Formal",
        "Forthright",
        "Fraudulent",
        "Freethinking",
        "Freewheeling",
        "Friendly",
        "Frightening",
        "Frivolous",
        "Frugal",
        "Fun-loving",
        "Gallant",
        "Generous",
        "Gentle",
        "Genuine",
        "Glamorous",
        "Gloomy",
        "Good-natured",
        "Graceless",
        "Gracious",
        "Grand",
        "Greedy",
        "Grim",
        "Guileless",
        "Gullible",
        "Hardworking",
        "Hateful",
        "Haughty",
        "Healthy",
        "Hearty",
        "Hedonistic",
        "Helpful",
        "Heroic",
        "Hesitant",
        "Hidebound",
        "High-handed",
        "High-minded",
        "High-spirited",
        "Honest",
        "Honorable",
        "Hostile",
        "Humble",
        "Humorous",
        "Huried",
        "Hypnotic",
        "Iconoclastic",
        "Idealistic",
        "Idiosyncratic",
        "Ignorant",
        "Imaginative",
        "Imitative",
        "Impassive",
        "Impatient",
        "Impersonal",
        "Impractical",
        "Impressionable",
        "Impressive",
        "Imprudent",
        "Impulsive",
        "Incisive",
        "Inconsiderate",
        "Incorruptible",
        "Incurious",
        "Indecisive",
        "Independent",
        "Individualistic",
        "Indulgent",
        "Inert",
        "Inhibited",
        "Innovative",
        "Inoffensive",
        "Insecure",
        "Insensitive",
        "Insightful",
        "Insincere",
        "Insouciant",
        "Insulting",
        "Intelligent",
        "Intense",
        "Intolerant",
        "Intuitive",
        "Invisible",
        "Invulnerable",
        "Irascible",
        "Irrational",
        "Irreligious",
        "Irresponsible",
        "Irreverent",
        "Irritable",
        "Kind",
        "Knowledge",
        "Lazy",
        "Leaderly",
        "Leisurely",
        "Liberal",
        "Libidinous",
        "Logical",
        "Loquacious",
        "Lovable",
        "Loyal",
        "Lyrical",
        "Magnanimous",
        "Malicious",
        "Mannered",
        "Mannerless",
        "Many-sided",
        "Masculine (Manly)",
        "Maternal",
        "Maticulous",
        "Mature",
        "Mawkish",
        "Mealymouthed",
        "Mechanical",
        "Meddlesome",
        "Melancholic",
        "Mellow",
        "Meretricious",
        "Messy",
        "Methodical",
        "Mischievous",
        "Miserable",
        "Miserly",
        "Misguided",
        "Mistaken",
        "Moderate",
        "Modern",
        "Modest",
        "Money-minded",
        "Monstrous",
        "Moody",
        "Moralistic",
        "Morbid",
        "Muddle-headed",
        "Multi-leveled",
        "Mystical",
        "Naive",
        "Narcissistic",
        "Narrow-minded",
        "Narrow",
        "Natty",
        "Neat",
        "Negativistic",
        "Neglectful",
        "Neurotic",
        "Neutral",
        "Nihilistic",
        "Nonauthoritarian",
        "Noncommittal",
        "Noncompetitive",
        "Obedient",
        "Objective",
        "Obnoxious",
        "Observant",
        "Obsessive",
        "Obvious",
        "Odd",
        "Offhand",
        "Old-fashioned",
        "One-dimensional",
        "One-sided",
        "Open",
        "Opinionated",
        "Opportunistic",
        "Oppressed",
        "Optimistic",
        "Orderly",
        "Ordinary",
        "Organized",
        "Original",
        "Outrageous",
        "Outspoken",
        "Overimaginative",
        "Painstaking",
        "Paranoid",
        "Passionate",
        "Passive",
        "Paternalistic",
        "Patient",
        "Patriotic",
        "Peaceful",
        "Pedantic",
        "Perceptive",
        "Perfectionist",
        "Personable",
        "Persuasive",
        "Perverse",
        "Petty",
        "Pharissical",
        "Phlegmatic",
        "Physical",
        "Placid",
        "Planful",
        "Playful",
        "Plodding",
        "Polished",
        "Political",
        "Pompous",
        "Popular",
        "Possessive",
        "Power-hungry",
        "Practical",
        "Precise",
        "Predatory",
        "Predictable",
        "Prejudiced",
        "Preoccupied",
        "Presumptuous",
        "Pretentious",
        "Prim",
        "Principled",
        "Private",
        "Procrastinating",
        "Profligate",
        "Profound",
        "Progressive",
        "Protean",
        "Protective",
        "Proud",
        "Providential",
        "Provocative",
        "Prudent",
        "Purposeful",
        "Pugnacious",
        "Punctual",
        "Pure",
        "Puritanical",
        "Questioning",
        "Quiet",
        "Quirky",
        "Rational",
        "Reactionary",
        "Reactive",
        "Realistic",
        "Reflective",
        "Regimental",
        "Regretful",
        "Relaxed",
        "Reliable",
        "Religious",
        "Repentant",
        "Repressed",
        "Resentful",
        "Reserved",
        "Resourceful",
        "Respectful",
        "Responsible",
        "Responsive",
        "Restrained",
        "Retiring",
        "Reverential",
        "Ridiculous",
        "Rigid",
        "Ritualistic",
        "Romantic",
        "Rowdy",
        "Ruined",
        "Rustic",
        "Sadistic",
        "Sage",
        "Sanctimonious",
        "Sane",
        "Sarcastic",
        "Scheming",
        "Scholarly",
        "Scornful",
        "Scrupulous",
        "Secretive",
        "Secure",
        "Sedentary",
        "Self-conscious",
        "Self-critical",
        "Self-defacing",
        "Self-denying",
        "Self-indulgent",
        "Self-reliant",
        "Self-sufficent",
        "Selfish",
        "Selfless",
        "Sensitive",
        "Sensual",
        "Sentimental",
        "Seraphic",
        "Serious",
        "Sexy",
        "Shallow",
        "Sharing",
        "Shortsighted",
        "Shrewd",
        "Shy",
        "Silly",
        "Simple",
        "Single-minded",
        "Skeptical",
        "Skillful",
        "Sloppy",
        "Slow",
        "Sly",
        "Small-thinking",
        "Smooth",
        "Sober",
        "Sociable",
        "Soft",
        "Softheaded",
        "Solemn",
        "Solid",
        "Solitary",
        "Sophisticated",
        "Sordid",
        "Spontaneous",
        "Sporting",
        "Stable",
        "Steadfast",
        "Steady",
        "Steely",
        "Stern",
        "Stiff",
        "Stoic",
        "Stolid",
        "Strict",
        "Strong-willed",
        "Strong",
        "Stubborn",
        "Studious",
        "Stupid",
        "Stylish",
        "Suave",
        "Subjective",
        "Submissive",
        "Subtle",
        "Superficial",
        "Superstitious",
        "Surprising",
        "Suspicious",
        "Sweet",
        "Sympathetic",
        "Systematic",
        "Tactless",
        "Tasteful",
        "Tasteless",
        "Teacherly",
        "Tense",
        "Thievish",
        "Thorough",
        "Thoughtless",
        "Tidy",
        "Timid",
        "Tolerant",
        "Tough",
        "Tractable",
        "Transparent",
        "Treacherous",
        "Trendy",
        "Troublesome",
        "Trusting",
        "Unaggressive",
        "Unambitious",
        "Unappreciative",
        "Uncaring",
        "Unceremonious",
        "Unchanging",
        "Uncharitable",
        "Uncomplaining",
        "Unconvincing",
        "Uncooperative",
        "Uncreative",
        "Uncritical",
        "Unctuous",
        "Undemanding",
        "Understanding",
        "Undisciplined",
        "Undogmatic",
        "Unfathomable",
        "Unfoolable",
        "Unfriendly",
        "Ungrateful",
        "Unhealthy",
        "Unhurried",
        "Unimaginative",
        "Unimpressive",
        "Uninhibited",
        "Unlovable",
        "Unpatriotic",
        "Unpolished",
        "Unpredicatable",
        "Unprincipled",
        "Unrealistic",
        "Unreflective",
        "Unreliable",
        "Unreligious",
        "Unrestrained",
        "Unself-critical",
        "Unsentimental",
        "Unstable",
        "Upright",
        "Urbane",
        "Vacuous",
        "Vague",
        "Venal",
        "Venomous",
        "Venturesome",
        "Vindictive",
        "Vivacious",
        "Vulnerable",
        "Warm",
        "Weak-willed",
        "Weak",
        "Well-bred",
        "Well-meaning",
        "Well-read",
        "Well-rounded",
        "Whimsical",
        "Willful",
        "Winning",
        "Wise",
        "Wishful",
        "Witty",
        "Youthful",
        "Zany"
      ]
    },
    {
      id: "traits",
      name: "Unique/Unusual Features",
      type: "list",
      icon: "mdi-guy-fawkes-mask",
      sizing: 6
    },
    {
      id: "statsList",
      name: "Stats/Attributes",
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
      id: "possessedItems",
      name: "Equipment/Owned Items",
      type: "manyToNoneRelationship",
      icon: "mdi-sword",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items"
      }
    },
    {
      id: "possessedCurrencies",
      name: "Whealth/Owned Currencies",
      type: "manyToNoneRelationship",
      icon: "fas fa-coins",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "currencies"
      }
    },
    {
      id: "knownSkills",
      name: "Known Skills/Abilities",
      type: "manyToNoneRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "skills"
      }
    },

    {
      id: "knownSpells",
      name: "Known Spells",
      type: "manyToNoneRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "skills"
      }
    },
    {
      id: "knownLanguage",
      name: "Known Languages",
      type: "manyToNoneRelationship",
      icon: "mdi-book-alphabet",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "languages"
      }
    },
    {
      id: "knownMagic",
      name: "Known Magical teachings",
      type: "manyToNoneRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "magic"
      }
    },
    {
      id: "knownTech",
      name: "Known Technologies/Sciences",
      type: "manyToNoneRelationship",
      icon: "fas fa-wrench",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech"
      }
    },
    {
      id: "breakRelationships",
      name: "Relationships",
      type: "break",
      sizing: 12
    },
    {
      id: "parentsOfCharacter",
      name: "Parents of the Character",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "childOfCharacter"
      }
    },
    {
      id: "childOfCharacter",
      name: "Children of the Character",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "parentsOfCharacter"
      }
    },
    {
      id: "relativesOfCharacter",
      name: "Other relatives of the Character",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "relativesOfCharacter"
      }
    },
    {
      id: "allyResCharacter",
      name: "Friends/Allies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "allyResCharacter"
      }
    },
    {
      id: "enemydResCharacter",
      name: "Enemies",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "enemydResCharacter"
      }
    },
    {
      id: "complicatedResCharacter",
      name: "Complicated relationship with",
      type: "manyToManyRelationship",
      icon: "mdi-account",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "characters",
        connectedField: "complicatedResCharacter"
      }
    },
    {
      id: "breakNotes",
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
        connectedField: "pairedConnectedCharacter"
      }
    },
    {
      id: "pairedConnectedMyths",
      name: "Connected to Myths, legends and stories",
      type: "manyToManyRelationship",
      icon: "fas fa-journal-whills",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "myths",
        connectedField: "pairedConnectedCharacter"
      }
    },
    {
      id: "breakOther",
      name: "Connections - World",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedEvent",
      name: "Took part in Events",
      type: "manyToManyRelationship",
      icon: "mdi-calendar-text",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "events",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "pairedConnectedPlaces",
      name: "Connected to Locations",
      type: "manyToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedConnectedCharacter"
      }
    },
    {
      id: "pairedLanguage",
      name: "Connected to Languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "relatedCultures",
      name: "Connected Cultures/Art",
      type: "manyToManyRelationship",
      icon: "fas fa-archway",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "culture",
        connectedField: "relatedCharacters"
      }
    },
    {
      id: "breakPolitics",
      name: "Connections - Groups/Teachings",
      type: "break",
      sizing: 12
    },

    {
      id: "pairedConnectionPolGroup",
      name: "Connected to Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedConnectionCharacter"
      }
    },
    {
      id: "pairedBelongingPolGroup",
      name: "Member of Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedBelongingCharacter"
      }
    },
    {
      id: "pairedAllyPolGroup",
      name: "Ally of Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedAllyCharacter"
      }
    },
    {
      id: "pairedEnemyPolGroup",
      name: "Enemy of Ideologies/Political groups",
      type: "manyToManyRelationship",
      icon: "mdi-bank-outline",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "politicalGroups",
        connectedField: "pairedEnemyCharacter"
      }
    },

    {
      id: "pairedConnectionOtherGroups",
      name: "Connected to Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedConnectionCharacter"
      }
    },
    {
      id: "pairedBelongingOtherGroups",
      name: "Member of Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedBelongingCharacter"
      }
    },
    {
      id: "pairedAllyOtherGroups",
      name: "Ally of Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedAllyCharacter"
      }
    },
    {
      id: "pairedEnemyOtherGroups",
      name: "Enemy of Organizations/Other groups",
      type: "manyToManyRelationship",
      icon: "mdi-account-group",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "guilds",
        connectedField: "pairedEnemyCharacter"
      }
    },

    {
      id: "pairedConnectionRelGroup",
      name: "Connected to Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedConnectionCharacter"
      }
    },
    {
      id: "pairedBelongingRelGroup",
      name: "Member of Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedBelongingCharacter"
      }
    },
    {
      id: "pairedAllyRelGroup",
      name: "Ally of Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedAllyCharacter"
      }
    },
    {
      id: "pairedEnemyRelGroup",
      name: "Enemy of Teachings/Religious groups",
      type: "manyToManyRelationship",
      icon: "fas fa-ankh",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "religions",
        connectedField: "pairedEnemyCharacter"
      }
    },
    {
      id: "pairedConnectionMagicGroup",
      name: "Connected to Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedConnectionCharacter"
      }
    },
    {
      id: "pairedBelongingMagicGroup",
      name: "Member of Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedBelongingCharacter"
      }
    },
    {
      id: "pairedAllyMagicGroup",
      name: "Ally of Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedAllyCharacter"
      }
    },
    {
      id: "pairedEnemyMagicGroup",
      name: "Enemy of Schools of Magic/Magical groups",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "magic",
        connectedField: "pairedEnemyCharacter"
      }
    },
    {
      id: "pairedConnectionTechGroup",
      name: "Connected to Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedConnectionCharacter"
      }
    },
    {
      id: "pairedBelongingTechGroup",
      name: "Member of Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedBelongingCharacter"
      }
    },
    {
      id: "pairedAllyTechGroup",
      name: "Ally of Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedAllyCharacter"
      }
    },
    {
      id: "pairedEnemyTechGroup",
      name: "Enemy of Sciences/Technological groups",
      type: "manyToManyRelationship",
      icon: "fas fa-wrench",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedEnemyCharacter"
      }
    },
    {
      id: "breakDetails",
      name: "Connections - Details",
      type: "break",
      sizing: 12
    },
    {
      id: "pairedSkills",
      name: "Connected to Skills/Spells/Other",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "skills",
        connectedField: "pairedCharacterSkills"
      }
    },
    {
      id: "pairedConnectedItems",
      name: "Connected to Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedCharacter"
      }
    },
    {
      id: "pairedConditionsConnected",
      name: "Connected to Afflictions/Boons/Conditions",
      type: "manyToManyRelationship",
      icon: "mdi-virus",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "conditions",
        connectedField: "pairedCharactersConnected"
      }
    },
    {
      id: "pairedResources",
      name: "Connected to Resources/Materials",
      type: "manyToManyRelationship",
      icon: "mdi-gold",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "resources",
        connectedField: "pairedCharacter"
      }
    }
  ]
}
