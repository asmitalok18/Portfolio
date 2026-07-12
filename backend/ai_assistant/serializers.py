import json
from rest_framework import serializers
from .models import (
    KnowledgeBase, ChatHistory, ProjectInfo, PersonalInfo, Resume,
    Skill, Experience, HeroSection, PersonalProfile, ContactSection
)

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)
    session_id = serializers.CharField(max_length=100, required=False, allow_null=True)
    use_rag = serializers.BooleanField(default=True, required=False)

class ChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
    session_id = serializers.CharField()
    rag_enabled = serializers.BooleanField(default=False)

class RAGManagementSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['initialize', 'update'], default='initialize')
    force_rebuild = serializers.BooleanField(default=False)

# ----------------- ADMIN SERIALIZERS (FULL DATA) -----------------
class ProjectInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInfo
        fields = '__all__'

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = '__all__'

class PersonalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalProfile
        fields = '__all__'

class ContactSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSection
        fields = '__all__'

# ----------------- PUBLIC OPTIMIZED SERIALIZERS -----------------
class PublicSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'category', 'level', 'icon', 'display_order')

class PublicExperienceSerializer(serializers.ModelSerializer):
    responsibilities = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = ('id', 'role', 'company', 'location', 'duration', 'type', 'responsibilities', 'technologies', 'display_order')

    def get_responsibilities(self, obj):
        if not obj.responsibilities:
            return []
        try:
            parsed = json.loads(obj.responsibilities)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
        return [r.strip() for r in str(obj.responsibilities).split('\n') if r.strip()]

    def get_technologies(self, obj):
        if not obj.technologies:
            return []
        try:
            parsed = json.loads(obj.technologies)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
        return [t.strip() for t in str(obj.technologies).split(',') if t.strip()]

class ProjectSummarySerializer(serializers.ModelSerializer):
    technology_preview = serializers.SerializerMethodField()

    class Meta:
        model = ProjectInfo
        fields = ('id', 'name', 'slug', 'short_description', 'image_url', 'category', 'live_url', 'github_url', 'is_featured', 'technology_preview')
        
    def get_technology_preview(self, obj):
        if not obj.technologies:
            return []
        try:
            parsed = json.loads(obj.technologies)
            if isinstance(parsed, list):
                return parsed[:3]
        except:
            pass
        return [t.strip() for t in str(obj.technologies).split(',') if t.strip()][:3]

class PublicResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('title', 'file', 'version_name', 'last_updated_date')

class ProjectDetailSerializer(serializers.ModelSerializer):
    features_list = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = ProjectInfo
        fields = '__all__'

    def get_features_list(self, obj):
        if not obj.features_list:
            return []
        try:
            parsed = json.loads(obj.features_list)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
        return [f.strip() for f in str(obj.features_list).split('\n') if f.strip()]

    def get_technologies(self, obj):
        if not obj.technologies:
            return []
        try:
            parsed = json.loads(obj.technologies)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
        return [t.strip() for t in str(obj.technologies).split(',') if t.strip()]