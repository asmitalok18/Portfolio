#!/usr/bin/env python
import os
import django
from django.contrib.auth import get_user_model

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

User = get_user_model()

# Create or update superuser
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not password:
    print("Error: DJANGO_SUPERUSER_PASSWORD is not set in your .env file!")
    print("Please set it to secure your admin account.")
    exit(1)

try:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.email = email
    user.save()
    print(f"Superuser '{username}' updated successfully!")
    print("Password updated from environment variables.")
except User.DoesNotExist:
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"Superuser '{username}' created successfully!")
    print("Password set from environment variables.")