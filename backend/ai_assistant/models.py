from django.db import models

class KnowledgeBase(models.Model):
    category = models.CharField(max_length=100)
    question = models.TextField()
    answer = models.TextField()
    keywords = models.TextField(help_text="Comma-separated keywords for better matching")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category}: {self.question[:50]}..."

class ChatHistory(models.Model):
    session_id = models.CharField(max_length=100)
    user_message = models.TextField()
    ai_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id}: {self.user_message[:30]}..."

class ProjectInfo(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.TextField()
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PersonalInfo(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    category = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}..."

class Resume(models.Model):
    title = models.CharField(max_length=200, default="Resume")
    file = models.FileField(upload_to='resumes/')
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.uploaded_at.strftime('%Y-%m-%d')}"

class PortfolioSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}..."