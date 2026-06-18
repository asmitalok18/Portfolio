from django.urls import path
from .views import ChatView, RAGManagementView, ProjectsView, PersonalInfoView, PortfolioDataView
from .management_views import (
    LoginView, LogoutView, CheckAuthView,
    ProjectManagementView, PersonalInfoManagementView, ResumeManagementView,
    ResumeDownloadView, DashboardStatsView,
    HeroSectionManagementView, PersonalProfileManagementView, ContactSectionManagementView,
    SkillManagementView, ExperienceManagementView
)

urlpatterns = [
    # Public APIs
    path('chat/', ChatView.as_view(), name='chat'),
    path('projects/', ProjectsView.as_view(), name='projects_list'),
    path('personal-info/', PersonalInfoView.as_view(), name='personal_info_list'),
    path('portfolio-data/', PortfolioDataView.as_view(), name='portfolio_data'),
    path('resume/download/', ResumeDownloadView.as_view(), name='resume_download'),
    
    # RAG Index Management
    path('rag/', RAGManagementView.as_view(), name='rag_management'),
    
    # Portfolio Admin Management
    path('auth/login/', LoginView.as_view(), name='admin_login'),
    path('auth/logout/', LogoutView.as_view(), name='admin_logout'),
    path('auth/check/', CheckAuthView.as_view(), name='admin_check_auth'),
    
    path('manage/projects/', ProjectManagementView.as_view(), name='manage_projects'),
    path('manage/projects/<int:pk>/', ProjectManagementView.as_view(), name='manage_project_detail'),
    path('manage/personal-info/', PersonalInfoManagementView.as_view(), name='manage_personal_info'),
    path('manage/personal-info/<int:pk>/', PersonalInfoManagementView.as_view(), name='manage_personal_info_detail'),
    path('manage/resume/', ResumeManagementView.as_view(), name='manage_resume'),
    path('manage/resume/<int:pk>/', ResumeManagementView.as_view(), name='manage_resume_detail'),
    path('manage/dashboard/', DashboardStatsView.as_view(), name='manage_dashboard'),
    
    # Structured Admin CRUDs
    path('manage/hero/', HeroSectionManagementView.as_view(), name='manage_hero'),
    path('manage/profile/', PersonalProfileManagementView.as_view(), name='manage_profile'),
    path('manage/contact/', ContactSectionManagementView.as_view(), name='manage_contact'),
    
    path('manage/skills/', SkillManagementView.as_view(), name='manage_skills'),
    path('manage/skills/<int:pk>/', SkillManagementView.as_view(), name='manage_skills_detail'),
    
    path('manage/experiences/', ExperienceManagementView.as_view(), name='manage_experiences'),
    path('manage/experiences/<int:pk>/', ExperienceManagementView.as_view(), name='manage_experiences_detail'),
]