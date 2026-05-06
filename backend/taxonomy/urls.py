from rest_framework.routers import DefaultRouter
from taxonomy.views import SectionViewSet, SubsectionViewSet, TagViewSet, CollectionViewSet

router = DefaultRouter()
router.register("sections", SectionViewSet, basename="section")
router.register("subsections", SubsectionViewSet, basename="subsection")
router.register("tags", TagViewSet, basename="tag")
router.register("collections", CollectionViewSet, basename="collection")

urlpatterns = router.urls
