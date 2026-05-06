from django.urls import path
from rest_framework.routers import DefaultRouter
from materials.views import MaterialViewSet, UploadViewSet, dashboard_stats

router = DefaultRouter()
router.register("materials", MaterialViewSet, basename="material")
router.register("uploads", UploadViewSet, basename="upload")

urlpatterns = [
    path("dashboard/stats/", dashboard_stats, name="dashboard-stats"),
]
urlpatterns += router.urls
