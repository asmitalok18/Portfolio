import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.ai_service import AIService, WebScraper
from ai_assistant.models import ProjectInfo
import json

def test_web_scraper():
    """Test the web scraping functionality"""
    print("🔍 Testing Web Scraper...")
    scraper = WebScraper()
    
    # Test with a sample URL (you can replace with your actual project URL)
    test_url = "https://github.com"  # Safe test URL
    
    try:
        result = scraper.scrape_project_info(test_url)
        print(f"✅ Scraping successful: {result.get('scraped_successfully', False)}")
        print(f"📄 Title: {result.get('title', 'N/A')[:100]}...")
        print(f"🔧 Technologies detected: {len(result.get('technologies', []))}")
        print(f"⭐ Features found: {len(result.get('features', []))}")
        return True
    except Exception as e:
        print(f"❌ Scraping failed: {str(e)}")
        return False

def test_ai_service():
    """Test the AI service functionality"""
    print("\n🤖 Testing AI Service...")
    
    try:
        ai_service = AIService()
        
        # Test questions
        test_questions = [
            "What projects has Asmit worked on?",
            "What are Asmit's technical skills?",
            "How can I contact Asmit?",
            "Tell me about the AI-powered portfolio project",
            "What technologies does Asmit specialize in?"
        ]
        
        for i, question in enumerate(test_questions, 1):
            print(f"\n📝 Test Question {i}: {question}")
            try:
                response, session_id = ai_service.get_ai_response(question)
                print(f"✅ Response length: {len(response)} characters")
                print(f"🔑 Session ID: {session_id[:8]}...")
                print(f"💬 Response preview: {response[:150]}...")
            except Exception as e:
                print(f"❌ AI response failed: {str(e)}")
                return False
        
        return True
    except Exception as e:
        print(f"❌ AI Service initialization failed: {str(e)}")
        return False

def test_context_data():
    """Test context data retrieval"""
    print("\n📊 Testing Context Data...")
    
    try:
        ai_service = AIService()
        context = ai_service.get_context_data()
        
        print(f"👤 Personal info entries: {len(context.get('personal_info', {}))}")
        print(f"🚀 Projects: {len(context.get('projects', []))}")
        print(f"🧠 Knowledge base entries: {len(context.get('knowledge_base', []))}")
        print(f"📄 Resume info: {context.get('resume_info', 'N/A')}")
        
        # Show sample project data
        if context.get('projects'):
            sample_project = context['projects'][0]
            print(f"\n📋 Sample Project: {sample_project.get('name', 'N/A')}")
            print(f"   Technologies: {sample_project.get('technologies', 'N/A')}")
            print(f"   Live URL: {sample_project.get('live_url', 'N/A')}")
            print(f"   Scraped data available: {bool(sample_project.get('scraped_title'))}")
        
        return True
    except Exception as e:
        print(f"❌ Context data test failed: {str(e)}")
        return False

def test_database_data():
    """Test database data availability"""
    print("\n🗄️ Testing Database Data...")
    
    try:
        from ai_assistant.models import PersonalInfo, ProjectInfo, KnowledgeBase
        
        personal_count = PersonalInfo.objects.count()
        project_count = ProjectInfo.objects.count()
        kb_count = KnowledgeBase.objects.count()
        
        print(f"👤 Personal Info records: {personal_count}")
        print(f"🚀 Project records: {project_count}")
        print(f"🧠 Knowledge Base records: {kb_count}")
        
        if project_count > 0:
            projects_with_urls = ProjectInfo.objects.filter(live_url__isnull=False).exclude(live_url='').count()
            print(f"🔗 Projects with live URLs: {projects_with_urls}")
        
        return personal_count > 0 and project_count > 0 and kb_count > 0
    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🧪 AI Assistant Test Suite")
    print("=" * 50)
    
    tests = [
        ("Database Data", test_database_data),
        ("Context Data", test_context_data),
        ("Web Scraper", test_web_scraper),
        ("AI Service", test_ai_service),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🔬 Running {test_name} Test...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20} {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Your AI assistant is ready to go!")
    else:
        print("⚠️  Some tests failed. Please check the configuration and try again.")
    
    print("\n💡 Next Steps:")
    print("1. Update your .env file with a valid Groq API key")
    print("2. Run: python setup_asmit_data.py")
    print("3. Start the server: python manage.py runserver")
    print("4. Test the chat interface at your frontend")

if __name__ == '__main__':
    main()