from typing import Any
from django.contrib.auth.models import AnonymousUser
from history.models import ChangeLog


def log_action(*, user: Any, action: str, entity_type: str, entity_id: str, material=None, payload=None) -> None:
    if isinstance(user, AnonymousUser):
        user = None
    ChangeLog.objects.create(
        user=user,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        material=material,
        payload=payload or {},
    )
