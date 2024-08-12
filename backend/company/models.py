from django.db import models
from django.utils import timezone

from common.models import Currency, Unit


class Client(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=255)
    phone_2 = models.CharField(max_length=255, null=True, blank=True)
    phone_3 = models.CharField(max_length=255, null=True, blank=True)
    passport_no = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['phone'], name='unique_phone')
        ]

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

class Cek(models.Model):
    nomer = models.CharField(max_length=255, null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    is_nesye = models.BooleanField(default=True)
    summa = models.DecimalField(max_digits=10, decimal_places=2)
    alan_zatlary = models.TextField(null=True, blank=True)
    bellik = models.TextField(null=True, blank=True)
    date = models.DateField(default=timezone.now().date())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Cek: {self.client.first_name} {self.date} {self.summa}'
    

class Toleg(models.Model):
    nomer = models.CharField(max_length=255, null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    summa = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now().date())
    bellik = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Toleg: {self.client.first_name} {self.date} {self.summa}'
    

class Category(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    @property
    def children(self):
        return Category.objects.filter(parent=self)
    
    def __str__(self):
        return self.name
    

class Haryt(models.Model):
    ady = models.CharField(max_length=255)
    ady_2 = models.CharField(max_length=255, null=True, blank=True)
    ady_3 = models.CharField(max_length=255, null=True, blank=True)
    birligi = models.ForeignKey(Unit, on_delete=models.PROTECT)
    gelen_bahasy = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gelen_pul_birligi = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='gelen_pul_birligi')
    satlyk_bahasy = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    satlyk_pul_birligi = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='satlyk_pul_birligi')
    kategoriya = models.ForeignKey(Category, on_delete=models.PROTECT)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ady
