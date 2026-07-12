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
    PersonalProfileSerializer, ContactSectionSerializer,
    PublicSkillSerializer, PublicExperienceSerializer, ProjectSummarySerializer,
    PublicResumeSerializer, ProjectDetailSerializer
)
from django.conf import settings
from django.core.cache import cache
import logging
import requests
import os
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class ContactView(APIView):
    def post(self, request):
        try:
            formspree_url = os.environ.get('FORMSPREE_ENDPOINT')
            if not formspree_url:
                logger.error("FORMSPREE_ENDPOINT is not configured.")
                return Response({'error': 'Contact service is not configured properly.'}, status=503)
                
            parsed = urlparse(formspree_url)
            if parsed.scheme != 'https' or parsed.hostname != 'formspree.io' or parsed.username or parsed.password:
                logger.error("FORMSPREE_ENDPOINT must be a valid https URL pointing to formspree.io without credentials.")
                return Response({'error': 'Contact service is not configured properly.'}, status=503)
                
            try:
                timeout_sec = int(os.environ.get('FORMSPREE_TIMEOUT_SECONDS', 10))
                if timeout_sec <= 0 or timeout_sec > 60:
                    timeout_sec = 10
            except ValueError:
                timeout_sec = 10
            
            # Proxy to formspree
            response = requests.post(
                formspree_url,
                data=request.data,
                headers={'Accept': 'application/json'},
                timeout=timeout_sec
            )
            if response.status_code in [200, 201]:
                return Response({'success': True, 'message': 'Message sent successfully'})
                
            logger.warning(f"Formspree returned status {response.status_code}")
            return Response({'success': False, 'message': 'Failed to send message'}, status=400)
            
        except requests.exceptions.Timeout:
            logger.error("Contact formspree timeout")
            return Response({'error': 'Service timeout. Please try again later.'}, status=504)
        except Exception as e:
            logger.error(f"Contact error: external service failure: {str(e)}")
            return Response({'error': 'Service Error'}, status=500)

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
        cache_key = 'portfolio:v1:public-homepage'
        cached_data = cache.get(cache_key)
        ttl = int(os.environ.get('PORTFOLIO_DATA_CACHE_TTL', 600))
        headers = {
            'Cache-Control': f'public, max-age={ttl}',
            'X-Portfolio-Cache': 'HIT'
        }
        
        if cached_data:
            return Response(cached_data, headers=headers)

        hero = HeroSection.objects.only('name', 'role', 'main_headline', 'subtitle', 'availability_badge', 'profile_image', 'resume_link', 'tech_badges', 'social_links').first()
        profile = PersonalProfile.objects.only('full_name', 'current_role', 'current_status', 'short_bio', 'long_bio', 'social_profiles').first()
        contact = ContactSection.objects.only('email', 'phone', 'location', 'cta_heading', 'cta_subtitle', 'meeting_link', 'social_links').first()
        skills = Skill.objects.filter(is_featured=True).only('id', 'name', 'category', 'level', 'icon', 'display_order').order_by('display_order')
        experiences = Experience.objects.only('id', 'role', 'company', 'location', 'duration', 'type', 'responsibilities', 'technologies', 'display_order').order_by('display_order')
        projects = ProjectInfo.objects.filter(is_featured=True, status="Completed").only('id', 'name', 'slug', 'short_description', 'technologies', 'image_url', 'category', 'live_url', 'github_url', 'is_featured').order_by('display_order', '-created_at')
        resume = Resume.objects.filter(is_active=True).only('title', 'file', 'version_name', 'last_updated_date').first()

        social_links = {}
        if hero and hero.social_links:
            social_links.update(hero.social_links)
        if profile and profile.social_profiles:
            social_links.update(profile.social_profiles)
        if contact and contact.social_links:
            social_links.update(contact.social_links)

        identity = {}
        if hero:
            identity = {
                'name': hero.name,
                'role': hero.role,
                'headline': hero.main_headline,
                'subtitle': hero.subtitle,
                'availability_badge': hero.availability_badge,
                'profile_image': hero.profile_image if hero.profile_image else None,
                'resume_link': hero.resume_link,
                'tech_badges': hero.tech_badges,
            }

        contact_data = {
            'email': contact.email,
            'phone': contact.phone,
            'location': contact.location,
            'cta_heading': contact.cta_heading,
            'cta_subtitle': contact.cta_subtitle,
            'meeting_link': contact.meeting_link,
        } if contact else {}

        data = {
            'identity': identity,
            'social_links': social_links,
            'profile': {
                'full_name': profile.full_name,
                'current_role': profile.current_role,
                'current_status': profile.current_status,
                'short_bio': profile.short_bio,
                'long_bio': profile.long_bio,
            } if profile else None,
            'contact': contact_data,
            'skills': PublicSkillSerializer(skills, many=True).data,
            'experiences': PublicExperienceSerializer(experiences, many=True).data,
            'projects': ProjectSummarySerializer(projects, many=True).data,
            'resume': PublicResumeSerializer(resume).data if resume else None,
        }
        
        cache.set(cache_key, data, timeout=ttl)
        headers['X-Portfolio-Cache'] = 'MISS'
        
        return Response(data, headers=headers)

class ProjectDetailView(APIView):
    def get(self, request, pk):
        try:
            project = ProjectInfo.objects.get(pk=pk)
            serializer = ProjectDetailSerializer(project)
            return Response(serializer.data)
        except ProjectInfo.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)