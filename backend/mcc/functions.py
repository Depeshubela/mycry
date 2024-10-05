import pytz,hashlib,datetime,traceback,json,base64
from decimal import Decimal
from .web3Connect import w3,mccContract,usdtContract,mccAddress
from .models import *
from .secret import AES_CTR,AES_ECB
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.mail import get_connection
from .myException import *

def hash_code(s, salt='function'):
    h = hashlib.sha256()
    s += salt
    h.update(s.encode()) 
    return h.hexdigest()

def make_confirm_string(email):
    now = datetime.datetime.now(pytz.timezone('Asia/Taipei')).strftime("%Y-%m-%d %H:%M:%S")
    token = email
    token = hash_code(email, now)
    ConfirmString.objects.create(token=token, email=email)
    return token


def send_email(subject, text_content , html_content, from_email, recipient_list, using='outside'):
    if using == 'outside':
        
        connection = get_connection(backend=settings.OUTSIDE_EMAIL_BACKEND,
                                    host=settings.OUTSIDE_EMAIL_HOST,
                                    port=settings.OUTSIDE_EMAIL_PORT,
                                    username=settings.OUTSIDE_EMAIL_HOST_USER,
                                    password=settings.OUTSIDE_EMAIL_HOST_PASSWORD,
                                    use_ssl=settings.OUTSIDE_EMAIL_USE_SSL)
    # elif using == 'inside':
        
    #     connection = get_connection(backend=settings.INSIDE_EMAIL_BACKEND,
    #                                 host=settings.INSIDE_EMAIL_HOST,
    #                                 port=settings.INSIDE_EMAIL_PORT,
    #                                 username=settings.INSIDE_EMAIL_HOST_USER,
    #                                 password=settings.INSIDE_EMAIL_HOST_PASSWORD,
    #                                 use_ssl=settings.INSIDE_EMAIL_USE_SSL)
    else:
        raise ValueError('Invalid email settings')
    msg = EmailMultiAlternatives(subject, text_content , from_email, [recipient_list],connection=connection)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def userIdGenerator():

    return str(datetime.datetime.now().year)[2:] + '{:02d}'.format(datetime.datetime.now().month) + '{:02d}'.format(datetime.datetime.now().day) + '{:04d}'.format(UserData.objects.last().id + 1 if UserData.objects.last() else 1)


def refreshBalance(userAddress):
    try:
        userUSDTinfo = Decimal(usdtContract.functions.balanceOf(userAddress.ethAddress).call()) * Decimal(Decimal('10') ** - (usdtContract.functions.decimals().call()))
        userMCCinfo = Decimal(mccContract.functions.balanceOf(userAddress.ethAddress).call()) * Decimal(Decimal('10') ** - (mccContract.functions.decimals().call()))
        userMCCStakeDatainfo = mccContract.functions.stakeDataView(userAddress.ethAddress).call()
        allStaking = w3.from_wei(mccContract.functions.stakedAmount().call(),'ether')
        balance = Decimal(userMCCinfo)
        rate = 0
        for stakeData in userMCCStakeDatainfo:
            if stakeData[1] != 0 :
                try:
                    result = mccContract.functions.stakingCalculate(stakeData[0], stakeData[1]).call()
                    rate += w3.from_wei(result, "ether")
                except:
                    traceback.print_exc()
            balance += w3.from_wei(stakeData[1], "ether")
        
        userAddress.staked = Decimal(balance - userMCCinfo)

        userETHinfo = w3.from_wei(w3.eth.get_balance(userAddress.ethAddress),'ether')
        # print(userUSDTinfo,userMCCinfo,userETHinfo)
        # userMCCinfo = w3.from_wei(w3.eth.get_balance(userAddress.ethAddress),'ether')
        userAddress.usdtBalance = Decimal(round(userUSDTinfo,18))
        userAddress.tokenBalance = Decimal(round(userMCCinfo,18))
        
        userAddress.ethBalance = Decimal(round(userETHinfo,18))

        userAddress.save()
        return rate,allStaking
    except:
        traceback.print_exc()

def buyWithETH(initAmount,userData):
    try:
        if not Decimal(initAmount):
            raise CouldNotBeZero('CouldNotBeNull')
        if Decimal(initAmount) > Decimal(userData.ethBalance) - Decimal('0.015'):
            raise TransGasError('GasNotEnough')
        refreshBalance(userData)
        senderPrivateKey = AES_CTR().unpad(AES_CTR().decrypt(settings.AES_CTR_KEY.encode('utf-8'), base64.b64decode(userData.ethPrivateKey.encode('utf-8')))).decode()
        transferAmount = w3.to_wei(initAmount, "ether")
        senderAddress = userData.ethAddress
        txParams = mccContract.functions.buyWithEth().build_transaction({
            'value':transferAmount,
            'nonce': w3.eth.get_transaction_count(senderAddress),
            'from': senderAddress,
            "chainId": w3.eth.chain_id,
            'gas':1000000,
        })
        tx = ethTrans(txParams,senderPrivateKey)

        return tx
    except CouldNotBeZero as e:
        return {'status':'交易失敗','message':str(e)}
    except TransGasError as e:
        return {'status':'交易失敗','message':str(e)}
    
def buyWithUSDT(initAmount,userData):
    try:
        if not Decimal(initAmount):
            raise CouldNotBeZero('CouldNotBeNull')
        if Decimal(userData.ethBalance) < Decimal('0.015'):
            raise TransGasError('GasNotEnough')
        # refreshBalance(userData)
        senderPrivateKey = AES_CTR().unpad(AES_CTR().decrypt(settings.AES_CTR_KEY.encode('utf-8'), base64.b64decode(userData.ethPrivateKey.encode('utf-8')))).decode()
        transferAmount = w3.to_wei(initAmount, "mwei")
        senderAddress = userData.ethAddress

        checkAllowance = usdtContract.functions.allowance(senderAddress,mccAddress).call()
        if checkAllowance < transferAmount:
            txParams = usdtContract.functions.approve(mccAddress,transferAmount).build_transaction({
                'nonce': w3.eth.get_transaction_count(senderAddress),
                'from': senderAddress,
                "chainId": w3.eth.chain_id,
                'gas':1000000,
            })
            ethTrans(txParams,senderPrivateKey)

        txParams = mccContract.functions.buyWithUSDT(transferAmount).build_transaction({
            'nonce': w3.eth.get_transaction_count(senderAddress),
            'from': senderAddress,
            "chainId": w3.eth.chain_id,
            'gas':1000000,
        })

        tx = ethTrans(txParams,senderPrivateKey)

        return tx
    except CouldNotBeZero as e:

        return {'status':'交易失敗','message':str(e)}
    except TransGasError as e:

        return {'status':'交易失敗','message':str(e)}
    except:
        traceback.print_exc()
    
def mccStake(initAmount,userData):
    try:
        if not Decimal(initAmount):
            raise CouldNotBeZero('CouldNotBeNull')
        if Decimal(userData.ethBalance) < Decimal('0.015'):
            raise TransGasError('GasNotEnough')
        if Decimal(initAmount) > Decimal(userData.tokenBalance):
            raise StakeBalanceNotEnough('TokenNotEnough')

        senderPrivateKey = AES_CTR().unpad(AES_CTR().decrypt(settings.AES_CTR_KEY.encode('utf-8'), base64.b64decode(userData.ethPrivateKey.encode('utf-8')))).decode()
        transferAmount = w3.to_wei(initAmount, "ether")
        senderAddress = userData.ethAddress

        checkAllowance = mccContract.functions.allowance(senderAddress,mccAddress).call()
        if checkAllowance < transferAmount:
            txParams = mccContract.functions.approve(mccAddress,transferAmount).build_transaction({
                'nonce': w3.eth.get_transaction_count(senderAddress),
                'from': senderAddress,
                "chainId": w3.eth.chain_id,
                'gas':1000000,
            })
            ethTrans(txParams,senderPrivateKey)
        
        txParams = mccContract.functions.setStake(transferAmount).build_transaction({
            'nonce': w3.eth.get_transaction_count(senderAddress),
            'from': senderAddress,
            "chainId": w3.eth.chain_id,
            'gas':1000000,
        })
        # print('txParams')
        tx = ethTrans(txParams,senderPrivateKey)

        return tx
    except CouldNotBeZero as e:
        return {'status':'交易失敗','message':str(e)}
    except TransGasError as e:
        return {'status':'交易失敗','message':str(e)}
    except StakeBalanceNotEnough as e:
        return {'status':'交易失敗','message':str(e)}
    except:
        traceback.print_exc()


def mccWithdrawStake(initAmount,userData):
    try:
        if not Decimal(initAmount):
            raise CouldNotBeZero('CouldNotBeNull')
        if Decimal(userData.ethBalance) < Decimal('0.015'):
            raise TransGasError('GasNotEnough')
        # if Decimal(initAmount) > Decimal(userData.staked):
        #     raise StakeBalanceNotEnough('TokenNotEnough')

        senderPrivateKey = AES_CTR().unpad(AES_CTR().decrypt(settings.AES_CTR_KEY.encode('utf-8'), base64.b64decode(userData.ethPrivateKey.encode('utf-8')))).decode()
        # transferAmount = w3.to_wei(initAmount, "ether")
        senderAddress = userData.ethAddress
        
        txParams = mccContract.functions.withdrawStake().build_transaction({
            'nonce': w3.eth.get_transaction_count(senderAddress),
            'from': senderAddress,
            "chainId": w3.eth.chain_id,
            'gas':1000000,
        })
        # print('txParams')
        tx = ethTrans(txParams,senderPrivateKey)
        # print(tx['receipt'])
        return tx
    except CouldNotBeZero as e:
        return {'status':'交易失敗','message':str(e)}
    except TransGasError as e:
        return {'status':'交易失敗','message':str(e)}
    except StakeBalanceNotEnough as e:
        return {'status':'交易失敗','message':str(e)}
    except:
        traceback.print_exc()

def ethTrans(txParams,senderPrivateKey,mode=w3):

    signedTx = mode.eth.account.sign_transaction(txParams, private_key=senderPrivateKey)

    txHash = mode.eth.send_raw_transaction(signedTx.raw_transaction)

    receipt = mode.eth.wait_for_transaction_receipt(txHash)

    if receipt['status'] == 1:
        tx = {
            'status': '交易成功',
            'tx': txHash.hex(),
            'receipt':receipt
        }
        
    else:
        tx = {
            'status': '交易失敗',
            'tx': txHash.hex(),
            'receipt':receipt
        }
    return tx