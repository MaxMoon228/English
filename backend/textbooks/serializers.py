from rest_framework import serializers
from textbooks.models import Textbook, TextbookComponent


class TextbookComponentSerializer(serializers.ModelSerializer):
    upload_path = serializers.SerializerMethodField()

    class Meta:
        model = TextbookComponent
        fields = ["id", "title", "kind", "upload", "upload_path", "sort_order"]

    def get_upload_path(self, obj: TextbookComponent):
        if obj.upload and obj.upload.file:
            return obj.upload.file.url
        return ""


class TextbookSerializer(serializers.ModelSerializer):
    components = TextbookComponentSerializer(many=True, read_only=True)

    class Meta:
        model = Textbook
        fields = [
            "id",
            "title",
            "series",
            "author",
            "publisher",
            "grade",
            "level",
            "description",
            "cover_color",
            "cover_image",
            "sort_order",
            "active",
            "components",
        ]
