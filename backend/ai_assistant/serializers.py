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