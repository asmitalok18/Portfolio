import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import PersonalInfo, ProjectInfo, KnowledgeBase, PortfolioSettings
from django.contrib.auth.models import User

def setup_complete_data():
    """Setup complete data for the AI assistant and portfolio management"""
    
    # Create superuser using environment variables if it doesn't exist
    admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
    
    if admin_password:
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(admin_username, admin_email, admin_password)
            print(f"Created superuser: {admin_username} using credentials from .env")
    else:
        print("Warning: DJANGO_SUPERUSER_PASSWORD not set in .env. Superuser creation skipped.")
    
    # Personal Information
    personal_data = [
        {'key': 'name', 'value': 'Your Full Name', 'category': 'basic'},
        {'key': 'title', 'value': 'Full Stack Developer', 'category': 'basic'},
        {'key': 'location', 'value': 'Your City, Country', 'category': 'basic'},
        {'key': 'email', 'value': 'your.email@example.com', 'category': 'contact'},
        {'key': 'phone', 'value': '+1 (555) 123-4567', 'category': 'contact'},
        {'key': 'linkedin', 'value': 'https://linkedin.com/in/yourprofile', 'category': 'contact'},
        {'key': 'github', 'value': 'https://github.com/yourusername', 'category': 'contact'},
        {'key': 'experience_years', 'value': '3+ years', 'category': 'experience'},
        {'key': 'specialization', 'value': 'React, Node.js, Python, Django, AI Integration', 'category': 'skills'},
        {'key': 'bio', 'value': 'Passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating innovative solutions that solve real-world problems.', 'category': 'about'},
        {'key': 'education', 'value': 'Bachelor of Technology in Computer Science', 'category': 'education'},
        {'key': 'languages', 'value': 'JavaScript, Python, TypeScript, Java, C++', 'category': 'skills'},
        {'key': 'frameworks', 'value': 'React, Django, Node.js, Express, Flask', 'category': 'skills'},
        {'key': 'databases', 'value': 'MongoDB, PostgreSQL, MySQL, SQLite', 'category': 'skills'},
        {'key': 'tools', 'value': 'Git, Docker, AWS, Heroku, Vercel', 'category': 'skills'},
    ]
    
    for data in personal_data:
        PersonalInfo.objects.get_or_create(
            key=data['key'],
            defaults={'value': data['value'], 'category': data['category']}
        )
    
    # Project Information
    projects_data = [
        {
            'name': 'AI-Powered Portfolio',
            'description': 'A dynamic portfolio website with integrated AI assistant that can answer questions about projects, skills, and experience. Features include project management, resume upload, and intelligent chat functionality.',
            'technologies': 'React, Django, OpenAI GPT, SQLite, Bootstrap',
            'category': 'Web Application',
            'github_url': 'https://github.com/yourusername/ai-portfolio',
            'live_url': 'https://your-portfolio.com',
            'image_url': '/ai_portfolio.png'
        },
        {
            'name': 'E-Commerce Platform',
            'description': 'Full-stack e-commerce solution with user authentication, product management, shopping cart, and payment integration.',
            'technologies': 'React, Node.js, Express, MongoDB, Stripe',
            'category': 'E-Commerce',
            'github_url': 'https://github.com/yourusername/ecommerce',
            'live_url': 'https://your-ecommerce.com',
            'image_url': '/ecommerce.png'
        },
        {
            'name': 'Task Management App',
            'description': 'Collaborative task management application with real-time updates, team collaboration, and project tracking features.',
            'technologies': 'React, Django REST, PostgreSQL, WebSocket',
            'category': 'Productivity',
            'github_url': 'https://github.com/yourusername/task-manager',
            'live_url': 'https://your-taskmanager.com',
            'image_url': '/task_manager.png'
        },
        {
            'name': 'Weather Dashboard',
            'description': 'Interactive weather dashboard with location-based forecasts, historical data, and beautiful visualizations.',
            'technologies': 'React, Chart.js, Weather API, CSS3',
            'category': 'Data Visualization',
            'github_url': 'https://github.com/yourusername/weather-dashboard',
            'live_url': 'https://your-weather-app.com',
            'image_url': '/weather_dashboard.png'
        },
        {
            'name': 'Social Media Analytics',
            'description': 'Analytics platform for social media metrics with data visualization and reporting features.',
            'technologies': 'Python, Django, Pandas, D3.js, PostgreSQL',
            'category': 'Analytics',
            'github_url': 'https://github.com/yourusername/social-analytics',
            'live_url': 'https://your-analytics.com',
            'image_url': '/social_analytics.png'
        }
    ]
    
    for project_data in projects_data:
        ProjectInfo.objects.get_or_create(
            name=project_data['name'],
            defaults=project_data
        )
    
    # Knowledge Base
    knowledge_data = [
        {
            'category': 'skills',
            'question': 'What programming languages do you know?',
            'answer': 'I am proficient in JavaScript, Python, TypeScript, Java, and C++. I have extensive experience with modern frameworks and libraries.',
            'keywords': 'programming, languages, javascript, python, typescript, java, cpp, skills'
        },
        {
            'category': 'experience',
            'question': 'What is your development experience?',
            'answer': 'I have 3+ years of experience in full-stack development, working with modern frameworks like React, Django, and Node.js. I specialize in creating scalable web applications and AI-powered solutions.',
            'keywords': 'experience, development, react, django, nodejs, fullstack, ai, scalable'
        },
        {
            'category': 'projects',
            'question': 'What types of projects have you worked on?',
            'answer': 'I have worked on various projects including AI-powered portfolios, e-commerce platforms, task management applications, data visualization dashboards, and social media analytics tools.',
            'keywords': 'projects, ai, ecommerce, task management, data visualization, analytics'
        },
        {
            'category': 'contact',
            'question': 'How can someone contact you?',
            'answer': 'You can reach me through email, LinkedIn, or check out my work on GitHub. All contact information is available in my portfolio. I\'m always open to discussing new opportunities and collaborations.',
            'keywords': 'contact, email, linkedin, github, reach, hire, opportunities'
        },
        {
            'category': 'ai',
            'question': 'Do you have experience with AI and machine learning?',
            'answer': 'Yes, I have experience integrating AI solutions into web applications, including chatbots, natural language processing, and API integrations with services like OpenAI GPT.',
            'keywords': 'ai, machine learning, chatbots, nlp, openai, gpt, integration'
        },
        {
            'category': 'technologies',
            'question': 'What technologies do you work with?',
            'answer': 'I work with a wide range of technologies including React, Django, Node.js, Python, JavaScript, MongoDB, PostgreSQL, AWS, Docker, and various AI/ML tools.',
            'keywords': 'technologies, react, django, nodejs, python, javascript, mongodb, postgresql, aws, docker'
        },
        {
            'category': 'services',
            'question': 'What services do you offer?',
            'answer': 'I offer full-stack web development, AI integration, API development, database design, and consultation services. I can help with both frontend and backend development.',
            'keywords': 'services, fullstack, ai integration, api development, database, consultation'
        }
    ]
    
    for kb_data in knowledge_data:
        KnowledgeBase.objects.get_or_create(
            question=kb_data['question'],
            defaults=kb_data
        )
    
    # Portfolio Settings
    settings_data = [
        {'key': 'site_title', 'value': 'Your Name - Full Stack Developer', 'description': 'Main site title'},
        {'key': 'site_description', 'value': 'Portfolio of a passionate full-stack developer specializing in modern web technologies and AI integration.', 'description': 'Site meta description'},
        {'key': 'hero_title', 'value': 'Hi, I\'m Your Name', 'description': 'Hero section title'},
        {'key': 'hero_subtitle', 'value': 'Full Stack Developer & AI Enthusiast', 'description': 'Hero section subtitle'},
        {'key': 'about_summary', 'value': 'I create innovative web solutions that combine modern technologies with intelligent features.', 'description': 'About section summary'},
    ]
    
    for setting_data in settings_data:
        PortfolioSettings.objects.get_or_create(
            key=setting_data['key'],
            defaults={'value': setting_data['value'], 'description': setting_data['description']}
        )
    
    print("Complete data setup completed!")
    print("\nNext steps:")
    print("1. Update personal information in the admin panel or management interface")
    print("2. Add your actual projects with real GitHub URLs and live demo links")
    print("3. Upload your resume through the management interface")
    print("4. Customize the AI knowledge base with specific information about your work")
    print("5. Test the AI assistant to ensure it provides accurate responses")
    print("\nAccess the management interface at: http://localhost:3000/admin-portfolio-management-secure")
    admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    print(f"Login with username '{admin_username}' and your configured .env password.")

if __name__ == '__main__':
    setup_complete_data()