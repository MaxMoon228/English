from django.urls import path
from auth_app.views import login_view, logout_view, session_view, csrf

urlpatterns = [
    path("csrf/", csrf, name="csrf"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("session/", session_view, name="session"),
]
