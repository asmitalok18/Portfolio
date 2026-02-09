from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatRequestSerializer, ChatResponseSerializer
from .ai_service import AIService
from .models import ProjectInfo, PersonalInfo
from .serializers import ProjectInfoSerializer, PersonalInfoSerializer

class ChatView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.validated_data['message']
            session_id = serializer.validated_data.get('session_id')
            
            try:
                ai_service = AIService()
                response, session_id = ai_service.get_ai_response(message, session_id)
                
                response_data = {
                    'response': response,
                    'session_id': session_id
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({
                    'error': 'Configuration Error',
                    'message': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                print(e)
                return Response({
                    'error': 'Service Error',
                    'message': 'AI service is temporarily unavailable. Please try again later.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectsView(APIView):
    def get(self, request):
        projects = ProjectInfo.objects.all()
        serializer = ProjectInfoSerializer(projects, many=True)
        return Response(serializer.data)

class PersonalInfoView(APIView):
    def get(self, request):
        personal_info = PersonalInfo.objects.all()
        serializer = PersonalInfoSerializer(personal_info, many=True)
        return Response(serializer.data)