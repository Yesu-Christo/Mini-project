import json
from django.http import JsonResponse
from django.views import View
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import UserProfile

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = authenticate(username=username, password=password)
            if user:
                role = getattr(user.profile, 'role', 'STUDENT') if hasattr(user, 'profile') else 'STUDENT'
                return JsonResponse({
                    'message': 'Login successful',
                    'token': f'mock-jwt-token-for-{user.username}',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': role
                    }
                }, status=200)
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')
            role = data.get('role', 'STUDENT')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already taken'}, status=400)
                
            user = User.objects.create_user(username=username, password=password, email=email)
            UserProfile.objects.create(user=user, role=role)
            return JsonResponse({'message': 'Registration successful'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
