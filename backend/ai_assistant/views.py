from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatRequestSerializer, ChatResponseSerializer
from .ai_service import AIService
from .rag_service import RAGService
from .models import (
    ProjectInfo, PersonalInfo, Resume,
    Skill, Experience, HeroSection, PersonalProfile, ContactSection
)
from .serializers import (
    ProjectInfoSerializer, PersonalInfoSerializer, ResumeSerializer,
    SkillSerializer, ExperienceSerializer, HeroSectionSerializer,
    PersonalProfileSerializer, ContactSectionSerializer
)
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class ChatView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data['message']
            session_id = serializer.validated_data.get('session_id')
            use_rag = serializer.validated_data.get('use_rag', True)  # Default to RAG
            
            try:
                # Force dynamic database-backed AIService to guarantee strict grounding and no stale vector data
                ai_service = AIService()
                response, session_id = ai_service.get_ai_response(message, session_id)
                
                response_data = {
                    'response': response,
                    'session_id': session_id,
                    'rag_enabled': False
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
                
            except ValueError as e:
                return Response({
                    'error': 'Configuration Error',
                    'message': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"Chat error: {str(e)}")
                return Response({
                    'error': 'Service Error',
                    'message': 'AI service is temporarily unavailable. Please try again later.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _is_rag_configured(self):
        """Check if RAG is properly configured"""
        try:
            pinecone_key = getattr(settings, 'PINECONE_API_KEY', None)
            return pinecone_key and pinecone_key != 'your-pinecone-api-key-here'
        except:
            return False

class RAGManagementView(APIView):
    """API endpoints for managing RAG system"""
    
    def get(self, request):
        """Get RAG system status and statistics"""
        try:
            if not self._is_rag_configured():
                return Response({
                    'error': 'RAG not configured',
                    'message': 'Pinecone API key not configured'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            rag_service = RAGService()
            stats = rag_service.get_knowledge_base_stats()
            
            return Response({
                'status': 'configured',
                'stats': stats
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"RAG status error: {str(e)}")
            return Response({
                'error': 'Service Error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Initialize or update RAG knowledge base"""
        try:
            if not self._is_rag_configured():
                return Response({
                    'error': 'RAG not configured',
                    'message': 'Pinecone API key not configured'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            action = request.data.get('action', 'initialize')
            force_rebuild = request.data.get('force_rebuild', False)
            
            rag_service = RAGService()
            
            if action == 'initialize':
                success = rag_service.initialize_knowledge_base(force_rebuild=force_rebuild)
            elif action == 'update':
                success = rag_service.update_knowledge_base(force_update=force_rebuild)
            else:
                return Response({
                    'error': 'Invalid action',
                    'message': 'Action must be "initialize" or "update"'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if success:
                stats = rag_service.get_knowledge_base_stats()
                return Response({
                    'success': True,
                    'message': f'Knowledge base {action}d successfully',
                    'stats': stats
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': f'Failed to {action} knowledge base'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            logger.error(f"RAG management error: {str(e)}")
            return Response({
                'error': 'Service Error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _is_rag_configured(self):
        """Check if RAG is properly configured"""
        try:
            pinecone_key = getattr(settings, 'PINECONE_API_KEY', None)
            return pinecone_key and pinecone_key != 'your-pinecone-api-key-here'
        except:
            return False

class ProjectsView(APIView):
    def get(self, request):
        projects = ProjectInfo.objects.all().order_by('display_order', '-created_at')
        serializer = ProjectInfoSerializer(projects, many=True)
        return Response(serializer.data)

class PersonalInfoView(APIView):
    def get(self, request):
        personal_info = PersonalInfo.objects.all()
        serializer = PersonalInfoSerializer(personal_info, many=True)
        return Response(serializer.data)

class PortfolioDataView(APIView):
    def get(self, request):
        hero = HeroSection.objects.first()
        profile = PersonalProfile.objects.first()
        contact = ContactSection.objects.first()
        skills = Skill.objects.all().order_by('display_order')
        experiences = Experience.objects.all().order_by('display_order')
        projects = ProjectInfo.objects.all().order_by('display_order', '-created_at')
        resume = Resume.objects.filter(is_active=True).first()

        data = {
            'hero': HeroSectionSerializer(hero).data if hero else None,
            'profile': PersonalProfileSerializer(profile).data if profile else None,
            'contact': ContactSectionSerializer(contact).data if contact else None,
            'skills': SkillSerializer(skills, many=True).data,
            'experiences': ExperienceSerializer(experiences, many=True).data,
            'projects': ProjectInfoSerializer(projects, many=True).data,
            'resume': ResumeSerializer(resume).data if resume else None,
        }
        return Response(data)