from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from history.models import ChangeLog
from history.serializers import ChangeLogSerializer


class ChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChangeLog.objects.select_related("user", "material").all()
    serializer_class = ChangeLogSerializer
    permission_classes = [IsAuthenticated]
