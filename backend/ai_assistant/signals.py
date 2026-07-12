from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import (
    ProjectInfo, PersonalInfo, Resume, Skill, 
    Experience, HeroSection, PersonalProfile, ContactSection
)

def clear_portfolio_cache(sender, **kwargs):
    cache.delete('portfolio:v1:public-homepage')

for model in [ProjectInfo, PersonalInfo, Resume, Skill, Experience, HeroSection, PersonalProfile, ContactSection]:
    post_save.connect(clear_portfolio_cache, sender=model, dispatch_uid=f"clear_cache_save_{model.__name__}")
    post_delete.connect(clear_portfolio_cache, sender=model, dispatch_uid=f"clear_cache_delete_{model.__name__}")
