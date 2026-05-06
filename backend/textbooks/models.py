from django.db import models
from materials.models import Upload


class Textbook(models.Model):
    title = models.CharField(max_length=255)
    series = models.CharField(max_length=255, blank=True)
    author = models.CharField(max_length=255, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    grade = models.CharField(max_length=32, blank=True)
    level = models.CharField(max_length=32, blank=True)
    description = models.TextField(blank=True)
    cover_color = models.CharField(max_length=32, blank=True)
    cover_image = models.ImageField(upload_to="textbooks/covers/", null=True, blank=True)
    sort_order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self) -> str:
        return self.title


class TextbookComponent(models.Model):
    textbook = models.ForeignKey(Textbook, related_name="components", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    kind = models.CharField(max_length=64, default="component")
    upload = models.ForeignKey(Upload, on_delete=models.SET_NULL, null=True, blank=True, related_name="textbook_components")
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "title"]
