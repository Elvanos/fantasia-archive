import { I_Blueprint } from "../../../interfaces/I_Blueprint"
export const charactersBlueprint: I_Blueprint = {
  _id: "characters",
  order: 18,
  namePlural: "Characters",
  nameSingular: "Character",
  icon: "mdi-account",
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
      sizing: 6
    },
    {
      id: "titles",
      name: "Titles",
      type: "list",
      icon: "mdi-crown",
      sizing: 6
    },
    {
      id: "sex",
      name: "Sex",
      type: "singleSelect",
      icon: "mdi-gender-male-female",
      sizing: 3,
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
      sizing: 3
    },
    {
      id: "height",
      name: "Height",
      type: "text",
      icon: "mdi-human-male-height-variant",
      sizing: 3
    },
    {
      id: "weight",
      name: "Weight",
      type: "text",
      icon: "mdi-weight",
      sizing: 3
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
      id: "pairedOriginLocation",
      name: "Place of origin",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedOriginCharacters"
      }
    },
    {
      id: "birthDate",
      name: "Date of birth",
      type: "text",
      icon: "mdi-cake-variant",
      sizing: 3
    },
    {
      id: "pairedDemiseLocation",
      name: "Place of demise",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedDemiseCharacters"
      }
    },
    {
      id: "deathDate",
      name: "Date of death",
      type: "text",
      icon: "mdi-skull-crossbones",
      sizing: 3
    },
    {
      id: "pairedCurrentLocation",
      name: "Place of residence",
      type: "singleToManyRelationship",
      icon: "mdi-map-marker-radius",
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "locations",
        connectedField: "pairedCurrentCharacters"
      }
    },
    {
      id: "pairedRace",
      name: "Species/Races/Flora/Fauna",
      type: "manyToManyRelationship",
      icon: "fas fa-dragon",
      sizing: 3,
      relationshipSettings: {
        connectedObjectType: "races",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "ethnicity",
      name: "Ethnicity",
      type: "text",
      icon: "fas fa-hand-paper",
      sizing: 3
    },
    {
      id: "powerLevel",
      name: "Combat rating",
      type: "singleSelect",
      icon: "fas fa-fist-raised",
      sizing: 3,
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
      id: "description",
      name: "Description & History",
      type: "wysiwyg",
      sizing: 12
    },
    {
      id: "breakSkills",
      name: "Skills & Other features",
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
        "Forecful",
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
        "Pruposeful",
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
      name: "Unusual Features/Traits",
      type: "list",
      icon: "mdi-guy-fawkes-mask",
      sizing: 6
    },
    {
      id: "skills",
      name: "Skills",
      type: "list",
      icon: "mdi-sword-cross",
      sizing: 12,
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
      id: "pairedLanguage",
      name: "Languages",
      type: "manyToManyRelationship",
      icon: "mdi-book-alphabet",
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "languages",
        connectedField: "pairedCharacter"
      }
    },
    {
      id: "pairedMagic",
      name: "Known Magic/Spells",
      type: "manyToManyRelationship",
      icon: "fas fa-hat-wizard",
      sizing: 4,
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
      sizing: 4,
      relationshipSettings: {
        connectedObjectType: "tech",
        connectedField: "pairedCharacter"
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
      id: "breakPolitics",
      name: "Ideologies, Religions, Politics & Other connections",
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
      name: "Connected to Magical groups",
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
      name: "Member of Magical groups",
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
      name: "Ally of Magical groups",
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
      name: "Enemy of Magical groups",
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
      id: "breakOther",
      name: "Other details",
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
      id: "pairedConnectedItems",
      name: "Connected to Items",
      type: "manyToManyRelationship",
      icon: "mdi-sword-cross",
      sizing: 6,
      relationshipSettings: {
        connectedObjectType: "items",
        connectedField: "pairedConnectedCharacter"
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
        connectedField: "pairedConnectedCharacter"
      }
    }

  ]
}
