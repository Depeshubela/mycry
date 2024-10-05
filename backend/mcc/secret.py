from Crypto.Cipher import AES
import base64,os
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from django.conf import settings

class AES_ECB():
    def pad(self,text):
        return text + (16 - len(text) % 16) * ' '

    def encrypt(self,key, raw):
        raw = self.pad(raw)
        cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
        encrypted = cipher.encrypt(raw.encode('utf-8'))
        return base64.b32encode(encrypted).decode('utf-8').rstrip('=')

    def decrypt(self,key, enc):
        cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
        
        # 補回去掉的 `=` 符號
        missing_padding = len(enc) % 8
        if missing_padding:
            enc += '=' * (8 - missing_padding)
        
        decrypted = cipher.decrypt(base64.b32decode(enc))
        return decrypted.decode('utf-8').strip()


class AES_CTR():
    def pad(self,data):
        # 使用PKCS7填充方式將資料補齊為AES區塊大小的倍數
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(data) + padder.finalize()
        return padded_data

    def unpad(self,padded_data):
        # 移除PKCS7填充
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        data = unpadder.update(padded_data) + unpadder.finalize()
        return data

    def encrypt(self,key, data):
        backend = default_backend()

        # 使用CTR模式，並且將隨機的nonce設定為16位
        nonce = os.urandom(16)
        cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=backend)

        # 將資料補齊為AES區塊大小的倍數
        padded_data = self.pad(data)

        # 建立加密器
        encryptor = cipher.encryptor()

        # 加密資料
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

        # 合併 nonce 與密文，並返回
        combined_data = nonce + encrypted_data
        return combined_data

    def decrypt(self,key, combined_data):
        backend = default_backend()

        # 提取 nonce
        nonce = combined_data[:16]
        encrypted_data = combined_data[16:]

        # 使用CTR模式，並且將提取的 nonce 設定為16位
        cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=backend)

        # 建立解密器
        decryptor = cipher.decryptor()

        # 解密資料
        decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()

        return decrypted_data



# key = '98765432198765432198765432198765' 
# message = '24b31d150b0d5e4ba7d047ae1e08312189d8a8963d9c6c23aa15ea5a531eea71'
# message = 'VoUTcbeLuU/WicYFJ5qYOiAkm7S6wANp5oTjJ4H244LrX5Vo5Ny0zHFx7fpcLpc2IJ2AkByL3oTTZNFOUKOqvujyueNMB3meCzL2wgroyi4rh7z1s4NkBl9LBMb0veYy+PMHNBK4kTOGW7SWwu3tt0Fm7ApA868u1UfN3P8dSISS8j0oBY3VlAISthhRyXt7oB5MuSDQTc+PRNXZidM4yUjnRsgT'
# encrypted = base64.b64encode(AES_CTR().encrypt(key.encode('utf-8'), message.encode('utf-8'))).decode('utf-8'),

# print(f'Encrypted: {encrypted}')

# decrypted = AES_CTR().unpad(AES_CTR().decrypt(key.encode('utf-8'), base64.b64decode(message.encode('utf-8')))).decode()
# print(f'Decrypted: {decrypted}')
