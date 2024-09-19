from django.contrib import admin

from .models import (
    Client, Supplier, Cek, Payment, Category, Product, ExpenseType, Expense
)


admin.site.register(Client)
admin.site.register(Supplier)
admin.site.register(Cek)
admin.site.register(Payment)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ExpenseType)
admin.site.register(Expense)

