from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("auth_app.urls")),
    path("api/", include("materials.urls")),
    path("api/", include("taxonomy.urls")),
    path("api/", include("textbooks.urls")),
    path("api/", include("skillmap.urls")),
    path("api/history/", include("history.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
