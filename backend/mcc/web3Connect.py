from web3 import Web3
from django.conf import settings
import json

w3 = Web3(Web3.HTTPProvider(settings.ARB_SEPOLIA_RPC))

with open(settings.USDT_ABI_URL, 'r') as f:
    usdt_abi = json.load(f)

with open(settings.MCC_ABI_URL, 'r') as f:
    mcc_abi = json.load(f)

usdtAddress = settings.USDT_CONTRACT
mccAddress = settings.MCC_CONTRACT

usdtContract = w3.eth.contract(address=usdtAddress, abi=usdt_abi)
mccContract = w3.eth.contract(address=mccAddress, abi=mcc_abi)