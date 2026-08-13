import re
from django.contrib.auth import get_user_model
from django.contrib.auth.middleware import get_user
from django.utils.deprecation import MiddlewareMixin
from apps.accounts.models import UserProfile

User = get_user_model()

class TokenAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.user = get_user(request)
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split('Bearer ')[1].strip()
        if not token:
            return None

        try:
            profile = UserProfile.objects.select_related('user').get(school_id__iexact=token)
            request.user = profile.user
        except UserProfile.DoesNotExist:
            try:
                user = User.objects.get(username__iexact=token)
                request.user = user
            except User.DoesNotExist:
                pass
        return None
