from scholar.settings.base import *

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME':os.environ["POSTGRES_DB"],
        'USER':os.environ["POSTGRES_USER"],
        'PASSWORD':os.environ["POSTGRES_PASSWORD"],
        'HOST': 'postgres',
        'PORT': '',
    },
}

# 节省流量，使用内网
# 但不是下面的这个方法，下面的方法会造成数据无法上传
ALIYUN_OSS_ENV_INTERNAL_POINT = env.str('ALIYUN_OSS_ENV_INTERNAL_POINT', 'oss-cn-beijing-internal.aliyuncs.com')

# Docker compose 配置
GROBID_HOST = 'http://grobid:8070/api'
CELERY_BROKER_URL = 'redis://redis/0'