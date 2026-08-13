from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .Views.user_views import registerUser, MyTokenObtainPairView, LobbyListCreateView, LobbyRetrieveDestroyView


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerUser, name='register_user'),
    path(
        "lobbies/",
        LobbyListCreateView.as_view(),
        name="lobby-list-create",
    ),
    path(
        "lobbies/<int:pk>/",
        LobbyRetrieveDestroyView.as_view(),
        name="lobby-retrieve-destroy",
    ),
    
]