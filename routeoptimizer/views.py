import json
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from pytz import timezone as tzone
from django.shortcuts import render
from django.views.generic import View
from django.conf import settings
from django.utils import timezone

from .api import login
from .models import Tour, GlobalVar, Stop, Location, Vehicle


def generate_vehicles(num_flotte=5):
    for i in range(num_flotte):
        Vehicle.objects.get_or_create(start_lat=45.556109, start_lng=-73.667452, name='bus{}'.format(i))


class DispatcherView(View):
    def get(self, request):
        try:
            tour = Tour.objects.get(name='demo')
            tour.global_space = login()
        except ObjectDoesNotExist:
            tour = Tour.objects.create(name='demo', global_space=login())
        generate_vehicles()
        payload = settings.DEFAULT_DISPATCH_REQUEST
        # eastern = tzone('US/Eastern')
        # localtime = timezone.now().astimezone(eastern)
        utctime = timezone.now()
        payload.update({
            'CurrentTime': '{}-{}-{}T{}:{}:{}Z'.format(utctime.year, utctime.month, utctime.day,
                                                       utctime.hour, utctime.minute, utctime.second)
        })
        result = tour.dispatch(payload)
        to_json = json.dumps(result, cls=DjangoJSONEncoder)
        return render(request, 'clientapp/live.html', {'initial_data': to_json})

    def post(self, request):
        demo_tour = Tour.objects.get(name='demo')
        location_from = request.POST.get('from')
        location_to = request.POST.get('to')
        lat_from = json.load(location_from).get('lat')
        lng_from = json.load(location_from).get('lng')
        lat_to = json.load(location_to).get('lat')
        lng_to = json.load(location_to).get('lng')
        loc_from, _ = Location.objects.get_or_create(lat=lat_from, lng=lng_from)
        loc_to, _ = Location.objects.get_or_create(lat=lat_to, lng=lng_to)
        stop_from, _ = Stop.objects.get_or_create(location=loc_from, tour=demo_tour, type=0,
                                               waiting_people=1)
        stop_to, _ = Stop.objects.get_or_create(location=loc_to, tour=demo_tour, type=3)
        result = demo_tour.dispatch()
        to_json = json.dumps(result, cls=DjangoJSONEncoder)
        return HttpResponse(to_json)
