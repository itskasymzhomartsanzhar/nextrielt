
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-7kwc^w!=!&)^@jjohhlf+aqbz+h2l4++c!&#8pby^r8=+-zb$4'

DEBUG = 1

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend', 'nextrielt.tw1.su']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = []
frontend_assets_dir = BASE_DIR.parent / 'frontend' / 'dist' / 'assets'
if frontend_assets_dir.exists():
    STATICFILES_DIRS.append(frontend_assets_dir)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Third-party / API settings
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

CORS_ALLOW_ALL_ORIGINS = bool(DEBUG)
if not CORS_ALLOW_ALL_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        origin.strip()
        for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
        if origin.strip()
    ]

# Telegram notifications
TELEGRAM_NOTIFY_ENABLED = os.environ.get('TELEGRAM_NOTIFY_ENABLED', '0') == '1'
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '')

# OpenAI chat settings
from api.prompts import CHAT_SYSTEM_PROMPT

OPENAI_API_KEY = "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"
OPENAI_API_URL = os.environ.get('OPENAI_API_URL', 'https://api.openai.com/v1/responses')
OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4.1-mini')
OPENAI_SYSTEM_PROMPT = os.environ.get('OPENAI_SYSTEM_PROMPT', CHAT_SYSTEM_PROMPT)
OPENAI_MAX_OUTPUT_TOKENS = int(os.environ.get('OPENAI_MAX_OUTPUT_TOKENS', '300'))
OPENAI_TEMPERATURE = float(os.environ.get('OPENAI_TEMPERATURE', '0.6'))
OPENAI_TIMEOUT_SECONDS = int(os.environ.get('OPENAI_TIMEOUT_SECONDS', '15'))
OPENAI_MAX_HISTORY = int(os.environ.get('OPENAI_MAX_HISTORY', '12'))

# LLM provider selection
LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'openrouter')

# OpenRouter settings
OPENROUTER_API_KEY = "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"
OPENROUTER_API_URL = os.environ.get('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1/chat/completions')
OPENROUTER_MODEL = os.environ.get('OPENROUTER_MODEL', 'openai/gpt-4o-mini')
OPENROUTER_SITE_URL = os.environ.get('OPENROUTER_SITE_URL', '')
OPENROUTER_APP_NAME = os.environ.get('OPENROUTER_APP_NAME', 'NextRielt')
OPENROUTER_MAX_TOKENS = int(os.environ.get('OPENROUTER_MAX_TOKENS', '300'))
OPENROUTER_TEMPERATURE = float(os.environ.get('OPENROUTER_TEMPERATURE', '0.6'))
OPENROUTER_TIMEOUT_SECONDS = int(os.environ.get('OPENROUTER_TIMEOUT_SECONDS', '15'))

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
