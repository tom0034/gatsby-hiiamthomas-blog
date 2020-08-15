---
id: "8338521334"
title: "[Raspberry Pi] 自建 Rsshub + Tiny Tiny RSS"
date: 2020-08-15T10:46:05.112Z
description: Raspberry Pi 自建 Rsshub + Tiny Tiny RSS，另有一鍵配置腳本!
tags:
  - Raspberry Pi
  - Rsshub
  - Tiny Tiny RSS
templateKey: blog-post
---
## 環境

* Raspberry Pi Model 3B+ , Raspbian GNU/Linux 10 (buster)


&nbsp;
## 安裝docker

首先我們要安裝docker, 因接下來的步驟全部都會用到docker。如你不想使用docker，那就自己摸索一下吧。。



1. 安裝docker engine，我們用script去安裝

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

   

2. 將現在使用中的用戶加入 docker group, 免去輸入`sudo`的煩惱

   ```bash
   sudo usermod -aG docker $USER
   ```

   如正在使用ssh連接pi的，請退出並重新ssh一次以生效

   

3. 安裝docker-compose。因raspberry pi的架構關係 (pi 3b+: armv7l, pi 4b: aarch64)，需利用`pip`才能順利安裝。

   ```bash
   # install python3 and pip3
   sudo apt update
   sudo apt install python3 python3-pip -y
   
   # install docker-compose
   sudo pip3 install docker-compose
   ```

4. 測試是否成功安裝

   ```bash
   docker --version
   Docker version 19.03.12, build 48a6621
   
   docker-compose --version
   docker-compose version 1.25.0, build unknown
   ```


&nbsp;
## 安裝tt-rss

1. 下載docker-compose.yml

   ```bash
   # create new directory to save .yml
   cd ~
   mkdir ttrss
   cd ttrss
   
   # download .yml
   wget https://raw.githubusercontent.com/HenryQW/Awesome-TTRSS/master/docker-compose.yml
   ```

2. 更改設置

   ```yml
   ###
   # 1st place to edit
   ###
   
     service.rss:
       image: wangqiru/ttrss:latest
       container_name: ttrss
       ports:
         - 181:80
       environment:
       #### change this ####
         - SELF_URL_PATH=http://localhost:181/ # <----------- change this to your pi ip address, eg http://192.168.1.100:181/
       #####################
         - DB_HOST=database.postgres
         - DB_PORT=5432
         - DB_NAME=ttrss
         - DB_USER=postgres
         - DB_PASS=ttrss 
         - ENABLE_PLUGINS=auth_internal,fever
         - FEED_LOG_QUIET=true
       stdin_open: true
       tty: true
       restart: always
       command: sh -c 'sh /wait-for.sh $$DB_HOST:$$DB_PORT -- php /configure-db.php && exec s6-svscan /etc/s6/'
       
       
   #------------------------------------------------------------------------------------------------------------------#
   
   
   ###
   # 2nd place to edit
   # comment out opencc, since the pi archetecture does not support
   # as show below
   ###
   
     #service.opencc: # set OpenCC API endpoint to `service.opencc:3000` on TTRSS plugin setting page
     #  image: wangqiru/opencc-api-server:latest
     #  container_name: opencc
     #  environment:
     #    - NODE_ENV=production
     #  expose:
     #    - 3000
     #  restart: always
   
   ```

3. 運行

   ```bash
   docker-compose up -d
   ```


&nbsp;
## 安裝rsshub

1. 下載docker-compose.yml

   ```bash
   # create new directory to save .yml
   cd ~
   mkdir rsshub
   cd rsshub
   
   # download .yml
   wget https://raw.githubusercontent.com/DIYgod/RSSHub/master/docker-compose.yml
   ```

2. 運行

   ```bash
   # Create a docker volume to persist Redis caches
   docker volume create redis-data
   
   # Launch
   docker-compose up -d
   ```


&nbsp;
## 檢查

* 輸入`docker ps` 查看，如下

  ![docker ps](https://i.imgur.com/6TPmYFO.png)

* ttrss: `http://your-ttrss-ip:181`, eg: `http://192.168.1.100:181`

* rsshub: `http://your-rsshub-ip:1200`, eg: `http://192.168.1.100:1200`


&nbsp;
## Bonus

原本[Awesome-TTRSS](https://github.com/HenryQW/Awesome-TTRSS)內置了 opencc (繁簡轉換)，無奈raspberry pi的架構令其不能使用，檢查 `docker ps`會顯示opencc一直重啟，所有才需要在ttrss 的docer-compose.yml裡將其關閉。但因為其[opencc api server](https://github.com/HenryQW/OpenCC.henry.wang)是基於[BYVoid/OpenCC](https://github.com/BYVoid/OpenCC)，而後者是能夠在arm上編譯的，故我抱著一試的心態從github下載source code直接編譯。

1. 下載source code

   ```bash
   git clone https://github.com/HenryQW/OpenCC.henry.wang.git
   cd OpenCC.henry.wang
   ```

2. 編譯

   ```bash
   docker build -t opencc_dev .
   ```

   記住不要漏掉最尾的一點 `.`

3. 運行

   ```bash
   docker run -d -p 3000:3000 --restart=always opencc_dev
   ```

4. 輸入`docker ps` 看看有沒有成功，`NAMES`應用會顯示為`opencc_dev`


&nbsp;
## Bonus 2

tt-rss, rsshub, opencc 要做3次`docker-compose up -d`很麻煩？它們處於不用bridge要互相溝通很不方便？那就將它們都放在一起!

一個docker-compose.yml文件滿足你所有願望

請確認opencc api server 的source code 是位於當前位置的OpenCC.henry.wang文件夾內，例如當前位置為`~/rss_combined`, opencc api server的source code應位於`~/rss_combined/OpenCC.henry.wang`

```yml
# assume current dir is ~/rss_combined
# put this file in this dir

version: "3"
services:
  database.postgres:
    image: postgres:alpine
    container_name: postgres
    environment:
      - POSTGRES_PASSWORD=ttrss # please change the password
    volumes:
      - ~/postgres/data/:/var/lib/postgresql/data # persist postgres data to ~/postgres/data/ on the host
    restart: always

  service.rss:
    image: wangqiru/ttrss:latest
    container_name: ttrss
    ports:
      - 181:80
    environment:
      - SELF_URL_PATH=http://your-ttrss-ip-address:181/ # please change to your own domain
      - DB_HOST=database.postgres
      - DB_PORT=5432
      - DB_NAME=ttrss
      - DB_USER=postgres
      - DB_PASS=ttrss # please change the password
      - ENABLE_PLUGINS=auth_internal,fever # auth_internal is required. Plugins enabled here will be enabled for all users as system plugins
      - FEED_LOG_QUIET=true
    stdin_open: true
    tty: true
    restart: always
    command: sh -c 'sh /wait-for.sh $$DB_HOST:$$DB_PORT -- php /configure-db.php && exec s6-svscan /etc/s6/'

  service.mercury: # set Mercury Parser API endpoint to `service.mercury:3000` on TTRSS plugin setting page
    image: wangqiru/mercury-parser-api:latest
    container_name: mercury
    expose:
      - 3000
    restart: always

  services.opencc_dev:
    image: services.opencc_dev
    build: ./OpenCC.henry.wang
    environment:
      NODE_ENV: production
    ports:
      - 3000:3000
    restart: always

  # service.opencc: # set OpenCC API endpoint to `service.opencc:3000` on TTRSS plugin setting page
  #   image: wangqiru/opencc-api-server:latest
  #   container_name: opencc
  #   environment:
  #     - NODE_ENV=production
  #   expose:
  #     - 3000
  #   restart: always

  # utility.watchtower:
  #   container_name: watchtower
  #   image: containrrr/watchtower:latest
  #   volumes:
  #     - /var/run/docker.sock:/var/run/docker.sock
  #   environment:
  #     - WATCHTOWER_CLEANUP=true
  #     - WATCHTOWER_POLL_INTERVAL=86400
  #   restart: always

  rsshub:
    image: diygod/rsshub
    restart: always
    ports:
      - "1200:1200"
    environment:
      NODE_ENV: production
      CACHE_TYPE: redis
      REDIS_URL: "redis://redis:6379/"
      PUPPETEER_WS_ENDPOINT: "ws://browserless:3000"
    depends_on:
      - redis
      - browserless

  browserless:
    image: browserless/chrome
    restart: always

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis-data:/data

volumes:
  redis-data:

```

&nbsp;
## reference

https://github.com/HenryQW/OpenCC.henry.wang

https://github.com/BYVoid/OpenCC

https://docs.rsshub.app/en/install/

http://ttrss.henry.wang/#deployment-via-docker-compose

https://docs.docker.com/get-started/part2/

https://li-aaron.github.io/2019/12/ttrss-rsshub/

https://tstrs.me/1451.html