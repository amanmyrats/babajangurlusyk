from rest_framework.serializers import ModelSerializer

from .models import (
    Client, Cek, Toleg, Category, Haryt
)


class ClientModelSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    
class CekModelSerializer(ModelSerializer):
    class Meta:
        model = Cek
        fields = '__all__'

    
class TolegModelSerializer(ModelSerializer):
    class Meta:
        model = Toleg
        fields = '__all__'


class CategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class HarytModelSerializer(ModelSerializer):
    class Meta:
        model = Haryt
        fields = '__all__'