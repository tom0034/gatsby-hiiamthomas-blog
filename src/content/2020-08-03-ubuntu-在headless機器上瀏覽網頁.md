---
id: "6901598506"
title: 在Headless Server上瀏覽網頁
date: 2020-08-03T05:01:55.442Z
description: browse website on a headless server
tags:
  - Ubuntu
  - Headless
  - Server
templateKey: blog-post
---
## 環境

* Headless server: Raspberry Pi, Ubuntu 20.04
* Client: Windows 10, Firefox

&nbsp;
## 安裝

安裝squid，用作proxy server

```bash
# update repo
sudo apt-get update

# install squid
sudo apt-get install squid -y
```

&nbsp;
## 設置

在Firefox裡設置好proxy

![setting](https://i.imgur.com/Aaod9ad.png)

&nbsp;
## 使用

安裝完squid並設置好firefox proxy後，便可使用ssh tunnel將網頁流量由ubuntu送到windows。

開啟ssh client並使用`-CNT2gL`選項

```bash
ssh -CNT2gL 8080:localhost:3128 username@headless-server -p 22
```

現在firefox已經連上ubuntu server, 能夠使用其網絡去瀏覽網頁

&nbsp;
## 測試

1. headless server 連上vpn
2. 設置好並開啟squid
3. 檢查ip是否為vpn ip, 或是否能連上公司/學校的內聯網

&nbsp;
## 其他

* squid settings: `/etc/squid/squid.conf`

  * `http_access`
  * `http_port`
* squid status: `sudo systemctl status squid.service`

&nbsp;
## Reference

1. https://askubuntu.com/questions/603100/gui-browser-on-a-headless-server
2. https://phoenixnap.com/kb/setup-install-squid-proxy-server-ubuntu
3. https://www.cyberciti.biz/faq/ubuntu-squid-proxy-server-installation-configuration/