from pytz import timezone as tzone
from django.shortcuts import render
from django.views.generic import View
from django.conf import settings
from django.utils import timezone

from .api import login
from .models import Tour, GlobalVar


class DispatcherView(View):
    def get(self, request):
        tour = Tour(name='demo', global_space=login())
        payload = settings.DEFAULT_DISPATCH_REQUEST
        # eastern = tzone('US/Eastern')
        # localtime = timezone.now().astimezone(eastern)
        utctime = timezone.now()
        payload.update({
            'CurrentTime': '{}-{}-{}T{}:{}:{}Z'.format(utctime.year, utctime.month, utctime.day,
                                                       utctime.hour, utctime.minute, utctime.second)
        })
        result = tour.dispatch(payload)
        return render(request, 'clientapp/live.html', {'dispatch_data': result})

    def post(self, request):
        pass
