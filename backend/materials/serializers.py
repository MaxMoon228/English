import mimetypes
from pathlib import Path
from rest_framework import serializers
from materials.models import Material, MaterialFile, MaterialRelation, Upload
from taxonomy.models import Tag, Section, Subsection


class MaterialFileSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = MaterialFile
        fields = [
            "id",
            "material",
            "original_name",
            "stored_name",
            "mime_type",
            "extension",
            "size",
            "path",
            "kind",
            "uploaded_at",
            "file",
        ]
        read_only_fields = ["material", "stored_name", "mime_type", "extension", "size", "uploaded_at", "path"]

    def get_path(self, obj: MaterialFile):
        return obj.file.url if obj.file else ""

    def create(self, validated_data):
        upload = validated_data.get("file")
        if upload:
            validated_data["stored_name"] = upload.name
            validated_data["original_name"] = validated_data.get("original_name") or upload.name
            validated_data["size"] = upload.size
            validated_data["extension"] = Path(upload.name).suffix.replace(".", "").lower()
            validated_data["mime_type"] = mimetypes.guess_type(upload.name)[0] or ""
        return super().create(validated_data)


class TagOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "key", "title"]


class MaterialSerializer(serializers.ModelSerializer):
    section_key = serializers.CharField(source="section.key", read_only=True)
    section_title = serializers.CharField(source="section.title", read_only=True)
    subsection_key = serializers.CharField(source="subsection.key", read_only=True)
    subsection_title = serializers.CharField(source="subsection.title", read_only=True)
    tags = TagOutSerializer(many=True, read_only=True)
    tag_titles = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    files = MaterialFileSerializer(many=True, read_only=True)
    related_material_ids = serializers.SerializerMethodField()
    related_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Material
        fields = [
            "id",
            "title",
            "slug",
            "section",
            "section_key",
            "section_title",
            "subsection",
            "subsection_key",
            "subsection_title",
            "type",
            "level",
            "grade",
            "description_short",
            "description_full",
            "author",
            "date_created",
            "date_updated",
            "tags",
            "tag_titles",
            "difficulty",
            "files",
            "related_material_ids",
            "related_ids",
            "views",
            "status",
            "cover_image",
            "external_links",
            "featured",
            "sort_order",
        ]
        read_only_fields = ["slug", "date_created", "date_updated", "views"]
        extra_kwargs = {
            "subsection": {"required": False, "allow_null": True},
        }

    def get_related_material_ids(self, obj: Material):
        return list(obj.relations_from.values_list("related_material_id", flat=True))

    def validate(self, attrs):
        section = attrs.get("section") or getattr(self.instance, "section", None)
        subsection = attrs.get("subsection") if "subsection" in attrs else getattr(self.instance, "subsection", None)
        if subsection and section and subsection.section_id != section.id:
            raise serializers.ValidationError({"subsection": "Subsection does not belong to section."})
        return attrs

    def _set_tags(self, material: Material, tag_titles):
        if tag_titles is None:
            return
        tags = []
        for title in tag_titles:
            normalized = title.strip()
            if not normalized:
                continue
            tag, _ = Tag.objects.get_or_create(
                title=normalized,
                defaults={"key": normalized.lower().replace(" ", "-")},
            )
            tags.append(tag)
        material.tags.set(tags)

    def _set_relations(self, material: Material, related_ids):
        if related_ids is None:
            return
        MaterialRelation.objects.filter(material=material).delete()
        for related_id in related_ids:
            if related_id == material.id:
                continue
            if Material.objects.filter(id=related_id).exists():
                MaterialRelation.objects.get_or_create(material=material, related_material_id=related_id)

    def create(self, validated_data):
        tag_titles = validated_data.pop("tag_titles", [])
        related_ids = validated_data.pop("related_ids", [])
        material = super().create(validated_data)
        self._set_tags(material, tag_titles)
        self._set_relations(material, related_ids)
        return material

    def update(self, instance, validated_data):
        tag_titles = validated_data.pop("tag_titles", None)
        related_ids = validated_data.pop("related_ids", None)
        material = super().update(instance, validated_data)
        self._set_tags(material, tag_titles)
        self._set_relations(material, related_ids)
        return material


class UploadSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = Upload
        fields = ["id", "file", "path", "original_name", "mime_type", "extension", "size", "uploaded_at", "material"]
        read_only_fields = ["path", "mime_type", "extension", "size", "uploaded_at"]

    def get_path(self, obj: Upload):
        return obj.file.url if obj.file else ""

    def create(self, validated_data):
        upload = validated_data.get("file")
        if upload:
            validated_data["original_name"] = validated_data.get("original_name") or upload.name
            validated_data["size"] = upload.size
            validated_data["extension"] = Path(upload.name).suffix.replace(".", "").lower()
            validated_data["mime_type"] = mimetypes.guess_type(upload.name)[0] or ""
        return super().create(validated_data)
