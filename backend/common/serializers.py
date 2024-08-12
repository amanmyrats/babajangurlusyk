from rest_framework.serializers import ModelSerializer

from .models import Currency, Unit


class CurrencyModelSerializer(ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class UnitModelSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'