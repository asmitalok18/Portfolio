import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import PersonalInfo, ProjectInfo, KnowledgeBase, PortfolioSettings
from django.contrib.auth.models import User

def setup_asmit_data():
    """Setup complete data for Asmit Alok's AI assistant and portfolio"""
    
    # Create superuser if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@asmitalok.com', 'admin123')
        print("Created superuser: admin / admin123")
    
    # Personal Information for Asmit Alok
    personal_data = [
        {'key': 'name', 'value': 'Asmit Alok', 'category': 'basic'},
        {'key': 'title', 'value': 'Full Stack Developer', 'category': 'basic'},
        {'key': 'location', 'value': 'India', 'category': 'basic'},
        {'key': 'email', 'value': 'contact@asmitalok.com', 'category': 'contact'},
        {'key': 'linkedin', 'value': 'https://linkedin.com/in/asmit-alok', 'category': 'contact'},
        {'key': 'github', 'value': 'https://github.com/asmitalok', 'category': 'contact'},
        {'key': 'experience_years', 'value': '5+ years', 'category': 'experience'},
        {'key': 'specialization', 'value': 'Angular, ReactJS, Python, Django, AI Integration', 'category': 'skills'},
        {'key': 'bio', 'value': 'Passionate full-stack developer specializing in Angular, ReactJS, Python and Django. I craft scalable web applications with a user-centric approach and have expertise in AI integration for modern web solutions.', 'category': 'about'},
        {'key': 'education', 'value': 'Bachelor of Technology in Computer Science', 'category': 'education'},
        {'key': 'languages', 'value': 'JavaScript, Python, TypeScript, HTML5, CSS3', 'category': 'skills'},
        {'key': 'frameworks', 'value': 'Angular, React, Django, Node.js, Express', 'category': 'skills'},
        {'key': 'databases', 'value': 'MongoDB, PostgreSQL, MySQL, SQLite', 'category': 'skills'},
        {'key': 'tools', 'value': 'Git, Docker, AWS, Heroku, Vercel, VS Code', 'category': 'skills'},
        {'key': 'certifications', 'value': 'Full Stack Development, Python Programming, Web Development', 'category': 'education'},
    ]
    
    for data in personal_data:
        PersonalInfo.objects.get_or_create(
            key=data['key'],
            defaults={'value': data['value'], 'category': data['category']}
        )
    
    # Project Information based on the portfolio images
    # projects_data = [
    #     {
    #         'name': 'AI-Powered Portfolio Website',
    #         'description': 'A dynamic portfolio website with integrated AI assistant that can answer questions about projects, skills, and experience. Features include project management, resume upload, and intelligent chat functionality powered by advanced AI models.',
    #         'technologies': 'React, Django, Groq AI, SQLite, Bootstrap, Web Scraping',
    #         'category': 'Web Application',
    #         'github_url': 'https://github.com/asmitalok/ai-portfolio',
    #         'live_url': 'https://asmitalok.com',
    #         'image_url': '/portfolio.png'
    #     },
    #     {
    #         'name': 'Blog Application',
    #         'description': 'A comprehensive blog platform with user authentication, post creation, editing, commenting system, and admin dashboard. Features include rich text editor, image uploads, and responsive design.',
    #         'technologies': 'React, Node.js, Express, MongoDB, JWT Authentication',
    #         'category': 'Content Management',
    #         'github_url': 'https://github.com/asmitalok/blog-app',
    #         'live_url': 'https://blog.asmitalok.com',
    #         'image_url': '/blog_app_image.png'
    #     },
    #     {
    #         'name': 'Cricket Statistics Website',
    #         'description': 'A cricket statistics and news website with live scores, player information, match schedules, and historical data. Features real-time updates and comprehensive cricket analytics.',
    #         'technologies': 'HTML5, CSS3, JavaScript, Cricket API, Bootstrap',
    #         'category': 'Sports Analytics',
    #         'github_url': 'https://github.com/asmitalok/cricket-website',
    #         'live_url': 'https://cricket.asmitalok.com',
    #         'image_url': '/cricket_website.png'
    #     },
    #     {
    #         'name': 'PlayTube - Video Streaming Platform',
    #         'description': 'A video streaming platform similar to YouTube with video upload, streaming, user management, playlists, and search functionality. Includes video processing and optimization features.',
    #         'technologies': 'React, Node.js, Express, MongoDB, Video Processing APIs, AWS S3',
    #         'category': 'Media Platform',
    #         'github_url': 'https://github.com/asmitalok/playtube',
    #         'live_url': 'https://playtube.asmitalok.com',
    #         'image_url': '/playtube.png'
    #     },
    #     {
    #         'name': 'Student Management System',
    #         'description': 'A comprehensive system for managing student records, grades, attendance, course management, and administrative tasks. Features include reporting, analytics, and multi-role access control.',
    #         'technologies': 'Python, Django, SQLite, Bootstrap, Chart.js',
    #         'category': 'Management System',
    #         'github_url': 'https://github.com/asmitalok/student-management',
    #         'live_url': 'https://students.asmitalok.com',
    #         'image_url': '/student_management.jpg'
    #     },
    #     {
    #         'name': 'Educator Learning Platform',
    #         'description': 'An online learning platform for educators to create courses, manage students, conduct assessments, and track progress. Features include video lectures, assignments, and interactive learning tools.',
    #         'technologies': 'React, Django REST Framework, PostgreSQL, Redis, WebSocket',
    #         'category': 'Education Platform',
    #         'github_url': 'https://github.com/asmitalok/educator-platform',
    #         'live_url': 'https://educator.asmitalok.com',
    #         'image_url': '/educator.png'
    #     }
    # ]
    
    # for project_data in projects_data:
    #     ProjectInfo.objects.get_or_create(
    #         name=project_data['name'],
    #         defaults=project_data
    #     )
    
    # Enhanced Knowledge Base
    knowledge_data = [
        {
            'category': 'skills',
            'question': 'What programming languages and technologies does Asmit know?',
            'answer': 'Asmit is proficient in JavaScript, Python, TypeScript, HTML5, and CSS3. He specializes in modern frameworks like Angular, React, Django, and Node.js. He also has experience with databases like MongoDB, PostgreSQL, and MySQL, along with tools like Git, Docker, AWS, and various AI integration technologies.',
            'keywords': 'programming, languages, javascript, python, typescript, html, css, angular, react, django, nodejs, skills, technologies'
        },
        {
            'category': 'experience',
            'question': 'What is Asmit\'s development experience?',
            'answer': 'Asmit has 5+ years of experience in full-stack development, specializing in Angular, ReactJS, Python, and Django. He has worked on various projects including AI-powered portfolios, content management systems, media platforms, and educational tools. His expertise includes crafting scalable web applications with user-centric approaches.',
            'keywords': 'experience, development, fullstack, angular, react, django, python, scalable, user-centric'
        },
        {
            'category': 'projects',
            'question': 'What types of projects has Asmit worked on?',
            'answer': 'Asmit has worked on diverse projects including AI-powered portfolio websites, blog applications, video streaming platforms, student management systems, cricket statistics websites, and educational platforms. His projects demonstrate expertise in full-stack development, AI integration, and creating user-friendly interfaces.',
            'keywords': 'projects, ai-powered, blog, video streaming, student management, cricket, education, fullstack'
        },
        {
            'category': 'ai_integration',
            'question': 'Does Asmit have experience with AI and machine learning?',
            'answer': 'Yes, Asmit has significant experience with AI integration in web applications. He has built AI-powered portfolio assistants, implemented chatbots, worked with natural language processing, and integrated various AI APIs including Groq and OpenAI. He specializes in creating intelligent web solutions that enhance user experience.',
            'keywords': 'ai, machine learning, chatbots, nlp, groq, openai, intelligent solutions, ai integration'
        },
        {
            'category': 'specialization',
            'question': 'What is Asmit\'s area of specialization?',
            'answer': 'Asmit specializes in Angular, ReactJS, Python, and Django development. He focuses on creating scalable web applications with user-centric approaches and has particular expertise in AI integration for modern web solutions. He excels at building full-stack applications that solve real-world problems.',
            'keywords': 'specialization, angular, react, python, django, scalable, user-centric, ai integration'
        },
        {
            'category': 'contact',
            'question': 'How can someone contact Asmit or hire him?',
            'answer': 'You can contact Asmit through email at contact@asmitalok.com, connect with him on LinkedIn, or check out his work on GitHub. He is available for freelance projects, full-time opportunities, and collaborations. Feel free to reach out to discuss your project requirements.',
            'keywords': 'contact, hire, email, linkedin, github, freelance, full-time, collaboration, opportunities'
        },
        {
            'category': 'services',
            'question': 'What services does Asmit offer?',
            'answer': 'Asmit offers comprehensive full-stack web development services including frontend development with Angular and React, backend development with Python and Django, AI integration, API development, database design, and consultation services. He can help with both new project development and existing system enhancement.',
            'keywords': 'services, fullstack, frontend, backend, ai integration, api development, database, consultation'
        },
        {
            'category': 'approach',
            'question': 'What is Asmit\'s development approach?',
            'answer': 'Asmit follows a user-centric approach to development, focusing on creating scalable, maintainable, and efficient web applications. He emphasizes clean code, best practices, responsive design, and modern development methodologies. His goal is to deliver solutions that not only meet technical requirements but also provide excellent user experiences.',
            'keywords': 'approach, user-centric, scalable, maintainable, clean code, best practices, responsive, user experience'
        }
    ]
    
    for kb_data in knowledge_data:
        KnowledgeBase.objects.get_or_create(
            question=kb_data['question'],
            defaults=kb_data
        )
    
    # Portfolio Settings
    settings_data = [
        {'key': 'site_title', 'value': 'Asmit Alok - Full Stack Developer', 'description': 'Main site title'},
        {'key': 'site_description', 'value': 'Portfolio of Asmit Alok, a passionate full-stack developer specializing in Angular, ReactJS, Python and Django with expertise in AI integration.', 'description': 'Site meta description'},
        {'key': 'hero_title', 'value': 'Hello, I\'m Asmit Alok', 'description': 'Hero section title'},
        {'key': 'hero_subtitle', 'value': 'Full Stack Developer', 'description': 'Hero section subtitle'},
        {'key': 'hero_description', 'value': 'Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach', 'description': 'Hero section description'},
        {'key': 'about_summary', 'value': 'I create innovative web solutions that combine modern technologies with intelligent features, focusing on scalability and user experience.', 'description': 'About section summary'},
    ]
    
    for setting_data in settings_data:
        PortfolioSettings.objects.get_or_create(
            key=setting_data['key'],
            defaults={'value': setting_data['value'], 'description': setting_data['description']}
        )
    
    print("✅ Asmit Alok's portfolio data setup completed!")
    print("\n📋 Summary:")
    print(f"- Personal Information: {len(personal_data)} entries")
    print(f"- Projects: {len(projects_data)} projects")
    print(f"- Knowledge Base: {len(knowledge_data)} Q&A pairs")
    print(f"- Portfolio Settings: {len(settings_data)} settings")
    print("\n🚀 Next steps:")
    print("1. Update the live URLs in projects with actual deployed links")
    print("2. Update GitHub URLs with real repository links")
    print("3. Upload resume through the management interface")
    print("4. Test the AI assistant to ensure accurate responses")
    print("5. Configure Groq API key in .env file")
    print("\n🔗 Access the management interface at: http://localhost:8000/admin/")
    print("Default login: admin / admin123")

if __name__ == '__main__':
    setup_asmit_data()