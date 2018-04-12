from scholar.settings.base import *

DEBUG = True

INSTALLED_APPS += [
    'django_extensions'
]

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    # },
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME':os.environ["POSTGRES_DB"],
        'USER':os.environ["POSTGRES_USER"],
        'PASSWORD':os.environ["POSTGRES_PASSWORD"],
        'HOST': 'postgres',
        'PORT': '',
    },
}

SECRET_KEY = env.str(
    'SECRET_KEY', 's7*@kejguxeb&8#zol^*1%dwn(aki&wala%f2wk6ueerh4%_&h')

# DEFAULT_SUPERUSER_CELLPHONE = env.str(
#     "DEFAULT_SUPERUSER_CELLPHONE", default="13800000000")
# DEFAULT_SUPERUSER_PASSWORD = env.str(
#     "DEFAULT_SUPERUSER_PASSWORD", default="123456789")
# DEFAULT_SUPERUSER_EMAIL = env.str(
#     "DEFAULT_SUPERUSER_EMAIL", default="admin@admin.com")

ALIYUN_ACCESSKEYID = env.str('ALIYUN_ACCESSKEYID', 'LTAIVcC4QysIyRpu')
ALIYUN_ACCESSKEYSECRET = env.str(
    'ALIYUN_ACCESSKEYSECRET', '8XDh1d1t8ebgSV2JMYB0SdygIkJzaJ')

# ALIYUN_DM_ENDPOINT = env.str('ALIYUN_DM_ENDPOINT', 'dm.aliyuncs.com')
# ALIYUN_DM_ACCOUNT = env.str(
#     'ALIYUN_DM_ACCOUNT', 'support@mail.picopico.com.cn')

# ALIYUN_SMS_SIGNNAME = env.str('ALIYUN_SMS_SIGNNAME', '万能青年')
# ALIYUN_SMS_ENDPOINT = env.str('ALIYUN_SMS_ENDPOINT', 'sms.aliyuncs.com')
