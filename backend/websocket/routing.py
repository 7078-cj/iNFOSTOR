from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/game/<str:id>/', consumers.MyWebSocketConsumer.as_asgi()),
]