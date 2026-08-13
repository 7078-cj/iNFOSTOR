from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..serializers import UserSerializer
import os
from django.conf import settings
from rest_framework import generics

from ..models import Lobby
from ..serializers import LobbySerializer
from rest_framework import viewsets, permissions


# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
        
@api_view(['POST'])
def registerUser(request):
    
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            return Response({'message': 'User registered successfully'})
        return Response(serializer.errors, status=400)


class LobbyListCreateView(generics.ListCreateAPIView):
    queryset = Lobby.objects.all()
    serializer_class = LobbySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LobbyRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = LobbySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lobby.objects.filter(user=self.request.user)