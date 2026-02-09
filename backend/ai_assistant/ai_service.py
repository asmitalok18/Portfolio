import requests
import json
import uuid
from django.conf import settings
from .models import KnowledgeBase, ProjectInfo, PersonalInfo

class AIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if not self.api_key or self.api_key == 'your-groq-api-key-here':
            raise ValueError("Groq API key is not configured. Please set GROQ_API_KEY in your .env file.")
        self.base_url = "https://api.groq.com/openai/v1"

    def get_context_data(self):
        """Retrieve all relevant context about the portfolio owner"""
        projects = ProjectInfo.objects.all()
        personal_info = PersonalInfo.objects.all()
        knowledge_base = KnowledgeBase.objects.all()
        
        context = {
            'projects': [
                {
                    'name': p.name,
                    'description': p.description,
                    'technologies': p.technologies,
                    'category': p.category,
                    'github_url': p.github_url,
                    'live_url': p.live_url
                } for p in projects
            ],
            'personal_info': {info.key: info.value for info in personal_info},
            'knowledge_base': [
                {
                    'question': kb.question,
                    'answer': kb.answer,
                    'category': kb.category
                } for kb in knowledge_base
            ]
        }
        return context

    def generate_system_prompt(self, context_data):
        """Generate a comprehensive system prompt with portfolio context"""
        projects_info = "\n".join([
            f"- {p['name']}: {p['description']} (Technologies: {p['technologies']})"
            for p in context_data['projects']
        ])
        
        personal_info = "\n".join([
            f"- {key}: {value}" for key, value in context_data['personal_info'].items()
        ])
        
        knowledge_base = "\n".join([
            f"Q: {kb['question']}\nA: {kb['answer']}"
            for kb in context_data['knowledge_base']
        ])

        return f"""You are an AI assistant representing a software developer's portfolio. 
        You should answer questions professionally and helpfully about the developer, their projects, and skills.

        DEVELOPER INFORMATION:
        {personal_info}

        PROJECTS:
        {projects_info}

        ADDITIONAL KNOWLEDGE:
        {knowledge_base}

        INSTRUCTIONS:
        - Always respond professionally and courteously
        - Provide specific details about projects when asked
        - If you don't have information about something, politely say so
        - Keep responses concise but informative
        - Encourage visitors to explore the portfolio or contact the developer
        - Never make up information that isn't provided in the context
        """

    def get_ai_response(self, user_message, session_id=None):
        """Get AI response for user message using Groq API"""
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            context_data = self.get_context_data()
            system_prompt = self.generate_system_prompt(context_data)

            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': 'llama-3.1-8b-instant',  # Updated to current Groq model
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_message}
                ],
                'max_tokens': 500,
                'temperature': 0.7,
                'stream': False
            }

            response = requests.post(
                f'{self.base_url}/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                
                # Save to chat history
                from .models import ChatHistory
                ChatHistory.objects.create(
                    session_id=session_id,
                    user_message=user_message,
                    ai_response=ai_response
                )
                
                return ai_response, session_id
            else:
                error_msg = f"Groq API error: {response.status_code}"
                if response.status_code == 401:
                    error_msg = "Invalid Groq API key. Please check your configuration."
                elif response.status_code == 429:
                    error_msg = "Groq API rate limit exceeded. Please try again later."
                elif response.status_code == 400:
                    try:
                        error_detail = response.json()
                        error_msg = f"Groq API error: {error_detail.get('error', {}).get('message', 'Bad request')}"
                    except:
                        error_msg = "Groq API bad request error"
                return error_msg, session_id

        except requests.exceptions.RequestException as e:
            return f"Network error connecting to Groq: {str(e)}", session_id
        except Exception as e:
            return f"I apologize, but I'm having trouble processing your request right now. Please try again later.", session_id