# from .models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import *
from decimal import Decimal

class LoginObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        email = attrs.get('email')

        password = attrs.get('password')

        self.user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password,
        )
 
        if self.user is None:
            raise serializers.ValidationError(
                _('請確認帳號或密碼是否正確')
            )

        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.userID
        return token
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = '__all__'

class PurchaseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPurchaseHistory
        fields = '__all__'
    

class UserSetStakeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetStakeHistory
        fields = '__all__'

class UserWithdrawStakeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWithdrawStakeHistory
        fields = '__all__'