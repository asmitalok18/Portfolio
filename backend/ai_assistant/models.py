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
    name = models.CharField(max_length=200)  # Maps to Project Title
    slug = models.SlugField(max_length=200, blank=True, null=True)
    description = models.TextField()  # Maps to Detailed Description
    short_description = models.TextField(blank=True, null=True)
    technologies = models.TextField()  # Maps to Tech Stack (comma separated)
    features_list = models.TextField(blank=True, null=True, help_text="JSON list or newline-separated features")
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image_url = models.ImageField(upload_to='projects/', blank=True, null=True)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default="Completed")
    is_featured = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
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
    version_name = models.CharField(max_length=100, default="v1.0")
    last_updated_date = models.DateField(auto_now=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} ({self.version_name}) - {self.uploaded_at.strftime('%Y-%m-%d')}"

class PortfolioSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}..."

# Structured models for upgrading the portfolio
class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)  # Frontend Development, Backend Development, Database & DevOps
    level = models.IntegerField(default=80)      # 0 to 100
    icon = models.CharField(max_length=100, blank=True)  # React icon string/identifier
    display_order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.category}: {self.name}"

class Experience(models.Model):
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    duration = models.CharField(max_length=100)  # e.g. "Feb 2025 - Present"
    type = models.CharField(max_length=100, default="Full-time")  # Full-time, Internship
    responsibilities = models.TextField(help_text="JSON list or newline-separated responsibilities/achievements")
    technologies = models.CharField(max_length=500, blank=True, help_text="Comma-separated technologies used")
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.role} at {self.company}"

class HeroSection(models.Model):
    name = models.CharField(max_length=200, default="Asmit Alok")
    role = models.CharField(max_length=200, default="Full Stack Developer")
    main_headline = models.CharField(max_length=300, default="Full Stack Developer")
    subtitle = models.TextField(default="Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach")
    availability_badge = models.CharField(max_length=100, default="Available for work")
    cta_labels = models.CharField(max_length=200, default="Let's Connect, Resume")
    cta_links = models.CharField(max_length=200, default="#contact, /resume.pdf")
    profile_image = models.ImageField(upload_to='hero/', blank=True, null=True)
    resume_link = models.CharField(max_length=500, default="/resume.pdf")
    social_links = models.JSONField(default=dict, blank=True)
    tech_badges = models.CharField(max_length=500, default="Angular, React, Python, Django")

    def __str__(self):
        return f"Hero Section: {self.name}"

class PersonalProfile(models.Model):
    full_name = models.CharField(max_length=200, default="Asmit Alok")
    email = models.EmailField(default="alokasmit@gmail.com")
    phone = models.CharField(max_length=50, default="+91 8210632703")
    location = models.CharField(max_length=200, default="Gurugram, India")
    short_bio = models.TextField(default="Passionate Full Stack Developer specializing in Angular, ReactJS, Python and Django.")
    long_bio = models.TextField(default="I'm a passionate technology enthusiast dedicated to staying at the forefront of emerging industry trends and advancements. My commitment to continuous learning drives me to actively seek opportunities where I can contribute meaningfully to the ever-evolving world of technology.")
    current_role = models.CharField(max_length=200, default="Full Stack Developer")
    current_status = models.CharField(max_length=200, default="Active")
    social_profiles = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Personal Profile: {self.full_name}"

class ContactSection(models.Model):
    email = models.EmailField(default="alokasmit@gmail.com")
    phone = models.CharField(max_length=50, default="+91 8210632703")
    location = models.CharField(max_length=200, default="Gurugram, India")
    cta_heading = models.CharField(max_length=200, default="Let's Connect")
    cta_subtitle = models.CharField(max_length=300, default="Have a project in mind or want to discuss opportunities?")
    social_links = models.JSONField(default=dict, blank=True)
    meeting_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return "Contact Section Settings"