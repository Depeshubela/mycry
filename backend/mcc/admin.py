from django.contrib import admin
from .models import *

admin.site.site_header = 'MCC後檯管理'
admin.site.site_title = 'MCC後檯管理'
admin.site.index_title = 'MCC後檯管理'


@admin.register(UserData)
class UserDataAdmin(admin.ModelAdmin):
    list_display = ['userID','email','is_active','is_staff','is_superuser']

@admin.register(UserPurchaseHistory)
class UserPurchaseHistoryAdmin(admin.ModelAdmin):
    list_display = ['purchase','transHash','transTime','payToken','payAmount']

@admin.register(UserSetStakeHistory)
class UserSetStakeHistoryAdmin(admin.ModelAdmin):
    list_display = ['stake','transHash','transTime','stakeAmount']

@admin.register(UserWithdrawStakeHistory)
class UserWithdrawStakeHistoryAdmin(admin.ModelAdmin):
    list_display = ['stake','transHash','transTime','withdrawAmount']

@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user','ethAddress','ethBalance','usdtBalance','tokenBalance','staked']

@admin.register(ConfirmString)
class ConfirmStringAdmin(admin.ModelAdmin):
    list_display = ['token','email','createTime']