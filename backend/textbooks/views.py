from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from textbooks.models import Textbook, TextbookComponent
from textbooks.serializers import TextbookSerializer, TextbookComponentSerializer


class TextbookViewSet(viewsets.ModelViewSet):
    queryset = Textbook.objects.prefetch_related("components").all()
    serializer_class = TextbookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        grade = params.get("grade")
        level = params.get("level")
        publisher = params.get("publisher")
        series = params.get("series")
        if grade:
            queryset = queryset.filter(grade=grade)
        if level:
            queryset = queryset.filter(level=level)
        if publisher:
            queryset = queryset.filter(publisher__icontains=publisher)
        if series:
            queryset = queryset.filter(series__icontains=series)
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(active=True)
        return queryset


class TextbookComponentViewSet(viewsets.ModelViewSet):
    queryset = TextbookComponent.objects.select_related("textbook", "upload").all()
    serializer_class = TextbookComponentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
