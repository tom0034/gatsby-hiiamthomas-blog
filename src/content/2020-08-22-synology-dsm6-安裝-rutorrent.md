---
title: "[Synology] DSM6 安裝 ruTorrent"
date: 2020-08-22T09:12:50.824Z
description: Synology DSM6 安裝 ruTorrent 和 解決 RSS "Error Loading Feed" 問題
tags:
  - Synology
  - ruTorrent
headerImage: ""
templateKey: blog-post
---

## 環境

* Synology DS215j, DSM 6.2.3-25426

&nbsp;

## 安裝和設置

1. 添加community source `https://packages.synocommunity.com/`

2. 下載 `WebStation`, `Apache 2.4`, `PHP 7.0`

3. 打開 `WebStation`，前往General Setting，將 HTTP backend server設為 apache 2.4，php設為 php7.0

4. 在 `WebStation`，前往 PHP Setting，編輯 Default Profile，或你可新增一個profile

5. 將`open_basedir`開啟，加上以下句子

   ```
   /var/services/tmp:/var/services/web:/usr/local/rutorrent:/usr/bin:/volume1/downloads
   ```

   另外，裝`extension`全部勾選，如下圖

   ![](https://i.imgur.com/pobeLQi.png)

6. 建立`downloads`共用資料夾，給予HTTP群組read/write權限

7. 下載`ruTorrent`套件，按預設值安裝 

8. 現在你已可使用 ruTrrent 了


&nbsp;
## 啟用RSS

當新增RSS feed時，會報錯 `Error Loading Feed`

經過一番google search，解決方法如下

1. 啟用 `admin`帳號，啟用 `ssh`

2. ssh 進入 synology

3. 成為 root

   ```
   sudo -i
   ```

4. 更改 config.php

   ```
   ## open and edit config.php
   $ vi /var/services/web/rutorrent/conf/config.php
   ```

   config.php :

   ```php
       <?php                                                                                                                       // configuration parameters
   
       // for snoopy client
       @define('HTTP_USER_AGENT', 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0', true);
       @define('HTTP_TIME_OUT', 30, true); // in seconds
       @define('HTTP_USE_GZIP', true, true);
       $httpIP = null;             // IP string. Or null for any.
   
       @define('RPC_TIME_OUT', 5, true);   // in seconds
   
       @define('LOG_RPC_CALLS', false, true);
       @define('LOG_RPC_FAULTS', true, true);
   
       // for php
       @define('PHP_USE_GZIP', false, true);
       @define('PHP_GZIP_LEVEL', 2, true);
   
       $schedule_rand = 10;            // rand for schedulers start, +0..X seconds
   
       $do_diagnostic = true;
       $log_file = '/tmp/errors.log';      // path to log file (comment or leave blank to disable logging)
   
       $saveUploadedTorrents = true;       // Save uploaded torrents to profile/torrents directory or not
       $overwriteUploadedTorrents = false;     // Overwrite existing uploaded torrents in profile/torrents directory or make unique name
   
       $topDirectory = '/volume1/';            // Upper available directory. Absolute path with trail slash.
       $forbidUserSettings = false;
   
       $scgi_port = 8050;
       $scgi_host = "127.0.0.1";
   
       // For web->rtorrent link through unix domain socket
       // (scgi_local in rtorrent conf file), change variables
       // above to something like this:
       //
       // $scgi_port = 0;
       // $scgi_host = "unix:///tmp/rpc.socket";
   
       $XMLRPCMountPoint = "/RPC2";        // DO NOT DELETE THIS LINE!!! DO NOT COMMENT THIS LINE!!!
   
       $pathToExternals = array(
           "php"   => '',          // Something like /usr/bin/php. If empty, will be found in PATH.
           "curl"  => '',          // Something like /usr/bin/curl. If empty, will be found in PATH.
           "gzip"  => '',          // Something like /usr/bin/gzip. If empty, will be found in PATH.
           "id"    => '',          // Something like /usr/bin/id. If empty, will be found in PATH.
           "stat"  => '',          // Something like /usr/bin/stat. If empty, will be found in PATH.
       );
   
       $localhosts = array(            // list of local interfaces
           "127.0.0.1",
           "localhost",
       );
   
       $profilePath = '../share';      // Path to user profiles
       $profileMask = 0777;            // Mask for files and directory creation in user profiles.
                           // Both Webserver and rtorrent users must have read-write access to it.
                           // For example, if Webserver and rtorrent users are in the same group then the value may be 0770.
   
       $tempDirectory = '/usr/local/rutorrent/tmp/';           // Temp directory. Absolute path with trail slash. If null, then autodetect will be used.
   
       $canUseXSendFile = true;        // Use X-Sendfile feature if it exist
   ```

   將 `$tempDirectory = '/usr/local/rutorrent/tmp'` 改為 `$tempDirectory = '/usr/local/rutorrent/tmp/'`

5. 儲存


&nbsp;
## reference

https://github.com/SynoCommunity/spksrc/pull/3175#issuecomment-368499409

https://github.com/SynoCommunity/spksrc/issues/2215#issuecomment-263028398

https://github.com/Novik/ruTorrent/issues/1461#issuecomment-355478849

https://github.com/Novik/ruTorrent/issues/1622

https://github.com/SynoCommunity/spksrc/issues/3062#issuecomment-425707089