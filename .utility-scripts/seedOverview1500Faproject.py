#!/usr/bin/env python3
"""One-shot overview seed: 4 worlds x 20 classic templates x 1500 random docs.

Uses stdlib sqlite3 so Electron-locked better-sqlite3 is not required.

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

WORLD_SPECS = (
    ("Earth", "#4A90D9"),
    ("Venus", "#D94A4A"),
    ("Lemuria", "#4AD97A"),
    ("Alpha Centauri", "#D9A84A"),
)

# (plural display title, singular title) — order matches overview chart axis
TEMPLATE_SPECS = (
    ("Chapters", "Chapter"),
    ("Lore notes/Other notes", "Lore note/Other note"),
    ("Myths/Legends/Stories", "Myth/Legend/Story"),
    ("Characters", "Character"),
    ("Locations/Geography", "Location/Geography"),
    ("Events", "Event"),
    ("Species/Races/Flora/Fauna", "Species/Race/Flora/Fauna"),
    ("Languages", "Language"),
    ("Cultures/Arts", "Culture/Art"),
    ("Ideologies/Political groups", "Ideology/Political group"),
    ("Teachings/Religious groups", "Teaching/Religious group"),
    ("Organizations/Other groups", "Organization/Other group"),
    ("Schools of Magic/Magical groups", "School of Magic/Magical group"),
    ("Sciences/Technological groups", "Science/Technological group"),
    ("Skills/Spells/Other", "Skill/Spell/Other"),
    ("Items", "Item"),
    ("Occupations/Classes", "Occupation/Class"),
    ("Afflictions/Boons/Conditions", "Affliction/Boon/Condition"),
    ("Resources/Materials", "Resource/Material"),
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

    placements: list[dict] = []
    for world in worlds:
        for root_sort, template in enumerate(templates):
            placement_id = str(uuid.uuid4())
            conn.execute(
                """
                INSERT INTO world_template_placements (
                  id, world_id, document_template_id, group_id, root_sort_order, group_sort_order,
                  nickname, nickname_translations_json, nickname_singular_translations_json,
                  created_at_ms, updated_at_ms
                ) VALUES (?, ?, ?, NULL, ?, NULL, '', '{}', '{}', ?, ?)
                """,
                (placement_id, world["id"], template["id"], root_sort, now_ms, now_ms),
            )
            placements.append(
                {
                    "placement_id": placement_id,
                    "world_id": world["id"],
                    "world_name": world["name"],
                    "template_id": template["id"],
                    "template_name": template["name"],
                }
            )

    # True random split: each doc picks a random world+template placement.
    placement_counts = [0] * len(placements)
    doc_rows: list[tuple] = []
    for _ in range(document_count):
        placement_index = random.randrange(len(placements))
        placement = placements[placement_index]
        sort = placement_counts[placement_index]
        placement_counts[placement_index] = sort + 1
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
    conn.close()

    elapsed = time.time() - started
    print("Done.")
    print(f"  file: {out_path}")
    print(f"  documents: {counted} (target {document_count})")
    print(f"  worlds: {len(WORLD_SPECS)}, templates: {len(TEMPLATE_SPECS)}")
    print(f"  rng seed: {args.seed}")
    print(f"  elapsed: {elapsed:.1f}s")
    print("  per world:")
    for name, count in world_counts:
        print(f"    {name}: {count}")
    print("  per template:")
    for name, count in template_counts:
        print(f"    {name}: {count}")


if __name__ == "__main__":
    main()
