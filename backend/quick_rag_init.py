import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

def quick_rag_check():
    """Quick check and initialization of RAG system"""
    print("🔍 Checking RAG System Status...")
    
    # Check if we have data in the database
    from ai_assistant.models import PersonalInfo, ProjectInfo, KnowledgeBase
    
    personal_count = PersonalInfo.objects.count()
    project_count = ProjectInfo.objects.count()
    kb_count = KnowledgeBase.objects.count()
    
    print(f"📊 Database Status:")
    print(f"   Personal Info: {personal_count} records")
    print(f"   Projects: {project_count} records")
    print(f"   Knowledge Base: {kb_count} records")
    
    if personal_count == 0 or project_count == 0:
        print("\n⚠️  Database appears to be empty. Running setup...")
        try:
            # Import and run the setup
            import subprocess
            result = subprocess.run(['python', 'setup_asmit_data.py'], 
                                  capture_output=True, text=True, cwd='.')
            if result.returncode == 0:
                print("✅ Database setup completed")
            else:
                print(f"❌ Setup failed: {result.stderr}")
        except Exception as e:
            print(f"❌ Setup error: {str(e)}")
    
    # Check RAG dependencies
    print(f"\n🔍 Checking RAG Dependencies...")
    
    missing_deps = []
    
    try:
        import sentence_transformers
        print("✅ sentence_transformers available")
    except ImportError:
        missing_deps.append("sentence_transformers")
        print("❌ sentence_transformers missing")
    
    try:
        import pinecone
        print("✅ pinecone available")
    except ImportError:
        missing_deps.append("pinecone-client")
        print("❌ pinecone missing")
    
    # Check environment variables
    print(f"\n🔍 Checking Environment Configuration...")
    
    from django.conf import settings
    
    groq_key = getattr(settings, 'GROQ_API_KEY', None)
    pinecone_key = getattr(settings, 'PINECONE_API_KEY', None)
    
    print(f"   GROQ_API_KEY: {'✅ Set' if groq_key and groq_key != 'your-groq-api-key-here' else '❌ Missing'}")
    print(f"   PINECONE_API_KEY: {'✅ Set' if pinecone_key and pinecone_key != 'your-pinecone-api-key-here' else '❌ Missing'}")
    
    if missing_deps:
        print(f"\n📦 Missing Dependencies: {', '.join(missing_deps)}")
        print("To install missing dependencies, run:")
        print(f"pip install {' '.join(missing_deps)}")
        
        print(f"\n🔄 Falling back to basic AI service...")
        return False
    
    if not pinecone_key or pinecone_key == 'your-pinecone-api-key-here':
        print(f"\n⚠️  Pinecone not configured. RAG system will use fallback mode.")
        print("To enable full RAG functionality:")
        print("1. Get Pinecone API key from https://app.pinecone.io/")
        print("2. Add PINECONE_API_KEY=your-key to .env file")
        print("3. Restart the server")
        return False
    
    # Try to initialize RAG if everything is available
    try:
        print(f"\n🚀 Attempting RAG initialization...")
        from ai_assistant.rag_service import RAGService
        
        rag_service = RAGService()
        stats = rag_service.get_knowledge_base_stats()
        
        pinecone_stats = stats.get('pinecone_stats', {})
        total_vectors = pinecone_stats.get('total_vectors', 0)
        
        print(f"📊 Current Pinecone Status:")
        print(f"   Total Vectors: {total_vectors}")
        print(f"   Index Dimension: {pinecone_stats.get('dimension', 'Unknown')}")
        
        if total_vectors == 0:
            print(f"\n📚 Knowledge base is empty. Initializing...")
            success = rag_service.initialize_knowledge_base()
            
            if success:
                print("✅ RAG knowledge base initialized successfully!")
                final_stats = rag_service.get_knowledge_base_stats()
                final_vectors = final_stats.get('pinecone_stats', {}).get('total_vectors', 0)
                print(f"   Final vector count: {final_vectors}")
                return True
            else:
                print("❌ RAG initialization failed")
                return False
        else:
            print("✅ RAG knowledge base already initialized")
            return True
            
    except Exception as e:
        print(f"❌ RAG initialization error: {str(e)}")
        print("Falling back to basic AI service")
        return False

def test_rag_query():
    """Test a sample RAG query"""
    try:
        from ai_assistant.rag_service import RAGService
        
        print(f"\n🧪 Testing RAG Query...")
        rag_service = RAGService()
        
        test_query = "What projects has Asmit worked on?"
        relevant_docs = rag_service.query_knowledge_base(test_query, top_k=3)
        
        print(f"   Query: {test_query}")
        print(f"   Found {len(relevant_docs)} relevant documents")
        
        if relevant_docs:
            best_match = relevant_docs[0]
            print(f"   Best match score: {best_match['score']:.3f}")
            print(f"   Document type: {best_match['type']}")
            print(f"   Content preview: {best_match['content'][:100]}...")
            return True
        else:
            print("   No relevant documents found")
            return False
            
    except Exception as e:
        print(f"❌ RAG query test failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("🔧 RAG System Quick Check & Initialization")
    print("=" * 50)
    
    # Check and initialize
    rag_ready = quick_rag_check()
    
    if rag_ready:
        # Test query
        query_success = test_rag_query()
        
        if query_success:
            print(f"\n🎉 RAG System is fully operational!")
            print("Your AI assistant will now provide enhanced, contextual responses.")
        else:
            print(f"\n⚠️  RAG System initialized but queries not working properly.")
    else:
        print(f"\n💡 RAG System not fully configured.")
        print("The AI assistant will use basic mode until RAG is properly set up.")
    
    print(f"\n📋 Next Steps:")
    print("1. Ensure all dependencies are installed")
    print("2. Configure Pinecone API key in .env file")
    print("3. Restart Django server: python manage.py runserver")
    print("4. Test chat functionality")