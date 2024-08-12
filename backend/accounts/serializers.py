from rest_framework.serializers import ModelSerializer

from .models import Account, Role


class AccountModelSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class RoleModelSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'