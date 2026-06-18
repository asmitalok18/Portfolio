from django.core.management.base import BaseCommand
from django.core.cache import cache
from ai_assistant.models import ProjectInfo
from ai_assistant.ai_service import WebScraper

class Command(BaseCommand):
    help = 'Refresh project data by scraping live URLs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--project',
            type=str,
            help='Specific project name to refresh (optional)',
        )
        parser.add_argument(
            '--clear-cache',
            action='store_true',
            help='Clear existing cache before scraping',
        )

    def handle(self, *args, **options):
        scraper = WebScraper()
        
        if options['clear_cache']:
            self.stdout.write('Clearing project cache...')
            cache.clear()
        
        if options['project']:
            try:
                project = ProjectInfo.objects.get(name__icontains=options['project'])
                projects = [project]
                self.stdout.write(f'Refreshing data for project: {project.name}')
            except ProjectInfo.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Project "{options["project"]}" not found')
                )
                return
        else:
            projects = ProjectInfo.objects.filter(live_url__isnull=False).exclude(live_url='')
            self.stdout.write(f'Refreshing data for {projects.count()} projects...')
        
        success_count = 0
        error_count = 0
        
        for project in projects:
            if not project.live_url:
                continue
                
            self.stdout.write(f'\nScraping: {project.name} ({project.live_url})')
            
            try:
                scraped_data = scraper.scrape_project_info(project.live_url)
                
                if scraped_data.get('scraped_successfully'):
                    # Cache the scraped data
                    cache_key = f"scraped_project_{project.id}"
                    cache.set(cache_key, scraped_data, 86400)  # 24 hours
                    
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Successfully scraped {project.name}')
                    )
                    
                    # Display scraped information
                    if scraped_data.get('title'):
                        self.stdout.write(f'   Title: {scraped_data["title"][:100]}...')
                    if scraped_data.get('technologies'):
                        self.stdout.write(f'   Technologies: {", ".join(scraped_data["technologies"][:5])}')
                    if scraped_data.get('features'):
                        self.stdout.write(f'   Features: {len(scraped_data["features"])} found')
                    
                    success_count += 1
                else:
                    error_msg = scraped_data.get('error', 'Unknown error')
                    self.stdout.write(
                        self.style.WARNING(f'⚠️  Failed to scrape {project.name}: {error_msg}')
                    )
                    error_count += 1
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error scraping {project.name}: {str(e)}')
                )
                error_count += 1
        
        self.stdout.write(f'\n📊 Summary:')
        self.stdout.write(f'   ✅ Successful: {success_count}')
        self.stdout.write(f'   ❌ Failed: {error_count}')
        self.stdout.write(f'   📝 Total: {success_count + error_count}')
        
        if success_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'\n🎉 Project data refresh completed! The AI assistant now has enhanced information about your projects.')
            )