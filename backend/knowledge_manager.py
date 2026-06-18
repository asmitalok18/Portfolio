import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_ai.settings')
django.setup()

from ai_assistant.models import KnowledgeBase

def add_custom_knowledge():
    """Interactive script to add custom knowledge to the AI assistant"""
    
    print("=== AI Assistant Knowledge Manager ===")
    print("This tool helps you add specific knowledge about your projects and skills.")
    print("Press Ctrl+C to exit at any time.\n")
    
    try:
        while True:
            print("\nChoose an option:")
            print("1. Add new knowledge entry")
            print("2. View existing knowledge")
            print("3. Update existing knowledge")
            print("4. Add project-specific knowledge")
            print("5. Exit")
            
            choice = input("\nEnter your choice (1-5): ").strip()
            
            if choice == '1':
                add_new_knowledge()
            elif choice == '2':
                view_knowledge()
            elif choice == '3':
                update_knowledge()
            elif choice == '4':
                add_project_specific()
            elif choice == '5':
                print("Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")
                
    except KeyboardInterrupt:
        print("\nGoodbye!")

def add_new_knowledge():
    """Add a new knowledge entry"""
    print("\n--- Add New Knowledge ---")
    
    category = input("Category (e.g., projects, skills, experience): ").strip()
    question = input("Question: ").strip()
    answer = input("Answer: ").strip()
    keywords = input("Keywords (comma-separated): ").strip()
    
    if all([category, question, answer]):
        KnowledgeBase.objects.create(
            category=category,
            question=question,
            answer=answer,
            keywords=keywords
        )
        print("✅ Knowledge added successfully!")
    else:
        print("❌ Please fill in all required fields.")

def view_knowledge():
    """View existing knowledge entries"""
    print("\n--- Existing Knowledge ---")
    
    entries = KnowledgeBase.objects.all().order_by('category', 'question')
    
    if not entries:
        print("No knowledge entries found.")
        return
    
    current_category = None
    for entry in entries:
        if entry.category != current_category:
            current_category = entry.category
            print(f"\n📁 {current_category.upper()}")
            print("-" * 40)
        
        print(f"Q: {entry.question}")
        print(f"A: {entry.answer[:100]}{'...' if len(entry.answer) > 100 else ''}")
        print(f"Keywords: {entry.keywords}")
        print()

def update_knowledge():
    """Update existing knowledge"""
    print("\n--- Update Knowledge ---")
    
    search_term = input("Enter part of the question to search: ").strip()
    
    if not search_term:
        print("Please enter a search term.")
        return
    
    entries = KnowledgeBase.objects.filter(question__icontains=search_term)
    
    if not entries:
        print("No matching entries found.")
        return
    
    print(f"\nFound {entries.count()} matching entries:")
    for i, entry in enumerate(entries, 1):
        print(f"{i}. {entry.question}")
    
    try:
        choice = int(input("\nSelect entry to update (number): ")) - 1
        if 0 <= choice < len(entries):
            entry = entries[choice]
            print(f"\nCurrent answer: {entry.answer}")
            
            new_answer = input("New answer (press Enter to keep current): ").strip()
            new_keywords = input(f"New keywords (current: {entry.keywords}): ").strip()
            
            if new_answer:
                entry.answer = new_answer
            if new_keywords:
                entry.keywords = new_keywords
            
            entry.save()
            print("✅ Knowledge updated successfully!")
        else:
            print("Invalid selection.")
    except ValueError:
        print("Please enter a valid number.")

def add_project_specific():
    """Add project-specific knowledge"""
    print("\n--- Add Project-Specific Knowledge ---")
    
    from ai_assistant.models import ProjectInfo
    projects = ProjectInfo.objects.all()
    
    if not projects:
        print("No projects found. Please add projects first.")
        return
    
    print("Available projects:")
    for i, project in enumerate(projects, 1):
        print(f"{i}. {project.name}")
    
    try:
        choice = int(input("\nSelect project (number): ")) - 1
        if 0 <= choice < len(projects):
            project = projects[choice]
            
            print(f"\nAdding knowledge for: {project.name}")
            print("Suggested questions:")
            print(f"- What are the key features of {project.name}?")
            print(f"- How does {project.name} work?")
            print(f"- What problems does {project.name} solve?")
            print(f"- What makes {project.name} unique?")
            
            question = input("\nEnter your question: ").strip()
            answer = input("Enter the answer: ").strip()
            
            if question and answer:
                keywords = f"{project.name.lower()}, {project.category.lower()}, {project.technologies.lower()}, project"
                
                KnowledgeBase.objects.create(
                    category='projects',
                    question=question,
                    answer=answer,
                    keywords=keywords
                )
                print("✅ Project knowledge added successfully!")
            else:
                print("❌ Please fill in both question and answer.")
        else:
            print("Invalid selection.")
    except ValueError:
        print("Please enter a valid number.")

if __name__ == '__main__':
    add_custom_knowledge()