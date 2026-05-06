from rest_framework.routers import DefaultRouter
from textbooks.views import TextbookViewSet, TextbookComponentViewSet

router = DefaultRouter()
router.register("textbooks", TextbookViewSet, basename="textbook")
router.register("textbook-components", TextbookComponentViewSet, basename="textbook-component")

urlpatterns = router.urls
