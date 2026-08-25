from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_userprofile_staff_details'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='role',
            field=models.CharField(
                choices=[
                    ('STUDENT', 'Student'),
                    ('SECURITY', 'Security Personnel'),
                    ('ADMIN', 'Administrator'),
                    ('STAFF', 'University Staff'),
                    ('IT', 'IT Support'),
                ],
                default='STUDENT',
                max_length=20,
            ),
        ),
    ]