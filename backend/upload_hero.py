import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portfolio_ai.settings")
django.setup()

from ai_assistant.models import HeroSection
from django.core.files import File

hero = HeroSection.objects.first()
if hero:
    with open('../public/portfolio_image.png', 'rb') as f:
        hero.profile_image.save('portfolio_image.png', File(f))
    hero.save()
    print("Uploaded and saved successfully: " + str(hero.profile_image))
else:
    print("No hero section found!")
