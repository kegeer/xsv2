import os
from datetime import datetime
import environ


root = environ.Path(__file__) - 2  # three folder back (/a/b/c/ - 3 = /)
BASE_DIR = root()
LOG_DIR = root - 1
ENV_FILE_DIR = root - 1
ENV_FILE = ENV_FILE_DIR() + '/.env'
env = environ.Env(DEBUG=(bool, False), )  # set default values and casting
environ.Env.read_env(env_file=ENV_FILE)  # reading .env file

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = '=a6)ud)mr$6d3r5j%%ltij#@z7-!%xx^+ux2o8bqg%4@c93zg@'
SECRET_KEY = env.str('SECRET_KEY', '=a6)ud)mr$6d3r5j%%ltij#@z7-!%xx^+ux2o8bqg%4@c93zg@')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*', '0.0.0.0', '127.0.0.1', 'localhost']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.postgres',

    'corsheaders',
    'rest_framework',
    'polymorphic',

    'scholar.apps.profiles',
    'scholar.apps.authentication',

    'scholar.apps.projects',
    'scholar.apps.highlights'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

DEFAULT_FILE_STORAGE = 'django.core.files.uploadhandler.TemporaryFileUploadHandler'
ROOT_URLCONF = 'scholar.urls'

TEMPLATES_DIR = BASE_DIR + "/templates"
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATES_DIR, ],
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

WSGI_APPLICATION = 'scholar.wsgi.application'

# AUTHENTICATION_BACKENDS = [
#     'scholar.apps.account.auth.ModelBackend',
#     'scholar.apps.account.auth.GithubBackend',
#     'scholar.apps.account.auth.GooglePlusBackend',
# ]

# PASSWORD_HASHERS = [
#     'django.contrib.auth.hashers.Argon2PasswordHasher',
#     'django.contrib.auth.hashers.PBKDF2PasswordHasher',
#     'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
#     'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
#     'django.contrib.auth.hashers.BCryptPasswordHasher',
# ]

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


LANGUAGE_CODE = 'zh-cn'  # env.str('LANGUAGE_CODE', default='en-us')

LANGUAGES = [
    ('cn', 'Chinese'),
    ('en', 'English'),
]

LOCALE_PATHS = [BASE_DIR + '/locals', ]

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR + "/assets"

STATIC_DIR = BASE_DIR + '/static/'

STATICFILES_DIRS = [STATIC_DIR]

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR + "/media"

# Aliyun Api Setting
ALIYUN_ACCESSKEYID = env.str('ALIYUN_ACCESSKEYID', '')
ALIYUN_ACCESSKEYSECRET = env.str('ALIYUN_ACCESSKEYSECRET', '')

ALIYUN_DM_ACCOUNT = env.str('ALIYUN_DM_ACCOUNT', '')
ALIYUN_DM_ENDPOINT = env.str('ALIYUN_DM_ENDPOINT', 'dm.aliyuncs.com')

ALIYUN_SMS_SIGNNAME = env.str('ALIYUN_SMS_SIGNNAME', '')
ALIYUN_SMS_ENDPOINT = env.str('ALIYUN_SMS_ENDPOINT', 'sms.aliyuncs.com')

ALIYUN_OSS_END_POINT = env.str('ALIYUN_OSS_END_POINT', 'oss-cn-beijing.aliyuncs.com')
ALIYUN_OSS_END_INTERNAL_POINT = env.str('ALIYUN_OSS_ENV_INTERNAL_POINT', 'oss-cn-beijing-internal.aliyuncs.com')
ALIYUN_OSS_DOMAIN = env.str('ALIYUN_OSS_DOMAIN', 'oss.linkick.com')

# Register Email Message
EMAIL_REGISTER_CAPTCHA_SUBJECT = "PICOPICO社区注册验证码"
EMAIL_REGISTER_CAPTCHA_MESSAGE = "您的验证码是 {CODE} 的说，希望常来玩的说。"

# Resetpass Email Message
EMAIL_RESETPASS_CAPTCHA_SUBJECT = "PICOPICO社区密码重置验证码"
EMAIL_RESETPASS_CPATCHA_MESSAGE = "您的验证码是 {CODE} 的说，请尽快修复密码说。"

TEST = False

# OpenID Setting
WECHAT_OPENID_APP_ID = env.str('WECHAT_OPENID_APP_ID', '')
WECHAT_OPENID_APP_SECRET = env.str('WECHAT_OPENID_APP_SECRET', '')

QQ_OPENID_APP_ID = env.str('QQ_OPENID_APP_ID', '')
QQ_OPENID_APP_SECRET = env.str('QQ_OPENID_APP_SECRET', '')

GITHUB_CLIENT_ID = env.str('GITHUB_CLIENT_ID', '')
GITHUB_CLIENT_SECRET = env.str('GITHUB_CLIENT_SECRET', '')
GITHUB_CALLBACK_URI = env.str(
    'GITHUB_CALLBACK_URI', 'http://127.0.0.1:8000/account/callback/github')

USE_SSL = env.bool('USE_SSL', True)


CORS_ORIGIN_ALLOW_ALL = True
""" 自定义的用户表格 """
AUTH_USER_MODEL = 'authentication.User'

# Rest framework definition

REST_FRAMEWORK = {
    # 'DEFAULT_FILTER_BACKENDS': (
    #     'django_filters.rest_framework.DjangoFilterBackend',
    #     'rest_framework.filters.SearchFilter',
    #     'rest_framework.filters.OrderingFilter',
    # ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework_json_api.parsers.JSONParser',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'scholar.apps.authentication.backends.JWTAuthentication',
    ),
    'DEFAULT_METADATA_CLASS':
        'rest_framework_json_api.metadata.JSONAPIMetadata',
    'EXCEPTION_HANDLER':
        'rest_framework_json_api.exceptions.exception_handler',
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework_json_api.pagination.PageNumberPagination',
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework_json_api.renderers.JSONRenderer',
    ),
}

""" JOSNAPI 设置 """
JSON_API_FORMAT_KEYS = 'dasherize'
JSON_API_FORMAT_TYPES = 'dasherize'
JSON_API_PLURALIZE_TYPES = True

""" 文献识别模块 """
# Docker compose 配置
# GROBID_HOST = 'http://grobid:8070/api'

# 本地开发配置
GROBID_HOST = 'http://localhost:8070/api'
GROBID_THREADS = 4


""" 上传目录，会逐步更改为OSS """
MEDIA_ROOT = os.path.join(BASE_DIR, 'uploads/')

# Celery settings
CELERY_BROKER_URL = 'redis://localhost:6379/0'
