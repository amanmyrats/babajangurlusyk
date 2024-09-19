from django.contrib import admin

from .models import (
    Currency, Unit, 
)


admin.site.register(Currency)
admin.site.register(Unit)
