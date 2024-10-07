import ecdsa,base64
from Crypto.Hash import keccak
from eth_account import Account
from decimal import Decimal
from .models import *
from .secret import AES_CTR
from .web3Connect import w3
from django.conf import settings

def createWallet(userData):      
    eth_private_key, eth_public_key, eth_address = createAddress()
    UserAddress.objects.create(
        ethPrivateKey = base64.b64encode(AES_CTR().encrypt(settings.AES_CTR_KEY.encode('utf-8'), eth_private_key.encode('utf-8'))).decode('utf-8'),
        ethPublicKey = eth_public_key,
        ethAddress = eth_address,
        ethBalance = Decimal('0'),
        user_id = userData.userID,
        usdtBalance = Decimal('0'),
        tokenBalance = Decimal('0'),
        staked = Decimal('0')
    )

def createAddress():
    private_key = Account.create()._private_key.hex()
    account = w3.eth.account.from_key(private_key) 
    private_key_hex = private_key
    private_key_bytes = bytes.fromhex(private_key_hex)
    sk = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    public_key_bytes = vk.to_string()
    hash_keccak = keccak.new(digest_bits=256)
    hash_keccak.update(public_key_bytes)
    # public_key_hash = hash_keccak.hexdigest()

    return private_key,public_key_bytes.hex(),account.address
