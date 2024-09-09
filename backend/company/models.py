from django.db import models
from django.utils import timezone

from common.models import Currency, Unit


PARTNER_TYPES = [
    ('CLIENT', 'Müşderi'), 
    ('SUPPLIER', 'Telekeçi')
]

PAYMENT_TYPES = [
    ('IN', 'Gelen Töleg'), 
    ('OUT', 'Giden Töleg')
]

CEK_TYPES = [
    ('IN', 'Satyn Alyş Çegi'), 
    ('OUT', 'Satyş Çegi')
]

class Product(models.Model):
    name = models.CharField(max_length=255)
    name_2 = models.CharField(max_length=255, null=True, blank=True)
    name_3 = models.CharField(max_length=255, null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)
    initial_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    initial_price_currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='gelen_pul_birligi')
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price_currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='satys_pul_birligi')
    category = models.ForeignKey('Category', on_delete=models.PROTECT)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Client(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    is_ussa = models.BooleanField(default=False)
    phone = models.CharField(max_length=255, unique=True)
    phone_2 = models.CharField(max_length=255, null=True, blank=True)
    phone_3 = models.CharField(max_length=255, null=True, blank=True)
    passport_no = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def olaryn_bergisi(self):
        nesye_sowda = Cek.objects.filter(client=self, is_nesye=True, cek_type='IN').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return nesye_sowda
    
    @property
    def bizin_bergimiz(self):
        return 0.00
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

class Supplier(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=255, unique=True)
    phone_2 = models.CharField(max_length=255, null=True, blank=True)
    phone_3 = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def olaryn_bergisi(self):
        return 0.00

    @property
    def bizin_bergimiz(self):
        nesye_out = Cek.objects.filter(supplier=self, is_nesye=True, cek_type='OUT').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return nesye_out
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    

class Cek(models.Model):
    no = models.CharField(max_length=255, null=True, blank=True)
    partner_type = models.CharField(max_length=255, choices=PARTNER_TYPES)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, null=True, blank=True)
    cek_type = models.CharField(max_length=255, choices=CEK_TYPES)
    is_nesye = models.BooleanField(default=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    alan_zatlary = models.TextField(null=True, blank=True)
    referenced_by = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='referenced_by', null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=timezone.now().date())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.partner_type == 'CLIENT' and self.supplier:
            self.supplier = None
        elif self.partner_type == 'SUPPLIER' and self.client:
            self.client = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Cek: {self.client.first_name} {self.date} {self.amount}'
    

class Payment(models.Model):    
    
    no = models.CharField(max_length=255, null=True, blank=True)
    partner_type = models.CharField(max_length=255, choices=PARTNER_TYPES)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, null=True, blank=True)
    payment_type = models.CharField(max_length=255, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=timezone.now().date())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.partner_type == 'CLIENT' and self.supplier:
            self.supplier = None
        elif self.partner_type == 'SUPPLIER' and self.client:
            self.client = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Payment: {self.client.first_name} {self.date} {self.amount}'
    

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class ExpenseType(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ExpenseType: {self.name}"
    

class Expense(models.Model):
    expense_type = models.ForeignKey(ExpenseType, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.ForeignKey(Currency, on_delete=models.DO_NOTHING)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"{self.expense_type} - {self.amount} {self.currency}"

