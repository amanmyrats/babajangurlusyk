from django.urls import path, include


urlpatterns = [
    path('common/', include('common.urls')),
    path('company/', include('company.urls')),
    path('accounts/', include('accounts.urls')),
]