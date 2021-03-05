
# Advanced search guide

---

## Introduction

Fantasia Archive comes with a fairly advanced search-engine present in most of the search fields that look up through either all or at least one type of document - these are for example the multiple and single relationship fields on each document page and the quick-search popup.

---

## Intelligent search matching & sorting

The search itself works the following: You can search any amount of words and the software will process them individually as long as they are separated by whitespace.

### The search follows these rules

- **The search is case-insensitive, which means that you can type everything in UPPER or lower case, it won't matter**
- **Words can be in any order**
  - Example: `Dark scary castle` will be found even if you type `scary castle dark`
- **Even parts of words will result in successful search**
  - Example: `Dark scary castle` will be found even if you type `sca tle ark`
- **Documents will sort based on the following rules:**
  - **Direct match has priority over everything else**
    - Example: `Dark scary castle` is a direct match for a search containing `dark scary castle`
  - **Full word match has priority over fragments**
    - Each fully matched word counts individually; the more full-matches the document has, the higher it will be in the list
    - Example: `Dark scary castle` has 2 full word matches from `dark scary tle`
  - **Fragments are at the bottom of the list**
    - Each fragment matched counts individually; the more fragments the document has, the higher it will be in the list
    - Example: `Dark scary castle` has 2 fragment matches from `sca tle`

---

## Filtering

Except for the advanced search functionality, Fantasia Archive also offers instant filtering via multiple attributes for further narrowing search results.

### The filtering works in the following ways and follows these rules

- **Any of the following filter terms will not conflict with the normal word search**
- **It is possible to only filter by one instance of each of the following filters at once, however, each individual instance may present at the same time**
- **The filter is case-insensitive, which means that you can type everything in UPPER or lower case, it won't matter**
- **If your filter-term contained whitespaces, replace them with the `-` symbol**
  - Example: You wish to search for a tag called `Player Characters`, to fully match this tag, you will need to type `#player-characters`
- **Hierarchical path auto-replaces all `>` symbols in the path, this result in their omission from the filter string**
  - Example: You wish to search for a hierarchical path containing the following `USA > Virginia > Richmond`, to fully match this hierarchical path, you will need to type `>usa-virginia-richmond`
- **The following filter terms may be used**
  - `$` - Symbol for document type search
  - `#` - Symbol for tag search
  - `>` - Symbol for hierarchical path search
  