from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from .models import (
    ProjectInfo, PersonalInfo, Resume, PortfolioSettings,
    Skill, Experience, HeroSection, PersonalProfile, ContactSection
)
from .serializers import (
    ProjectInfoSerializer, PersonalInfoSerializer, ResumeSerializer,
    SkillSerializer, ExperienceSerializer, HeroSectionSerializer,
    PersonalProfileSerializer, ContactSectionSerializer
)
import os

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({'success': True, 'message': 'Login successful'})
        return Response({'success': False, 'message': 'Invalid credentials'}, 
                       status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': True, 'message': 'Logout successful'})

class CheckAuthView(APIView):
    def get(self, request):
        return Response({'authenticated': request.user.is_authenticated})

class ProjectManagementView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        projects = ProjectInfo.objects.all().order_by('display_order', '-created_at')
        serializer = ProjectInfoSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        
        # Handle image upload
        if 'image' in request.FILES:
            data['image_url'] = request.FILES['image'].name
        
        serializer = ProjectInfoSerializer(data=data)
        if serializer.is_valid():
            try:
                project = serializer.save()
                
                # Handle image file
                if 'image' in request.FILES:
                    image_file = request.FILES['image']
                    image_path = f'media/projects/{image_file.name}'
                    os.makedirs(os.path.dirname(image_path), exist_ok=True)
                    
                    with open(image_path, 'wb+') as destination:
                        for chunk in image_file.chunks():
                            destination.write(chunk)
                    
                    project.image_url = f'/media/projects/{image_file.name}'
                    project.save()
                
                return Response(ProjectInfoSerializer(project).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': 'Server Error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        project = get_object_or_404(ProjectInfo, pk=pk)
        data = request.data.copy()
        
        try:
            # Handle image upload
            if 'image' in request.FILES:
                image_file = request.FILES['image']
                image_path = f'media/projects/{image_file.name}'
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                
                with open(image_path, 'wb+') as destination:
                    for chunk in image_file.chunks():
                        destination.write(chunk)
                
                data['image_url'] = f'/media/projects/{image_file.name}'
            
            serializer = ProjectInfoSerializer(project, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Server Error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk=None):
        project = get_object_or_404(ProjectInfo, pk=pk)
        project.delete()
        return Response({'success': True, 'message': 'Project deleted successfully'})

# Legacy PersonalInfo CRUD endpoint (kept for backward compatibility)
class PersonalInfoManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        personal_info = PersonalInfo.objects.all()
        serializer = PersonalInfoSerializer(personal_info, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PersonalInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        personal_info = get_object_or_404(PersonalInfo, pk=pk)
        serializer = PersonalInfoSerializer(personal_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        personal_info = get_object_or_404(PersonalInfo, pk=pk)
        personal_info.delete()
        return Response({'success': True, 'message': 'Personal info deleted successfully'})

# Resume management with versioning support
class ResumeManagementView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        resumes = Resume.objects.all().order_by('-uploaded_at')
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get('title', 'Resume')
        version_name = request.data.get('version_name', 'v1.0')
        file = request.FILES.get('file')
        is_active = request.data.get('is_active', 'true').lower() == 'true'
        
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if is_active:
            Resume.objects.all().update(is_active=False)
        
        resume = Resume.objects.create(
            title=title,
            version_name=version_name,
            file=file,
            is_active=is_active
        )
        
        serializer = ResumeSerializer(resume)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk=None):
        resume = get_object_or_404(Resume, pk=pk)
        if resume.file:
            resume.file.delete()
        resume.delete()
        return Response({'success': True, 'message': 'Resume deleted successfully'})

class ResumeDownloadView(APIView):
    def get(self, request):
        try:
            resume = Resume.objects.filter(is_active=True).first()
            if not resume or not resume.file:
                return Response({'error': 'No active resume found'}, status=status.HTTP_404_NOT_FOUND)
            
            response = FileResponse(
                resume.file.open('rb'),
                as_attachment=True,
                filename=f"{resume.title}.pdf"
            )
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# New structured management views
class HeroSectionManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hero = HeroSection.objects.first()
        if not hero:
            hero = HeroSection.objects.create()
        serializer = HeroSectionSerializer(hero)
        return Response(serializer.data)

    def put(self, request):
        hero = HeroSection.objects.first()
        if not hero:
            hero = HeroSection.objects.create()
        serializer = HeroSectionSerializer(hero, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PersonalProfileManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = PersonalProfile.objects.first()
        if not profile:
            profile = PersonalProfile.objects.create()
        serializer = PersonalProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = PersonalProfile.objects.first()
        if not profile:
            profile = PersonalProfile.objects.create()
        serializer = PersonalProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactSectionManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contact = ContactSection.objects.first()
        if not contact:
            contact = ContactSection.objects.create()
        serializer = ContactSectionSerializer(contact)
        return Response(serializer.data)

    def put(self, request):
        contact = ContactSection.objects.first()
        if not contact:
            contact = ContactSection.objects.create()
        serializer = ContactSectionSerializer(contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = Skill.objects.all().order_by('display_order', 'id')
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        skill = get_object_or_404(Skill, pk=pk)
        serializer = SkillSerializer(skill, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        skill = get_object_or_404(Skill, pk=pk)
        skill.delete()
        return Response({'success': True, 'message': 'Skill deleted successfully'})

class ExperienceManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        experiences = Experience.objects.all().order_by('display_order', 'id')
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        experience = get_object_or_404(Experience, pk=pk)
        serializer = ExperienceSerializer(experience, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        experience = get_object_or_404(Experience, pk=pk)
        experience.delete()
        return Response({'success': True, 'message': 'Experience deleted successfully'})

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .models import ChatHistory
        
        stats = {
            'total_projects': ProjectInfo.objects.count(),
            'total_chats': ChatHistory.objects.count(),
            'total_skills': Skill.objects.count(),
            'total_experiences': Experience.objects.count(),
            'active_resume': Resume.objects.filter(is_active=True).exists()
        }
        
        # Recent chat messages
        recent_messages = ChatHistory.objects.order_by('-timestamp')[:5]
        stats['recent_messages'] = [{
            'user_message': msg.user_message[:50] + '...' if len(msg.user_message) > 50 else msg.user_message,
            'timestamp': msg.timestamp
        } for msg in recent_messages]
        
        return Response(stats)