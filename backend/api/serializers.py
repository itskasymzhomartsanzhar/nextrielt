import re
from rest_framework import serializers
from .models import Faq, Lead


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ('id', 'question', 'answer')


def normalize_phone(value: str) -> str:
    digits = re.sub(r'\D', '', value or '')
    if not digits:
        return ''
    if digits[0] == '8':
        digits = f'7{digits[1:]}'
    elif digits[0] != '7':
        digits = f'7{digits}'
    digits = digits[:11]
    return f'+{digits}'


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ('telegram', 'phone', 'source_url')

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value or '')
        if len(digits) < 10:
            raise serializers.ValidationError('Укажите корректный номер телефона.')
        return value

    def validate_telegram(self, value):
        value = (value or '').strip()
        return value

    def create(self, validated_data):
        ip_address = self.context.get('ip_address')
        user_agent = self.context.get('user_agent', '')[:255]
        phone_normalized = normalize_phone(validated_data.get('phone', ''))
        return Lead.objects.create(
            telegram=validated_data.get('telegram', ''),
            phone=validated_data.get('phone', ''),
            phone_normalized=phone_normalized,
            source_url=validated_data.get('source_url', ''),
            ip_address=ip_address,
            user_agent=user_agent,
        )


class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=('user', 'assistant'))
    content = serializers.CharField(max_length=2000)


class ChatRequestSerializer(serializers.Serializer):
    messages = ChatMessageSerializer(many=True)
