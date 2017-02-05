import os


PRODUCTION = os.getenv('busup_PROD', -1) > 0

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'busupdb',
        'PORT': '',
        'USERNAME': '',
        'PASSWORD': '',
    }
}
