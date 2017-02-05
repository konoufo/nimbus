from django.test import TestCase
from .api import login


class TestSimpleOptimisation(TestCase):

    def setUp(self):
        pass

    def test_optimisation_api(self):
        gbl = login()
        self.assertIsNotNone(gbl)
        self.assertIsNotNone(gbl.key)

    def test_one_vehicle(self):
        pass

    def test_one_vehicle_with_pickup_and_deliveries(self):
        pass
