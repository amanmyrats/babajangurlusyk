from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (
    ClientModelViewSet, SupplierModelViewSet, CekModelViewSet, PaymentModelViewSet,
    CategoryModelViewSet, ProductModelViewSet, 
    ExpenseTypeModelViewSet, ExpenseModelViewSet, 
)


router = DefaultRouter()
router.register(r'clients', ClientModelViewSet)
router.register(r'suppliers', SupplierModelViewSet)
router.register(r'ceks', CekModelViewSet)
router.register(r'payments', PaymentModelViewSet)
router.register(r'categories', CategoryModelViewSet)
router.register(r'products', ProductModelViewSet)
router.register(r'expensetypes', ExpenseTypeModelViewSet)
router.register(r'expenses', ExpenseModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]