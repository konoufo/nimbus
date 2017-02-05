from django.conf.urls import url

import routeoptimizer.views as views

urlpatterns = [
    url(r'^dispatch/$', views.DispatcherView.as_view(), name='dispatcher'),
]

