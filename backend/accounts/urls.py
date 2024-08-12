from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import AccountModelViewSet, RoleModelViewSet


router = DefaultRouter()
router.register('accounts', AccountModelViewSet)
router.register('roles', RoleModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]