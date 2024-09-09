# Generated by Django 4.2.15 on 2024-08-15 15:42

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Ussa',
            new_name='Supplier',
        ),
        migrations.RemoveField(
            model_name='category',
            name='parent',
        ),
        migrations.AddField(
            model_name='cek',
            name='cek_type',
            field=models.CharField(choices=[('IN', 'Satyn Alyş Çegi'), ('OUT', 'Satyş Çegi')], default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cek',
            name='partner_type',
            field=models.CharField(choices=[('CLIENT', 'Müşderi'), ('SUPPLIER', 'Telekeçi')], default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cek',
            name='referenced_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='referenced_by', to='company.client'),
        ),
        migrations.AddField(
            model_name='cek',
            name='supplier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='company.supplier'),
        ),
        migrations.AddField(
            model_name='client',
            name='is_ussa',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='payment',
            name='partner_type',
            field=models.CharField(choices=[('CLIENT', 'Müşderi'), ('SUPPLIER', 'Telekeçi')], default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_type',
            field=models.CharField(choices=[('IN', 'Gelen Töleg'), ('OUT', 'Giden Töleg')], default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payment',
            name='supplier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='company.supplier'),
        ),
        migrations.AlterField(
            model_name='cek',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='company.client'),
        ),
        migrations.AlterField(
            model_name='cek',
            name='date',
            field=models.DateField(default=datetime.date(2024, 8, 15)),
        ),
        migrations.AlterField(
            model_name='payment',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payment',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='company.client'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='date',
            field=models.DateField(default=datetime.date(2024, 8, 15)),
        ),
    ]
