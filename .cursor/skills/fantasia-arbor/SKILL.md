---
name: fantasia-arbor
description: >-
  Project Arbor MCP code graph: callers/callees, impact, map, file graph.
  Use when tracing Vue-manager-functions flow, finding usages, scoping a
  refactor, or blast radius of uncommitted git. Not for i18n strings, locators,
  or connected Vitest path discovery. Fallback Grep/Read if MCP down.
---

# Arbor MCP (project)

Local **stdio** server from project **`.cursor/mcp.json`** (`arbor.exe` **`bridge`**). Machine path — gitignored, do not commit. Agent Window: **Customize** toggle. Rule: [fantasia-arbor.mdc](../../rules/fantasia-arbor.mdc).

Discover tools: **`GetDynamicTools`** pattern **`arbor`**. Call **project** namespace only (not user Arbor). **`GetDynamicTools`** for schema before **`CallDynamicTool`**.

## Default moves

1. **Usages of a function/symbol** → **`search_symbols`** then **`get_callers`**. Confirm hits with Read. Two-level: Vue SFC, **`*_manager.ts`**, **`functions/`**, stores, Electron **`mainScripts/`**.
2. **What does this call?** → **`get_callees`** / **`get_file_graph`**.
3. **A ↔ B coupling** → **`find_path`** / **`get_logic_path`**.
4. **About to edit shared helper** → **`analyze_impact`**. Dirty tree → **`get_blast_radius`**.
5. **New area / big feature** → **`get_map`** (`exclude_test` on) or **`get_architecture_overview`**. Skip dumping huge module lists into chat.

**`explain_symbol`** / **`get_node_detail`** after a search hit. **`batch_query`** for a small set of names. **`audit_security`** only when tracing sinks (IPC, FS, SQL, net).

## Do not substitute Arbor for

- [fantasia-dev-scoped-verify](../fantasia-dev-scoped-verify/SKILL.md) connected **`*.vitest.test.ts`** discovery (colocated + ripgrep)
- Literal copy, **`data-test-*`**, i18n keys, IPC channel strings
- Gates: eslint / **`vue-tsc`** / stylelint / Vitest / Playwright

## Missing MCP

Work proceeds with Grep/Read/Glob. No install lecture unless user asks to wire MCP.

## Graph hygiene

Centrality and **`list_entry_points`** often overweight tests/stubs. Prefer production **`src/`** / **`src-electron/`**. Verify file+line before editing.
