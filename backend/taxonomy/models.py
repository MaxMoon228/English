from django.db import models


class Section(models.Model):
    key = models.SlugField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=64, blank=True)
    color = models.CharField(max_length=32, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self) -> str:
        return self.title


class Subsection(models.Model):
    section = models.ForeignKey(Section, related_name="subsections", on_delete=models.CASCADE)
    key = models.SlugField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["section__sort_order", "sort_order", "title"]

    def __str__(self) -> str:
        return f"{self.section.title} / {self.title}"


class Tag(models.Model):
    key = models.SlugField(max_length=128, unique=True)
    title = models.CharField(max_length=128, unique=True)
    sort_order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self) -> str:
        return self.title


class Collection(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=32, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self) -> str:
        return self.title
