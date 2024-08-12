from decimal import Decimal
from django.db import models


class Currency(models.Model):
    code = models.CharField(max_length=3)
    name = models.CharField(max_length=255)
    sign = models.CharField(max_length=5, null=True, blank=True)
    manat_rate = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        if self.code == 'TMT':
            self.manat_rate = Decimal(1.0000)
        return super(Currency, self).save(*args, **kwargs)

    def __str__(self):
        return self.code


class Unit(models.Model):
    code = models.CharField(max_length=5)
    name = models.CharField(max_length=25)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name