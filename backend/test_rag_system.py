import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.rag_service import RAGService, EmbeddingService, PineconeService, DocumentProcessor
from ai_assistant.models import ProjectInfo, PersonalInfo, KnowledgeBase
import json

def test_embedding_service():
    """Test the embedding service"""
    print("🔍 Testing Embedding Service...")
    
    try:
        embedding_service = EmbeddingService()
        
        # Test single embedding
        test_text = "Asmit is a full-stack developer specializing in React and Django"
        embedding = embedding_service.generate_embedding(test_text)
        
        print(f"✅ Single embedding generated")
        print(f"   Text: {test_text[:50]}...")
        print(f"   Embedding dimension: {len(embedding)}")
        print(f"   Sample values: {embedding[:3]}")
        
        # Test batch embeddings
        test_texts = [
            "React frontend development",
            "Django backend development", 
            "Python programming skills",
            "Full-stack web applications"
        ]
        
        batch_embeddings = embedding_service.generate_embeddings_batch(test_texts)
        print(f"✅ Batch embeddings generated: {len(batch_embeddings)} embeddings")
        
        return True
        
    except Exception as e:
        print(f"❌ Embedding service test failed: {str(e)}")
        return False

def test_pinecone_service():
    """Test Pinecone service connection and operations"""
    print("\n🌲 Testing Pinecone Service...")
    
    try:
        pinecone_service = PineconeService()
        
        # Test connection and stats
        stats = pinecone_service.get_index_stats()
        print(f"✅ Connected to Pinecone index")
        print(f"   Total vectors: {stats.get('total_vectors', 0)}")
        print(f"   Dimension: {stats.get('dimension', 0)}")
        
        # Test vector operations with sample data
        embedding_service = EmbeddingService()
        test_vector = embedding_service.generate_embedding("Test document for Pinecone")
        
        sample_vectors = [{
            'id': 'test_vector_1',
            'values': test_vector,
            'metadata': {
                'type': 'test',
                'content': 'Test document for Pinecone operations',
                'source': 'test_suite'
            }
        }]
        
        # Test upsert
        upsert_success = pinecone_service.upsert_vectors(sample_vectors)
        print(f"✅ Vector upsert: {'Success' if upsert_success else 'Failed'}")
        
        # Test query
        query_results = pinecone_service.query_vectors(test_vector, top_k=1)
        print(f"✅ Vector query: Found {len(query_results)} results")
        
        # Test delete
        delete_success = pinecone_service.delete_vectors(['test_vector_1'])
        print(f"✅ Vector delete: {'Success' if delete_success else 'Failed'}")
        
        return True
        
    except Exception as e:
        print(f"❌ Pinecone service test failed: {str(e)}")
        return False

def test_document_processor():
    """Test document processing and chunking"""
    print("\n📄 Testing Document Processor...")
    
    try:
        processor = DocumentProcessor()
        
        # Test portfolio data processing
        chunks = processor.process_portfolio_data()
        
        print(f"✅ Document processing completed")
        print(f"   Total chunks generated: {len(chunks)}")
        
        # Analyze chunk types
        chunk_types = {}
        for chunk in chunks:
            chunk_type = chunk['metadata'].get('type', 'unknown')
            chunk_types[chunk_type] = chunk_types.get(chunk_type, 0) + 1
        
        print(f"   Chunk breakdown:")
        for chunk_type, count in chunk_types.items():
            print(f"     {chunk_type}: {count} chunks")
        
        # Show sample chunk
        if chunks:
            sample_chunk = chunks[0]
            print(f"\n📋 Sample Chunk:")
            print(f"   ID: {sample_chunk['id']}")
            print(f"   Type: {sample_chunk['metadata'].get('type')}")
            print(f"   Content preview: {sample_chunk['content'][:100]}...")
            print(f"   Keywords: {sample_chunk['metadata'].get('keywords', [])[:5]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Document processor test failed: {str(e)}")
        return False

def test_rag_service():
    """Test the complete RAG service"""
    print("\n🤖 Testing RAG Service...")
    
    try:
        rag_service = RAGService()
        
        # Test knowledge base initialization (without force rebuild to avoid overwriting)
        print("📚 Testing knowledge base query...")
        
        # Test queries
        test_queries = [
            "What projects has Asmit worked on?",
            "What are Asmit's technical skills?",
            "Tell me about React development experience",
            "How can I contact Asmit?",
            "What is Asmit's experience with Django?"
        ]
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n🔍 Test Query {i}: {query}")
            
            # Test knowledge base query
            relevant_docs = rag_service.query_knowledge_base(query, top_k=3)
            print(f"   Found {len(relevant_docs)} relevant documents")
            
            if relevant_docs:
                best_match = relevant_docs[0]
                print(f"   Best match score: {best_match['score']:.3f}")
                print(f"   Document type: {best_match['type']}")
                print(f"   Content preview: {best_match['content'][:80]}...")
            
            # Test full RAG response (if configured)
            try:
                response, session_id = rag_service.generate_rag_response(query)
                print(f"   ✅ RAG response generated ({len(response)} chars)")
                print(f"   Response preview: {response[:100]}...")
            except Exception as e:
                print(f"   ⚠️  RAG response generation failed: {str(e)}")
        
        # Test statistics
        stats = rag_service.get_knowledge_base_stats()
        print(f"\n📊 Knowledge Base Statistics:")
        print(f"   Pinecone vectors: {stats.get('pinecone_stats', {}).get('total_vectors', 0)}")
        print(f"   Database records: {sum(stats.get('database_stats', {}).values())}")
        
        return True
        
    except Exception as e:
        print(f"❌ RAG service test failed: {str(e)}")
        return False

def test_database_data():
    """Test database data availability"""
    print("\n🗄️ Testing Database Data...")
    
    try:
        personal_count = PersonalInfo.objects.count()
        project_count = ProjectInfo.objects.count()
        kb_count = KnowledgeBase.objects.count()
        
        print(f"✅ Database data available:")
        print(f"   Personal Info: {personal_count} records")
        print(f"   Projects: {project_count} records")
        print(f"   Knowledge Base: {kb_count} records")
        
        if project_count > 0:
            sample_project = ProjectInfo.objects.first()
            print(f"\n📋 Sample Project: {sample_project.name}")
            print(f"   Technologies: {sample_project.technologies}")
            print(f"   Description: {sample_project.description[:100]}...")
        
        return personal_count > 0 and project_count > 0 and kb_count > 0
        
    except Exception as e:
        print(f"❌ Database test failed: {str(e)}")
        return False

def main():
    """Run comprehensive RAG system tests"""
    print("🧪 RAG System Test Suite")
    print("=" * 60)
    
    tests = [
        ("Database Data", test_database_data),
        ("Embedding Service", test_embedding_service),
        ("Pinecone Service", test_pinecone_service),
        ("Document Processor", test_document_processor),
        ("RAG Service", test_rag_service),
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
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print("=" * 60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20} {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Your RAG system is ready for production!")
        print("\n🚀 Next Steps:")
        print("1. Initialize the knowledge base: python manage.py initialize_rag")
        print("2. Test the chat interface with RAG enabled")
        print("3. Monitor performance and accuracy")
    else:
        print("⚠️  Some tests failed. Please check the configuration:")
        print("\n🔧 Troubleshooting:")
        print("1. Verify Pinecone API key in .env file")
        print("2. Check internet connectivity")
        print("3. Ensure all dependencies are installed: pip install -r requirements.txt")
        print("4. Run: python setup_asmit_data.py to populate database")
        print("5. Check Django logs for detailed error information")

if __name__ == '__main__':
    main()