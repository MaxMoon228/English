from rest_framework import serializers
from taxonomy.models import Section, Subsection, Tag, Collection


class SubsectionSerializer(serializers.ModelSerializer):
    section_key = serializers.CharField(source="section.key", read_only=True)

    class Meta:
        model = Subsection
        fields = ["id", "section", "section_key", "key", "title", "description", "sort_order", "active"]


class SectionSerializer(serializers.ModelSerializer):
    subsections = SubsectionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ["id", "key", "title", "description", "icon", "color", "sort_order", "active", "subsections"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "key", "title", "sort_order", "active"]


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "title", "description", "color", "sort_order", "tags"]
