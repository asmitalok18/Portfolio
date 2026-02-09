#!/usr/bin/env python
import os
import django
from django.contrib.auth import get_user_model

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

User = get_user_model()

# Create superuser if it doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    print("Superuser created successfully!")
    print("Username: admin")
    print("Password: admin123")
    print("Email: admin@example.com")
else:
    print("Superuser already exists!")