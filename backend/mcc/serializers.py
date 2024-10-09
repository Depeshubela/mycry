from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import *
from decimal import Decimal

class LoginObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):

        #獲取前端傳來的email、password
        email = attrs.get('email')
        password = attrs.get('password')

        #驗證帳號密碼是否正確並更改後端對此用戶的request.user狀態
        self.user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password,
        )

        #若經過登入驗證後還是未登入代表有問題
        if self.user is None:
            raise serializers.ValidationError(
                _('請確認帳號或密碼是否正確')
            )

        #若登入成功，調用父類JWT Token的驗證器validate且生成token
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data
    
    #修改token生成時內部包含的參數
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