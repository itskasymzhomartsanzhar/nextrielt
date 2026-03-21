import logging
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Faq
from .serializers import FaqSerializer, LeadCreateSerializer, ChatRequestSerializer
from .services import build_lead_message, send_telegram_message, send_openai_chat, send_openrouter_chat

logger = logging.getLogger(__name__)

def get_client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class FaqListView(generics.ListAPIView):
    serializer_class = FaqSerializer

    def get_queryset(self):
        return Faq.objects.filter(is_active=True).order_by('order', 'id')


@method_decorator(csrf_exempt, name='dispatch')
class LeadCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LeadCreateSerializer(
            data=request.data,
            context={
                'ip_address': get_client_ip(request),
                'user_agent': (request.META.get('HTTP_USER_AGENT') or '')[:255],
            },
        )
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        message = build_lead_message(lead)
        telegram_sent = send_telegram_message(message)
        if not telegram_sent:
            logger.info('Telegram уведомление не отправлено', extra={'lead_id': lead.id})
        return Response(
            {'id': lead.id, 'telegram_sent': telegram_sent},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        messages = serializer.validated_data['messages'][-settings.OPENAI_MAX_HISTORY :]
        if not any(message['role'] == 'user' for message in messages):
            return Response({'error': 'No user message provided.'}, status=status.HTTP_400_BAD_REQUEST)

        if settings.LLM_PROVIDER == 'openrouter':
            reply, error = send_openrouter_chat(messages, settings.OPENAI_SYSTEM_PROMPT)
        else:
            reply, error = send_openai_chat(messages, settings.OPENAI_SYSTEM_PROMPT)
        if error == 'missing_api_key':
            return Response({'error': 'API key is not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if error:
            return Response({'error': 'Failed to generate response.'}, status=status.HTTP_502_BAD_GATEWAY)
        return Response({'reply': reply}, status=status.HTTP_200_OK)
