from django.db.models import Q, Sum
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from materials.models import Material, MaterialFile, Upload
from materials.serializers import MaterialSerializer, MaterialFileSerializer, UploadSerializer
from history.services import log_action


class MaterialViewSet(viewsets.ModelViewSet):
    def _update_status(self, request, material: Material, next_status: str):
        if next_status not in {
            Material.STATUS_PUBLISHED,
            Material.STATUS_DRAFT,
            Material.STATUS_HIDDEN,
        }:
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        material.status = next_status
        material.save(update_fields=["status", "date_updated"])
        action_name = "updated"
        if next_status == Material.STATUS_PUBLISHED:
            action_name = "published"
        elif next_status == Material.STATUS_HIDDEN:
            action_name = "hidden"
        log_action(
            user=request.user,
            action=action_name,
            entity_type="material",
            entity_id=str(material.id),
            material=material,
            payload={"status": next_status},
        )
        return Response({"ok": True, "status": material.status})

    queryset = Material.objects.select_related("section", "subsection").prefetch_related("tags", "files", "relations_from").all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        search = params.get("search")
        section = params.get("section")
        subsection = params.get("subsection")
        type_value = params.get("type")
        level = params.get("level")
        grade = params.get("grade")
        difficulty = params.get("difficulty")
        status_value = params.get("status")
        ordering = params.get("ordering")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description_short__icontains=search)
                | Q(description_full__icontains=search)
                | Q(author__icontains=search)
                | Q(tags__title__icontains=search)
            ).distinct()
        if section:
            queryset = queryset.filter(section__key=section)
        if subsection:
            queryset = queryset.filter(subsection__key=subsection)
        if type_value:
            queryset = queryset.filter(type=type_value)
        if level:
            queryset = queryset.filter(level=level)
        if grade:
            queryset = queryset.filter(grade=grade)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if status_value:
            queryset = queryset.filter(status=status_value)
        else:
            if not self.request.user.is_authenticated:
                queryset = queryset.filter(status=Material.STATUS_PUBLISHED)
        if ordering:
            queryset = queryset.order_by(ordering)
        return queryset

    def perform_create(self, serializer):
        material = serializer.save()
        log_action(
            user=self.request.user,
            action="created",
            entity_type="material",
            entity_id=str(material.id),
            material=material,
            payload={"title": material.title},
        )

    def perform_update(self, serializer):
        material = serializer.save()
        log_action(
            user=self.request.user,
            action="updated",
            entity_type="material",
            entity_id=str(material.id),
            material=material,
            payload={"title": material.title},
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="deleted",
            entity_type="material",
            entity_id=str(instance.id),
            material=instance,
            payload={"title": instance.title},
        )
        return super().perform_destroy(instance)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        material = self.get_object()
        return self._update_status(request, material, Material.STATUS_PUBLISHED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def hide(self, request, pk=None):
        material = self.get_object()
        return self._update_status(request, material, Material.STATUS_HIDDEN)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated], url_path="set-status")
    def set_status(self, request, pk=None):
        material = self.get_object()
        next_status = request.data.get("status")
        return self._update_status(request, material, next_status)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def duplicate(self, request, pk=None):
        source = self.get_object()
        clone = Material.objects.create(
            title=f"{source.title} (copy)",
            slug="",
            section=source.section,
            subsection=source.subsection,
            type=source.type,
            level=source.level,
            grade=source.grade,
            description_short=source.description_short,
            description_full=source.description_full,
            author=source.author,
            difficulty=source.difficulty,
            status=Material.STATUS_DRAFT,
            external_links=source.external_links,
            featured=False,
            sort_order=source.sort_order,
        )
        clone.tags.set(source.tags.all())
        log_action(user=request.user, action="created", entity_type="material", entity_id=str(clone.id), material=clone, payload={"duplicated_from": source.id})
        return Response(MaterialSerializer(clone, context={"request": request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated], url_path="upload-file")
    def upload_file(self, request, pk=None):
        material = self.get_object()
        serializer = MaterialFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(material=material)
        log_action(user=request.user, action="file_uploaded", entity_type="material", entity_id=str(material.id), material=material)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], permission_classes=[IsAuthenticated], url_path=r"files/(?P<file_id>\d+)")
    def delete_file(self, request, pk=None, file_id=None):
        material = self.get_object()
        file_obj = MaterialFile.objects.filter(material=material, id=file_id).first()
        if not file_obj:
            return Response({"detail": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        file_obj.delete()
        log_action(user=request.user, action="updated", entity_type="material", entity_id=str(material.id), material=material, payload={"file_deleted": file_id})
        return Response(status=status.HTTP_204_NO_CONTENT)


class UploadViewSet(viewsets.ModelViewSet):
    queryset = Upload.objects.select_related("material").all()
    serializer_class = UploadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    materials = Material.objects.all()
    files_count = MaterialFile.objects.count()
    uploads_count = Upload.objects.count()
    return Response(
        {
            "materials_total": materials.count(),
            "materials_published": materials.filter(status=Material.STATUS_PUBLISHED).count(),
            "materials_draft": materials.filter(status=Material.STATUS_DRAFT).count(),
            "materials_hidden": materials.filter(status=Material.STATUS_HIDDEN).count(),
            "files_total": files_count + uploads_count,
            "views_total": materials.aggregate(total=Sum("views")).get("total") or 0,
            "recent_materials": MaterialSerializer(materials.order_by("-date_updated")[:8], many=True, context={"request": request}).data,
        }
    )
