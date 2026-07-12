import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key-change-in-production')
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.onrender.com', '.vercel.app']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',
    'rest_framework',
    'corsheaders',
    'ai_assistant',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'portfolio_ai.middleware.CSRFExemptMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portfolio_ai.urls'

WSGI_APPLICATION = 'portfolio_ai.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}

if not os.environ.get('DATABASE_URL') and os.getenv('DATABASE_HOST'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'neondb',
            'USER': 'neondb_owner',
            'PASSWORD': os.getenv('DATABASE_PASSWORD'),
            'HOST': os.getenv('DATABASE_HOST'),
            'PORT': '5432',
            'CONN_MAX_AGE': 600,
            'OPTIONS': {
                'sslmode': 'require',
                'channel_binding': 'require',
            }
        }
    }
elif not os.environ.get('DATABASE_URL') and not os.getenv('DATABASE_HOST'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

CORS_ALLOWED_ORIGINS = [
    # "http://localhost:3000",
    # "http://127.0.0.1:3000",
    # "https://portfolio-chi-one-53.vercel.app",
    # "https://asmitportfolio-five.vercel.app",
    # "https://asmitportfolio-5yf60qhal-alokasmitgmailcoms-projects.vercel.app",
    
    "https://www.asmitalok.in",
    "https://asmitalok.in",
    "https://www.alokasmit.in",
    "https://alokasmit.in",
]

CORS_ALLOW_CREDENTIALS = True

# CSRF settings for frontend
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://portfolio-chi-one-53.vercel.app",
    "https://asmitportfolio-five.vercel.app",
    "https://asmitportfolio-5yf60qhal-alokasmitgmailcoms-projects.vercel.app",
    "https://*.onrender.com",
    "https://www.alokasmit.in",
    "https://alokasmit.in",
    "https://www.asmitalok.in",
    "https://asmitalok.in",
]

# Cookie settings for cross-site authentication
SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True

# Exempt API endpoints from CSRF
CSRF_EXEMPT_URLS = [
    r'^/api/.*$',
]

# Remove CORS_ALLOW_ALL_ORIGINS when using credentials
# CORS_ALLOW_ALL_ORIGINS = True

# AI and RAG Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')  # Optional, for enhanced RAG responses

# Pinecone Configuration for RAG
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT', 'us-east-1-aws')
PINECONE_INDEX_NAME = os.getenv('PINECONE_INDEX_NAME', 'asmit-portfolio-rag')

# Caching Configuration for RAG
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 86400,  # 24 hours
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'ai_assistant': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Cloudinary configuration
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET')
}
if os.getenv('CLOUDINARY_CLOUD_NAME'):
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB