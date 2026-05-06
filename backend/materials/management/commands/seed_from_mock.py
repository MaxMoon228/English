import json
import subprocess
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from materials.models import Material, MaterialRelation
from skillmap.models import SkillNode, SkillConnection, SkillNodeMaterial
from taxonomy.models import Section, Subsection, Tag, Collection
from textbooks.models import Textbook, TextbookComponent


def _load_mock_payload(mock_path: Path) -> dict:
    if not mock_path.exists():
        raise CommandError(f"mockData.ts not found: {mock_path}")
    node_script = f"""
const fs = require('fs');
const input = fs.readFileSync({json.dumps(str(mock_path))}, 'utf8');
let code = input
  .replace(/export type[\\s\\S]*?;\\n/g, '')
  .replace(/export interface[\\s\\S]*?\\n\\}}\\n/g, '')
  .replace(/ as [A-Za-z0-9_]+/g, '')
  .replace(/const\\s+([A-Za-z0-9_]+)\\s*:\\s*[^=]+=/g, 'const $1 =')
  .replace(/export const /g, 'const ');
code += "\\nconsole.log(JSON.stringify({{ textbooks, materials, skillNodes, skillConnections, sections, popularTopics, collections }}));";
eval(code);
"""
    result = subprocess.run(
        ["node", "-e", node_script],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
        check=False,
    )
    if result.returncode != 0:
        raise CommandError(f"Failed to parse mock data: {result.stderr}")
    return json.loads(result.stdout)


class Command(BaseCommand):
    help = "Seed database from frontend mockData.ts"

    def add_arguments(self, parser):
        parser.add_argument("--mock-path", default="src/app/data/mockData.ts")
        parser.add_argument("--reset", action="store_true")

    def handle(self, *args, **options):
        project_root = Path(__file__).resolve().parents[4]
        mock_path = (project_root / options["mock_path"]).resolve()
        payload = _load_mock_payload(mock_path)

        if options["reset"]:
            SkillConnection.objects.all().delete()
            SkillNodeMaterial.objects.all().delete()
            SkillNode.objects.all().delete()
            MaterialRelation.objects.all().delete()
            Material.objects.all().delete()
            TextbookComponent.objects.all().delete()
            Textbook.objects.all().delete()
            Collection.objects.all().delete()
            Subsection.objects.all().delete()
            Section.objects.all().delete()
            Tag.objects.all().delete()

        section_by_key = {}
        subsection_by_key = {}
        for idx, sec in enumerate(payload.get("sections", [])):
            section, _ = Section.objects.update_or_create(
                key=sec["key"],
                defaults={
                    "title": sec["label"],
                    "description": "",
                    "icon": sec.get("icon", ""),
                    "color": sec.get("color", ""),
                    "sort_order": idx,
                    "active": True,
                },
            )
            section_by_key[sec["key"]] = section
            for sub_idx, sub in enumerate(sec.get("subsections", [])):
                subsection, _ = Subsection.objects.update_or_create(
                    key=sub["key"],
                    defaults={
                        "section": section,
                        "title": sub["label"],
                        "description": "",
                        "sort_order": sub_idx,
                        "active": True,
                    },
                )
                subsection_by_key[sub["key"]] = subsection

        tag_titles = set()
        for material in payload.get("materials", []):
            for tag in material.get("tags", []):
                tag_titles.add(tag.strip())
        for idx, title in enumerate(sorted(tag_titles)):
            existing = Tag.objects.filter(title=title).first()
            if existing:
                continue
            base_key = slugify(title)[:110] or f"tag-{idx}"
            key = base_key
            key_index = 1
            while Tag.objects.filter(key=key).exists():
                key_index += 1
                key = f"{base_key}-{key_index}"
            Tag.objects.create(title=title, key=key, sort_order=idx)
        tag_map = {tag.title: tag for tag in Tag.objects.all()}

        material_map = {}
        for idx, material in enumerate(payload.get("materials", [])):
            section = section_by_key.get(material["section"])
            subsection = subsection_by_key.get(material["subsection"])
            obj, _ = Material.objects.update_or_create(
                slug=slugify(material["title"])[:240] or material["id"],
                defaults={
                    "title": material["title"],
                    "section": section,
                    "subsection": subsection,
                    "type": material.get("type", "worksheet"),
                    "level": material.get("level", ""),
                    "grade": material.get("grade", ""),
                    "description_short": material.get("description", "")[:220],
                    "description_full": material.get("description", ""),
                    "author": material.get("author", ""),
                    "difficulty": material.get("difficulty"),
                    "views": material.get("views") or 0,
                    "status": material.get("status") or Material.STATUS_DRAFT,
                    "external_links": [],
                    "featured": idx < 6,
                    "sort_order": idx,
                },
            )
            obj.tags.set([tag_map[t] for t in material.get("tags", []) if t in tag_map])
            material_map[material["id"]] = obj

        MaterialRelation.objects.all().delete()
        for material in payload.get("materials", []):
            source = material_map.get(material["id"])
            if not source:
                continue
            for related_id in material.get("related", []):
                target = material_map.get(related_id)
                if target:
                    MaterialRelation.objects.get_or_create(material=source, related_material=target)

        for idx, textbook in enumerate(payload.get("textbooks", [])):
            tb, _ = Textbook.objects.update_or_create(
                title=textbook["title"],
                defaults={
                    "series": textbook.get("series", ""),
                    "author": textbook.get("author", ""),
                    "publisher": textbook.get("publisher", ""),
                    "grade": textbook.get("grade", ""),
                    "level": textbook.get("level", ""),
                    "description": textbook.get("description", ""),
                    "cover_color": textbook.get("coverColor", ""),
                    "sort_order": idx,
                    "active": True,
                },
            )
            tb.components.all().delete()
            for comp_idx, component in enumerate(textbook.get("components", [])):
                TextbookComponent.objects.create(textbook=tb, title=component, kind="component", sort_order=comp_idx)

        Collection.objects.all().delete()
        for idx, col in enumerate(payload.get("collections", [])):
            Collection.objects.create(
                title=col["title"],
                description=col.get("description", ""),
                color=col.get("color", ""),
                sort_order=idx,
                tags=col.get("tags", []),
            )

        node_map = {}
        SkillConnection.objects.all().delete()
        SkillNodeMaterial.objects.all().delete()
        SkillNode.objects.all().delete()
        for idx, node in enumerate(payload.get("skillNodes", [])):
            obj = SkillNode.objects.create(
                label=node["label"],
                slug=node["id"],
                x=node.get("x", 0),
                y=node.get("y", 0),
                category=node.get("category", "grammar"),
                goals=node.get("goals", []),
                progress=node.get("progress", 0),
                material_count=node.get("materialCount", 0),
                description=node.get("description", ""),
                sort_order=idx,
            )
            node_map[node["id"]] = obj

            for material in material_map.values():
                tags = [tag.title.lower() for tag in material.tags.all()]
                if node["label"].lower() in " ".join(tags):
                    SkillNodeMaterial.objects.get_or_create(node=obj, material=material)

        for from_id, to_id in payload.get("skillConnections", []):
            from_node = node_map.get(from_id)
            to_node = node_map.get(to_id)
            if from_node and to_node:
                SkillConnection.objects.get_or_create(from_node=from_node, to_node=to_node)

        self.stdout.write(self.style.SUCCESS("Seed completed from mockData.ts"))
