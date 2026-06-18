from django.contrib import admin
from .models import KnowledgeBase, ChatHistory, ProjectInfo, PersonalInfo, Resume, PortfolioSettings

@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'category')
    list_filter = ('category',)
    search_fields = ('key', 'value')
    ordering = ('category', 'key')

@admin.register(ProjectInfo)
class ProjectInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'technologies', 'github_url', 'live_url', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description', 'technologies')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'image_url')
        }),
        ('Links', {
            'fields': ('github_url', 'live_url')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )

@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'created_at', 'updated_at')
    list_filter = ('category', 'created_at')
    search_fields = ('question', 'answer', 'keywords')
    ordering = ('-updated_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Question & Answer', {
            'fields': ('category', 'question', 'answer')
        }),
        ('SEO & Matching', {
            'fields': ('keywords',),
            'description': 'Comma-separated keywords to help the AI match this Q&A to user questions'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user_message_preview', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('user_message', 'ai_response', 'session_id')
    ordering = ('-timestamp',)
    readonly_fields = ('session_id', 'user_message', 'ai_response', 'timestamp')
    
    def user_message_preview(self, obj):
        return obj.user_message[:50] + '...' if len(obj.user_message) > 50 else obj.user_message
    user_message_preview.short_description = 'User Message'

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'uploaded_at')
    list_filter = ('is_active', 'uploaded_at')
    ordering = ('-uploaded_at',)
    readonly_fields = ('uploaded_at',)

@admin.register(PortfolioSettings)
class PortfolioSettingsAdmin(admin.ModelAdmin):
    list_display = ('key', 'value_preview', 'description')
    search_fields = ('key', 'value', 'description')
    ordering = ('key',)
    
    def value_preview(self, obj):
        return obj.value[:100] + '...' if len(obj.value) > 100 else obj.value
    value_preview.short_description = 'Value'

# Customize admin site
admin.site.site_header = "Asmit's Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to Portfolio Administration"