from rest_framework.routers import DefaultRouter
from history.views import ChangeLogViewSet

router = DefaultRouter()
router.register("", ChangeLogViewSet, basename="history")

urlpatterns = router.urls
