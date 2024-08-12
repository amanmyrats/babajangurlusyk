from rest_framework.viewsets import ModelViewSet

from .serializers import (
    ClientModelSerializer, CekModelSerializer, TolegModelSerializer, 
    CategoryModelSerializer, HarytModelSerializer
)
from .models import (
    Client, Cek, Toleg, Category, Haryt
)


class ClientModelViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientModelSerializer


class CekModelViewSet(ModelViewSet):
    queryset = Cek.objects.all()
    serializer_class = CekModelSerializer


class TolegModelViewSet(ModelViewSet):
    queryset = Toleg.objects.all()
    serializer_class = TolegModelSerializer


class CategoryModelViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer


class HarytModelViewSet(ModelViewSet):
    queryset = Haryt.objects.all()
    serializer_class = HarytModelSerializer