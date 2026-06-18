import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import KnowledgeBase

def update_knowledge_base():
    """Add enhanced knowledge base entries for better project-specific responses"""
    
    enhanced_knowledge = [
        {
            'category': 'projects',
            'question': 'Tell me about Local Newsletter OS project features',
            'answer': 'Local Newsletter OS is a comprehensive SAAS platform featuring real-time AI-powered content editing, streaming APIs, custom React hooks, responsive design with Tailwind CSS, and Django backend. Key features include intelligent content suggestions, real-time collaboration, automated newsletter generation, and seamless user experience. The platform is live at https://www.localnewsletteros.com/ where you can explore all these features.',
            'keywords': 'local newsletter os, features, real-time, ai-powered, content editing, streaming apis, react hooks, tailwind css, django, saas, newsletter, collaboration'
        },
        {
            'category': 'projects',
            'question': 'What technologies are used in Local Newsletter OS?',
            'answer': 'Local Newsletter OS is built with React for the frontend, utilizing custom hooks for state management and real-time functionality. The backend is powered by Django with Python, implementing streaming APIs for real-time content editing. The UI is styled with Tailwind CSS for a modern, responsive design. The project showcases advanced JavaScript techniques, API integration, and full-stack development skills. You can see it in action at https://www.localnewsletteros.com/',
            'keywords': 'local newsletter os, technologies, react, javascript, python, django, tailwind css, streaming apis, custom hooks, frontend, backend, fullstack'
        },
        {
            'category': 'projects',
            'question': 'How does the AI integration work in Local Newsletter OS?',
            'answer': 'The AI integration in Local Newsletter OS provides intelligent content editing assistance through real-time streaming APIs. The AI helps with content suggestions, grammar improvements, and newsletter optimization. The system uses advanced AI models to enhance the writing experience and provide contextual recommendations. This demonstrates Asmit\'s expertise in AI integration and real-time web applications.',
            'keywords': 'ai integration, local newsletter os, intelligent content, real-time, streaming, content suggestions, ai models, writing assistance'
        },
        {
            'category': 'projects',
            'question': 'What makes Local Newsletter OS unique?',
            'answer': 'Local Newsletter OS stands out with its real-time AI-powered content editing capabilities, custom React hooks architecture, and seamless streaming API implementation. The platform combines modern web technologies with intelligent features to create a superior newsletter creation experience. The real-time collaboration features and AI-assisted writing make it a cutting-edge SAAS solution. Experience it live at https://www.localnewsletteros.com/',
            'keywords': 'local newsletter os, unique, real-time, ai-powered, custom hooks, streaming api, modern, intelligent, collaboration, cutting-edge, saas'
        },
        {
            'category': 'technical',
            'question': 'What is Asmit\'s approach to full-stack development?',
            'answer': 'Asmit follows a modern full-stack approach combining React/Angular frontends with Django/Python backends. He emphasizes real-time functionality, AI integration, responsive design, and scalable architecture. His projects like Local Newsletter OS demonstrate expertise in streaming APIs, custom hooks, and seamless user experiences. He focuses on both technical excellence and user-centric design.',
            'keywords': 'fullstack development, react, angular, django, python, real-time, ai integration, responsive design, scalable, streaming apis, user experience'
        },
        {
            'category': 'experience',
            'question': 'What kind of real-time features has Asmit implemented?',
            'answer': 'Asmit has extensive experience with real-time features including streaming APIs, live content editing, real-time collaboration, and dynamic updates. His Local Newsletter OS project showcases advanced real-time content editing with AI assistance, demonstrating his ability to build responsive, interactive web applications that provide immediate feedback and seamless user experiences.',
            'keywords': 'real-time features, streaming apis, live editing, collaboration, dynamic updates, local newsletter os, responsive, interactive, immediate feedback'
        },
        {
            'category': 'projects',
            'question': 'Can you show me Asmit\'s live projects?',
            'answer': 'Asmit\'s flagship project, Local Newsletter OS, is live at https://www.localnewsletteros.com/ where you can explore the real-time AI-powered content editing platform. The project demonstrates his full-stack capabilities with React, Django, and AI integration. You can interact with the live features including the streaming APIs, custom React hooks, and responsive Tailwind CSS design. This showcases his ability to deliver production-ready SAAS applications.',
            'keywords': 'live projects, local newsletter os, https://www.localnewsletteros.com/, real-time, ai-powered, react, django, streaming apis, production-ready, saas'
        },
        {
            'category': 'contact',
            'question': 'How can I hire Asmit for a similar project?',
            'answer': 'Asmit is available for freelance projects and full-time opportunities. His expertise in React, Django, AI integration, and real-time applications makes him ideal for modern web development projects. You can contact him through his portfolio to discuss your project requirements. He has proven experience delivering production-ready applications like Local Newsletter OS and can help bring your ideas to life.',
            'keywords': 'hire asmit, freelance, full-time, react, django, ai integration, real-time applications, web development, production-ready, contact'
        }
    ]
    
    for kb_data in enhanced_knowledge:
        # Check if similar question already exists
        existing = KnowledgeBase.objects.filter(question__icontains=kb_data['question'][:30]).first()
        if not existing:
            KnowledgeBase.objects.create(**kb_data)
            print(f"Added: {kb_data['question']}")
        else:
            # Update existing entry
            existing.answer = kb_data['answer']
            existing.keywords = kb_data['keywords']
            existing.save()
            print(f"Updated: {kb_data['question']}")
    
    print("Knowledge base enhancement completed!")

if __name__ == '__main__':
    update_knowledge_base()