import logging
import os
import ssl
import urllib.error
import json
from urllib import request, parse
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def _build_ssl_context(verify_env_key, fallback_env_key):
    verify_ssl = os.environ.get(verify_env_key, '1') == '1'
    allow_insecure_fallback = os.environ.get(fallback_env_key, '1') == '1'

    ssl_context = None
    if verify_ssl:
        try:
            import certifi

            ssl_context = ssl.create_default_context(cafile=certifi.where())
        except Exception:
            ssl_context = ssl.create_default_context()
    else:
        ssl_context = ssl._create_unverified_context()

    return ssl_context, verify_ssl, allow_insecure_fallback

def build_lead_message(lead):
    created = timezone.localtime(lead.created_at).strftime('%Y-%m-%d %H:%M:%S')
    lines = [
        'Новая заявка',
        f'Телефон: {lead.phone_normalized or lead.phone}',
    ]
    if lead.telegram:
        lines.append(f'Telegram: {lead.telegram}')
    if lead.source_url:
        lines.append(f'Источник: {lead.source_url}')
    lines.append(f'Дата: {created}')
    return '\n'.join(lines)


def send_telegram_message(message):
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    if not settings.TELEGRAM_NOTIFY_ENABLED:
        return False
    if not token or not chat_id:
        logger.warning('Telegram уведомления отключены: нет токена или chat_id.')
        return False

    ssl_context, verify_ssl, allow_insecure_fallback = _build_ssl_context(
        'TELEGRAM_SSL_VERIFY',
        'TELEGRAM_SSL_FALLBACK',
    )

    payload = parse.urlencode({'chat_id': chat_id, 'text': message}).encode('utf-8')
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    def _send_with_context(context):
        req = request.Request(url, data=payload, method='POST')
        with request.urlopen(req, timeout=5, context=context) as response:
            return 200 <= response.status < 300

    try:
        return _send_with_context(ssl_context)
    except urllib.error.URLError as error:
        if (
            verify_ssl
            and allow_insecure_fallback
            and isinstance(getattr(error, 'reason', None), ssl.SSLError)
        ):
            try:
                return _send_with_context(ssl._create_unverified_context())
            except Exception:
                logger.exception('Ошибка отправки Telegram сообщения (insecure retry)')
                return False
        logger.exception('Ошибка отправки Telegram сообщения')
        return False


def _extract_response_text(payload):
    output_text = payload.get('output_text')
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    pieces = []
    for item in payload.get('output', []) or []:
        if item.get('type') != 'message' or item.get('role') != 'assistant':
            continue
        for part in item.get('content', []) or []:
            if part.get('type') in ('output_text', 'text') and part.get('text'):
                pieces.append(part['text'])
    return ''.join(pieces).strip()


def send_openai_chat(messages, system_prompt):
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        logger.warning('OpenAI API key не задан.')
        return None, 'missing_api_key'

    safe_messages = []
    for message in messages:
        role = message.get('role')
        content = message.get('content', '')
        if role not in ('user', 'assistant'):
            continue
        safe_messages.append({'role': role, 'content': content})

    if system_prompt:
        safe_messages.insert(0, {'role': 'system', 'content': system_prompt})

    payload = {
        'model': settings.OPENAI_MODEL,
        'input': safe_messages,
        'max_output_tokens': settings.OPENAI_MAX_OUTPUT_TOKENS,
        'temperature': settings.OPENAI_TEMPERATURE,
    }

    ssl_context, verify_ssl, allow_insecure_fallback = _build_ssl_context(
        'OPENAI_SSL_VERIFY',
        'OPENAI_SSL_FALLBACK',
    )

    req = request.Request(
        settings.OPENAI_API_URL,
        data=json.dumps(payload).encode('utf-8'),
        method='POST',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
    )

    try:
        def _send_with_context(context):
            with request.urlopen(req, timeout=settings.OPENAI_TIMEOUT_SECONDS, context=context) as response:
                raw = response.read().decode('utf-8')
                data = json.loads(raw)
                text = _extract_response_text(data)
                if not text:
                    return None
                return text

        text = _send_with_context(ssl_context)
        if not text:
            return None, 'empty_response'
        return text, None
    except urllib.error.HTTPError as error:
        try:
            error_body = error.read().decode('utf-8')
        except Exception:
            error_body = ''
        logger.exception('OpenAI API error: %s', error_body)
        return None, 'openai_error'
    except urllib.error.URLError as error:
        if (
            verify_ssl
            and allow_insecure_fallback
            and isinstance(getattr(error, 'reason', None), ssl.SSLError)
        ):
            try:
                text = _send_with_context(ssl._create_unverified_context())
                if not text:
                    return None, 'empty_response'
                return text, None
            except Exception:
                logger.exception('OpenAI API error (insecure retry)')
                return None, 'openai_error'
        logger.exception('OpenAI API error')
        return None, 'openai_error'
    except Exception:
        logger.exception('OpenAI API error')
        return None, 'openai_error'


def send_openrouter_chat(messages, system_prompt):
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        logger.warning('OpenRouter API key не задан.')
        return None, 'missing_api_key'

    safe_messages = []
    for message in messages:
        role = message.get('role')
        content = message.get('content', '')
        if role not in ('user', 'assistant'):
            continue
        safe_messages.append({'role': role, 'content': content})

    if system_prompt:
        safe_messages.insert(0, {'role': 'system', 'content': system_prompt})

    payload = {
        'model': settings.OPENROUTER_MODEL,
        'messages': safe_messages,
        'temperature': settings.OPENROUTER_TEMPERATURE,
        'max_tokens': settings.OPENROUTER_MAX_TOKENS,
    }

    ssl_context, verify_ssl, allow_insecure_fallback = _build_ssl_context(
        'OPENROUTER_SSL_VERIFY',
        'OPENROUTER_SSL_FALLBACK',
    )

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }
    if settings.OPENROUTER_SITE_URL:
        headers['HTTP-Referer'] = settings.OPENROUTER_SITE_URL
    if settings.OPENROUTER_APP_NAME:
        headers['X-Title'] = settings.OPENROUTER_APP_NAME

    req = request.Request(
        settings.OPENROUTER_API_URL,
        data=json.dumps(payload).encode('utf-8'),
        method='POST',
        headers=headers,
    )

    try:
        def _send_with_context(context):
            with request.urlopen(req, timeout=settings.OPENROUTER_TIMEOUT_SECONDS, context=context) as response:
                raw = response.read().decode('utf-8')
                data = json.loads(raw)
                choice = (data.get('choices') or [{}])[0]
                message = choice.get('message') or {}
                text = (message.get('content') or '').strip()
                return text or None

        text = _send_with_context(ssl_context)
        if not text:
            return None, 'empty_response'
        return text, None
    except urllib.error.HTTPError as error:
        try:
            error_body = error.read().decode('utf-8')
        except Exception:
            error_body = ''
        logger.exception('OpenRouter API error: %s', error_body)
        return None, 'openrouter_error'
    except urllib.error.URLError as error:
        if (
            verify_ssl
            and allow_insecure_fallback
            and isinstance(getattr(error, 'reason', None), ssl.SSLError)
        ):
            try:
                text = _send_with_context(ssl._create_unverified_context())
                if not text:
                    return None, 'empty_response'
                return text, None
            except Exception:
                logger.exception('OpenRouter API error (insecure retry)')
                return None, 'openrouter_error'
        logger.exception('OpenRouter API error')
        return None, 'openrouter_error'
    except Exception:
        logger.exception('OpenRouter API error')
        return None, 'openrouter_error'
