from web3 import Web3

# 連接到以太坊節點
infura_url = 'https://arbitrum-sepolia.infura.io/v3/02c5f02b1ca74885874d8bb3455e99c1'  # 可以是任何節點或你的 Infura URL
web3 = Web3(Web3.HTTPProvider(infura_url))


# # 交易哈希 (Transaction Hash)
# tx_hash = '0x8b44ef28f90587ce9270b95fc6710f93588821dde429466a99894f673160ee98'  # 替換成你想查詢的交易哈希

# # 查詢交易紀錄
# try:
#     transaction = web3.eth.get_transaction(tx_hash)
#     print(transaction)
# except Exception as e:
#     print(f"Error: {e}")

print(web3.to_wei(0.0001,'ether'))