import requests, traceback

from django.db import models
from django.utils import timezone
from django.conf import settings


def time_str(utctime):
    return '{}-{}-{}T{}:{}:{}{}Z'.format(utctime.year, utctime.month, utctime.day,
                                         utctime.hour, utctime.minute, utctime.second)


class Vehicle(models.Model):
    start_lat = models.DecimalField(decimal_places=6, max_digits=9)
    start_lng = models.DecimalField(decimal_places=6, max_digits=9)
    current_lat = models.DecimalField(decimal_places=6, max_digits=9, blank=True, null=True)
    current_lng = models.DecimalField(decimal_places=6, max_digits=9, blank=True, null=True)
    name = models.CharField(max_length=99)

    @classmethod
    def create_vehicle(cls, lat, lng, name=None):
        o, created = cls.objects.create(start_lat=lat, start_lng=lng, name=name or 'vehicle')
        if created:
            o.name = 'vehicle{}'.format(o.pk)
            o.save()

    def generate_json(self):
        return {
            'Name': self.name,
            'StartLocation': {
                'LatLong': {
                    'latitude': str(float(self.lat)),
                    'longitude': str(float(self.lng)),
                }
            }
        }

    @property
    def lat(self):
        return self.current_lat or self.start_lat

    @property
    def lng(self):
        return self.current_lng or self.start_lng

    def __str__(self):
        return '{}<{},{}>'.format(self.name, self.lat, self.lng)


class Location(models.Model):
    lat = models.DecimalField(decimal_places=6, max_digits=9)
    lng = models.DecimalField(decimal_places=6, max_digits=9)
    name = models.CharField(max_length=99, default="arret_stm")

    @classmethod
    def create_location(cls, lat, lng, name=None):
        o, created = cls.objects.create(lat=lat, lng=lng, name=name or 'arret_stm')
        if created:
            o.name = 'arret_stm{}'.format(o.pk)
            o.save()

    def generate_json(self):
        return {
            'Name': self.name,
            'LatLong': {
                'latitude': str(float(self.lat)),
                'longitude': str(float(self.lng)),
            }
        }
    def __str__(self):
        return '{}<{};{}>'.format(self.name, self.lat, self.lng)


class Stop(models.Model):
    location = models.ForeignKey(Location, related_name='stops')
    tour = models.ForeignKey('routeoptimizer.Tour', related_name='stops')
    type = models.IntegerField(choices=((0, 'midway'), (1, 'start'), (2, 'finish'), (3, 'delivery')), default=0)
    waiting_people = models.IntegerField(default=0)
    deliveryTime1 = models.DateTimeField(null=True, blank=True)
    deliveryTime2 = models.DateTimeField(null=True, blank=True)

    @classmethod
    def create_stop(cls, lat, lng, tour, stop_type=0, people=0):
        location = Location.objects.filter(lat=lat, lng=lng).first()
        if location is None:
            location, _ = Location.objects.create(lat=lat, lng=lng)
            location.name = 'arret_stm{}'.format(location.pk)
        cls.objects.create(location=location, tour=tour, type=stop_type, waiting_people=people)

    def generate_json(self):
        location = self.location.generate_json()
        location.update({
            'LocationType': self.type,
            'TimeConstraintArrival': self.deliveryTime1 and time_str(self.deliveryTime1),
            'TimeConstraintArrival1': self.deliveryTime2 and time_str(self.deliveryTime2),
            'Priority': int(self.waiting_people/5) if self.waiting_people <= 50 else 10,
        })
        return location


def _generate_expiration():
        return timezone.now() + timezone.timedelta(hours=3, minutes=40)


class GlobalVar(models.Model):
    key = models.CharField(max_length=250)
    key_expiration = models.DateTimeField(default=_generate_expiration)


class Tour(models.Model):
    name = models.CharField(blank=True, null=True, max_length=99)
    global_space = models.ForeignKey(GlobalVar, related_name='tours', on_delete=models.CASCADE)

    def dispatch(self, payload=None):
        try:
            key = self.global_space.key
        except AttributeError:
            print(traceback.format_exc())
            return None
        if payload is None:
            payload = settings.DEFAULT_DISPATCH_REQUEST
        locations = [loc.generate_json() for loc in self.stops.all()]
        if not locations:
            locations = payload['Locations']
        vehicles = [bus.generate_json() for bus in Vehicle.objects.all()]
        payload.update({'Vehicles': vehicles, 'Locations': locations})
        print(payload)
        r = requests.post('http://trackservice.trackroad.com/rest/dispatch/{}'.format(key),
                          json=payload)
        print(r.text)
        if r.json().get('Status') == 1:
            data = r.json()
            data.update({'numStops': len(locations)})
            return data
        return None
