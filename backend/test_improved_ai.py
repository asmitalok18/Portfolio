import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.ai_service import AIService

def test_improved_ai():
    """Test the improved AI assistant with project-specific queries"""
    
    ai_service = AIService()
    
    test_queries = [
        "Tell me about the Local Newsletter OS project",
        "What technologies are used in https://www.localnewsletteros.com/?",
        "What are the key features of Asmit's projects?",
        "Show me Asmit's live projects with URLs",
        "How does the AI integration work in Local Newsletter OS?",
        "What makes Asmit's projects unique?"
    ]
    
    print("Testing Improved AI Assistant")
    print("=" * 50)
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{i}. Query: {query}")
        print("-" * 40)
        
        try:
            response, session_id = ai_service.get_ai_response(query)
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error: {str(e)}")
        
        print("-" * 40)

if __name__ == '__main__':
    test_improved_ai()