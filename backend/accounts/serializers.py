from django.contrib.auth.hashers import make_password

from rest_framework.serializers import (
    ModelSerializer, IntegerField, CharField, Serializer, 
) 

from .models import Account, Role, AccountRole


class RoleModelSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class AccountRoleModelSerializer(ModelSerializer):
    class Meta:
        model = AccountRole
        fields = '__all__'


class AccountModelSerializer(ModelSerializer):
    role = IntegerField(write_only=True, required=False)
    role_name = CharField(read_only=True, source='account_role.role.name')

    class Meta:
        model = Account
        fields = (
            'id', 'first_name', 'last_name', 
            'is_active', 'is_staff', 'is_superuser', 'date_joined', 
            'role', 'role_name')
        read_only_fields = ('is_active', 'is_staff', 'is_superuser', 'date_joined', 'role_name',)

    def get_role(self, obj):
        if hasattr(obj, 'account_role'):
            return obj.account_role.role.id
        return None
    
    def get_role_name(self, obj):
        if hasattr(obj, 'account_role'):
            return obj.account_role.role.name
        return None

    def create(self, validated_data):
        role_id = validated_data.pop('role', None)
        password = 'babajangurlusyk'
        validated_data['password'] = make_password(password)
        account = super().create(validated_data)
        if role_id:
            role = Role.objects.get(id=role_id)
            AccountRole.objects.create(account=account, role=role)
        return account
    
    def update(self, instance, validated_data):
        role_id = validated_data.pop('role', None)
        if role_id:
            role = Role.objects.get(id=role_id)
            if hasattr(instance, 'account_role'):
                instance.account_role.role = role
                instance.account_role.save()
            else:
                AccountRole.objects.create(account=instance, role=role)
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        # Custom representation to include role information in the output
        representation = super().to_representation(instance)
        if hasattr(instance, 'account_role'):
            representation['role'] = instance.account_role.role.id
        else:
            representation['role'] = None
        return representation
    

class AccountRegisterModelSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ('first_name', 'last_name', 'username', 'phone',)
    

class ChangePasswordSerializer(Serializer):
    old_password = CharField(required=True)
    new_password = CharField(required=True)
    confirm_password = CharField(required=True)


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', )
        read_only_fields = ('is_active', 'is_staff', 'is_superuser', 'date_joined', )


class PasswordResetRequestSerializer(Serializer):
    username = CharField()


class PasswordResetConfirmSerializer(Serializer):
    new_password = CharField(write_only=True)
    confirm_password = CharField(write_only=True)
    uid = CharField(write_only=True)
    token = CharField(write_only=True)
