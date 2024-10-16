from django.db import transaction
from rest_framework.generics import GenericAPIView,CreateAPIView,ListAPIView,ListCreateAPIView,UpdateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.conf import settings
from rest_framework.views import APIView
from django.core.cache import cache

from django.utils import timezone
from datetime import timedelta
import threading,pytz,datetime,requests,traceback,json
from .functions import *
from .createWallet import createWallet
from .serializers import *
from .models import *
from .secret import AES_CTR,AES_ECB

class LoginTokenAPIView(TokenObtainPairView):
    serializer_class = LoginObtainPairSerializer
    @swagger_auto_schema(
        operation_summary='此POST函數用於創建登入JWT Token',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            message = e.detail['non_field_errors'][0] if 'non_field_errors' in e.detail and e.detail['non_field_errors'][0] else '請輸入正確的帳號或密碼'
            return Response({'error': message}, status=400)
        return super().post(request, *args, **kwargs)
    
class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_summary='此POST函數用於接收註冊請求',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **krgs):
        data = request.data
        if not data or UserData.objects.filter(email=data['email']).exists():
            return Response({'error': '此信箱已存在'}, status=status.HTTP_200_OK)
        elif ConfirmString.objects.filter(email = data['email']).exists():
            c_time = ConfirmString.objects.get(email = data['email']).createTime.astimezone(pytz.timezone('Asia/Taipei'))
            now = datetime.datetime.now(pytz.timezone('Asia/Taipei'))
            if now < c_time + datetime.timedelta(settings.REGISTER_CONFIRM_EXPIRY_TIME):
                return Response({'error': f'此信箱已寄信，請等待{int(settings.REGISTER_CONFIRM_EXPIRY_TIME * 1440)}分鐘後再次註冊'},status=status.HTTP_200_OK)
            else:
                ConfirmString.objects.filter(email = data['email']).delete()
        
        code = make_confirm_string(data['email'])
        html_content = '''
        <body style="font-family:DFKai-sb;font-size: 20px;">
        <a style="color:#0070C0">您好{}！<br><br>
        歡迎您註冊MyCryCoin！<br><br>
        請點選以下驗證連結，驗證Email帳號以完成註冊程序。<br><br>
        您也可以複製下方網址到瀏覽器中開啟進行驗證</a><br><br>
        <a style="color:#0070C0" href="https://{}/mcc/backend/registerConfirm/?code={}&v={}">http://{}/mcc/backend/registerConfirm/?code={}&v={}</a><br><br>
        <a style="color:#FF0000">請注意：信件只有1分鐘有效期，請注意註冊時間。<br><br><br><br><br><br>
        <a style="color:#FF0000">請注意：此郵件是系統自動傳送，請勿直接回覆！<br>
        </body>
        '''.format(data['email'],settings.PROJECT_URL, code, AES_ECB().encrypt(settings.AES_ECB_KEY,data['email']), settings.PROJECT_URL, code ,AES_ECB().encrypt(settings.AES_ECB_KEY,data['email']))
        email_thread = threading.Thread(target=send_email, args=('註冊信箱驗證','註冊信箱驗證傳輸失敗，請重新註冊',html_content, settings.OUTSIDE_EMAIL_HOST_USER,data['email'],'outside'),daemon=True)
        email_thread.start()
        
        return Response({'success':'註冊信已發送，請至信箱收信以完成註冊'},status=status.HTTP_200_OK)
    
class UserRegisterConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_summary='此POST函數用於接收註冊驗證信點擊後的請求',
        # operation_description='傳遞資料:',
    )
    def post(self, request):
        data = {"registerEmail": AES_ECB().decrypt(settings.AES_ECB_KEY,request.data['urls'])}
        user = ConfirmString.objects.filter(email = data['registerEmail']).first()
        if user and timezone.now() - user.createTime <= timedelta(minutes=1):
            return Response(data)
        else:
            return Response({"detail": "Time Out"}, status=404)

    

class UserRegisterCreateAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_summary='此POST函數用於接收輸入完註冊密碼後的用戶創建',
        # operation_description='傳遞資料:',
    )
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        if UserData.objects.filter(email=email).exists():
            return Response({'error': '此信箱已存在'}, status=status.HTTP_200_OK)
        with transaction.atomic():
            user = UserData.objects.create(
                userID = userIdGenerator(),
                email = email
            )
            user.set_password(password)
            user.save()
            createWallet(user)
        return Response({'state':'註冊成功'})
    
class GetUserAddressDatasListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    @swagger_auto_schema(
        operation_summary='此get函數用於使用者登入至主頁面後返回使用者資料',
        # operation_description='傳遞資料:',
    )
    def get(self, request):
        user_id = request.user.userID
        redis_key = f"user_address_data:{user_id}"
        cached_data = cache.get(redis_key)
        if cached_data:
            print('命中')
            return Response({'datas': json.loads(cached_data)})
        serializer = self.serializer_class(request.user.address, many=False)
        data = serializer.data
        cache.set(redis_key, json.dumps(data), timeout=3600)  # 3600 = 1 小時
        print('未命中')
        return Response({'datas': data})
    
class RefreshBalanceAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    @swagger_auto_schema(
        operation_summary='此get函數用於刷新使用者區塊鏈各數據',
        # operation_description='傳遞資料:',
    )
    def get(self,request):
        rate,allStaking = refreshBalance(request.user.address)
        serializer = self.serializer_class(request.user.address, many=False)
        data = serializer.data
        user_id = request.user.userID
        redis_key = f"user_address_data:{user_id}"  
        cache.set(redis_key, json.dumps(data), timeout=3600)  # 3600 = 1 小時
        return Response({'datas':data,'rate':rate,'allStaking':allStaking})

class GetUSDUSDTPriceAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_summary='此get函數用於獲取最新USDTUSD價格，注意，此價格僅作參考，與合約上的價格源不同',
        # operation_description='傳遞資料:',
    )
    def get(self,request):
        url = 'https://api.binance.us/api/v3/ticker/price?symbol=USDTUSD'
        try:
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                return Response(data)
            else:
                return Response(f"Error: {response.status_code}, {response.text}")
        
        except Exception as e:
            return Response(f"An error occurred: {e}")

class BuyTokenWithETHAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseHistorySerializer
    @swagger_auto_schema(
        operation_summary='此post函數用於使用者用ETH購買代幣',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **kwargs):
        try:
            initData = request.data
            errors = {}
            for field, value in initData.items():
                if not value:
                    errors[field] = 'CouldNotBeNull'
            if errors:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            refreshBalance(request.user.address)
            tx = buyWithETH(initData['payAmount'],request.user.address)
            if tx['status'] != '交易成功':
                return Response(tx, status=status.HTTP_400_BAD_REQUEST)
            initData['transHash'] = tx['tx']
            initData['purchase'] = request.user.userID
            initData['transTime'] = datetime.datetime.now()
            serializer = self.get_serializer(data=initData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({'state':'購買成功','tx':tx['tx']})
        except:
            traceback.print_exc()

        

class BuyTokenWithUSDTAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PurchaseHistorySerializer
    @swagger_auto_schema(
        operation_summary='此post函數用於使用者用USDT購買代幣',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **kwargs):
        try:
            initData = request.data
            errors = {}
            for field, value in initData.items():
                if not value:
                    errors[field] = 'CouldNotBeNull'
            if errors:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            refreshBalance(request.user.address)
            tx = buyWithUSDT(initData['payAmount'],request.user.address)
            if tx['status'] != '交易成功':
                return Response(tx, status=status.HTTP_400_BAD_REQUEST)
            initData['transHash'] = tx['tx']
            initData['purchase'] = request.user.userID
            initData['transTime'] = datetime.datetime.now()
            serializer = self.get_serializer(data=initData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({'state':'購買成功','tx':tx['tx']})
        except:
            traceback.print_exc()

class UserStakeAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSetStakeHistorySerializer
    @swagger_auto_schema(
        operation_summary='此post函數用於使用者質押代幣',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **kwargs):
        try:
            initData = request.data
            errors = {}
            for field, value in initData.items():
                if not value:
                    errors[field] = 'CouldNotBeNull'
            if errors:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            tx = mccStake(initData['stakeAmount'],request.user.address)
            if tx['status'] != '交易成功':
                return Response(tx, status=status.HTTP_400_BAD_REQUEST)
            initData['transHash'] = tx['tx']
            initData['stake'] = request.user.userID
            initData['transTime'] = datetime.datetime.now()
            serializer = self.get_serializer(data=initData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({'state':'購買成功','tx':tx['tx']})
        except:
            traceback.print_exc()

class UserWithdrawStakeAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserWithdrawStakeHistorySerializer
    @swagger_auto_schema(
        operation_summary='此post函數用於使用者提領質押代幣',
        # operation_description='傳遞資料:',
    )
    def post(self, request, *args, **kwargs):
        try:
            initData = request.data
            errors = {}
            for field, value in initData.items():
                if not value:
                    errors[field] = 'CouldNotBeNull'
            if errors:
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            tx = mccWithdrawStake(initData['withdrawAmount'],request.user.address)
            if tx['status'] != '交易成功': 
                return Response(tx, status=status.HTTP_400_BAD_REQUEST)
            initData['transHash'] = tx['tx']
            initData['stake'] = request.user.userID
            initData['transTime'] = datetime.datetime.now()
            serializer = self.get_serializer(data=initData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({'state':'購買成功','tx':tx['tx']})
        except:
            traceback.print_exc()