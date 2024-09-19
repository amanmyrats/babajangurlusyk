from django.http import HttpResponse

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response

from import_export.formats.base_formats import DEFAULT_FORMATS

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
from .resources import ProductModelResource


class ProductModelViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductModelSerializer
    filterset_class = ProductFilterSet
    search_fields = ('name', 'name_2', 'name_3', 'description',)
    ordering_fields = ('name', 'category', 'initial_price', 'sale_price', )
    ordering = ('name', 'category', 'initial_price', 'sale_price', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]

    @action(detail=False, methods=['get'])
    def export(self, request, *args, **kwargs):
        # Use the same queryset as for list view, but without pagination
        queryset = self.filter_queryset(self.get_queryset())

        # Export data using the resource
        resource = ProductModelResource()
        dataset = resource.export(queryset=queryset[:1000])
        
        export_format = request.query_params.get('format', 'xlsx').lower()
        print('export_format', export_format)
        if export_format == 'csv':
            export_data = dataset.csv
            content_type = 'text/csv'
            extension = 'csv'
            response_data = export_data.encode('utf-8')
        elif export_format == 'json':
            export_data = dataset.json
            content_type = 'application/json'
            extension = 'json'
            response_data = export_data.encode('utf-8')
        else:  # Default to XLSX
            export_data = dataset.xlsx
            content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            extension = 'xlsx'
            response_data = export_data
        
        # Use HttpResponse for binary data to avoid any encoding issues
        response = HttpResponse(response_data, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="harytlar.{extension}"'
        return response
    
    @action(detail=False, methods=['post'])
    def import_data(self, request, *args, **kwargs):
        resource = ProductModelResource()
        file = request.FILES.get('file')
        
        if not file:
            return Response({'error': 'Excel faýl saýlaň!'}, status=status.HTTP_400_BAD_REQUEST)
        
        file_format = None
        for format in DEFAULT_FORMATS:
            if format().is_binary() and file.name.endswith(format().get_extension()):
                file_format = format()
                break

        if file_format is None:
            return Response({'error': 'Excel xlsx formatynda bolmaly.'}, status=status.HTTP_400_BAD_REQUEST)

        dataset = file_format.create_dataset(file.read())
        result = resource.import_data(dataset, dry_run=True)  # Dry run to check for errors
        # print('result', result)
        # print(dir(result))
        # print('result.has_errors()', result.has_errors())
        # print('result.row_errors()', result.row_errors())
        # print('result.error_rows', result.error_rows)
        # print('result.base_errors', result.base_errors)
        for er in result.error_rows:
            print(er.errors, er.number)

        if result.has_errors():
            return Response({'errors': result.row_errors()}, status=status.HTTP_400_BAD_REQUEST)

        resource.import_data(dataset, dry_run=False)  # Perform actual import
        return Response({'status': 'Üstünlikli ýerine ýetirildi.'}, status=status.HTTP_200_OK)




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
    ordering_fields = ('-updated_at', 'no', 'client', 'supplier', 'is_nesye', 'amount', 'alan_zatlary', 'date', )
    ordering = ('-updated_at', 'no', 'client', 'supplier', 'is_nesye', 'amount', 'alan_zatlary', 'date', )
    permission_classes = [IsAuthenticated, IsOrunbasar, ]


class PaymentModelViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentModelSerializer
    filterset_class = PaymentFilterSet
    search_fields = ('date', 'client', 'supplier', 'note', )
    ordering_fields = ('-updated_at', '-date', 'client', 'supplier', 'amount', )
    ordering = ('-updated_at', '-date', 'client', 'supplier', 'amount', )
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
