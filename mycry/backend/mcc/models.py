from django.db import models
from django.contrib.auth.models import PermissionsMixin,BaseUserManager, AbstractBaseUser,AbstractUser
from django.contrib.auth.hashers import make_password
from django.contrib.postgres.fields import ArrayField

class UserDataManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email field is required')
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class UserData(AbstractBaseUser,PermissionsMixin):
    userID = models.CharField(max_length=10,blank=True,unique=True,null=True)
    email = models.CharField(max_length=50,blank=True,unique=True,null=True)
    password = models.CharField(max_length=256,default=None,null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    objects = UserDataManager()

    class Meta:
        verbose_name = '用戶基本資料'
        verbose_name_plural = verbose_name


class UserPurchaseHistory(models.Model): #購買Token紀錄
    purchase = models.ForeignKey(UserData,on_delete=models.CASCADE,related_name='purchaseHistory',to_field='userID')
    transHash = models.CharField(max_length=128,blank=True,null=True)
    transTime = models.DateTimeField(blank=True,null=True)
    payToken = models.CharField(max_length=10,blank=True,null=True)
    payAmount = models.CharField(max_length=10,blank=True,null=True)

    class Meta:
        verbose_name = '購買Token紀錄'
        verbose_name_plural = verbose_name



class UserSetStakeHistory(models.Model): #質押紀錄
    stake = models.ForeignKey(UserData,on_delete=models.CASCADE,related_name='setStakeHistory',to_field='userID')
    transHash = models.CharField(max_length=128,blank=True,null=True)
    transTime = models.DateTimeField(blank=True,null=True)
    stakeAmount = models.CharField(max_length=10,blank=True,null=True)

    class Meta:
        verbose_name = '質押紀錄'
        verbose_name_plural = verbose_name

class UserWithdrawStakeHistory(models.Model): #質押提領紀錄
    stake = models.ForeignKey(UserData,on_delete=models.CASCADE,related_name='withdrawStakeHistory',to_field='userID')
    transHash = models.CharField(max_length=128,blank=True,null=True)
    transTime = models.DateTimeField(blank=True,null=True)
    withdrawAmount = models.CharField(max_length=10,blank=True,null=True)
    # rewards = models.DecimalField(default=0,null=True, blank=True,max_digits=24,decimal_places=18) #獎勵數量,提領量-原量

    class Meta:
        verbose_name = '質押提領紀錄'
        verbose_name_plural = verbose_name

class UserAddress(models.Model):
    user = models.OneToOneField(UserData,on_delete=models.CASCADE,related_name='address',to_field='userID')
    ethPrivateKey = models.CharField(max_length=256,default=None,null=True, blank=True)
    ethPublicKey = models.CharField(max_length=256,default=None,null=True, blank=True)
    ethAddress = models.CharField(max_length=128,blank=True,null=True)
    ethBalance = models.DecimalField(default=0,null=True, blank=True,max_digits=30,decimal_places=18)
    usdtBalance = models.DecimalField(default=0,null=True, blank=True,max_digits=30,decimal_places=18)
    tokenBalance = models.DecimalField(default=0,null=True, blank=True,max_digits=30,decimal_places=18)
    staked = models.DecimalField(default=0,null=True, blank=True,max_digits=30,decimal_places=18)

    class Meta:
        verbose_name = '用戶地址'
        verbose_name_plural = verbose_name


class ConfirmString(models.Model):
    token = models.CharField(max_length=256)
    email = models.EmailField(unique=True,default=None,null=True, blank=True)
    createTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '註冊Token'
        verbose_name_plural = verbose_name