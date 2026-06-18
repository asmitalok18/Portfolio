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

    def generate_system_prompt(self, context_data):
        """Generate a comprehensive system prompt with portfolio context and professional guidelines"""
        
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
            project_text += f"\n- Description: {p['description']}"
            project_text += f"\n- Technologies: {p['technologies']}"
            
            if p.get('github_url'):
                project_text += f"\n- GitHub: {p['github_url']}"
            if p.get('live_url'):
                project_text += f"\n- Live Demo: {p['live_url']}"
            
            projects_info.append(project_text)
        
        projects_text = "\n".join(projects_info) if projects_info else "No projects available"
        
        # Resume information
        resume_text = context_data.get('resume_info', 'No resume information available')

        return f"""You are Asmit Alok's AI Portfolio Assistant. Your primary goal is to answer visitor questions about Asmit's skills, experience, projects, and contact details.

CRITICAL IDENTITY & GROUNDING INSTRUCTIONS:
1. You represent Asmit Alok. You must answer questions using ONLY the official portfolio data source of truth provided below.
2. Do not invent, infer, guess, or assume any information not present in the context.
3. If a question is about projects, skills, education, companies, or achievements that are not listed in the provided data below, you must reply: "I don't have that information in the current portfolio data."
4. Never list generic project categories (e.g. AI-powered portfolios, Web applications, CMS, video streaming, student management systems, educational platforms) as if they are projects Asmit worked on.
5. If only one project is listed in the projects data, explicitly state that he currently has only one featured project.
6. Keep your answers concise, professional, clear, and recruiter-friendly. Do not mention "based on the provided context". Just answer directly.

PORTFOLIO DATA SOURCE OF TRUTH:

ASMIT ALOK PROFILE:
{personal_info_text}

ACTIVE RESUME COPY:
{resume_text}

FEATURED PROJECTS:
{projects_text}"""

    def check_deterministic_response(self, message, context_data):
        """
        Check if user query can be answered deterministically from database records.
        Returns (response_text, True) if deterministic answer is found, otherwise (None, False).
        """
        msg_lower = message.lower().strip("?. ")
        projects = context_data.get('projects', [])
        skills = Skill.objects.all().order_by('display_order')
        experiences = Experience.objects.all().order_by('display_order')
        profile = PersonalProfile.objects.first()
        contact = ContactSection.objects.first()
        resume = Resume.objects.filter(is_active=True).first()

        # 1. Specific project queries
        # e.g., "tell me about Local Newsletter OS", "what is Local Newsletter OS"
        for p in projects:
            p_name = p['name'].lower()
            if p_name in msg_lower:
                tech_stack = p.get('technologies', '')
                live_url = p.get('live_url', '')
                github_url = p.get('github_url', '')
                links_text = ""
                if live_url:
                    links_text += f" [Live Demo]({live_url})"
                if github_url:
                    links_text += f" [GitHub]({github_url})"
                
                return f"**{p['name']}** ({p['category']}):\n\n" \
                       f"**Description**: {p['description']}\n" \
                       f"**Technologies**: {tech_stack}\n" \
                       f"**Links**:{links_text}", True

        # Check for specific non-existent projects to deny them explicitly
        non_existent_keywords = {
            "video streaming": "video streaming",
            "streaming": "video streaming",
            "student management": "student management system",
            "student": "student management system",
            "educational": "educational platform",
            "cms": "content management system",
            "portfolio": "AI-powered portfolio",
        }
        for kw, proj_name in non_existent_keywords.items():
            if kw in msg_lower:
                # Double check if any real project contains this keyword
                matched = False
                for p in projects:
                    if kw in p['name'].lower():
                        matched = True
                        break
                if not matched:
                    if len(projects) == 0:
                        return f"The current portfolio data does not list a {proj_name} project. Currently, there are no projects listed.", True
                    elif len(projects) == 1:
                        return f"The current portfolio data does not list a {proj_name} project. Asmit currently has one featured project listed in this portfolio: **{projects[0]['name']}**. It is described as: {projects[0]['description']}.", True
                    else:
                        proj_titles = ", ".join([f"**{p['name']}**" for p in projects])
                        return f"The current portfolio data does not list a {proj_name} project. The featured projects currently listed are: {proj_titles}.", True

        # 2. General projects queries
        project_keywords = ["what projects", "list projects", "what has asmit built", "show me asmit's work", "what has he built", "projects has asmit worked on", "tell me about projects", "list of projects", "any projects", "worked on any projects", "projects is listed", "projects are listed", "how many projects"]
        if any(kw in msg_lower for kw in project_keywords) or msg_lower == "projects":
            if len(projects) == 0:
                return "Asmit currently does not have any featured projects listed in this portfolio.", True
            elif len(projects) == 1:
                p = projects[0]
                tech_stack = p.get('technologies', '')
                live_url = p.get('live_url', '')
                github_url = p.get('github_url', '')
                links_text = ""
                if live_url:
                    links_text += f" [Live Demo]({live_url})"
                if github_url:
                    links_text += f" [GitHub]({github_url})"
                
                return f"Asmit currently has one featured project listed in this portfolio: **{p['name']}**.\n\n" \
                       f"**Description**: {p['description']}\n" \
                       f"**Category**: {p['category']}\n" \
                       f"**Technologies**: {tech_stack}\n" \
                       f"**Links**:{links_text}\n\n" \
                       f"The portfolio does not currently list any other projects.", True
            else:
                resp = f"Asmit Alok currently has {len(projects)} featured projects listed in this portfolio:\n\n"
                for p in projects:
                    tech_stack = p.get('technologies', '')
                    live_url = p.get('live_url', '')
                    github_url = p.get('github_url', '')
                    links_text = ""
                    if live_url:
                        links_text += f" [Live Demo]({live_url})"
                    if github_url:
                        links_text += f" [GitHub]({github_url})"
                    
                    resp += f"### **{p['name']}** ({p['category']})\n"
                    resp += f"- **Description**: {p['description']}\n"
                    resp += f"- **Technologies**: {tech_stack}\n"
                    if links_text:
                        resp += f"- **Links**:{links_text}\n"
                    resp += "\n"
                return resp, True

        # 3. Skills Query
        skills_keywords = ["what are asmit's skills", "what skills", "technical skills", "skills", "technologies", "what technologies", "languages", "frameworks", "databases", "what can he do", "specialize in", "tech stack"]
        if any(kw in msg_lower for kw in skills_keywords):
            if not skills.exists():
                return "Asmit's skills information is not currently listed in the portfolio data.", True
            
            skills_by_cat = {}
            for s in skills:
                skills_by_cat.setdefault(s.category, []).append(s.name)
            
            resp = "Asmit Alok's technical skills and specializations listed in the portfolio are:\n\n"
            for cat, items in skills_by_cat.items():
                resp += f"- **{cat}**: {', '.join(items)}\n"
            return resp, True

        # 4. Experience Query
        exp_keywords = ["experience", "job", "work history", "companies", "where did he work", "position", "career", "employment", "professional experience"]
        if any(kw in msg_lower for kw in exp_keywords):
            if not experiences.exists():
                return "Asmit's professional experience is not currently listed in the portfolio data.", True
            
            resp = "Asmit Alok's professional experience records listed in the portfolio are:\n\n"
            for e in experiences:
                resp += f"### **{e.role}** at **{e.company}**\n"
                resp += f"- **Duration**: {e.duration}\n"
                if e.location:
                    resp += f"- **Location**: {e.location}\n"
                if e.technologies:
                    resp += f"- **Technologies**: {e.technologies}\n"
                
                resp += "- **Responsibilities**:\n"
                if e.responsibilities:
                    try:
                        resp_list = json.loads(e.responsibilities)
                        for r in resp_list:
                            resp += f"  - {r}\n"
                    except:
                        for r in e.responsibilities.split('\n'):
                            if r.strip():
                                resp += f"  - {r.strip().lstrip('- ')}\n"
                resp += "\n"
            return resp, True

        # 5. Contact Query
        contact_keywords = ["contact", "email", "phone", "social", "linkedin", "github", "hire", "reach out", "connect", "meeting"]
        if any(kw in msg_lower for kw in contact_keywords):
            contact_info = []
            if profile:
                contact_info.append(f"- **Email**: {profile.email}")
                contact_info.append(f"- **Location**: {profile.location}")
            elif contact:
                contact_info.append(f"- **Email**: {contact.email}")
                contact_info.append(f"- **Location**: {contact.location}")
            
            if contact and contact.meeting_link:
                contact_info.append(f"- **Schedule a Meeting**: [Book a time]({contact.meeting_link})")
            
            social_links = {}
            if contact and contact.social_links:
                social_links = contact.social_links
            elif profile and profile.social_profiles:
                social_links = profile.social_profiles
            
            for network, link in social_links.items():
                if link:
                    contact_info.append(f"- **{network.title()}**: [{network.title()}]({link})")
            
            if not contact_info:
                return "Contact information is not currently listed in the portfolio data.", True
            
            resp = "You can connect with Asmit Alok through the following channels:\n\n" + "\n".join(contact_info)
            return resp, True

        # 6. Resume Query
        resume_keywords = ["resume", "cv", "download resume"]
        if any(kw in msg_lower for kw in resume_keywords):
            if resume:
                return f"You can download Asmit's active resume copy here: [Download Resume](/api/resume/download/).\n" \
                       f"File details: **{resume.title}** (uploaded: {resume.uploaded_at.strftime('%Y-%m-%d')}).", True
            return "Asmit's resume document is not currently listed as active in the portfolio data.", True

        return None, False

    def get_ai_response(self, user_message, session_id=None):
        """Get AI response for user message using Groq API with enhanced processing"""
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            context_data = self.get_context_data()
            
            # Check deterministic response layer first to guarantee 100% accuracy and prevent hallucination
            det_response, is_found = self.check_deterministic_response(user_message, context_data)
            if is_found:
                # Save to chat history
                from .models import ChatHistory
                ChatHistory.objects.create(
                    session_id=session_id,
                    user_message=user_message,
                    ai_response=det_response
                )
                return det_response, session_id

            system_prompt = self.generate_system_prompt(context_data)

            # Enhanced message preprocessing
            processed_message = self._preprocess_message(user_message, context_data)

            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': 'llama-3.1-8b-instant',  # Updated to currently supported model
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': processed_message}
                ],
                'max_tokens': 1000,  # Increased for more detailed responses
                'temperature': 0.3,  # Lower temperature for more consistent, professional responses
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
                
                # Post-process the response for better formatting
                ai_response = self._postprocess_response(ai_response)
                
                # Save to chat history
                from .models import ChatHistory
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

    def _preprocess_message(self, message, context_data):
        """Preprocess user message to add context and improve response quality"""
        # Check if message is asking about specific projects
        project_names = [p['name'].lower() for p in context_data['projects']]
        message_lower = message.lower()
        
        # Add context hints for better responses
        context_hints = []
        
        # Check for project name mentions
        for project in context_data['projects']:
            if project['name'].lower() in message_lower:
                if project.get('live_url'):
                    context_hints.append(f"Note: {project['name']} is live at {project['live_url']}")
                if project.get('github_url'):
                    context_hints.append(f"Source code available at {project['github_url']}")
        
        # Check for URL mentions
        import re
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', message)
        for url in urls:
            for project in context_data['projects']:
                if project.get('live_url') and url in project['live_url']:
                    context_hints.append(f"This URL corresponds to the {project['name']} project")
                    break
        
        # Check for technology-specific queries
        tech_keywords = ['features', 'technologies', 'tech stack', 'built with', 'uses', 'framework', 'language']
        if any(keyword in message_lower for keyword in tech_keywords):
            context_hints.append("User is asking about technical details - provide comprehensive technology information")
        
        # Check for project listing queries
        project_keywords = ['projects', 'work', 'portfolio', 'built', 'created', 'developed']
        if any(keyword in message_lower for keyword in project_keywords):
            context_hints.append("User wants to know about projects - provide detailed project information with links")
        
        # Enhanced message with context
        if context_hints:
            enhanced_message = f"{message}\n\nContext for AI: {' | '.join(context_hints)}"
            return enhanced_message
        
        return message

    def _postprocess_response(self, response):
        """Post-process AI response for better formatting and professionalism"""
        # Ensure proper formatting
        response = response.strip()
        
        # Add professional closing if response doesn't have one
        closing_phrases = ['feel free to', 'let me know', 'contact', 'reach out', 'explore', 'check out']
        has_closing = any(phrase in response.lower() for phrase in closing_phrases)
        
        if not has_closing and len(response) > 100:
            response += "\n\nFeel free to explore the live projects or reach out if you have any questions!"
        
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