from rest_framework.viewsets import ModelViewSet

from .models import Currency, Unit
from .serializers import CurrencyModelSerializer, UnitModelSerializer


class CurrencyModelViewSet(ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencyModelSerializer


class UnitModelViewSet(ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitModelSerializer