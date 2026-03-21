from django.db import models


class Faq(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('order', 'id')

    def __str__(self):
        return self.question


class Lead(models.Model):
    telegram = models.CharField(max_length=64, blank=True)
    phone = models.CharField(max_length=32)
    phone_normalized = models.CharField(max_length=32, blank=True)
    source_url = models.URLField(max_length=1024, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    user_agent = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.phone_normalized or self.phone
