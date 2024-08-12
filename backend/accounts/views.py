from rest_framework.viewsets import ModelViewSet

from .serializers import AccountModelSerializer, RoleModelSerializer
from .models import Account, Role


class AccountModelViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountModelSerializer


class RoleModelViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleModelSerializer