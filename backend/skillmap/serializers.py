from rest_framework import serializers
from skillmap.models import SkillNode, SkillConnection


class SkillNodeSerializer(serializers.ModelSerializer):
    material_ids = serializers.SerializerMethodField()

    class Meta:
        model = SkillNode
        fields = [
            "id",
            "label",
            "slug",
            "x",
            "y",
            "category",
            "goals",
            "progress",
            "material_count",
            "description",
            "sort_order",
            "material_ids",
        ]

    def get_material_ids(self, obj: SkillNode):
        return list(obj.materials.values_list("id", flat=True))


class SkillConnectionSerializer(serializers.ModelSerializer):
    from_node_slug = serializers.CharField(source="from_node.slug", read_only=True)
    to_node_slug = serializers.CharField(source="to_node.slug", read_only=True)

    class Meta:
        model = SkillConnection
        fields = ["id", "from_node", "to_node", "from_node_slug", "to_node_slug"]
