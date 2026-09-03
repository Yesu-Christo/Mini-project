from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.core.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/incidents/', include('apps.incidents.urls')),
    path('api/prediction/', include('apps.prediction.urls')),
    path('api/alerts/', include('apps.alerts.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
