from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator

from rest_framework.viewsets import ModelViewSet
from rest_framework import views, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from company.permissions import IsBaslyk, IsAuthenticated, IsOrunbasar, IsIsgar
from .serializers import (
    AccountModelSerializer, AccountRegisterModelSerializer, ChangePasswordSerializer, 
    ProfileSerializer, RoleModelSerializer, AccountRoleModelSerializer, 
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
) 
from .models import Account, Role, AccountRole
from .filtersets import ( AccountFilterSet, )


class AccountModelViewSet(ModelViewSet):
    queryset = Account.objects.all()
    filterset_class = AccountFilterSet
    search_fields = ['username', 'first_name', 'last_name']
    ordering_fields = ['username', 'first_name', 'last_name']
    ordering = ['username', 'first_name', 'last_name']
    permission_classes = [IsAuthenticated, IsOrunbasar]

    def get_serializer_class(self):
        if self.action == 'changepassword':
            return ChangePasswordSerializer
        elif self.action == 'passwordreset':
            return PasswordResetRequestSerializer
        elif self.action == 'passwordresetconfirm':
            return PasswordResetConfirmSerializer
        return AccountModelSerializer

    @action(detail=False, methods=['post'], url_path='changepassword')
    def changepassword(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']
            if new_password != confirm_password:
                return Response({'status': 'Täze parollaryňyz deň bolmaly!'}, status=status.HTTP_400_BAD_REQUEST)
            if user.check_password(old_password):
                user.set_password(new_password)
                user.save()
                return Response({'status': 'Parolyňyz üstünlikli üýtgedildi.'})
            else:
                return Response({'status': 'Ulanyp ýören parolyňyzy ýalňyş ýazdyňyz.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='activatedeactivate')
    def activatedeactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        password = 'babajangurlusyk'
        user.set_password(password)
        user.save()
        return Response({'status': 'Işgäriň üstünlikli aktiwleşdirildi/ýatyryldy.'})


class PublicAccountModelViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountModelSerializer
    filterset_class = AccountFilterSet
    search_fields = ['username', 'first_name', 'last_name']
    ordering_fields = ['username', 'first_name', 'last_name']
    ordering = ['username', 'first_name', 'last_name']
    authentication_classes = []
    permission_classes = []
    
    def list(self, request):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)
    
    def retrieve(self, request, pk=None):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)
    
    def create(self, request):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)
    
    def update(self, request, pk=None):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)
    
    def partial_update(self, request, pk=None):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)
    
    def destroy(self, request, pk=None):
        return Response({'detail': 'Bu işlemi yapmaya yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = AccountModelSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # No need password when registering
            # user.set_password(serializer.validated_data['password'])
            # user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(views.APIView):
    def put(self, request):
        user = request.user
        serializer = ProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RoleModelViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleModelSerializer
    ordering_fields = ['name']
    ordering = ['name']
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class AccountRoleModelViewSet(ModelViewSet):
    queryset = AccountRole.objects.all()
    serializer_class = AccountRoleModelSerializer
    ordering_fields = ['account', 'role']
    ordering = ['account', 'role']
    permission_classes = [IsAuthenticated, IsOrunbasar, ]

