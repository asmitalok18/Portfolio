import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import PersonalInfo, ProjectInfo, KnowledgeBase

def setup_initial_data():
    """Setup initial data for the AI assistant"""
    
    # Personal Information
    personal_data = [
        {'key': 'name', 'value': 'Your Name', 'category': 'basic'},
        {'key': 'title', 'value': 'Full Stack Developer', 'category': 'basic'},
        {'key': 'location', 'value': 'Your Location', 'category': 'basic'},
        {'key': 'email', 'value': 'your.email@example.com', 'category': 'contact'},
        {'key': 'linkedin', 'value': 'https://linkedin.com/in/yourprofile', 'category': 'contact'},
        {'key': 'github', 'value': 'https://github.com/yourusername', 'category': 'contact'},
        {'key': 'experience_years', 'value': '3+ years', 'category': 'experience'},
        {'key': 'specialization', 'value': 'React, Node.js, Python, Django', 'category': 'skills'},
        {'key': 'bio', 'value': 'Passionate full-stack developer with expertise in modern web technologies...', 'category': 'about'},
    ]
    
    for data in personal_data:
        PersonalInfo.objects.get_or_create(
            key=data['key'],
            defaults={'value': data['value'], 'category': data['category']}
        )
    
    # Project Information (based on your portfolio images)
    projects_data = [
        {
            'name': 'Blog Application',
            'description': 'A full-featured blog application with user authentication, post creation, and commenting system.',
            'technologies': 'React, Node.js, Express, MongoDB',
            'category': 'Web Application',
            'github_url': 'https://github.com/yourusername/blog-app',
            'live_url': 'https://your-blog-app.com',
            'image_url': '/blog_app_image.png'
        },
        {
            'name': 'Cricket Website',
            'description': 'A cricket statistics and news website with live scores and player information.',
            'technologies': 'HTML, CSS, JavaScript, API Integration',
            'category': 'Sports Website',
            'github_url': 'https://github.com/yourusername/cricket-website',
            'live_url': 'https://your-cricket-site.com',
            'image_url': '/cricket_website.png'
        },
        {
            'name': 'PlayTube',
            'description': 'A video streaming platform similar to YouTube with upload, streaming, and user management features.',
            'technologies': 'React, Node.js, Express, MongoDB, Video Processing',
            'category': 'Media Platform',
            'github_url': 'https://github.com/yourusername/playtube',
            'live_url': 'https://your-playtube.com',
            'image_url': '/playtube.png'
        },
        {
            'name': 'Student Management System',
            'description': 'A comprehensive system for managing student records, grades, and administrative tasks.',
            'technologies': 'Python, Django, SQLite, Bootstrap',
            'category': 'Management System',
            'github_url': 'https://github.com/yourusername/student-management',
            'live_url': 'https://your-student-system.com',
            'image_url': '/student_management.jpg'
        },
        {
            'name': 'Educator Platform',
            'description': 'An online learning platform for educators to create courses and manage students.',
            'technologies': 'React, Django, PostgreSQL, Redis',
            'category': 'Education Platform',
            'github_url': 'https://github.com/yourusername/educator-platform',
            'live_url': 'https://your-educator-platform.com',
            'image_url': '/educator.png'
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
            'answer': 'I am proficient in JavaScript, Python, HTML, CSS, and have experience with TypeScript and SQL.',
            'keywords': 'programming, languages, javascript, python, html, css, typescript, sql'
        },
        {
            'category': 'experience',
            'question': 'What is your development experience?',
            'answer': 'I have 3+ years of experience in full-stack development, working with modern frameworks like React, Django, and Node.js.',
            'keywords': 'experience, development, react, django, nodejs, fullstack'
        },
        {
            'category': 'projects',
            'question': 'What types of projects have you worked on?',
            'answer': 'I have worked on various projects including web applications, management systems, media platforms, and educational tools.',
            'keywords': 'projects, web applications, management systems, media platforms, education'
        },
        {
            'category': 'contact',
            'question': 'How can someone contact you?',
            'answer': 'You can reach me through email, LinkedIn, or check out my work on GitHub. All contact information is available in my portfolio.',
            'keywords': 'contact, email, linkedin, github, reach, hire'
        }
    ]
    
    for kb_data in knowledge_data:
        KnowledgeBase.objects.get_or_create(
            question=kb_data['question'],
            defaults=kb_data
        )
    
    print("Initial data setup completed!")

if __name__ == '__main__':
    setup_initial_data()