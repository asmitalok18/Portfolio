from django.test import TestCase, Client, override_settings
from django.core.cache import cache
from .models import Skill, ProjectInfo, Experience

@override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache', 'LOCATION': 'test-portfolio-cache'}})
class PortfolioOptimizationTests(TestCase):
    def setUp(self):
        self.client = Client()
        cache.clear()
        
    def test_cache_miss_then_hit(self):
        r1 = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        self.assertEqual(r1['X-Portfolio-Cache'], 'MISS')
        
        r2 = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        self.assertEqual(r2['X-Portfolio-Cache'], 'HIT')
        
    def test_cache_invalidation_on_update(self):
        r1 = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        self.assertEqual(r1['X-Portfolio-Cache'], 'MISS')
        
        r2 = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        self.assertEqual(r2['X-Portfolio-Cache'], 'HIT')
        
        Skill.objects.create(name='New Skill', category='Frontend Development', level=100, display_order=1)
        
        r3 = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        self.assertEqual(r3['X-Portfolio-Cache'], 'MISS')

    def test_response_structure_arrays(self):
        Experience.objects.create(
            role='Test Role', 
            company='Test Co',
            responsibilities='["Res 1", "Res 2"]',
            technologies='["Tech 1", "Tech 2"]'
        )
        ProjectInfo.objects.create(
            name='Test Project',
            is_featured=True,
            status='Completed',
            technologies='["React", "Node"]'
        )
        
        r = self.client.get('/api/portfolio-data/', HTTP_HOST='localhost')
        data = r.json()
        
        self.assertIsInstance(data['experiences'][0]['responsibilities'], list)
        self.assertIsInstance(data['experiences'][0]['technologies'], list)
        self.assertIsInstance(data['projects'][0]['technology_preview'], list)
        
    def test_project_detail_endpoint(self):
        p = ProjectInfo.objects.create(
            name='Test Project Detail',
            features_list='["Feat 1", "Feat 2"]',
            technologies='["T1", "T2"]'
        )
        
        r = self.client.get(f'/api/projects/{p.id}/', HTTP_HOST='localhost')
        data = r.json()
        
        self.assertIsInstance(data['features_list'], list)
        self.assertIsInstance(data['technologies'], list)
        self.assertIn('features_list', data)
