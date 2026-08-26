import json
import re
import uuid
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.utils import timezone
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import PasswordResetToken, UserProfile


def _send_html_email(subject, template_name, context, to_email):
    """Send a plain-text + HTML email using a template."""
    html_body = render_to_string(template_name, context)
    # plain text fallback — strip tags roughly
    plain_body = (
        f"{subject}\n\n"
        + "\n".join(
            line.strip()
            for line in html_body.splitlines()
            if line.strip() and not line.strip().startswith('<')
        )
    )
    msg = EmailMultiAlternatives(
        subject=subject,
        body=plain_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=True)

ROLE_PREFIXES = {
    'STU': 'STUDENT',
    'SEC': 'SECURITY',
    'ADM': 'ADMIN',
    'STF': 'STAFF',
    'IT': 'IT',
}

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            school_id = data.get('school_id', '').strip().upper()
            password = data.get('password', '')

            if not school_id or not password:
                return JsonResponse({'error': 'School ID and password are required.'}, status=400)

            try:
                profile = UserProfile.objects.select_related('user').get(school_id=school_id)
            except UserProfile.DoesNotExist:
                return JsonResponse({'error': 'School ID not found.'}, status=403)

            user = authenticate(username=profile.user.username, password=password)
            if not user or not user.is_active:
                return JsonResponse({'error': 'Invalid credentials.'}, status=401)

            return JsonResponse({
                'message': 'Login successful',
                'token': profile.school_id,
                'user': {
                    'id': profile.user.id,
                    'username': profile.user.username,
                    'email': profile.user.email,
                    'role': profile.role,
                    'school_id': profile.school_id,
                    'title': profile.title,
                    'other_name': profile.other_name,
                    'program': profile.program,
                    'occupation': profile.occupation,
                    'hall_or_department': profile.hall_or_department,
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            school_id = data.get('school_id', '').strip().upper()
            password = data.get('password', '')
            email = data.get('email', '').strip()
            requested_role = data.get('role', '').strip().upper()
            department = data.get('department', '').strip()
            first_name = data.get('first_name', '').strip()
            last_name = data.get('last_name', '').strip()
            other_name = data.get('other_name', '').strip()
            title = data.get('title', '').strip()
            program = data.get('program', '').strip()
            occupation = data.get('occupation', '').strip()

            id_label = 'Student ID' if requested_role == 'STUDENT' else ('Staff ID' if requested_role in ['SECURITY', 'ADMIN', 'STAFF'] else 'ID')

            if not school_id:
                return JsonResponse({'error': f'{id_label} is required.'}, status=400)

            if not email:
                return JsonResponse({'error': 'Email address is required.'}, status=400)

            if not password:
                return JsonResponse({'error': 'Password is required.'}, status=400)

            valid_roles = {'STUDENT': 'STUDENT', 'SECURITY': 'SECURITY', 'ADMIN': 'ADMIN', 'STAFF': 'STAFF', 'IT': 'IT'}
            if requested_role in valid_roles:
                role = valid_roles[requested_role]
            else:
                role_prefix = school_id[:3]
                role = ROLE_PREFIXES.get(role_prefix, 'STUDENT')

            if not first_name or not last_name:
                return JsonResponse({'error': 'First name and last name are required.'}, status=400)

            if role == 'STUDENT' and not program:
                return JsonResponse({'error': 'Program of study is required for students.'}, status=400)

            if role in ['STAFF', 'SECURITY', 'ADMIN', 'IT'] and not occupation:
                return JsonResponse({'error': 'Occupation is required for university staff.'}, status=400)

            if role in ['STAFF', 'SECURITY', 'ADMIN', 'IT'] and not title:
                return JsonResponse({'error': 'Title is required for university staff.'}, status=400)

            if role in ['STAFF', 'ADMIN'] and not department:
                return JsonResponse({'error': 'Department is required for university staff.'}, status=400)

            if not re.match(r'^[A-Z0-9_-]{3,20}$', school_id):
                return JsonResponse({'error': f'Invalid {id_label} format.'}, status=400)

            if UserProfile.objects.filter(school_id=school_id).exists():
                return JsonResponse({'error': f'{id_label} is already registered.'}, status=400)

            username = school_id.lower()
            if User.objects.filter(username=username).exists():
                username = f"{username}_{User.objects.count() + 1}"

            user = User.objects.create_user(
                username=username, password=password, email=email,
                first_name=first_name, last_name=last_name,
            )
            UserProfile.objects.create(
                user=user,
                school_id=school_id,
                role=role,
                title=title,
                other_name=other_name,
                program=program if role == 'STUDENT' else '',
                occupation=occupation,
                hall_or_department=department or None,
            )

            # Send welcome email with HTML template
            _send_html_email(
                subject='Welcome to CampusShield AI — KNUST',
                template_name='emails/welcome.html',
                context={
                    'first_name': first_name,
                    'school_id': school_id,
                    'role': role.capitalize(),
                    'email': email,
                    'frontend_url': settings.FRONTEND_URL,
                },
                to_email=email,
            )

            return JsonResponse({'message': 'Registration successful', 'role': role}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ForgotPasswordView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            school_id = data.get('school_id', '').strip().upper()
            if not school_id:
                return JsonResponse({'error': 'School ID is required.'}, status=400)

            try:
                profile = UserProfile.objects.select_related('user').get(school_id=school_id)
            except UserProfile.DoesNotExist:
                return JsonResponse({'error': 'School ID not found.'}, status=404)

            reset_token = uuid.uuid4().hex
            expires_at = timezone.now() + timezone.timedelta(hours=2)
            PasswordResetToken.objects.create(
                user_profile=profile,
                token=reset_token,
                expires_at=expires_at,
            )

            reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
            _send_html_email(
                subject='Reset Your CampusShield AI Password',
                template_name='emails/password_reset.html',
                context={
                    'school_id': profile.school_id,
                    'reset_link': reset_link,
                    'frontend_url': settings.FRONTEND_URL,
                },
                to_email=profile.user.email,
            )
            return JsonResponse({'message': 'Password reset instructions sent.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ResetPasswordView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            token = data.get('token', '').strip()
            password = data.get('password', '')

            if not token or not password:
                return JsonResponse({'error': 'Reset token and new password are required.'}, status=400)

            try:
                reset_record = PasswordResetToken.objects.select_related('user_profile').get(
                    token=token,
                    used=False,
                    expires_at__gte=timezone.now(),
                )
            except PasswordResetToken.DoesNotExist:
                return JsonResponse({'error': 'Invalid or expired reset token.'}, status=400)

            user = reset_record.user_profile.user
            user.set_password(password)
            user.save()
            reset_record.used = True
            reset_record.save()

            return JsonResponse({'message': 'Password has been reset successfully.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
