# Generated by Django 5.0.9 on 2024-12-14 06:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0003_country_contact_country_delete_address'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SocialLink',
        ),
    ]