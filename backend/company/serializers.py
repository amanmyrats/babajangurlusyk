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
    jemi_satyn_alany = SerializerMethodField()
    jemi_eden_tolegi = SerializerMethodField()
    total_ussa_comission = SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

    def get_jemi_satyn_alany(self, obj):
        return obj.jemi_satyn_alany
    
    def get_jemi_eden_tolegi(self, obj):
        return obj.jemi_eden_tolegi
    
    def get_total_ussa_comission(self, obj):
        return obj.total_ussa_comission
    

class SupplierModelSerializer(ModelSerializer):
    jemi_satyn_alanymyz = SerializerMethodField()
    jemi_eden_tolegimiz = SerializerMethodField()

    class Meta:
        model = Supplier
        fields = '__all__'

    def get_jemi_satyn_alanymyz(self, obj):
        return obj.jemi_satyn_alanymyz
    
    def get_jemi_eden_tolegimiz(self, obj):
        return obj.jemi_eden_tolegimiz
    

class CekModelSerializer(ModelSerializer):
    client_obj = ClientModelSerializer(source='client', read_only=True)
    supplier_obj = SupplierModelSerializer(source='supplier', read_only=True)
    referenced_by_obj = ClientModelSerializer(source='referenced_by', read_only=True)

    class Meta:
        model = Cek
        fields = '__all__'

    
class PaymentModelSerializer(ModelSerializer):
    client_obj = ClientModelSerializer(source='client', read_only=True)
    supplier_obj = SupplierModelSerializer(source='supplier', read_only=True)
    
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

