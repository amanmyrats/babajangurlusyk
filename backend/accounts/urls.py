from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    AccountModelViewSet, RoleModelViewSet, 
    AccountRoleModelViewSet, PublicAccountModelViewSet, 
) 


router = DefaultRouter()
router.register(r'accounts', AccountModelViewSet, basename='accounts')
router.register(r'publicaccounts', PublicAccountModelViewSet, basename='publicaccounts')
router.register(r'roles', RoleModelViewSet)
router.register(r'accountroles', AccountRoleModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]