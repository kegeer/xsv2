# settings.py
import os
## Default settings
## Shared settings between development and production

if os.environ.get('DJANGO_PRODUCTION_SETTINGS', None):
    from .production import *
else:
    from .development import *