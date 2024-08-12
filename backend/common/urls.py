from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CurrencyModelViewSet, UnitModelViewSet


router = DefaultRouter()
router.register('currencies', CurrencyModelViewSet)
router.register('units', UnitModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]