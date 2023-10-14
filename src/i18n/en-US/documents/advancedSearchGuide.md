
# Advanced search guide

---

## Introduction

Fantasia Archive comes with a fairly advanced search-engine present in most of the search fields that look up through either all or at least one type of document - these are for example the multiple and single relationship fields on each document page and the quick-search popup.

---

## Intelligent search matching & sorting

The search itself works the following: You can search any amount of words and the software will process them individually as long as they are separated by whitespace.

### The search follows these rules

- **The search is case-insensitive, which means that you can type everything in UPPER or lower case (or any oThEr WaY), it won't matter**
- **Words can be in any order**
  - Example: `Dark scary castle` will be found even if you type `scary castle dark`
- **Even parts of words will result in successful search**
  - Example: `Dark scary castle` will be found even if you type `sca tle ark`
- **Documents will priority-sort based on the following rules:**
  1. **Direct match has priority over everything else**
      - Example: `Dark scary castle` is a direct match for a search containing `dark scary castle`
  2. **Full word match has priority over fragments**
      - Each fully matched word counts individually; the more full-matches the document has, the higher it will be in the list
      - Example: `Dark scary castle` has 2 full word matches from `dark scary tle`
  3. **Fragments are at the bottom of the list**
      - Each fragment matched counts individually; the more fragments the document has, the higher it will be in the list
      - Example: `Dark scary castle` has 2 fragment matches from `sca tle`
- **It is possible to include `Other names` into the search as well, by prefixing `@` in front of the search string**
  - Example: `@Vampire lair` (if your `Dark scary castle` had other name filled as `Vampire lair`, the search will find it this way)

---

## Filtering

Except for the advanced search functionality, Fantasia Archive also offers instant filtering via multiple attributes for further narrowing search results.

- **NOTE: All of the following filter values (including the Full-search filtering in the next section) support matching any part of the search-text with any part of the search-term**
  - Example: `>nada` will match with `Continent > North America > Canada > Toronto`

### The filtering works in the following ways and follows these rules:

- **Any of the following filter terms WILL NOT conflict with the normal word search; therefore you can use them together**
- **It is possible to use only filter-instance of each of the following filter-types at once; however, each individual filter-type may also be present at the same time**
- **The filter is case-insensitive, which means that you can type everything in UPPER or lower case, it won't matter**
- **If your filter-term contained whitespaces, replace them with the `-` symbol**
  - Example: You wish to search for a tag called `Player Characters`, to fully match this tag, you will need to type `#player-characters`
- **Hierarchical path-filter automatically removes all `>` symbols in the path, this result in their omission from the filter string**
  - Example: You wish to search for a hierarchical path containing the following `USA > Virginia > Richmond`, to fully match this hierarchical path, you will need to type `>usa-virginia-richmond`
- **The following filter terms may be used**
  - `$` - Symbol for document type search
  - `#` - Symbol for tag search
  - `>` - Symbol for hierarchical path search
  - `^` - Symbol for conditional-switch search (specific types and values below)
    - `^c` - Displays only documents with `Is a category` ticked on
    - `^d` - Displays only documents with `Is Dead/Gone/Destroyed` ticked on
    - `^f` - Displays only documents with `Is finished` ticked on
    - `^m` - Displays only documents with `Is a minor document` ticked on that are normally invisible and filtered out

## Full-search filtering

This feature is meant mostly for those in need of full-scale search that can crawl through any field in any document to match any value field in almost anywhere. Full-search filtering allows the user to narrow down the search marginally by digging through the whole document database and pinpointing exactly what is needed.

### A few words of caution

**The full-search is a very powerful, but also demanding tool - the more your project will grow, the more demanding it will become. This means that if you for example have 2000+ documents in your project and the search algorithm will have to go crawl through all of them, then the full-search might take a few second to reload your search results - please keep this in mind when using this feature: It can potentially be A LOT of data.**

### The filtering works in the following ways and follows these rules

- **The full-search can be used in combination with any other filters and/or normal search terms**
- **It is possible to have only a single instance of the full-search present in the search at once**
- **The filter is case-insensitive, which means that you can type everything in UPPER or lower case, it won't matter**
- **In the case of lists and multi-relationships, all the entered values get converted to one big text-line for the sake of searching**
  - Example with a field called `Local currencies`:
    - Original values: `Canadian Dollar` `American Dollar` `Euro` `Klingon Darsek`
    - Converted values: `canadian-dollar-american-dollar-euro-klingon-darsek`
- **The following filter terms must be used inside of the search term**
  - `%` - Symbol for the beginning full-search
  - `:` - Symbol for the division between the field-name and field value
- **Is possible to use precise searching**
  - Both the field name and its value can be wrapped inside invidual limiters
  - Example for both precise: `%"local-currencies":"some-currency"`
  - Example for precise field name: `%"local-currencies":some-currency`
  - Example for precise field value: `%local-currencies:"some-currency"`

- **If your filter-term contained whitespaces, replace them with the `-` symbol**
  - Example: You wish to search for a field called `Local Currencies` that contains `Canadian Dollars` as value, to fully match this tag, you will need to type `%local-currencies:canadian-dollars`
- **It is possible to do a full-text search, checking all fields for the desired text by doing the following: `%:canadian-dollars`**
- **A list of fields/field types the full-search doesn't work with:**
  - The `Break` field type (these are the big titles present throughout the document)
  - The `Tags` field type (this one is covered with a more sophisticated tag filter)
  - The `Switch` field type (this one doesn't contain any text values to even filter and is partially covered by the switch search option)
  - The `Name` field (this one is the main concern of the search and the normal search is far more advanced for searching through this one)
  - The `Belongs under` field (this one is covered by a much more advanced hierarchical path search)
