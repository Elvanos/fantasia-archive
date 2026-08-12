#!/usr/bin/env python3
"""One-shot overview seed: 4 worlds x classic templates x 1500 docs.

Uses stdlib sqlite3 so Electron-locked better-sqlite3 is not required.

Distribution:
  - At least 2 worlds receive every document type
  - Other worlds may omit some types
  - Each active world×type placement gets 10–50 documents
  - Counts are random within that band and sum to the target total

Usage (from repo root):
  python .utility-scripts/seedOverview1500Faproject.py
  python .utility-scripts/seedOverview1500Faproject.py path/to/out.faproject
"""

from __future__ import annotations

import argparse
import json
import random
import sqlite3
import time
import uuid
from pathlib import Path

TOTAL_DOCUMENTS = 1500
USER_VERSION = 8
TREE_ORDER_EMPTY = -9007199254740991
DOC_COUNT_MIN_PER_PLACEMENT = 10
DOC_COUNT_MAX_PER_PLACEMENT = 50
FULL_TEMPLATE_WORLD_MIN = 2

WORLD_SPECS = (
    ("Earth", "#4A90D9"),
    ("Venus", "#D94A4A"),
    ("Lemuria", "#4AD97A"),
    ("Alpha Centauri", "#D9A84A"),
)

# (plural display title, singular title) — order matches overview chart axis
# Spaces around '/' so long titles wrap in FaSelectInput / last-opened lists.
TEMPLATE_SPECS = (
    ("Chapters", "Chapter"),
    ("Lore notes / Other notes", "Lore note / Other note"),
    ("Myths / Legends / Stories", "Myth / Legend / Story"),
    ("Characters", "Character"),
    ("Locations / Geography", "Location / Geography"),
    ("Events", "Event"),
    ("Species / Races / Flora / Fauna", "Species / Race / Flora / Fauna"),
    ("Languages", "Language"),
    ("Cultures / Arts", "Culture / Art"),
    ("Ideologies / Political groups", "Ideology / Political group"),
    ("Teachings / Religious groups", "Teaching / Religious group"),
    ("Organizations / Other groups", "Organization / Other group"),
    ("Schools of Magic / Magical groups", "School of Magic / Magical group"),
    ("Sciences / Technological groups", "Science / Technological group"),
    ("Skills / Spells / Other", "Skill / Spell / Other"),
    ("Items", "Item"),
    ("Occupations / Classes", "Occupation / Class"),
    ("Afflictions / Boons / Conditions", "Affliction / Boon / Condition"),
    ("Resources / Materials", "Resource / Material"),
    ("Currencies", "Currency"),
)

SCHEMA_SQL = f"""
CREATE TABLE IF NOT EXISTS project_data (
  option_id INTEGER PRIMARY KEY,
  option_name TEXT NOT NULL UNIQUE CHECK (length(option_name) BETWEEN 1 AND 255),
  option_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS worlds (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  display_name_translations_json TEXT NOT NULL DEFAULT '{{}}',
  color TEXT NOT NULL DEFAULT '#808080'
  CHECK (color = '' OR (length(color) = 7 AND substr(color, 1, 1) = '#')),
  color_palette TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS document_templates (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  title_translations_json TEXT NOT NULL DEFAULT '{{}}',
  title_singular_translations_json TEXT NOT NULL DEFAULT '{{}}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  world_appendix TEXT NOT NULL DEFAULT '',
  world_appendix_translations_json TEXT NOT NULL DEFAULT '{{}}',
  icon TEXT NOT NULL DEFAULT '',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS world_template_groups (
  id TEXT NOT NULL PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  display_name_translations_json TEXT NOT NULL DEFAULT '{{}}',
  root_sort_order INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS world_template_placements (
  id TEXT NOT NULL PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  document_template_id TEXT NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES world_template_groups(id) ON DELETE SET NULL,
  root_sort_order INTEGER,
  group_sort_order INTEGER,
  nickname TEXT NOT NULL DEFAULT '',
  nickname_translations_json TEXT NOT NULL DEFAULT '{{}}',
  nickname_singular_translations_json TEXT NOT NULL DEFAULT '{{}}',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  UNIQUE (world_id, document_template_id),
  CHECK (
    (group_id IS NULL AND root_sort_order IS NOT NULL AND group_sort_order IS NULL)
    OR
    (group_id IS NOT NULL AND group_sort_order IS NOT NULL AND root_sort_order IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT NOT NULL PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE RESTRICT,
  template_id TEXT REFERENCES document_templates(id) ON DELETE RESTRICT,
  tree_placement_id TEXT REFERENCES world_template_placements(id) ON DELETE RESTRICT,
  tree_parent_document_id TEXT REFERENCES documents(id) ON DELETE CASCADE,
  tree_custom_sort_order INTEGER NOT NULL DEFAULT 0,
  display_name TEXT NOT NULL CHECK (length(display_name) > 0),
  document_text_color TEXT,
  document_background_color TEXT,
  is_category INTEGER NOT NULL DEFAULT 0 CHECK (is_category IN (0, 1)),
  is_finished INTEGER NOT NULL DEFAULT 0 CHECK (is_finished IN (0, 1)),
  is_minor INTEGER NOT NULL DEFAULT 0 CHECK (is_minor IN (0, 1)),
  is_dead INTEGER NOT NULL DEFAULT 0 CHECK (is_dead IN (0, 1)),
  tree_order_number INTEGER NOT NULL DEFAULT {TREE_ORDER_EMPTY},
  extra_classes TEXT NOT NULL DEFAULT '',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS document_media (
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, media_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT NOT NULL PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) > 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS document_tags (
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (document_id, tag_id)
);

CREATE TABLE IF NOT EXISTS opened_documents (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  snapshot_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS document_last_opened (
  document_id TEXT NOT NULL PRIMARY KEY
    REFERENCES documents(id) ON DELETE CASCADE,
  opened_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_world_template_groups_world_root_sort
  ON world_template_groups(world_id, root_sort_order);
CREATE INDEX IF NOT EXISTS idx_world_template_placements_world_root_sort
  ON world_template_placements(world_id, root_sort_order);
CREATE INDEX IF NOT EXISTS idx_world_template_placements_group_sort
  ON world_template_placements(group_id, group_sort_order);
CREATE INDEX IF NOT EXISTS idx_world_template_placements_document_template_id
  ON world_template_placements(document_template_id);
CREATE INDEX IF NOT EXISTS idx_documents_world_id ON documents(world_id);
CREATE INDEX IF NOT EXISTS idx_documents_template_id ON documents(template_id);
CREATE INDEX IF NOT EXISTS idx_documents_tree_placement_parent_sort
  ON documents(tree_placement_id, tree_parent_document_id, tree_custom_sort_order);
CREATE INDEX IF NOT EXISTS idx_document_media_media_id ON document_media(media_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_world_id_name_nocase
  ON tags(world_id, name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_tags_world_id ON tags(world_id);
CREATE INDEX IF NOT EXISTS idx_document_tags_tag_id_sort
  ON document_tags(tag_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_document_last_opened_opened_at_ms
  ON document_last_opened(opened_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_worlds_sort_order ON worlds(sort_order);
CREATE INDEX IF NOT EXISTS idx_document_templates_sort_order ON document_templates(sort_order);
"""


def en_us_json(value: str) -> str:
    return json.dumps({"en-US": value}, separators=(",", ":"))


def pick_active_world_template_pairs (
    world_count: int,
    template_count: int,
    *,
    full_world_min: int,
    total_documents: int,
    count_lo: int,
    count_hi: int,
) -> list[tuple[int, int]]:
    """Return (world_index, template_index) pairs that receive documents.

    At least `full_world_min` worlds get every template. Other worlds get a random
    non-empty subset. Pair count is forced into [ceil(total/hi), floor(total/lo)].
    """
    if world_count < full_world_min:
        raise ValueError("world_count must be >= full_world_min")
    min_pairs = (total_documents + count_hi - 1) // count_hi
    max_pairs = total_documents // count_lo
    hard_max = world_count * template_count
    if min_pairs > hard_max or min_pairs > max_pairs:
        raise ValueError(
            f"Cannot place {total_documents} docs with [{count_lo},{count_hi}] "
            f"per placement across {hard_max} max pairs"
        )

    full_world_count = random.randint(full_world_min, world_count)
    full_worlds = set(random.sample(range(world_count), full_world_count))
    pairs: set[tuple[int, int]] = set()
    for world_index in full_worlds:
        for template_index in range(template_count):
            pairs.add((world_index, template_index))

    other_worlds = [index for index in range(world_count) if index not in full_worlds]
    # Fill remaining worlds with random subsets until pair count is in range.
    target_pairs = random.randint(max(min_pairs, len(pairs)), min(max_pairs, hard_max))
    for world_index in other_worlds:
        if len(pairs) >= target_pairs:
            break
        # Keep at least one type so the world is not empty of docs.
        keep = random.randint(1, template_count)
        chosen = random.sample(range(template_count), keep)
        for template_index in chosen:
            if len(pairs) >= target_pairs:
                break
            pairs.add((world_index, template_index))

    # If still short (unlikely), add random missing pairs.
    while len(pairs) < min_pairs:
        candidate = (random.randrange(world_count), random.randrange(template_count))
        pairs.add(candidate)

    # If over max_pairs, drop from non-full worlds first.
    if len(pairs) > max_pairs:
        droppable = [
            pair for pair in pairs if pair[0] not in full_worlds
        ]
        random.shuffle(droppable)
        for pair in droppable:
            if len(pairs) <= max_pairs:
                break
            # Never empty a world entirely if it still has only one pair.
            world_index = pair[0]
            world_pair_count = sum(1 for item in pairs if item[0] == world_index)
            if world_pair_count <= 1:
                continue
            pairs.discard(pair)
        while len(pairs) > max_pairs:
            # Last resort: trim from full worlds (still keep full_world_min intact
            # by only trimming extras beyond the required full set — skip if all
            # remaining are required full coverage).
            extras = [pair for pair in pairs if pair[0] not in full_worlds]
            if not extras:
                break
            pairs.discard(extras[0])

    if not (min_pairs <= len(pairs) <= max_pairs):
        raise RuntimeError(
            f"Active pair count {len(pairs)} outside [{min_pairs}, {max_pairs}]"
        )
    return sorted(pairs)


def allocate_placement_counts (
    placement_count: int,
    total_documents: int,
    *,
    count_lo: int,
    count_hi: int,
) -> list[int]:
    """Random ints in [lo, hi] that sum to total_documents."""
    if placement_count * count_lo > total_documents:
        raise ValueError("total too small for placement minimums")
    if placement_count * count_hi < total_documents:
        raise ValueError("total too large for placement maximums")
    counts = [count_lo] * placement_count
    remaining = total_documents - placement_count * count_lo
    while remaining > 0:
        index = random.randrange(placement_count)
        room = count_hi - counts[index]
        if room <= 0:
            continue
        add = min(remaining, room, random.randint(1, room))
        counts[index] += add
        remaining -= add
    return counts


def main() -> None:
    default_out = Path(r"C:\Users\xfeni\Files\FA Perf Tests") / "overview-4worlds-1500.faproject"

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "out_path",
        nargs="?",
        default=str(default_out),
        help=f"Output .faproject path (default: {default_out})",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="RNG seed for reproducible random split (default: 42)",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=TOTAL_DOCUMENTS,
        help=f"Total documents to insert (default: {TOTAL_DOCUMENTS})",
    )
    args = parser.parse_args()

    if args.count < 1:
        raise SystemExit("--count must be >= 1")

    random.seed(args.seed)
    out_path = Path(args.out_path).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if out_path.exists():
        out_path.unlink()

    document_count = args.count
    started = time.time()
    print(f"Seeding {document_count} documents -> {out_path}")

    now_ms = int(time.time() * 1000)
    conn = sqlite3.connect(out_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA synchronous = OFF")
    conn.executescript(SCHEMA_SQL)
    conn.execute(f"PRAGMA user_version = {USER_VERSION}")

    project_name = "Overview 4 Worlds 1500"
    project_uuid = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO project_data (option_name, option_value) VALUES (?, ?)",
        ("project_name", project_name),
    )
    conn.execute(
        "INSERT INTO project_data (option_name, option_value) VALUES (?, ?)",
        ("project_uuid", project_uuid),
    )

    worlds: list[dict] = []
    for index, (name, color) in enumerate(WORLD_SPECS):
        world_id = str(uuid.uuid4())
        conn.execute(
            """
            INSERT INTO worlds (
              id, display_name, display_name_translations_json, color, color_palette,
              sort_order, created_at_ms, updated_at_ms
            ) VALUES (?, ?, ?, ?, '', ?, ?, ?)
            """,
            (world_id, name, en_us_json(name), color, index, now_ms, now_ms),
        )
        worlds.append({"id": world_id, "name": name})

    templates: list[dict] = []
    for index, (plural, singular) in enumerate(TEMPLATE_SPECS):
        template_id = str(uuid.uuid4())
        conn.execute(
            """
            INSERT INTO document_templates (
              id, display_name, title_translations_json, title_singular_translations_json,
              sort_order, world_appendix, world_appendix_translations_json, icon,
              created_at_ms, updated_at_ms
            ) VALUES (?, ?, ?, ?, ?, '', '{}', '', ?, ?)
            """,
            (
                template_id,
                plural,
                en_us_json(plural),
                en_us_json(singular),
                index,
                now_ms,
                now_ms,
            ),
        )
        templates.append({"id": template_id, "name": plural})

    active_pairs = pick_active_world_template_pairs(
        len(worlds),
        len(templates),
        full_world_min=FULL_TEMPLATE_WORLD_MIN,
        total_documents=document_count,
        count_lo=DOC_COUNT_MIN_PER_PLACEMENT,
        count_hi=DOC_COUNT_MAX_PER_PLACEMENT,
    )
    placement_counts = allocate_placement_counts(
        len(active_pairs),
        document_count,
        count_lo=DOC_COUNT_MIN_PER_PLACEMENT,
        count_hi=DOC_COUNT_MAX_PER_PLACEMENT,
    )

    placements: list[dict] = []
    for pair_index, (world_index, template_index) in enumerate(active_pairs):
        world = worlds[world_index]
        template = templates[template_index]
        placement_id = str(uuid.uuid4())
        conn.execute(
            """
            INSERT INTO world_template_placements (
              id, world_id, document_template_id, group_id, root_sort_order, group_sort_order,
              nickname, nickname_translations_json, nickname_singular_translations_json,
              created_at_ms, updated_at_ms
            ) VALUES (?, ?, ?, NULL, ?, NULL, '', '{}', '{}', ?, ?)
            """,
            (
                placement_id,
                world["id"],
                template["id"],
                template_index,
                now_ms,
                now_ms,
            ),
        )
        placements.append(
            {
                "count": placement_counts[pair_index],
                "placement_id": placement_id,
                "world_id": world["id"],
                "world_name": world["name"],
                "template_id": template["id"],
                "template_name": template["name"],
            }
        )

    # Per active placement: random count in [10, 50], names like "Template #n".
    doc_rows: list[tuple] = []
    for placement in placements:
        for sort in range(placement["count"]):
            doc_id = str(uuid.uuid4())
            name = f"{placement['template_name']} #{sort + 1}"
            doc_rows.append(
                (
                    doc_id,
                    placement["world_id"],
                    placement["template_id"],
                    placement["placement_id"],
                    None,
                    sort,
                    name,
                    TREE_ORDER_EMPTY,
                    now_ms,
                    now_ms,
                )
            )

    random.shuffle(doc_rows)

    insert_sql = """
      INSERT INTO documents (
        id, world_id, template_id, tree_placement_id, tree_parent_document_id,
        tree_custom_sort_order, display_name, document_text_color, document_background_color,
        is_category, is_finished, is_minor, is_dead, tree_order_number, extra_classes,
        created_at_ms, updated_at_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, 0, 0, 0, 0, ?, '', ?, ?)
    """
    conn.executemany(insert_sql, doc_rows)

    conn.commit()
    conn.execute("PRAGMA synchronous = FULL")
    quick_check = conn.execute("PRAGMA quick_check").fetchone()[0]
    if quick_check != "ok":
        raise RuntimeError(f"quick_check failed: {quick_check}")

    counted = conn.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
    world_counts = conn.execute(
        """
        SELECT w.display_name, COUNT(d.id)
        FROM worlds w
        LEFT JOIN documents d ON d.world_id = w.id
        GROUP BY w.id
        ORDER BY w.sort_order
        """
    ).fetchall()
    template_counts = conn.execute(
        """
        SELECT t.display_name, COUNT(d.id)
        FROM document_templates t
        LEFT JOIN documents d ON d.template_id = t.id
        GROUP BY t.id
        ORDER BY t.sort_order
        """
    ).fetchall()
    placement_stats = conn.execute(
        """
        SELECT w.display_name, t.display_name, COUNT(d.id) AS doc_count
        FROM world_template_placements p
        JOIN worlds w ON w.id = p.world_id
        JOIN document_templates t ON t.id = p.document_template_id
        LEFT JOIN documents d ON d.tree_placement_id = p.id
        GROUP BY p.id
        ORDER BY w.sort_order, t.sort_order
        """
    ).fetchall()
    world_template_coverage = conn.execute(
        """
        SELECT w.display_name, COUNT(DISTINCT p.document_template_id) AS template_count
        FROM worlds w
        LEFT JOIN world_template_placements p ON p.world_id = w.id
        GROUP BY w.id
        ORDER BY w.sort_order
        """
    ).fetchall()
    conn.close()

    elapsed = time.time() - started
    print("Done.")
    print(f"  file: {out_path}")
    print(f"  documents: {counted} (target {document_count})")
    print(f"  worlds: {len(WORLD_SPECS)}, templates: {len(TEMPLATE_SPECS)}")
    print(f"  active world×template placements: {len(placements)}")
    print(
        f"  docs per placement: [{DOC_COUNT_MIN_PER_PLACEMENT}, {DOC_COUNT_MAX_PER_PLACEMENT}]"
    )
    print(f"  rng seed: {args.seed}")
    print(f"  elapsed: {elapsed:.1f}s")
    print("  templates per world:")
    for name, template_count in world_template_coverage:
        print(f"    {name}: {template_count}/{len(TEMPLATE_SPECS)}")
    print("  per world:")
    for name, count in world_counts:
        print(f"    {name}: {count}")
    print("  per template:")
    for name, count in template_counts:
        print(f"    {name}: {count}")
    counts_only = [row[2] for row in placement_stats]
    if counts_only:
        print(
            f"  placement doc counts: min={min(counts_only)} max={max(counts_only)} "
            f"n={len(counts_only)}"
        )


if __name__ == "__main__":
    main()
