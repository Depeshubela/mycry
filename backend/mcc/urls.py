from .views import *
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', LoginTokenAPIView.as_view()),
    path('token/refresh/',TokenRefreshView.as_view()),
    path('register/',UserRegisterAPIView.as_view()),
    path('registerConfirm/',UserRegisterConfirmAPIView.as_view()),
    path('registerCreateUser/',UserRegisterCreateAPIView.as_view()),
    path('getUserAddressDatas/',GetUserAddressDatasListAPIView.as_view()),
    path('getUSDUSDTPrice/',GetUSDUSDTPriceAPIView.as_view()),
    path('buyTokenWithETH/',BuyTokenWithETHAPIView.as_view()),
    path('buyTokenWithUSDT/',BuyTokenWithUSDTAPIView.as_view()),
    path('refreshBalance/',RefreshBalanceAPIView.as_view()),
    path('userStake/',UserStakeAPIView.as_view()),
    path('userWithdrawStake/',UserWithdrawStakeAPIView.as_view()),
]