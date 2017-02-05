import requests

from django.conf import settings
from django.utils import timezone

from .models import GlobalVar


def login():
    gbl, created = GlobalVar.objects.get_or_create()
    if not created and gbl.key and gbl.key_expiration > timezone.now() + timezone.timedelta(seconds=20):
        return gbl
    r = requests.post('http://trackservice.trackroad.com/rest/login',
                      json={'username': settings.TRACKROAD_USERNAME, 'password': settings.TRACKROAD_PASSWORD},
                      headers={'content-type': 'text/json; charset=utf-8'})
    try:
        print(r.text)
        gbl.key = r.json().get('Key')
        gbl.save()
    except:
        return None
    return gbl