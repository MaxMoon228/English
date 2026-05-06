from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from taxonomy.models import Section, Subsection, Tag, Collection
from taxonomy.serializers import SectionSerializer, SubsectionSerializer, TagSerializer, CollectionSerializer


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.prefetch_related("subsections").all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class SubsectionViewSet(viewsets.ModelViewSet):
    queryset = Subsection.objects.select_related("section").all()
    serializer_class = SubsectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
