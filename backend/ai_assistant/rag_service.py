import os
import json
import uuid
import hashlib
from typing import List, Dict, Any, Optional, Tuple
import openai
from pinecone import Pinecone, ServerlessSpec
from django.conf import settings
from django.core.cache import cache
from .models import KnowledgeBase, ProjectInfo, PersonalInfo, Resume, ChatHistory
import logging
import tiktoken

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for generating and managing embeddings using OpenAI"""
    
    def __init__(self):
        self.model_name = "text-embedding-3-small"
        self.dimension = 1536  # Dimension for OpenAI's small embedding model
        
        api_key = getattr(settings, 'OPENAI_API_KEY', None)
        if not api_key or api_key == 'your-openai-api-key-here':
            logger.warning("OPENAI_API_KEY is not set. Embedding generation will fail.")
        
        self.client = openai.OpenAI(api_key=api_key)
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a given text"""
        try:
            # Clean and normalize text
            cleaned_text = self._clean_text(text)
            response = self.client.embeddings.create(
                input=[cleaned_text],
                model=self.model_name
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts efficiently"""
        try:
            cleaned_texts = [self._clean_text(text) for text in texts]
            response = self.client.embeddings.create(
                input=cleaned_texts,
                model=self.model_name
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {str(e)}")
            raise
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text for embedding"""
        if not text:
            return ""
        # Remove extra whitespace and normalize
        cleaned = " ".join(text.strip().split())
        # Truncate if too long (model has token limits)
        if len(cleaned) > 8000:  # Conservative limit
            cleaned = cleaned[:8000]
        return cleaned

class PineconeService:
    """Service for managing Pinecone vector database operations"""
    
    def __init__(self):
        self.api_key = settings.PINECONE_API_KEY
        self.environment = getattr(settings, 'PINECONE_ENVIRONMENT', 'us-east-1-aws')
        self.index_name = getattr(settings, 'PINECONE_INDEX_NAME', 'asmit-portfolio-rag-v2')
        self.dimension = 1536  # Must match embedding model dimension
        
        if not self.api_key or self.api_key == 'your-pinecone-api-key-here':
            raise ValueError("Pinecone API key is not configured. Please set PINECONE_API_KEY in your .env file.")
        
        self.pc = Pinecone(api_key=self.api_key)
        self.index = None
        self._initialize_index()
    
    def _initialize_index(self):
        """Initialize or create Pinecone index"""
        try:
            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating new Pinecone index: {self.index_name} with dimension {self.dimension}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region=self.environment
                    )
                )
            else:
                # Check if existing index has matching dimension
                index_info = self.pc.describe_index(self.index_name)
                existing_dimension = index_info.dimension
                
                if existing_dimension != self.dimension:
                    error_msg = (
                        f"Dimension mismatch for Pinecone index '{self.index_name}'!\n"
                        f"Expected dimension: {self.dimension} (using {self._get_embedding_model()})\n"
                        f"Existing index dimension: {existing_dimension}\n\n"
                        f"SOLUTION: Delete the existing Pinecone index and run the initialization again.\n"
                        f"Pinecone console: https://app.pinecone.io/"
                    )
                    logger.error(error_msg)
                    raise ValueError(error_msg)
                else:
                    logger.info(f"Found existing Pinecone index with correct dimension: {existing_dimension}")
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            logger.info(f"Connected to Pinecone index: {self.index_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Pinecone index: {str(e)}")
            raise
    
    def _get_embedding_model(self) -> str:
        """Get the current embedding model name"""
        embedding_service = EmbeddingService()
        return embedding_service.model_name
    
    def upsert_vectors(self, vectors: List[Dict[str, Any]]) -> bool:
        """Upsert vectors to Pinecone index"""
        try:
            if not vectors:
                return True
            
            # Batch upsert for efficiency
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            logger.info(f"Successfully upserted {len(vectors)} vectors to Pinecone")
            return True
            
        except Exception as e:
            error_str = str(e)
            if "Vector dimension" in error_str and "does not match" in error_str:
                logger.error(
                    f"ERROR: Vector dimension mismatch!\n"
                    f"{error_str}\n\n"
                    f"SOLUTION: Your Pinecone index was created with the wrong dimension.\n"
                    f"You need to delete the index '{self.index_name}' and run the initialization again.\n"
                    f"Visit: https://app.pinecone.io/ to delete the index."
                )
            else:
                logger.error(f"Error upserting vectors to Pinecone: {error_str}")
            return False
    
    def query_vectors(self, query_vector: List[float], top_k: int = 10, 
                     filter_dict: Optional[Dict] = None) -> List[Dict]:
        """Query similar vectors from Pinecone"""
        try:
            response = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict
            )
            
            results = []
            for match in response.matches:
                results.append({
                    'id': match.id,
                    'score': match.score,
                    'metadata': match.metadata
                })
            
            return results
            
        except Exception as e:
            logger.error(f"Error querying Pinecone: {str(e)}")
            return []
    
    def delete_vectors(self, ids: List[str]) -> bool:
        """Delete vectors from Pinecone index"""
        try:
            self.index.delete(ids=ids)
            logger.info(f"Deleted {len(ids)} vectors from Pinecone")
            return True
        except Exception as e:
            logger.error(f"Error deleting vectors from Pinecone: {str(e)}")
            return False
    
    def get_index_stats(self) -> Dict:
        """Get index statistics"""
        try:
            stats = self.index.describe_index_stats()
            return {
                'total_vectors': stats.total_vector_count,
                'dimension': stats.dimension,
                'index_fullness': stats.index_fullness
            }
        except Exception as e:
            logger.error(f"Error getting index stats: {str(e)}")
            return {}

class DocumentProcessor:
    """Service for processing and chunking documents for RAG"""
    
    def __init__(self):
        self.chunk_size = 1000  # Characters per chunk
        self.chunk_overlap = 200  # Overlap between chunks
        self.encoding = tiktoken.get_encoding("cl100k_base")  # GPT-4 encoding
    
    def process_portfolio_data(self) -> List[Dict[str, Any]]:
        """Process all portfolio data into chunks for embedding"""
        chunks = []
        
        # Process personal information
        personal_chunks = self._process_personal_info()
        chunks.extend(personal_chunks)
        
        # Process projects
        project_chunks = self._process_projects()
        chunks.extend(project_chunks)
        
        # Process knowledge base
        kb_chunks = self._process_knowledge_base()
        chunks.extend(kb_chunks)
        
        # Process resume if available
        resume_chunks = self._process_resume()
        chunks.extend(resume_chunks)
        
        logger.info(f"Processed {len(chunks)} document chunks")
        return chunks
    
    def _process_personal_info(self) -> List[Dict[str, Any]]:
        """Process personal information into chunks"""
        chunks = []
        personal_info = PersonalInfo.objects.all()
        
        # Group by category
        categories = {}
        for info in personal_info:
            if info.category not in categories:
                categories[info.category] = []
            categories[info.category].append(f"{info.key}: {info.value}")
        
        # Create chunks for each category
        for category, items in categories.items():
            content = f"Personal Information - {category.title()}:\n" + "\n".join(items)
            
            chunk_id = self._generate_chunk_id("personal", category)
            chunks.append({
                'id': chunk_id,
                'content': content,
                'metadata': {
                    'type': 'personal_info',
                    'category': category,
                    'source': 'database',
                    'keywords': [category, 'personal', 'info', 'asmit', 'alok']
                }
            })
        
        return chunks
    
    def _process_projects(self) -> List[Dict[str, Any]]:
        """Process projects into chunks"""
        chunks = []
        projects = ProjectInfo.objects.all()
        
        for project in projects:
            # Main project chunk
            content = f"Project: {project.name}\n"
            content += f"Category: {project.category}\n"
            content += f"Description: {project.description}\n"
            content += f"Technologies: {project.technologies}\n"
            
            if project.github_url:
                content += f"GitHub: {project.github_url}\n"
            if project.live_url:
                content += f"Live Demo: {project.live_url}\n"
            
            # Add scraped data if available
            cache_key = f"scraped_project_{project.id}"
            scraped_data = cache.get(cache_key)
            if scraped_data and scraped_data.get('scraped_successfully'):
                if scraped_data.get('detected_technologies'):
                    content += f"Detected Technologies: {', '.join(scraped_data['detected_technologies'])}\n"
                if scraped_data.get('features'):
                    features = [f['title'] for f in scraped_data['features'][:5]]
                    content += f"Key Features: {', '.join(features)}\n"
            
            chunk_id = self._generate_chunk_id("project", project.name)
            
            # Extract keywords
            keywords = [
                project.name.lower(), project.category.lower(), 'project'
            ]
            keywords.extend([tech.strip().lower() for tech in project.technologies.split(',')])
            
            chunks.append({
                'id': chunk_id,
                'content': content,
                'metadata': {
                    'type': 'project',
                    'project_name': project.name,
                    'category': project.category,
                    'source': 'database',
                    'github_url': project.github_url or '',
                    'live_url': project.live_url or '',
                    'keywords': keywords
                }
            })
            
            # Create separate chunks for long descriptions if needed
            if len(project.description) > self.chunk_size:
                desc_chunks = self._split_text(project.description)
                for i, desc_chunk in enumerate(desc_chunks):
                    chunk_id = self._generate_chunk_id("project_desc", f"{project.name}_{i}")
                    chunks.append({
                        'id': chunk_id,
                        'content': f"Project {project.name} - Detailed Description:\n{desc_chunk}",
                        'metadata': {
                            'type': 'project_description',
                            'project_name': project.name,
                            'chunk_index': i,
                            'source': 'database',
                            'keywords': keywords
                        }
                    })
        
        return chunks
    
    def _process_knowledge_base(self) -> List[Dict[str, Any]]:
        """Process knowledge base Q&A pairs into chunks"""
        chunks = []
        kb_entries = KnowledgeBase.objects.all()
        
        for kb in kb_entries:
            content = f"Question: {kb.question}\nAnswer: {kb.answer}"
            
            chunk_id = self._generate_chunk_id("kb", kb.question[:50])
            
            # Extract keywords
            keywords = [kb.category.lower(), 'knowledge', 'qa']
            if kb.keywords:
                keywords.extend([kw.strip().lower() for kw in kb.keywords.split(',')])
            
            chunks.append({
                'id': chunk_id,
                'content': content,
                'metadata': {
                    'type': 'knowledge_base',
                    'category': kb.category,
                    'question': kb.question,
                    'source': 'database',
                    'keywords': keywords
                }
            })
        
        return chunks
    
    def _process_resume(self) -> List[Dict[str, Any]]:
        """Process resume information into chunks"""
        chunks = []
        
        try:
            active_resume = Resume.objects.filter(is_active=True).first()
            if active_resume:
                content = f"Resume Information:\n"
                content += f"Title: {active_resume.title}\n"
                content += f"Uploaded: {active_resume.uploaded_at.strftime('%Y-%m-%d')}\n"
                content += f"Status: Active Resume"
                
                chunk_id = self._generate_chunk_id("resume", "active")
                chunks.append({
                    'id': chunk_id,
                    'content': content,
                    'metadata': {
                        'type': 'resume',
                        'title': active_resume.title,
                        'source': 'database',
                        'keywords': ['resume', 'cv', 'experience', 'qualifications']
                    }
                })
        except Exception as e:
            logger.error(f"Error processing resume: {str(e)}")
        
        return chunks
    
    def _split_text(self, text: str) -> List[str]:
        """Split text into chunks with overlap"""
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings near the chunk boundary
                for i in range(end, max(start + self.chunk_size - 200, start), -1):
                    if text[i] in '.!?':
                        end = i + 1
                        break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start position with overlap
            start = end - self.chunk_overlap
            if start >= len(text):
                break
        
        return chunks
    
    def _generate_chunk_id(self, prefix: str, identifier: str) -> str:
        """Generate unique chunk ID"""
        # Create hash of identifier for consistency
        hash_obj = hashlib.md5(identifier.encode())
        hash_hex = hash_obj.hexdigest()[:8]
        return f"{prefix}_{hash_hex}"

class RAGService:
    """Main RAG service that orchestrates embedding, storage, and retrieval"""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.pinecone_service = PineconeService()
        self.document_processor = DocumentProcessor()
        
        # OpenAI for final response generation
        self.openai_api_key = getattr(settings, 'OPENAI_API_KEY', None)
        if self.openai_api_key and self.openai_api_key != 'your-openai-api-key-here':
            openai.api_key = self.openai_api_key
        
        # Groq as fallback
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_base_url = "https://api.groq.com/openai/v1"
    
    def initialize_knowledge_base(self, force_rebuild: bool = False) -> bool:
        """Initialize the RAG knowledge base by processing and embedding all data"""
        try:
            # Check if already initialized (unless force rebuild)
            if not force_rebuild:
                stats = self.pinecone_service.get_index_stats()
                if stats.get('total_vectors', 0) > 0:
                    logger.info("Knowledge base already initialized. Use force_rebuild=True to rebuild.")
                    return True
            
            logger.info("Initializing RAG knowledge base...")
            
            # Process all portfolio data into chunks
            chunks = self.document_processor.process_portfolio_data()
            
            if not chunks:
                logger.warning("No chunks generated from portfolio data")
                return False
            
            # Generate embeddings for all chunks
            logger.info(f"Generating embeddings for {len(chunks)} chunks...")
            texts = [chunk['content'] for chunk in chunks]
            embeddings = self.embedding_service.generate_embeddings_batch(texts)
            
            # Prepare vectors for Pinecone
            vectors = []
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                vectors.append({
                    'id': chunk['id'],
                    'values': embedding,
                    'metadata': {
                        **chunk['metadata'],
                        'content': chunk['content'][:1000],  # Truncate for metadata
                        'full_content_hash': hashlib.md5(chunk['content'].encode()).hexdigest()
                    }
                })
            
            # Upsert to Pinecone
            success = self.pinecone_service.upsert_vectors(vectors)
            
            if success:
                logger.info(f"Successfully initialized knowledge base with {len(vectors)} vectors")
                # Cache initialization status
                cache.set('rag_initialized', True, 86400)  # 24 hours
                return True
            else:
                logger.error("Failed to upsert vectors to Pinecone")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing knowledge base: {str(e)}")
            return False
    
    def query_knowledge_base(self, query: str, top_k: int = 5) -> List[Dict]:
        """Query the knowledge base for relevant information"""
        try:
            # Generate embedding for query
            query_embedding = self.embedding_service.generate_embedding(query)
            
            # Search Pinecone
            results = self.pinecone_service.query_vectors(
                query_vector=query_embedding,
                top_k=top_k
            )
            
            # Process and rank results
            processed_results = []
            for result in results:
                if result['score'] > 0.7:  # Similarity threshold
                    processed_results.append({
                        'content': result['metadata'].get('content', ''),
                        'score': result['score'],
                        'type': result['metadata'].get('type', ''),
                        'source': result['metadata'].get('source', ''),
                        'metadata': result['metadata']
                    })
            
            return processed_results
            
        except Exception as e:
            logger.error(f"Error querying knowledge base: {str(e)}")
            return []
    
    def generate_rag_response(self, user_query: str, session_id: Optional[str] = None) -> Tuple[str, str]:
        """Generate response using RAG approach"""
        if not session_id:
            session_id = str(uuid.uuid4())
        
        try:
            # Query knowledge base for relevant context
            relevant_docs = self.query_knowledge_base(user_query, top_k=5)
            
            if not relevant_docs:
                # Fallback to basic response if no relevant docs found
                return self._generate_fallback_response(user_query, session_id)
            
            # Prepare context from retrieved documents
            context = self._prepare_context(relevant_docs)
            
            # Generate response using LLM with retrieved context
            response = self._generate_llm_response(user_query, context)
            
            # Save to chat history
            ChatHistory.objects.create(
                session_id=session_id,
                user_message=user_query,
                ai_response=response
            )
            
            return response, session_id
            
        except Exception as e:
            logger.error(f"Error generating RAG response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later.", session_id
    
    def _prepare_context(self, relevant_docs: List[Dict]) -> str:
        """Prepare context string from retrieved documents"""
        context_parts = []
        
        for doc in relevant_docs:
            doc_type = doc.get('type', 'unknown')
            content = doc.get('content', '')
            score = doc.get('score', 0)
            
            # Add type-specific formatting
            if doc_type == 'project':
                context_parts.append(f"[PROJECT INFO - Relevance: {score:.2f}]\n{content}")
            elif doc_type == 'personal_info':
                context_parts.append(f"[PERSONAL INFO - Relevance: {score:.2f}]\n{content}")
            elif doc_type == 'knowledge_base':
                context_parts.append(f"[Q&A - Relevance: {score:.2f}]\n{content}")
            else:
                context_parts.append(f"[{doc_type.upper()} - Relevance: {score:.2f}]\n{content}")
        
        return "\n\n".join(context_parts)
    
    def _generate_llm_response(self, query: str, context: str) -> str:
        """Generate response using LLM with retrieved context"""
        system_prompt = f"""You are Asmit's AI Assistant, a professional and knowledgeable virtual representative for Asmit Alok's portfolio. You have access to relevant information about Asmit's background, projects, and expertise.

INSTRUCTIONS:
- Use ONLY the provided context to answer questions
- Be professional, confident, and articulate
- Provide specific details from the context when available
- If the context doesn't contain enough information, acknowledge this clearly
- Maintain a warm, approachable tone while being authoritative
- Include relevant project links, technologies, and contact information when appropriate

RETRIEVED CONTEXT:
{context}

Remember: You represent a skilled professional developer. Every response should reflect expertise, accuracy, and genuine helpfulness."""

        user_prompt = f"Based on the provided context about Asmit Alok, please answer this question: {query}"
        
        # Try OpenAI first, fallback to Groq
        if self.openai_api_key:
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=800,
                    temperature=0.3
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.warning(f"OpenAI API failed, falling back to Groq: {str(e)}")
        
        # Fallback to Groq
        return self._generate_groq_response(system_prompt, user_prompt)
    
    def _generate_groq_response(self, system_prompt: str, user_prompt: str) -> str:
        """Generate response using Groq API"""
        try:
            import requests
            
            headers = {
                'Authorization': f'Bearer {self.groq_api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': 'llama-3.1-8b-instant',
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'max_tokens': 800,
                'temperature': 0.3,
                'stream': False
            }
            
            response = requests.post(
                f'{self.groq_base_url}/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                logger.error(f"Groq API error: {response.status_code}")
                return "I'm experiencing technical difficulties. Please try again later."
                
        except Exception as e:
            logger.error(f"Error with Groq API: {str(e)}")
            return "I'm having trouble generating a response right now. Please try again later."
    
    def _generate_fallback_response(self, query: str, session_id: str) -> Tuple[str, str]:
        """Generate fallback response when no relevant documents found"""
        fallback_response = """I don't have specific information about that topic in my knowledge base. However, I'd be happy to help you with questions about:

- Asmit's projects and technical work
- His skills and experience with Angular, React, Python, and Django
- Contact information and collaboration opportunities
- Technical expertise and development approach

Feel free to ask about any of these areas, or you can contact Asmit directly for more detailed information."""
        
        return fallback_response, session_id
    
    def update_knowledge_base(self, force_update: bool = False) -> bool:
        """Update knowledge base with latest data"""
        try:
            logger.info("Updating RAG knowledge base...")
            return self.initialize_knowledge_base(force_rebuild=force_update)
        except Exception as e:
            logger.error(f"Error updating knowledge base: {str(e)}")
            return False
    
    def get_knowledge_base_stats(self) -> Dict:
        """Get statistics about the knowledge base"""
        try:
            pinecone_stats = self.pinecone_service.get_index_stats()
            
            # Get database stats
            db_stats = {
                'personal_info_count': PersonalInfo.objects.count(),
                'projects_count': ProjectInfo.objects.count(),
                'knowledge_base_count': KnowledgeBase.objects.count(),
                'chat_history_count': ChatHistory.objects.count()
            }
            
            return {
                'pinecone_stats': pinecone_stats,
                'database_stats': db_stats,
                'embedding_model': self.embedding_service.model_name,
                'embedding_dimension': self.embedding_service.dimension
            }
            
        except Exception as e:
            logger.error(f"Error getting knowledge base stats: {str(e)}")
            return {}