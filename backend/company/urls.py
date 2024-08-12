from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    ClientModelViewSet, CekModelViewSet, TolegModelViewSet,
    CategoryModelViewSet, HarytModelViewSet
)


router = DefaultRouter()
router.register('clients', ClientModelViewSet)
router.register('ceks', CekModelViewSet)
router.register('tolegs', TolegModelViewSet)
router.register('categories', CategoryModelViewSet)
router.register('haryts', HarytModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]