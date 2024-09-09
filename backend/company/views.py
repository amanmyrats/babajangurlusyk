from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    ClientModelSerializer, CekModelSerializer, PaymentModelSerializer, 
    CategoryModelSerializer, ProductModelSerializer, 
    ExpenseModelSerializer, ExpenseTypeModelSerializer,
    SupplierModelSerializer, PaymentModelSerializer, 
)
from .models import (
    Client, Supplier, Cek, Payment, Category, Product, ExpenseType, Expense, 
)
from .permissions import IsBaslyk, IsOrunbasar, IsIsgar
from .filtersets import (
    ExpenseFilterSet, ProductFilterSet, ClientFilterSet, CekFilterSet, 
    PaymentFilterSet, 
)


class ProductModelViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductModelSerializer
    filterset_class = ProductFilterSet
    search_fields = ('name', 'name_2', 'name_3', 'description',)
    ordering_fields = ('name', 'category', 'initial_price', 'sale_price', )
    ordering = ('name', 'category', 'initial_price', 'sale_price', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class ClientModelViewSet(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientModelSerializer
    filterset_class = ClientFilterSet
    search_fields = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', 'passport_no', )
    ordering_fields = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', 'passport_no', )
    ordering = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', 'passport_no', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class SupplierModelViewSet(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierModelSerializer
    search_fields = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', )
    ordering_fields = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', )
    ordering = ('first_name', 'last_name', 'phone', 'phone_2', 'phone_3', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class CekModelViewSet(ModelViewSet):
    queryset = Cek.objects.all()
    serializer_class = CekModelSerializer
    filterset_class = CekFilterSet
    search_fields = ('client__first_name', 'client__last_name', 'note', 'no', 'alan_zatlary',  )
    ordering_fields = ('no', 'client', 'supplier', 'is_nesye', 'amount', 'alan_zatlary', 'date', )
    ordering = ('no', 'client', 'supplier', 'is_nesye', 'amount', 'alan_zatlary', 'date', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class PaymentModelViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentModelSerializer
    filterset_class = PaymentFilterSet
    search_fields = ('date', 'client', 'supplier', 'note', )
    ordering_fields = ('date', 'client', 'supplier', 'amount', )
    ordering = ('-date', 'client', 'supplier', 'amount', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class CategoryModelViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    search_fields = ('name', )
    ordering_fields = ('name', )
    ordering = ('name', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class ExpenseTypeModelViewSet(ModelViewSet):
    queryset = ExpenseType.objects.all()
    serializer_class = ExpenseTypeModelSerializer
    search_fields = ('name',)
    ordering_fields = ('name',)
    ordering = ('name',)
    permission_classes = [IsAuthenticated, IsBaslyk, ]


class ExpenseModelViewSet(ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseModelSerializer
    filterset_class = ExpenseFilterSet
    search_fields = ('description',)
    ordering_fields = ('expense_type', 'description', 'amount', 'currency',)
    ordering = ('expense_type', 'description', 'amount', 'currency',)
    permission_classes = [IsAuthenticated, IsBaslyk, ]
