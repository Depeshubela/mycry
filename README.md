# 聲明
本專案一切圖片素材皆來源於Google，排版設計模仿自[PLAYDOGE](https://playdoge.io/zh-hant#home)，僅於特定時間公開用於本人程式學習及求職使用，於特定時間後會關閉並禁止除本人外所有用戶訪問，無任何散播與營利之目的，若版權持有者有感到任何不便，請聯繫我，我將立刻移除相關內容。

# 專案介紹
本專案目標為實現網站與區塊鏈合約之交互使用，於專案內分為兩種模式
### 會員模式

用戶需註冊並登入後才可於合約進行合約互動，錢包由網站管理員(後端資料庫)統一保管、調用

以前後端分離的方式用RESTful API做前後端溝通

### 小狐狸模式

用戶可直接用瀏覽器小狐狸(Metamask)錢包連接並對合約互動，毋須註冊與登入

其他細部功能介紹待下述

## 主要使用工具
### 網頁
* 前端:React (Vite、tailwindcss、MetaMask SDK)

* 後端:Django (PostgreSQL、Redis、Prometheus、Grafana)

* 合約:Solidity (Remix撰寫、測試，Hardhat部屬於[Arbi鏈](https://sepolia.arbiscan.io/token/0x8b44cD4B02903FeDE538b2CF57aF222A53dee1f6?a=0x8b44cD4B02903FeDE538b2CF57aF222A53dee1f6)
### 運行環境
AWS EC2 Linux Ubuntu Docker容器中

## 小狐狸模式功能介紹  
[小狐狸模式-主要功能示範影片](https://drive.google.com/file/d/1nNdl8jo6_j1K6UVJldhuFICuORPEPYyZ/view?usp=drive_link)


### 主頁面
![foxMainFix](https://github.com/Depeshubela/mycry/blob/main/pic/foxMainFix.png)

1. 質押，點擊後會跳至質押頁面。

2. 會員模式，即需要註冊後才能使用交互的模式，註冊後將由後端生成錢包並保存至資料庫。  
點擊後會跳至會員模式登入畫面 [登入圖預覽](https://github.com/Depeshubela/mycry/blob/main/pic/login.png)

3. 版權聲明，由於本專案使用到部分網路素材，故特設此頁面聲明 [版權聲明預覽](https://github.com/Depeshubela/mycry/blob/main/pic/copyright.png)

4. 小狐狸登入後此處會顯示使用錢包，若點擊會使小狐狸錢包斷開。

5. 切換使用ETH購買MCC Token。

6. 切換使用USDT購買MCC Token。

7. 輸入要支付的ETH或USDT數量，另一格將會自動轉換您會獲得的數量，兩處由於合約上的USDT為用chainlink的預言機所抓，與網頁上顯示估算值會有些許差異。
  
8. 輸入要購買的Token數量，另一格將會自動轉換您會獲得的數量，兩處由於合約上的USDT為用chainlink的預言機所抓，與網頁上顯示估算值會有些許差異。

9. 點擊後即會跳出小狐狸視窗確認是否要進行交易，若是USDT交易則會先判斷allowance是否足夠，若不夠將會自動呼叫approve。

10. 質押，點擊後會跳至質押頁面。

11. 點擊即斷開小狐狸錢包連接。

### 質押頁面

![foxStakeFix](https://github.com/Depeshubela/mycry/blob/main/pic/forStakeFix.png)

1. 回首頁，點擊後會跳至首頁。

2. 點擊後即會跳出視窗請使用者輸入質押數量，確認無誤後即會進行質押動作，交易前會先判斷allowance是否足夠，若不夠將會自動呼叫approve，

3. 提取代幣，點擊後會將目前所有本金加上總獎勵的Token返回給客戶。

## 會員模式功能介紹

由於會員模式功能與小狐狸基本一致，故此處主要以說明各工具及其呈現狀態

***施工中***
