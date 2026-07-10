import requests
import json
import uuid
import re
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from django.conf import settings
from django.core.cache import cache
from .models import (
    KnowledgeBase, ProjectInfo, PersonalInfo, Resume,
    Skill, Experience, HeroSection, PersonalProfile, ContactSection
)
import logging

logger = logging.getLogger(__name__)

class WebScraper:
    """Enhanced web scraper for extracting project information from live URLs"""
    
    @staticmethod
    def scrape_project_info(url, timeout=10):
        """Scrape key features and technologies from a project URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else ""
            
            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc.get('content', '').strip() if meta_desc else ""
            
            # Extract keywords
            meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
            keywords = meta_keywords.get('content', '').strip() if meta_keywords else ""
            
            # Look for technology indicators in the page
            page_text = soup.get_text().lower()
            technologies = WebScraper._detect_technologies(page_text, soup)
            
            # Extract key features from headings and prominent text
            features = WebScraper._extract_features(soup)
            
            return {
                'title': title_text,
                'description': description,
                'keywords': keywords,
                'technologies': technologies,
                'features': features,
                'scraped_successfully': True
            }
            
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            return {
                'title': '',
                'description': '',
                'keywords': '',
                'technologies': [],
                'features': [],
                'scraped_successfully': False,
                'error': str(e)
            }
    
    @staticmethod
    def _detect_technologies(page_text, soup):
        """Detect technologies used based on page content and scripts"""
        technologies = set()
        
        # Technology patterns to look for
        tech_patterns = {
            'react': ['react', 'jsx', 'react.js', 'reactjs', 'react hooks', 'usestate', 'useeffect'],
            'angular': ['angular', 'ng-', '@angular', 'typescript'],
            'vue': ['vue', 'vue.js', 'vuejs'],
            'django': ['django', 'python', 'django.contrib', 'django rest'],
            'flask': ['flask', 'python', 'werkzeug'],
            'node.js': ['node', 'nodejs', 'express', 'npm'],
            'mongodb': ['mongodb', 'mongo', 'mongoose'],
            'postgresql': ['postgresql', 'postgres', 'psql'],
            'mysql': ['mysql', 'mariadb'],
            'redis': ['redis', 'cache'],
            'docker': ['docker', 'container'],
            'aws': ['aws', 'amazon web services', 's3', 'ec2'],
            'bootstrap': ['bootstrap', 'bs-'],
            'tailwind': ['tailwind', 'tw-', 'tailwindcss'],
            'typescript': ['typescript', '.ts', 'tsc'],
            'javascript': ['javascript', 'js', 'jquery'],
            'python': ['python', 'py', 'django', 'flask'],
            'java': ['java', 'spring', 'hibernate'],
            'php': ['php', 'laravel', 'symfony'],
            'ruby': ['ruby', 'rails', 'gem'],
            'go': ['golang', 'go'],
            'rust': ['rust', 'cargo'],
            'kotlin': ['kotlin', 'kt'],
            'swift': ['swift', 'ios'],
            'graphql': ['graphql', 'apollo'],
            'rest': ['rest api', 'restful', 'api'],
            'websocket': ['websocket', 'socket.io'],
            'oauth': ['oauth', 'authentication'],
            'jwt': ['jwt', 'json web token'],
            'stripe': ['stripe', 'payment'],
            'paypal': ['paypal', 'payment'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'openai', 'gpt'],
            'streaming': ['streaming', 'real-time', 'websocket', 'sse'],
            'saas': ['saas', 'software as a service', 'subscription']
        }
        
        # Check page text for technology indicators
        for tech, patterns in tech_patterns.items():
            for pattern in patterns:
                if pattern in page_text:
                    technologies.add(tech.title())
                    break
        
        # Check script tags for framework/library indicators
        scripts = soup.find_all('script', src=True)
        for script in scripts:
            src = script.get('src', '').lower()
            if 'react' in src:
                technologies.add('React')
            elif 'angular' in src:
                technologies.add('Angular')
            elif 'vue' in src:
                technologies.add('Vue.js')
            elif 'bootstrap' in src:
                technologies.add('Bootstrap')
            elif 'jquery' in src:
                technologies.add('jQuery')
            elif 'tailwind' in src:
                technologies.add('Tailwind CSS')
        
        # Check meta tags for additional info
        meta_tags = soup.find_all('meta')
        for meta in meta_tags:
            content = meta.get('content', '').lower()
            if 'react' in content:
                technologies.add('React')
            elif 'django' in content:
                technologies.add('Django')
            elif 'ai' in content or 'artificial intelligence' in content:
                technologies.add('AI')
        
        return list(technologies)
    
    @staticmethod
    def _extract_features(soup):
        """Extract key features from headings and prominent sections"""
        features = []
        
        # Look for feature-related headings and sections
        feature_selectors = [
            'h1, h2, h3, h4',  # All headings
            '.feature, .features',  # Feature classes
            '.benefit, .benefits',  # Benefit classes
            '.service, .services',  # Service classes
            '[class*="feature"]',  # Any class containing "feature"
            '[id*="feature"]',  # Any id containing "feature"
        ]
        
        # Extract from headings
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4'])
        for heading in headings[:10]:  # Limit to top 10 headings
            text = heading.get_text().strip()
            if len(text) > 5 and len(text) < 100:
                # Look for feature-related keywords
                feature_keywords = ['feature', 'capability', 'function', 'service', 'benefit', 'advantage', 'tool', 'solution']
                if any(keyword in text.lower() for keyword in feature_keywords) or len(features) < 3:
                    # Get description from next sibling or parent
                    description = ""
                    next_elem = heading.find_next_sibling(['p', 'div', 'span'])
                    if next_elem:
                        description = next_elem.get_text().strip()[:200]
                    
                    features.append({
                        'title': text,
                        'description': description if description else text
                    })
        
        # Look for lists that might contain features
        feature_lists = soup.find_all(['ul', 'ol'])
        for ul in feature_lists[:3]:  # Limit to 3 lists
            # Check if list seems to be about features
            list_context = ""
            prev_heading = ul.find_previous(['h1', 'h2', 'h3', 'h4'])
            if prev_heading:
                list_context = prev_heading.get_text().lower()
            
            if any(keyword in list_context for keyword in ['feature', 'benefit', 'service', 'capability']) or len(features) < 5:
                items = ul.find_all('li')[:5]  # Max 5 items per list
                for item in items:
                    text = item.get_text().strip()
                    if len(text) > 10 and len(text) < 200:
                        features.append({
                            'title': text[:50] + '...' if len(text) > 50 else text,
                            'description': text
                        })
        
        # Look for prominent text sections
        prominent_sections = soup.find_all(['section', 'div'], class_=lambda x: x and any(
            keyword in x.lower() for keyword in ['feature', 'benefit', 'service', 'highlight', 'key']
        ))
        
        for section in prominent_sections[:2]:  # Limit to 2 sections
            section_text = section.get_text().strip()
            if len(section_text) > 20 and len(section_text) < 300:
                # Try to extract a title
                title_elem = section.find(['h1', 'h2', 'h3', 'h4', 'strong', 'b'])
                title = title_elem.get_text().strip() if title_elem else section_text[:50] + '...'
                
                features.append({
                    'title': title,
                    'description': section_text[:200]
                })
        
        # Remove duplicates and return top features
        unique_features = []
        seen_titles = set()
        
        for feature in features:
            title_lower = feature['title'].lower()
            if title_lower not in seen_titles and len(unique_features) < 8:
                seen_titles.add(title_lower)
                unique_features.append(feature)
        
        return unique_features

class AIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if not self.api_key or self.api_key == 'your-groq-api-key-here':
            raise ValueError("Groq API key is not configured. Please set GROQ_API_KEY in your .env file.")
        self.base_url = "https://api.groq.com/openai/v1"
        self.scraper = WebScraper()

    def get_context_data(self):
        """Retrieve all relevant context about the portfolio owner with enhanced project data"""
        projects = ProjectInfo.objects.all().order_by('display_order', '-created_at')
        knowledge_base = KnowledgeBase.objects.all()
        
        # Fetch structured profile data
        profile = PersonalProfile.objects.first()
        hero = HeroSection.objects.first()
        contact = ContactSection.objects.first()
        skills = Skill.objects.all().order_by('display_order')
        experiences = Experience.objects.all().order_by('display_order')
        
        # Build personal info dictionary for backward compatibility and RAG context
        personal_info_dict = {}
        if profile:
            personal_info_dict.update({
                'name': profile.full_name,
                'email': profile.email,
                'phone': profile.phone,
                'location': profile.location,
                'bio': profile.long_bio,
                'short_bio': profile.short_bio,
                'title': profile.current_role,
                'status': profile.current_status,
            })
        if hero:
            personal_info_dict.update({
                'hero_title': hero.role,
                'hero_subtitle': hero.subtitle,
                'hero_headline': hero.main_headline,
                'tech_stack': hero.tech_badges,
            })
        if contact:
            personal_info_dict.update({
                'meeting_link': contact.meeting_link,
                'cta_heading': contact.cta_heading,
                'cta_subtitle': contact.cta_subtitle,
            })

        # Add Skills description
        if skills.exists():
            skills_by_cat = {}
            for s in skills:
                skills_by_cat.setdefault(s.category, []).append(s.name)
            skills_text = " | ".join([f"{cat}: {', '.join(items)}" for cat, items in skills_by_cat.items()])
            personal_info_dict['skills_and_specializations'] = skills_text

        # Add Experience description
        if experiences.exists():
            exp_list = []
            for e in experiences:
                exp_list.append(f"{e.role} at {e.company} ({e.duration})")
            personal_info_dict['professional_experience'] = ", ".join(exp_list)

        # Get resume information
        resume_info = ""
        try:
            active_resume = Resume.objects.filter(is_active=True).first()
            if active_resume:
                resume_info = f"Resume available: {active_resume.title} (version {active_resume.version_name}, uploaded {active_resume.uploaded_at.strftime('%Y-%m-%d')})"
        except:
            pass
        
        enhanced_projects = []
        for project in projects:
            project_data = {
                'name': project.name,
                'description': project.description,
                'technologies': project.technologies,
                'category': project.category,
                'github_url': project.github_url,
                'live_url': project.live_url,
                'image_url': project.image_url
            }
            
            # Try to get cached scraped data or scrape if needed
            if project.live_url:
                cache_key = f"scraped_project_{project.id}"
                scraped_data = cache.get(cache_key)
                
                if not scraped_data:
                    scraped_data = self.scraper.scrape_project_info(project.live_url)
                    # Cache for 24 hours
                    cache.set(cache_key, scraped_data, 86400)
                
                if scraped_data.get('scraped_successfully'):
                    project_data.update({
                        'scraped_title': scraped_data.get('title', ''),
                        'scraped_description': scraped_data.get('description', ''),
                        'detected_technologies': scraped_data.get('technologies', []),
                        'key_features': scraped_data.get('features', [])
                    })
            
            enhanced_projects.append(project_data)
        
        context = {
            'projects': enhanced_projects,
            'personal_info': personal_info_dict,
            'knowledge_base': [
                {
                    'question': kb.question,
                    'answer': kb.answer,
                    'category': kb.category,
                    'keywords': kb.keywords
                } for kb in knowledge_base
            ],
            'resume_info': resume_info
        }
        return context

    def generate_system_prompt(self, context_data, intent="unknown"):
        # Format personal information
        personal_info = []
        for key, value in context_data['personal_info'].items():
            if value and str(value).strip():
                personal_info.append(f"- {key.replace('_', ' ').title()}: {value}")
        personal_info_text = "\n".join(personal_info) if personal_info else "Personal info not available"
        
        # Format projects with enhanced details
        projects_info = []
        for p in context_data['projects']:
            project_text = f"\n**{p['name']}** ({p['category']})"
            project_text += f"\n- Short Purpose/Description: {p['description']}"
            project_text += f"\n- Technologies/Tech Stack: {p['technologies']}"
            
            if p.get('github_url'):
                project_text += f"\n- GitHub: {p['github_url']}"
            if p.get('live_url'):
                project_text += f"\n- Live Demo: {p['live_url']}"
            
            projects_info.append(project_text)
        
        projects_text = "\n".join(projects_info) if projects_info else "No projects available"
        
        # Resume information
        resume_text = context_data.get('resume_info', 'No resume information available')

        return f"""You are "Ask Asmit AI", the professional portfolio assistant for Asmit Alok.
You help visitors learn about Asmit Alok, his skills, projects, professional experience, resume, contact details, hiring availability, and suitable roles.

TONE & STYLE:
- Professional, friendly, confident, and concise. Recruiter-friendly.
- Natural English. Use Hinglish/Hindi ONLY if the visitor uses Hindi/Hinglish first (e.g., if they say "Tumhare projects kya hai?", reply in Hinglish).
- Do not write long paragraphs. Use 3-6 lines max for general questions. Use bullets only when useful.
- Do not repeat "Asmit Alok" unnaturally in every answer.
- CRITICAL: NEVER repeat, rephrase, or acknowledge the user's question. Start your response directly with the answer.

PRONOUN AND IDENTITY RULES:
- For profile-related questions (skills, projects, who are you, experience), you can answer in the first person as Asmit (use "I", "me", "my").
  - Example: "I'm Asmit Alok's portfolio assistant. I can help you explore my skills, projects..."
- For hiring, coordination, or contact actions, act strictly as his assistant and refer to him in the third person ("Asmit", "he", "his").
  - Example: "Asmit is open to suitable roles. Could you share your details? I will pass this to Asmit, and he will contact you soon."

PROJECT RESPONSE DEPTH CONTROL (CRITICAL):
- DO NOT give complete project details immediately.
- If intent is 'project_list' (e.g., "What projects have you worked on?"):
  - ONLY provide a short numbered list of project names with a ONE-LINE summary based strictly on the projects provided.
  - DO NOT hallucinate placeholders like "[Other projects]" or add items that are not in the provided data. If only two projects exist, only list those two.
  - End by asking: "Which one would you like details about?"
  - Do NOT include tech stack, full descriptions, or links here.
- If intent is 'project_detail' (e.g., "Tell me about Trident Marine", or "second one details"):
  - Provide structured details ONLY for the requested project(s): Project name, Short purpose, My role, Tech stack, Key features, What I built / impact, Link if available.
- If intent is 'project_tech': Give only the technology stack for that project.
- If intent is 'project_link': Give the link if available. If not, say politely: "I don't have a public link available for that right now."

HR / RECRUITER / HIRING FLOW (Intent: 'hiring' or 'contact'):
Step 1: Greet and acknowledge interest ("Thank you for reaching out. Asmit is open to suitable Full Stack, Frontend, and GenAI-related opportunities.")
Step 2: Ask for missing details to coordinate: Name, Company name, Role details, Email/Phone, Preferred time to connect, Location/Remote option.
Step 3: If user gives partial details, ask ONLY for missing details.
Step 4: Once enough details are collected, say: "Thanks for sharing the details. I've noted them down. I'll pass this to Asmit, and he will contact you soon."
- NEVER promise joining, accept offers, negotiate salary, or hallucinate a joining date.

GENERAL Q&A / FALLBACKS:
- If you don't know the answer or it's out of scope, do not hallucinate. Say: "I don't have that information available right now, but you can contact Asmit directly for confirmation."
- For unrelated tech questions, answer briefly and connect back to Asmit's work if relevant.

PORTFOLIO DATA SOURCE OF TRUTH:

ASMIT ALOK PROFILE / CONTACT / SKILLS / EXPERIENCE:
{personal_info_text}

ACTIVE RESUME COPY:
{resume_text}

FEATURED PROJECTS:
{projects_text}
"""

    def _detect_intent(self, message, context_data):
        msg_lower = message.lower()
        if any(w in msg_lower for w in ["hire", "hiring", "job", "opening", "recruiter", "hr", "opportunity"]):
            return "hiring"
        
        project_keywords = ["project", "projects", "work"]
        project_detail_keywords = ["detail", "explain", "tell me more", "tech stack", "role"]
        
        # Check for specific project names
        has_project_name = False
        for p in context_data.get('projects', []):
            if p['name'].lower() in msg_lower:
                has_project_name = True
                break
                
        if any(w in msg_lower for w in project_keywords) or has_project_name:
            if has_project_name or any(w in msg_lower for w in project_detail_keywords):
                return "project_detail"
            return "project_list"
            
        if any(w in msg_lower for w in ["who are you", "your name", "who am i asking", "whom am i asking"]):
            return "identity"
            
        if any(w in msg_lower for w in ["resume", "cv"]):
            return "resume"
            
        if any(w in msg_lower for w in ["contact", "connect", "email", "phone"]):
            return "contact"
            
        return "unknown"

    def check_deterministic_response(self, message, context_data):
        """
        Check if user query can be answered deterministically from database records.
        Returns (response_text, True) if deterministic answer is found, otherwise (None, False).
        """
        # We disable this to allow the LLM to follow complex conversational rules
        return None, False

    def get_ai_response(self, user_message, session_id=None):
        """Get AI response for user message using Groq API with enhanced processing"""
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            context_data = self.get_context_data()
            
            # Get intent
            intent = self._detect_intent(user_message, context_data)

            system_prompt = self.generate_system_prompt(context_data, intent)

            # Preprocess message
            processed_message = self._preprocess_message(user_message, context_data, intent)

            # Fetch Chat History
            from .models import ChatHistory
            recent_history = ChatHistory.objects.filter(session_id=session_id).order_by('-timestamp')[:5]
            
            messages = [{'role': 'system', 'content': system_prompt}]
            
            for hist in reversed(recent_history):
                messages.append({'role': 'user', 'content': hist.user_message})
                messages.append({'role': 'assistant', 'content': hist.ai_response})
                
            messages.append({'role': 'user', 'content': processed_message})

            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': 'llama-3.1-8b-instant',
                'messages': messages,
                'max_tokens': 1000,
                'temperature': 0.3,
                'top_p': 0.9,
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
                
                # Clean up thinking/reasoning blocks if any
                import re
                ai_response = re.sub(r'<think>.*?</think>', '', ai_response, flags=re.DOTALL).strip()
                
                # Post-process the response for better formatting
                ai_response = self._postprocess_response(ai_response)
                
                # Save to chat history
                ChatHistory.objects.create(
                    session_id=session_id,
                    user_message=user_message,
                    ai_response=ai_response
                )
                
                return ai_response, session_id
            else:
                error_msg = self._handle_api_error(response)
                return error_msg, session_id

        except requests.exceptions.RequestException as e:
            logger.error(f"Network error connecting to Groq: {str(e)}")
            return f"I'm experiencing connectivity issues right now. Please try again in a moment.", session_id
        except Exception as e:
            logger.error(f"Unexpected error in AI service: {str(e)}")
            return f"I apologize, but I'm having trouble processing your request right now. Please try again later.", session_id

    def _preprocess_message(self, message, context_data, intent="unknown"):
        """Preprocess user message to add context and improve response quality"""
        # Add context hints for better responses
        context_hints = [f"Detected Intent: {intent}"]
        
        # Enhanced message with context
        if context_hints:
            enhanced_message = f"{message}\n\n[SYSTEM NOTE - DO NOT MENTION TO USER: {' | '.join(context_hints)}]"
            return enhanced_message
        
        return message

    def _postprocess_response(self, response):
        """Post-process AI response for better formatting and professionalism"""
        response = response.strip()
        return response

    def _handle_api_error(self, response):
        """Handle API errors with user-friendly messages"""
        if response.status_code == 401:
            return "I'm experiencing authentication issues. Please contact the site administrator."
        elif response.status_code == 429:
            return "I'm receiving a high volume of requests right now. Please try again in a moment."
        elif response.status_code == 400:
            try:
                error_detail = response.json()
                error_msg = error_detail.get('error', {}).get('message', 'Bad request')
                logger.error(f"Groq API 400 error: {error_msg}")
            except:
                pass
            return "I'm having trouble understanding your request. Could you please rephrase it?"
        else:
            logger.error(f"Groq API error {response.status_code}: {response.text}")
            return "I'm experiencing technical difficulties. Please try again later."
