import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import KnowledgeBase, ProjectInfo

def add_comprehensive_project_knowledge():
    """Add comprehensive knowledge about all projects"""
    
    # Get all projects
    projects = ProjectInfo.objects.all()
    
    for project in projects:
        # Add detailed project knowledge
        project_knowledge = [
            {
                'category': 'projects',
                'question': f'What is {project.name}?',
                'answer': f'{project.name} is a {project.category} project built with {project.technologies}. {project.description} You can explore it live at {project.live_url if project.live_url else "the project repository"} and view the source code on GitHub.',
                'keywords': f'{project.name.lower()}, {project.category.lower()}, {project.technologies.lower()}, project, portfolio'
            },
            {
                'category': 'projects',
                'question': f'What technologies does {project.name} use?',
                'answer': f'{project.name} is built using {project.technologies}. This technology stack was chosen to provide {project.description.split(".")[0] if "." in project.description else project.description}. The project demonstrates expertise in modern web development and best practices.',
                'keywords': f'{project.name.lower()}, technologies, {project.technologies.lower()}, tech stack, development'
            },
            {
                'category': 'projects',
                'question': f'Can I see {project.name} live?',
                'answer': f'Yes! {project.name} is live and accessible at {project.live_url if project.live_url else "the project repository"}. You can interact with all the features and see the project in action. The source code is also available on GitHub for technical review.' + (f' Visit {project.live_url} to explore the project.' if project.live_url else ''),
                'keywords': f'{project.name.lower()}, live demo, url, website, {project.live_url if project.live_url else ""}'
            }
        ]
        
        for kb_data in project_knowledge:
            # Check if similar question exists
            existing = KnowledgeBase.objects.filter(
                question__icontains=project.name
            ).filter(
                question__icontains=kb_data['question'].split()[-1]  # Last word of question
            ).first()
            
            if not existing:
                KnowledgeBase.objects.create(**kb_data)
                print(f"Added knowledge for {project.name}: {kb_data['question']}")
            else:
                existing.answer = kb_data['answer']
                existing.keywords = kb_data['keywords']
                existing.save()
                print(f"Updated knowledge for {project.name}: {kb_data['question']}")
    
    # Add general project overview knowledge
    all_projects = ProjectInfo.objects.all()
    if all_projects:
        project_list = []
        for p in all_projects:
            project_info = f"• {p.name} ({p.category}) - {p.technologies}"
            if p.live_url:
                project_info += f" - Live at {p.live_url}"
            project_list.append(project_info)
        
        overview_knowledge = {
            'category': 'projects',
            'question': 'What projects has Asmit built?',
            'answer': f'Asmit has built several impressive projects showcasing his full-stack development skills:\n\n' + '\n'.join(project_list) + '\n\nEach project demonstrates different aspects of modern web development, from AI integration to real-time features and responsive design. You can explore the live demos and source code to see the quality of work and technical expertise.',
            'keywords': 'projects, portfolio, built, created, developed, showcase, full-stack, web development'
        }
        
        existing_overview = KnowledgeBase.objects.filter(question__icontains='What projects has Asmit').first()
        if not existing_overview:
            KnowledgeBase.objects.create(**overview_knowledge)
            print("Added project overview knowledge")
        else:
            existing_overview.answer = overview_knowledge['answer']
            existing_overview.keywords = overview_knowledge['keywords']
            existing_overview.save()
            print("Updated project overview knowledge")
    
    print("Comprehensive project knowledge added successfully!")

if __name__ == '__main__':
    add_comprehensive_project_knowledge()