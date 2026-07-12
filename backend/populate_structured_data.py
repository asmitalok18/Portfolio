import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import (
    Skill, Experience, HeroSection, PersonalProfile, ContactSection, ProjectInfo
)

def populate():
    print("Seeding database with structured portfolio data...")

    # 1. Seed Hero Section
    hero, created = HeroSection.objects.get_or_create(
        id=1,
        defaults={
            'name': 'Asmit Alok',
            'role': 'Full Stack Developer',
            'main_headline': 'Asmit Alok',
            'subtitle': 'Specializing in Angular, ReactJS, Python and Django | Crafting Scalable Web Apps with a User-Centric Approach',
            'availability_badge': 'Available for work',
            'cta_labels': "Let's Connect, Resume",
            'cta_links': '#contact, /resume.pdf',
            'profile_image': '/image.jpg',
            'resume_link': '/resume.pdf',
            'social_links': {
                'linkedin': 'https://www.linkedin.com/in/asmitalok',
                'github': 'https://github.com/asmitalok18',
                'whatsapp': 'https://wa.link/60n6aa',
                'telegram': 'https://t.me/Vrm01234'
            },
            'tech_badges': 'Angular, React, Python, Django'
        }
    )
    if not created:
        print("HeroSection already exists.")
    else:
        print("Seeded HeroSection.")

    # 2. Seed Personal Profile
    profile, created = PersonalProfile.objects.get_or_create(
        id=1,
        defaults={
            'full_name': 'Asmit Alok',
            'email': 'alokasmit@gmail.com',
            'phone': '+91 8210632703',
            'location': 'Gurugram, India',
            'short_bio': 'Passionate Full Stack Developer specializing in Angular, ReactJS, Python and Django with expertise in GenAI and AI integration.',
            'long_bio': "I'm a passionate technology enthusiast dedicated to staying at the forefront of emerging industry trends and advancements. My commitment to continuous learning drives me to actively seek opportunities where I can contribute meaningfully to the ever-evolving world of technology.",
            'current_role': 'Full Stack Developer',
            'current_status': 'Available for work',
            'social_profiles': {
                'linkedin': 'https://www.linkedin.com/in/asmitalok',
                'github': 'https://github.com/asmitalok18',
                'whatsapp': 'https://wa.link/60n6aa',
                'telegram': 'https://t.me/Vrm01234'
            }
        }
    )
    if not created:
        print("PersonalProfile already exists.")
    else:
        print("Seeded PersonalProfile.")

    # 3. Seed Contact Section
    contact, created = ContactSection.objects.get_or_create(
        id=1,
        defaults={
            'email': 'alokasmit@gmail.com',
            'phone': '+91 8210632703',
            'location': 'Gurugram, India',
            'cta_heading': "Let's Connect",
            'cta_subtitle': 'Have a project in mind or want to discuss opportunities?',
            'social_links': {
                'linkedin': 'https://www.linkedin.com/in/asmitalok',
                'github': 'https://github.com/asmitalok18',
                'whatsapp': 'https://wa.link/60n6aa',
                'telegram': 'https://t.me/Vrm01234'
            },
            'meeting_link': 'https://calendly.com/asmitalok'
        }
    )
    if not created:
        print("ContactSection already exists.")
    else:
        print("Seeded ContactSection.")

    # 4. Seed Skills
    skills_data = [
        # Frontend
        {'name': 'React.js', 'category': 'Frontend Development', 'level': 80, 'icon': 'FaReact', 'display_order': 1},
        {'name': 'JavaScript', 'category': 'Frontend Development', 'level': 80, 'icon': 'SiJavascript', 'display_order': 2},
        {'name': 'TypeScript', 'category': 'Frontend Development', 'level': 75, 'icon': 'SiTypescript', 'display_order': 3},
        {'name': 'HTML/CSS', 'category': 'Frontend Development', 'level': 90, 'icon': 'FaCode', 'display_order': 4},
        {'name': 'Tailwind CSS', 'category': 'Frontend Development', 'level': 80, 'icon': 'SiTailwindcss', 'display_order': 5},
        {'name': 'Bootstrap', 'category': 'Frontend Development', 'level': 75, 'icon': 'SiBootstrap', 'display_order': 6},
        # Backend
        {'name': 'Node.js', 'category': 'Backend Development', 'level': 70, 'icon': 'FaNodeJs', 'display_order': 7},
        {'name': 'Express.js', 'category': 'Backend Development', 'level': 70, 'icon': 'FaCode', 'display_order': 8},
        {'name': 'Python', 'category': 'Backend Development', 'level': 80, 'icon': 'SiPython', 'display_order': 9},
        {'name': 'REST APIs', 'category': 'Backend Development', 'level': 85, 'icon': 'FaCode', 'display_order': 10},
        {'name': 'Django', 'category': 'Backend Development', 'level': 80, 'icon': 'FaCode', 'display_order': 11},
        # Database & DevOps
        {'name': 'MongoDB', 'category': 'Database & DevOps', 'level': 70, 'icon': 'SiMongodb', 'display_order': 12},
        {'name': 'PostgreSQL', 'category': 'Database & DevOps', 'level': 75, 'icon': 'SiPostgresql', 'display_order': 13},
        {'name': 'MySQL', 'category': 'Database & DevOps', 'level': 85, 'icon': 'SiMysql', 'display_order': 14},
        {'name': 'Docker', 'category': 'Database & DevOps', 'level': 50, 'icon': 'FaDocker', 'display_order': 15},
    ]

    for sd in skills_data:
        Skill.objects.get_or_create(
            name=sd['name'],
            defaults=sd
        )
    print(f"Seeded {len(skills_data)} skills.")

    # 5. Seed Experiences
    exp_data = [
        {
            'role': 'Associate Consultant L1 - Frontend Development',
            'company': 'Oodles Technologies',
            'location': 'Gurugram, India',
            'duration': 'Feb 2025 - Present',
            'type': 'Full-time',
            'responsibilities': json.dumps([
                "Developed a comprehensive GenAI application using Angular 18+ with TypeScript, implementing complex components like file upload, query processing, and data visualization",
                "Integrated NgRx for state management to handle query states across components and maintain application data consistency",
                "Implemented automated report generation using jsPDF and PptxGenJS, generating professional PDFs and PowerPoint slides with multi-page layouts, embedded charts, and structured analytics from API responses",
                "Connected Django backend with frontend for smooth LLM-powered interactions and clean API use",
                "Implemented data preprocessing workflows to generate embeddings using large language models (LLMs)"
            ]),
            'technologies': 'Angular, TypeScript, NgRx, jsPDF, PptxGenJS, Django',
            'display_order': 1
        },
        {
            'role': 'Software Developer Intern',
            'company': 'Akshar Consultancy Services Pvt. Ltd.',
            'location': 'Delhi, India',
            'duration': 'Jun 2024 - Dec 2024',
            'type': 'Internship',
            'responsibilities': json.dumps([
                "Built dynamic and responsive single-page applications (SPAs) using React.js, JSX, and Tailwind CSS, enhancing performance through efficient Virtual DOM handling and reusable UI components",
                "Designed and implemented modular React components using Hooks (useState, useEffect, useContext) and a props-driven architecture, ensuring code scalability and maintainability",
                "Developed and deployed responsive web interfaces with Tailwind CSS, significantly improving cross-device compatibility and user engagement",
                "Collaborated in a cross-functional team of 4 developers to build RESTful APIs using Node.js and Express, streamlining backend operations and improving data handling efficiency",
                "Implemented secure authentication mechanisms using JSON Web Tokens (JWT), ensuring safe and reliable access management for over 500+ user accounts"
            ]),
            'technologies': 'React.js, Tailwind CSS, Node.js, Express, JWT',
            'display_order': 2
        }
    ]

    for ed in exp_data:
        Experience.objects.get_or_create(
            role=ed['role'],
            company=ed['company'],
            defaults=ed
        )
    print(f"Seeded {len(exp_data)} experiences.")

    # 6. Seed Projects details if not exists
    projects = ProjectInfo.objects.all()
    if not projects.exists():
        projects_data = [
            {
                'name': 'Blog Project',
                'description': 'Built a full-stack blog app with Django REST and React, featuring JWT auth, role-based access, and scalable CRUD APIs. Integrated paginated blog cards, dynamic routing, voice-to-text blog creation, and a user-specific comment system.',
                'technologies': 'React, Python, Django, MySQL, JWT, Tailwind css',
                'github_url': 'https://github.com/asmitalok18/ecommerce',
                'live_url': 'https://your-ecommerce-demo.vercel.app',
                'image_url': '/blog_app_image.png',
                'category': 'Content Management',
                'slug': 'blog-project',
                'short_description': 'Full-stack blog app with Django REST and React.',
                'features_list': json.dumps(["JWT Authentication", "Role-based access", "Voice-to-text creation", "Comment system"])
            },
            {
                'name': 'Portfolio Website',
                'description': 'Developed a fully responsive portfolio website using React and Bootstrap, showcasing smooth scroll animations, modern UI design, and optimized performance across devices to highlight personal projects and skills.',
                'technologies': 'React, Bootstrap, AOS, CSS3, Javascript, Framer Motion',
                'github_url': 'https://github.com/asmitalok18/Portfolio',
                'live_url': 'https://portfolio-chi-one-53.vercel.app/',
                'image_url': '/portfolio.png',
                'category': 'Web Application',
                'slug': 'portfolio-website',
                'short_description': 'Fully responsive AI-powered portfolio site.',
                'features_list': json.dumps(["Framer Motion animations", "AOS scrolls", "Custom dark theme", "Bootstrap layout"])
            }
        ]
        for pd in projects_data:
            ProjectInfo.objects.create(**pd)
        print("Seeded default projects.")
    else:
        # Update slug and display_order for existing projects if they are null
        for project in projects:
            if not project.slug:
                project.slug = project.name.lower().replace(" ", "-")
            if not project.short_description:
                project.short_description = project.description[:100] + "..."
            project.save()
        print("Updated existing projects with new fields.")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    populate()
