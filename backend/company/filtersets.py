from django_filters import rest_framework as filters

from .models import (
    Client, Supplier, Payment, Cek, Category, Product, Expense, 
) 


class ProductFilterSet(filters.FilterSet):
    class Meta:
        model = Product
        fields = '__all__'


class ClientFilterSet(filters.FilterSet):
    class Meta:
        model = Client
        fields = '__all__'


class SupplierFilterSet(filters.FilterSet):
    class Meta:
        model = Supplier
        fields = '__all__'


class PaymentFilterSet(filters.FilterSet):
    class Meta:
        model = Payment
        fields = '__all__'


class CekFilterSet(filters.FilterSet):
    class Meta:
        model = Cek
        fields = '__all__'


class CategoryFilterSet(filters.FilterSet):
    class Meta:
        model = Category
        fields = '__all__'


class ExpenseFilterSet(filters.FilterSet):
    class Meta:
        model = Expense
        fields = '__all__'
