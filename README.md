# 聲明
本專案一切圖片素材皆來源於Google，排版設計模仿自[PLAYDOGE](https://playdoge.io/zh-hant#home)，僅於特定時間公開用於本人程式學習及求職使用，於特定時間後會關閉並禁止除本人外所有用戶訪問，無任何散播與營利之目的。

# 專案介紹
本專案目標為實現網站與區塊鏈合約之交互使用，於專案內分為兩種模式
### 會員模式

用戶需註冊並登入後才可於合約進行合約互動，且錢包由網站管理員(後端資料庫)統一保管

以前後端分離的方式用RESTful API做前後端溝通

### 小狐狸模式

用戶可直接用瀏覽器小狐狸(Metamask)錢包連接並對合約互動，毋須註冊與登入

其他細部功能介紹待下述

## 主要使用工具
### 網頁
* 前端:React (Vite、tailwindcss、Metamask SDK)

* 後端:Python-Django (PostgreSQL、Redis、Prometheus、Grafana)

* 合約:Solidity (Remix撰寫、測試，Hardhat部屬於[Arbi鏈](https://sepolia.arbiscan.io/token/0xd83ad6b2b3aff6c5fccb17fa8901e1b5401873d9?a=0xD83Ad6b2B3Aff6c5fCCB17fa8901E1B5401873d9))
### 開發與運行環境
開發於Windows

運行於AWS EC2 Linux Ubuntu Docker容器中

## 會員模式功能介紹









## 小狐狸模式功能介紹
