# Generated by Django 4.2.14 on 2024-08-12 13:23

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Cek',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nomer', models.CharField(blank=True, max_length=255, null=True)),
                ('is_nesye', models.BooleanField(default=True)),
                ('summa', models.DecimalField(decimal_places=2, max_digits=10)),
                ('alan_zatlary', models.TextField(blank=True, null=True)),
                ('bellik', models.TextField(blank=True, null=True)),
                ('date', models.DateField(default=datetime.date(2024, 8, 12))),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(max_length=255)),
                ('phone_2', models.CharField(blank=True, max_length=255, null=True)),
                ('phone_3', models.CharField(blank=True, max_length=255, null=True)),
                ('passport_no', models.CharField(blank=True, max_length=255, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('note', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Toleg',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nomer', models.CharField(blank=True, max_length=255, null=True)),
                ('summa', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date', models.DateField(default=datetime.date(2024, 8, 12))),
                ('bellik', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.client')),
            ],
        ),
        migrations.CreateModel(
            name='Haryt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ady', models.CharField(max_length=255)),
                ('ady_2', models.CharField(blank=True, max_length=255, null=True)),
                ('ady_3', models.CharField(blank=True, max_length=255, null=True)),
                ('gelen_bahasy', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('satlyk_bahasy', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('birligi', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='common.unit')),
                ('gelen_pul_birligi', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='gelen_pul_birligi', to='common.currency')),
                ('kategoriya', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.category')),
                ('satlyk_pul_birligi', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='satlyk_pul_birligi', to='common.currency')),
            ],
        ),
        migrations.AddConstraint(
            model_name='client',
            constraint=models.UniqueConstraint(fields=('phone',), name='unique_phone'),
        ),
        migrations.AddField(
            model_name='cek',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='company.client'),
        ),
        migrations.AddField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='company.category'),
        ),
    ]
