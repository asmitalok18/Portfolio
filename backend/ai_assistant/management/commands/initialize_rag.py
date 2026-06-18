from django.core.management.base import BaseCommand
from ai_assistant.rag_service import RAGService
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize RAG knowledge base with portfolio data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force-rebuild',
            action='store_true',
            help='Force rebuild of existing knowledge base',
        )
        parser.add_argument(
            '--stats-only',
            action='store_true',
            help='Only show knowledge base statistics',
        )

    def handle(self, *args, **options):
        try:
            rag_service = RAGService()
            
            if options['stats_only']:
                self.stdout.write('📊 Getting RAG knowledge base statistics...')
                stats = rag_service.get_knowledge_base_stats()
                
                self.stdout.write('\n🔍 Knowledge Base Statistics:')
                self.stdout.write('=' * 50)
                
                # Pinecone stats
                pinecone_stats = stats.get('pinecone_stats', {})
                self.stdout.write(f"📈 Pinecone Index Stats:")
                self.stdout.write(f"   Total Vectors: {pinecone_stats.get('total_vectors', 0)}")
                self.stdout.write(f"   Dimension: {pinecone_stats.get('dimension', 0)}")
                self.stdout.write(f"   Index Fullness: {pinecone_stats.get('index_fullness', 0):.2%}")
                
                # Database stats
                db_stats = stats.get('database_stats', {})
                self.stdout.write(f"\n📊 Database Stats:")
                self.stdout.write(f"   Personal Info: {db_stats.get('personal_info_count', 0)} records")
                self.stdout.write(f"   Projects: {db_stats.get('projects_count', 0)} records")
                self.stdout.write(f"   Knowledge Base: {db_stats.get('knowledge_base_count', 0)} records")
                self.stdout.write(f"   Chat History: {db_stats.get('chat_history_count', 0)} records")
                
                # Model info
                self.stdout.write(f"\n🤖 Embedding Model:")
                self.stdout.write(f"   Model: {stats.get('embedding_model', 'N/A')}")
                self.stdout.write(f"   Dimension: {stats.get('embedding_dimension', 0)}")
                
                return
            
            force_rebuild = options['force_rebuild']
            
            self.stdout.write('🚀 Initializing RAG knowledge base...')
            
            if force_rebuild:
                self.stdout.write('⚠️  Force rebuild enabled - existing data will be replaced')
            
            success = rag_service.initialize_knowledge_base(force_rebuild=force_rebuild)
            
            if success:
                self.stdout.write(
                    self.style.SUCCESS('✅ RAG knowledge base initialized successfully!')
                )
                
                # Show final stats
                stats = rag_service.get_knowledge_base_stats()
                pinecone_stats = stats.get('pinecone_stats', {})
                
                self.stdout.write(f"\n📊 Final Statistics:")
                self.stdout.write(f"   Total Vectors: {pinecone_stats.get('total_vectors', 0)}")
                self.stdout.write(f"   Embedding Dimension: {stats.get('embedding_dimension', 0)}")
                self.stdout.write(f"   Model: {stats.get('embedding_model', 'N/A')}")
                
                self.stdout.write(f"\n🎉 Your RAG system is ready!")
                self.stdout.write(f"   The AI assistant will now use semantic search for more accurate responses.")
                
            else:
                self.stdout.write(
                    self.style.ERROR('❌ Failed to initialize RAG knowledge base')
                )
                self.stdout.write('Please check your Pinecone configuration and try again.')
                
        except Exception as e:
            error_msg = str(e)
            self.stdout.write(
                self.style.ERROR(f'❌ Error initializing RAG: {error_msg}')
            )
            
            # Check if it's a dimension mismatch error
            if "Dimension mismatch" in error_msg or "does not match" in error_msg:
                self.stdout.write('\n⚠️  DIMENSION MISMATCH DETECTED!')
                self.stdout.write('Your Pinecone index was created with the wrong dimension.\n')
                self.stdout.write('SOLUTION:')
                self.stdout.write('1. Go to https://app.pinecone.io/')
                self.stdout.write(f'2. Delete the index named "asmit-portfolio-rag"')
                self.stdout.write('3. Run this command again to recreate it with the correct dimension (384)')
                self.stdout.write('4. Or run: python manage.py initialize_rag --force-rebuild')
                self.stdout.write('\nEmbedding Model: all-MiniLM-L6-v2 (384 dimensions)')
                self.stdout.write('Required Index Dimension: 384\n')
            else:
                self.stdout.write('\nTroubleshooting steps:')
                self.stdout.write('1. Check your Pinecone API key in .env file')
                self.stdout.write('2. Verify internet connectivity')
                self.stdout.write('3. Ensure all dependencies are installed')
                self.stdout.write('4. Check Django logs for detailed error information')