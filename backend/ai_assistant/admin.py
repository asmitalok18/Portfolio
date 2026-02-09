from django.contrib import admin
from .models import KnowledgeBase, ChatHistory, ProjectInfo, PersonalInfo, Resume, PortfolioSettings

@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ['category', 'question', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['question', 'answer', 'keywords']

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user_message', 'timestamp']
    list_filter = ['timestamp']
    readonly_fields = ['timestamp']

@admin.register(ProjectInfo)
class ProjectInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description', 'technologies']

@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ['key', 'category']
    list_filter = ['category']
    search_fields = ['key', 'value']

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'uploaded_at']
    list_filter = ['is_active', 'uploaded_at']
    readonly_fields = ['uploaded_at']

@admin.register(PortfolioSettings)
class PortfolioSettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']
    search_fields = ['key', 'value']