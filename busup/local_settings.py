import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PRODUCTION = int(os.getenv('busup_PROD', -1)) > 0

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'busupdb',
        'PORT': '',
        'USERNAME': '',
        'PASSWORD': '',
    }
}

# Tools
# # Webpack Server for hot-reloading

WEBPACK_STATS = os.path.join(BASE_DIR, 'webpack-prod-stats.json')
if not PRODUCTION:
    WEBPACK_STATS = os.path.join(BASE_DIR, 'webpack-stats.json')