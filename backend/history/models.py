from django.db import models
from django.contrib.auth.models import User
from materials.models import Material


class ChangeLog(models.Model):
    ACTION_CHOICES = [
        ("created", "Created"),
        ("updated", "Updated"),
        ("published", "Published"),
        ("hidden", "Hidden"),
        ("deleted", "Deleted"),
        ("file_uploaded", "File uploaded"),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=32, choices=ACTION_CHOICES)
    entity_type = models.CharField(max_length=64, default="material")
    entity_id = models.CharField(max_length=64)
    material = models.ForeignKey(Material, on_delete=models.SET_NULL, null=True, blank=True, related_name="history_entries")
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
