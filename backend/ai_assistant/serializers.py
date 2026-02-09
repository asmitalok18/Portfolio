from rest_framework import serializers
from .models import KnowledgeBase, ChatHistory, ProjectInfo, PersonalInfo, Resume

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)
    session_id = serializers.CharField(max_length=100, required=False, allow_null=True)

class ChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
    session_id = serializers.CharField()

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