from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Lobby

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user



class LobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lobby
        fields = ["id", "user", "name", "created_at"]
        read_only_fields = ["id", "user", "created_at"]