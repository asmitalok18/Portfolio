from django.urls import path
from .views import ChatView, ProjectsView, PersonalInfoView
from .management_views import (
    LoginView, LogoutView, CheckAuthView, ProjectManagementView,
    PersonalInfoManagementView, ResumeManagementView, ResumeDownloadView,
    DashboardStatsView
)

urlpatterns = [
    # Public API endpoints
    path('chat/', ChatView.as_view(), name='chat'),
    path('projects/', ProjectsView.as_view(), name='projects'),
    path('personal-info/', PersonalInfoView.as_view(), name='personal-info'),
    path('resume/download/', ResumeDownloadView.as_view(), name='resume-download'),
    
    # Management API endpoints (authenticated)
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/check/', CheckAuthView.as_view(), name='check-auth'),
    
    path('manage/projects/', ProjectManagementView.as_view(), name='manage-projects'),
    path('manage/projects/<int:pk>/', ProjectManagementView.as_view(), name='manage-project-detail'),
    path('manage/personal-info/', PersonalInfoManagementView.as_view(), name='manage-personal-info'),
    path('manage/personal-info/<int:pk>/', PersonalInfoManagementView.as_view(), name='manage-personal-info-detail'),
    path('manage/resume/', ResumeManagementView.as_view(), name='manage-resume'),
    path('manage/resume/<int:pk>/', ResumeManagementView.as_view(), name='manage-resume-detail'),
    path('manage/dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
]