from django.urls import path
from .views import FaqListView, LeadCreateView, ChatView

app_name = 'api'

urlpatterns = [
    path('faq/', FaqListView.as_view(), name='faq-list'),
    path('leads/', LeadCreateView.as_view(), name='lead-create'),
    path('chat/', ChatView.as_view(), name='chat'),
]
