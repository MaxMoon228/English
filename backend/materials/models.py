from django.db import models
from django.utils.text import slugify
from taxonomy.models import Section, Subsection, Tag


class Material(models.Model):
    STATUS_PUBLISHED = "published"
    STATUS_DRAFT = "draft"
    STATUS_HIDDEN = "hidden"
    STATUS_CHOICES = [
        (STATUS_PUBLISHED, "Published"),
        (STATUS_DRAFT, "Draft"),
        (STATUS_HIDDEN, "Hidden"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    section = models.ForeignKey(Section, on_delete=models.PROTECT, related_name="materials")
    subsection = models.ForeignKey(Subsection, on_delete=models.PROTECT, related_name="materials", null=True, blank=True)
    type = models.CharField(max_length=64)
    level = models.CharField(max_length=32)
    grade = models.CharField(max_length=32, blank=True)
    description_short = models.TextField(blank=True)
    description_full = models.TextField(blank=True)
    author = models.CharField(max_length=255, blank=True)
    tags = models.ManyToManyField(Tag, related_name="materials", blank=True)
    difficulty = models.PositiveSmallIntegerField(null=True, blank=True)
    views = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    cover_image = models.ImageField(upload_to="materials/covers/", null=True, blank=True)
    external_links = models.JSONField(default=list, blank=True)
    featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-date_updated"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or "material"
            slug = base
            index = 1
            while Material.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                index += 1
                slug = f"{base}-{index}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class MaterialFile(models.Model):
    material = models.ForeignKey(Material, related_name="files", on_delete=models.CASCADE)
    file = models.FileField(upload_to="materials/files/%Y/%m/")
    original_name = models.CharField(max_length=255)
    stored_name = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=128, blank=True)
    extension = models.CharField(max_length=20, blank=True)
    size = models.BigIntegerField(default=0)
    kind = models.CharField(max_length=32, default="attachment")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    @property
    def path(self) -> str:
        return self.file.url if self.file else ""


class MaterialRelation(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="relations_from")
    related_material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="relations_to")

    class Meta:
        unique_together = ("material", "related_material")


class Favorite(models.Model):
    client_id = models.CharField(max_length=128)
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="favorites")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("client_id", "material")


class Upload(models.Model):
    file = models.FileField(upload_to="uploads/%Y/%m/")
    original_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=128, blank=True)
    extension = models.CharField(max_length=20, blank=True)
    size = models.BigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    material = models.ForeignKey(Material, on_delete=models.SET_NULL, null=True, blank=True, related_name="uploads")

