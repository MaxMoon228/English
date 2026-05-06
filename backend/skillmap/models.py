from django.db import models
from materials.models import Material


class SkillNode(models.Model):
    CATEGORY_CHOICES = [
        ("grammar", "Grammar"),
        ("vocabulary", "Vocabulary"),
        ("writing", "Writing"),
        ("culture", "Culture"),
        ("speaking", "Speaking"),
    ]
    label = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    x = models.PositiveIntegerField(default=0)
    y = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    goals = models.JSONField(default=list, blank=True)
    progress = models.PositiveSmallIntegerField(default=0)
    material_count = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)
    materials = models.ManyToManyField(Material, related_name="skill_nodes", through="SkillNodeMaterial", blank=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.label


class SkillConnection(models.Model):
    from_node = models.ForeignKey(SkillNode, related_name="connections_from", on_delete=models.CASCADE)
    to_node = models.ForeignKey(SkillNode, related_name="connections_to", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("from_node", "to_node")


class SkillNodeMaterial(models.Model):
    node = models.ForeignKey(SkillNode, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("node", "material")
