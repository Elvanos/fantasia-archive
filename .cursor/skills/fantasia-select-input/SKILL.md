---
name: fantasia-select-input
description: >-
  Reusable FaSelectInput QSelect chips wrapper and src/scripts/faSelectInput helpers:
  modes simple / document / otherType / tags (media stub), filter highlight, create-new,
  clearIsNewFlags. Use when adding select/chip fields or wiring document/template options.
---

# Fantasia Archive — FaSelectInput

## When to use

Reusable **`q-select`** with chips, filter input, whole-word label highlight, optional create-new → **`FaSelectInput`** from **`src/components/elements/FaSelectInput/`**. **No** one-off chip menus that reimplement this contract.

**Do not** use **`mode="media"`** yet — typed stub; options always normalize to **`[]`**.

**Live smoke only** (not persisted document field): **`DocumentWorkspacePageSelectSmoke`** under dead toggle on **`DocumentWorkspacePage`**.

App Settings enum **`q-select`** stays in **`DialogAppSettingsSettingBlock`** unless product wants this chip UX.

## Public API (SFC)

```vue
<FaSelectInput
  v-model="model"
  mode="document"
  :options="options"
  test-locator="myFeature-select"
  allow-create-new
  @request-options="reloadOptions"
  @new-value="onCreated"
  @change="onChange"
/>
```

| Prop | Role |
| --- | --- |
| **`mode`** | Required — **`simple`** \| **`document`** \| **`otherType`** \| **`tags`** \| **`media`** (stub) |
| **`modelValue`** | String(s) or object item(s) / **`null`** per mode |
| **`options`** | Strings or **`I_faSelectInputObjectItem`** list |
| **`testLocator`** | Root **`data-test-locator`**; chip / option / separator-alt attrs |
| **`allowCreateNew`** | Opt-in Enter create-new (default **`false`**) |
| **`clearInputOnSelect`** | Opt-in clear filter text after select/create (default **`false`**; chip stays) |
| **`chipRemovable`** | Chip X remove control (default **`true`**); set **`false`** for mandatory single (chip stays, no X) |
| **`filterFn`** | Optional override of default filter |
| **`multiple`**, **`label`**, **`loading`**, **`disable`**, Quasar chrome | Standard defaults: dense filled dark, color **`primary-bright`** |

**Emits:** **`update:modelValue`**, **`change`** (`{ action, value }`), **`new-value`**, **`request-options`** (focus + popup-show), **`option-activate`** (option click or Enter on focused option, including single reselect).

**Expose:** **`clearIsNewFlags(ids)`**, **`openPopup()`**.

**Test hooks:** **`{testLocator}`**, **`-filter`**, **`-chip`**, **`-selected`** (inline), **`-option-{index}`**, **`data-test-locator-separator-alt`** on option (index ≥ 1).

## UX behavior

- Default presentation **chips**; **`selectionPresentation="inline"`** for icon+label closed field (no chips)
- **`chipRemovable`** default **`true`**; mandatory single parents set **`false`** (chip, no X)
- Optional object **`color`** tints icons via **`fa-color-glyph`**
- Hide empty single selection chip; **`isNew`** → teal-3 chip else accent; text dark
- Object **`icon`** on chip/option/inline when non-empty
- Filter highlight = whole whitespace-delimited words matching needle words (not letter-only wash)
- **Default:** keyboard-highlight first option on popup-show and after every filter update (model unchanged)
- **Focus opens menu:** Tab / Shift+Tab via **`keyup` Tab** (not `@focus` `showPopup` — that races Quasar click toggle; **`QSelect` `inheritAttrs: false`** drops wrapper `@mousedown`); parents may still call **`openPopup()`** (Quick Add template)
- Menu fixed **600px**, center under field (**`bottom middle`** / **`top middle`**); optional **`popupContentClass`**
- **separatorAlt** via CSS border on option item (single virtual-scroll root); **`virtual-scroll-slice-size` 80** fills tall menus on first open; selected = side bars + idle non-match text; filter **optionMatch** gold on selected too; hover/keyboard wash same as other rows
- Create-new: trim; simple string or object **`{ id: crypto.randomUUID(), name, isNew: true }`**

## File map

| Area | Path |
| --- | --- |
| SFC + styles | **`FaSelectInput.vue`**, **`styles/_variables.scss`**, **`styles/FaSelectInput.unscoped.scss`** |
| Composable | **`scripts/faSelectInput_manager.ts`**, **`scripts/functions/createUseFaSelectInput.ts`** |
| Domain | **`src/scripts/faSelectInput/functions/`** + **`faSelectInput_manager.ts`** barrel |
| Types | **`types/I_faSelectInput.ts`** |
| Storybook | **`_tests/FaSelectInput.stories.ts`** |
| Smoke | **`DocumentWorkspacePageSelectSmoke.vue`** + **`mapDocumentWorkspacePageSelectSmokeOptions.ts`** |

## Modes

| Mode | Options | Empty single |
| --- | --- | --- |
| **`simple`** | strings | **`''`** |
| **`document`** / **`otherType`** / **`tags`** | objects | **`null`** |
| **`media`** | always **`[]`** | stub |

Smoke today: simple + **`otherType`** templates + **`document`** docs via projectContent IPC on **`request-options`**.

## Adding to a new screen

1. Import **`FaSelectInput`**; pick **`mode`**
2. Parent owns **`options`** + reload on **`@request-options`**
3. Unique **`test-locator`**
4. Persist create-new: listen **`@new-value`** / **`@change`**; call **`clearIsNewFlags`** when ids saved
5. Stub in parent Vitest when testing layout only

## Two-level layout

- Level 1: **`src/scripts/faSelectInput/functions/*.ts`** + element **`createUseFaSelectInput`**
- Level 2: element **`faSelectInput_manager.ts`** wires Vue + domain barrel

See [fantasia-two-level-architecture](../fantasia-two-level-architecture/SKILL.md).

## Tests

| Suite | Location |
| --- | --- |
| Vitest (SFC) | **`FaSelectInput/_tests/FaSelectInput.vitest.test.ts`** |
| Vitest (composable) | **`scripts/_tests/createUseFaSelectInput.vitest.test.ts`** |
| Vitest (domain) | **`src/scripts/faSelectInput/functions/_tests/faSelectInputDomain.vitest.test.ts`** |
| Smoke | **`DocumentWorkspacePageSelectSmoke.vitest.test.ts`** |
| Playwright component | **`FaSelectInput/_tests/FaSelectInput.playwright.test.ts`** — Tab open, reopen click, filter type, separator-alt, tall menu fill, selected-option close |

Quick Add dialog PW/E2E also exercise **`FaSelectInput`** world/template fields.

## Related

- [fa-select-input.mdc](../../rules/fa-select-input.mdc)
- [fa-context-menu-dividers.mdc](../../rules/fa-context-menu-dividers.mdc)
- [fantasia-quasar-vue](../fantasia-quasar-vue/SKILL.md)
