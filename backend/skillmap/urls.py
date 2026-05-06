from rest_framework.routers import DefaultRouter
from skillmap.views import SkillNodeViewSet, SkillConnectionViewSet

router = DefaultRouter()
router.register("skill-nodes", SkillNodeViewSet, basename="skill-node")
router.register("skill-connections", SkillConnectionViewSet, basename="skill-connection")

urlpatterns = router.urls
