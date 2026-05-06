import os
from django.contrib.auth import login as django_login, logout as django_logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


def _get_or_create_editor() -> User:
    username = os.getenv("ADMIN_LOGIN", "EnglishPlatform")
    user, _ = User.objects.get_or_create(username=username, defaults={"is_staff": True, "is_active": True})
    if not user.is_staff:
        user.is_staff = True
        user.save(update_fields=["is_staff"])
    return user


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request):
    return JsonResponse({"ok": True})


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    login_value = request.data.get("login", "")
    password_value = request.data.get("password", "")
    expected_login = os.getenv("ADMIN_LOGIN", "EnglishPlatform")
    expected_password = os.getenv("ADMIN_PASSWORD", "12345")

    if login_value != expected_login or password_value != expected_password:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    user = _get_or_create_editor()
    django_login(request, user)
    return Response({"authenticated": True, "user": {"username": user.username, "is_staff": user.is_staff}})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    django_logout(request)
    return Response({"authenticated": False})


@api_view(["GET"])
@permission_classes([AllowAny])
def session_view(request):
    if request.user.is_authenticated:
        return Response(
            {
                "authenticated": True,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                    "is_staff": request.user.is_staff,
                },
            }
        )
    return Response({"authenticated": False, "user": None})
