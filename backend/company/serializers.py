from rest_framework.serializers import ModelSerializer, SerializerMethodField

from common.serializers import CurrencyModelSerializer, UnitModelSerializer
from .models import (
    Client, Supplier, Cek, Payment, Category, Product, ExpenseType, Expense
)


class CategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductModelSerializer(ModelSerializer):
    initial_price_currency_obj = CurrencyModelSerializer(source='initial_price_currency', read_only=True)
    sale_price_currency_obj = CurrencyModelSerializer(source='sale_price_currency', read_only=True)
    unit_obj = UnitModelSerializer(source='unit', read_only=True)
    category_obj = CategoryModelSerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class ClientModelSerializer(ModelSerializer):
    olaryn_bergisi = SerializerMethodField()
    bizin_bergimiz = SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

    def get_olaryn_bergisi(self, obj):
        return obj.olaryn_bergisi
    
    def get_bizin_bergimiz(self, obj):
        return obj.bizin_bergimiz
    

class SupplierModelSerializer(ModelSerializer):
    olaryn_bergisi = SerializerMethodField()
    bizin_bergimiz = SerializerMethodField()

    class Meta:
        model = Supplier
        fields = '__all__'

    def get_olaryn_bergisi(self, obj):
        return obj.olaryn_bergisi
    
    def get_bizin_bergimiz(self, obj):
        return obj.bizin_bergimiz
    

class CekModelSerializer(ModelSerializer):
    client_obj = ClientModelSerializer(source='client', read_only=True)
    supplier_obj = SupplierModelSerializer(source='supplier', read_only=True)
    referenced_by_obj = ClientModelSerializer(source='referenced_by', read_only=True)

    class Meta:
        model = Cek
        fields = '__all__'

    
class PaymentModelSerializer(ModelSerializer):
    client_obj = ClientModelSerializer(source='client', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'


class ExpenseTypeModelSerializer(ModelSerializer):
    class Meta:
        model = ExpenseType
        fields = '__all__'


class ExpenseModelSerializer(ModelSerializer):
    expense_type_obj = ExpenseTypeModelSerializer(source='expense_type', read_only=True)
    currency_obj = CurrencyModelSerializer(source='currency', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'

