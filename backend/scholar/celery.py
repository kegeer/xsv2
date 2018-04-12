# import os
# import environ
# import sys
# from celery import Celery
# from django.conf import settings

# root = environ.Path(__file__)  # three folder back (/a/b/c/ - 3 = /)
# path = root - 2
# env = environ.Env(DEBUG=(bool, False), )  # set default values and casting
# environ.Env.read_env(env_file=path() + '/.env')  # reading .env file
# DJANGO_SETTINGS_MODULE = env('DJANGO_SETTINGS_MODULE')
# sys.path.insert(0, path())

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scholar.settings")

# app = Celery('scholar')

# app.config_from_object('django.conf:settings', namespace='CELERY')
# app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scholar.settings')

app = Celery('scholar')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
