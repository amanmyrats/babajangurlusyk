from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget

from common.models import Currency, Unit
from .models import (
    Product, Category, 
)


class ProductModelResource(resources.ModelResource):

    initial_price_currency = fields.Field(
        column_name='Gelen Pul Birligi',
        attribute='initial_price_currency',
        widget=ForeignKeyWidget(Currency, 'code')
    )

    sale_price_currency = fields.Field(
        column_name='Satyş Pul Birligi',
        attribute='sale_price_currency',
        widget=ForeignKeyWidget(Currency, 'code')
    )

    unit = fields.Field(
        column_name='Birligi',
        attribute='unit',
        widget=ForeignKeyWidget(Unit, 'name')
    )

    category = fields.Field(
        column_name='Kategoriýa',
        attribute='category',
        widget=ForeignKeyWidget(Category, 'name')
    )

    class Meta:
        model = Product
        import_id_fields = ('id',)
        exclude = ('created_at', 'updated_at', 'created_by',)
