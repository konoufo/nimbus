# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-02-05 08:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('routeoptimizer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='stop',
            name='pickupTime1',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='stop',
            name='pickupTime2',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='stop',
            name='type',
            field=models.IntegerField(choices=[(0, 'midway'), (1, 'start'), (2, 'finish'), (3, 'delivery')], default=0),
        ),
        migrations.AlterField(
            model_name='stop',
            name='waiting_people',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='current_lat',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AlterField(
            model_name='vehicle',
            name='current_lng',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
    ]