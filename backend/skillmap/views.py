from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from skillmap.models import SkillNode, SkillConnection
from skillmap.serializers import SkillNodeSerializer, SkillConnectionSerializer


class SkillNodeViewSet(viewsets.ModelViewSet):
    queryset = SkillNode.objects.prefetch_related("materials").all()
    serializer_class = SkillNodeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        goal = self.request.query_params.get("goal")
        if goal and goal != "all":
            queryset = queryset.filter(goals__contains=[goal])
        return queryset


class SkillConnectionViewSet(viewsets.ModelViewSet):
    queryset = SkillConnection.objects.select_related("from_node", "to_node").all()
    serializer_class = SkillConnectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
