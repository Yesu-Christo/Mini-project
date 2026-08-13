from functools import wraps
from django.http import JsonResponse


def _unauthorized_response(message='Authentication required'):
    return JsonResponse({'error': message}, status=401)


def _forbidden_response(message='Permission denied'):
    return JsonResponse({'error': message}, status=403)


def require_auth(view_func):
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return _unauthorized_response()
        return view_func(request, *args, **kwargs)
    return _wrapped


def require_role(*allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped(request, *args, **kwargs):
            user = getattr(request, 'user', None)
            if not user or not user.is_authenticated:
                return _unauthorized_response()
            profile = getattr(user, 'profile', None)
            if profile is None or profile.role not in allowed_roles:
                return _forbidden_response()
            return view_func(request, *args, **kwargs)
        return _wrapped
    return decorator
