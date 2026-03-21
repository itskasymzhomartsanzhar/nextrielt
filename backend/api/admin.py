from django.contrib import admin
from .models import Faq, Lead


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'order', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('question', 'answer')
    list_editable = ('is_active', 'order')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('phone', 'phone_normalized', 'telegram', 'source_url', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('phone', 'phone_normalized', 'telegram', 'source_url')
    readonly_fields = ('created_at', 'ip_address', 'user_agent', 'phone_normalized')
