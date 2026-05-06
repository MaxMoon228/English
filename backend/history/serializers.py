from rest_framework import serializers
from history.models import ChangeLog


class ChangeLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = ChangeLog
        fields = [
            "id",
            "action",
            "entity_type",
            "entity_id",
            "user",
            "user_name",
            "material",
            "payload",
            "created_at",
        ]

    def get_user_name(self, obj: ChangeLog):
        if not obj.user:
            return "System"
        full_name = obj.user.get_full_name().strip()
        return full_name or obj.user.username
