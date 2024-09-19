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
    ('SATYN_ALYS', 'Satyn Alyş Çegi'), 
    ('SATYS', 'Satyş Çegi')
]

class Product(models.Model):
    name = models.CharField(max_length=255)
    name_2 = models.CharField(max_length=255, null=True, blank=True)
    name_3 = models.CharField(max_length=255, null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT, null=True, blank=True)
    initial_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    initial_price_currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='gelen_pul_birligi', null=True, blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price_currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='satys_pul_birligi', null=True, blank=True)
    category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True, blank=True)
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
    def jemi_satyn_alany(self):
        jemi_cek = Cek.objects.filter(
            client=self, 
            cek_type='SATYS').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return jemi_cek
    
    @property
    def jemi_eden_tolegi(self):
        # get total payment of this client
        jemi_tolegi = Payment.objects.filter(
            client=self,
            payment_type='IN').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return jemi_tolegi
    
    @property
    def total_ussa_comission(self):
        # get total comission of this client if he is ussa from all ceks
        total_comission = Cek.objects.filter(
            referenced_by=self).aggregate(models.Sum('reference_comission'))['reference_comission__sum'] or 0.00
        return total_comission
    
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
    def jemi_satyn_alanymyz(self):
        # get all Ceks of this supplier
        jemi_cek = Cek.objects.filter(
            supplier=self,
            cek_type='SATYN_ALYS').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return jemi_cek

    @property
    def jemi_eden_tolegimiz(self):
        jemi_toleg = Payment.objects.filter(
            supplier=self, 
            payment_type='OUT').aggregate(models.Sum('amount'))['amount__sum'] or 0.00
        return jemi_toleg
    
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
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=timezone.now().date())
    referenced_by = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='referenced_by', null=True, blank=True)
    reference_percentage = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    reference_comission = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-date']

    def save(self, *args, **kwargs):
        if self.partner_type == 'CLIENT':
            self.cek_type = 'SATYS'
            self.supplier = None
        elif self.partner_type == 'SUPPLIER':
            self.cek_type = 'SATYN_ALYS'
            self.client = None
        if not self.client and not self.supplier:
            raise ValueError('Müşderi ýa-da telekeçi saýlanmaly')
        if self.referenced_by and self.reference_percentage:
            self.reference_comission = self.amount * self.reference_percentage / 100
        super().save(*args, **kwargs)

        if not self.is_nesye:
            if self.partner_type == 'CLIENT':
                # get or create paymant with this object
                payment, created = Payment.objects.get_or_create(
                    cek=self,
                )
                if payment:
                    payment.partner_type = 'CLIENT'
                    payment.client = self.client
                    payment.supplier = None
                    payment.payment_type = 'IN'
                    payment.amount = self.amount
                    payment.date = self.date
                    payment.note = "Nagt çek goşulanda, müşderiniň eden tölegi hem awtomat goşuldy"
                    payment.save()
            elif self.partner_type == 'SUPPLIER':
                payment, created = Payment.objects.get_or_create(
                    cek=self,
                )
                if payment:
                    payment.partner_type = 'SUPPLIER'
                    payment.supplier = self.supplier
                    payment.client = None
                    payment.payment_type = 'OUT'
                    payment.amount = self.amount
                    payment.date = self.date
                    payment.note = "Nagt çek goşulanda, telekeçä edilen töleg hem awtomat goşuldy"
                    payment.save()
        if self.is_nesye:
            # Delete related payment if exists
            Payment.objects.filter(cek=self).delete()

    def __str__(self):
        if self.client:
            return f'Cek: {self.client.first_name} {self.date} {self.amount}'
        if self.supplier:
            return f'Cek: {self.supplier.first_name} {self.date} {self.amount}'
        super().__str__()


class Payment(models.Model):    
    
    no = models.CharField(max_length=255, null=True, blank=True)
    partner_type = models.CharField(max_length=255, choices=PARTNER_TYPES)
    client = models.ForeignKey(Client, on_delete=models.PROTECT, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, null=True, blank=True)
    payment_type = models.CharField(max_length=255, choices=PAYMENT_TYPES)
    cek = models.OneToOneField(Cek, on_delete=models.PROTECT, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=timezone.now().date())
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.partner_type == 'CLIENT':
            self.supplier = None
        elif self.partner_type == 'SUPPLIER':
            self.client = None
        super().save(*args, **kwargs)

    def __str__(self):
        if self.client:
            return f'Payment: {self.client.first_name} {self.date} {self.amount}'
        if self.supplier:
            return f'Payment: {self.supplier.first_name} {self.date} {self.amount}'
        super().__str__()
    

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

