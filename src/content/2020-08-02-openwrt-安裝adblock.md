---
id: "2167237437"
slug: openwrt-install-adblock
title: "[OpenWrt] 安裝Adblock"
date: 2020-08-02T04:55:32.041Z
description: OpenWrt 安裝和設置 Adblock
tags:
  - OpenWrt
  - Adblock
  - Hello World
headerImage: https://i.imgur.com/K7XPk7j.jpg
templateKey: blog-post
---
## 安裝

1. 刷新軟件源

   ```bash
   $ opkg update
   ```

2. 安裝Adblock

   ```bash
   #install download utiility
   $ opkg install uclient-fetch
   $ opkg install libustream-openssl
   
   #install adblock
   $ opkg install adblock
   
   # install luci interface
   $ opkg install luci-app-adblock
   ```

3. 安裝nano (待會設定用，或你可以使用web interface來調校)

   ```bash
   $ opkg install nano
   ```



## 設置

這裡使用command line進行設置。有安裝web interface的，可到luci, service -> adblock進行設置。

1. 進入`/etc/config/adblock`

2. 參考並根據你個人喜好修改

   ```console
   #/etc/config/adblock
   
   config adblock 'global'
           option adb_basever '3.8'
           option adb_enabled '1'
           option adb_dns 'dnsmasq'
           option adb_dnsvariant 'nxdomain'
           option adb_fetchutil 'uclient-fetch'
           option adb_trigger 'wan'
   
   config adblock 'extra'
           option adb_debug '0'
           option adb_forcedns '0'
           option adb_report '0'
           option adb_maxqueue '4'
   
   config source 'adaway'
           option adb_src 'https://adaway.org/hosts.txt'
           option adb_src_rset '/^127\.0\.0\.1[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'focus on mobile ads, infrequent updates, approx. 400 entries'
           option enabled '1'
   
   config source 'adguard'
           option adb_src 'https://filters.adtidy.org/windows/filters/15.txt'
           option adb_src_rset 'BEGIN{FS=\"[/|^|\r]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+[\/\^\r]+$/{print tolower(\$3)}'
           option adb_src_desc 'combined adguard dns filter list, frequent updates, approx. 17.000 entries'
           option enabled '1'
   
   config source 'bitcoin'
           option adb_src 'https://raw.githubusercontent.com/hoshsadiq/adblock-nocoin-list/master/hosts.txt'
           option adb_src_rset '/^0\.0\.0\.0[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'focus on malicious bitcoin mining sites, infrequent updates, approx. 80 entries'
           option enabled '0'
   
   config source 'disconnect'
           option adb_src 'https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'mozilla driven blocklist, numerous updates on the same day, approx. 4.700 entries'
           option enabled '1'
   
   config source 'dshield'
           option adb_src 'https://www.dshield.org/feeds/suspiciousdomains_Low.txt'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'generic blocklist, daily updates, approx. 3.500 entries'
           option enabled '0'
   
   config source 'hphosts'
           option adb_src 'https://hosts-file.net/ad_servers.txt'
           option adb_src_rset '/^127\.0\.0\.1[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|\$)+/{print tolower(\$2)}'
           option adb_src_desc 'broad blocklist, monthly updates, approx. 19.200 entries'
           option enabled '1'
   
   config source 'malware'
           option adb_src 'https://mirror.espoch.edu.ec/malwaredomains/justdomains'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'broad blocklist, daily updates, approx. 18.300 entries'
           option enabled '0'
   
   config source 'malwarelist'
           option adb_src 'http://www.malwaredomainlist.com/hostslist/hosts.txt'
           option adb_src_rset '/^127\.0\.0\.1[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'focus on malware, daily updates, approx. 1.200 entries'
           option enabled '1'
   
   config source 'notracking'
           option adb_src 'https://raw.githubusercontent.com/notracking/hosts-blocklists/master/dnscrypt-proxy/dnscrypt-proxy.blacklist.txt'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'notrack domains, daily updates, approx. 60.000 entries'
           option enabled '0'
   
   config source 'openphish'
           option adb_src 'https://openphish.com/feed.txt'
           option adb_src_rset 'BEGIN{FS=\"/\"}/^http[s]?:\/\/([[:alnum:]_-]+\.)+[[:alpha:]]+(\/|$)/{print tolower(\$3)}'
           option adb_src_desc 'focus on phishing, numerous updates on the same day, approx. 2.400 entries'
           option enabled '0'
   
   config source 'reg_cn'
           option adb_src 'https://easylist-downloads.adblockplus.org/easylistchina+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on chinese ads plus generic easylist additions, daily updates, approx. 11.700 entries'
           option enabled '1'
   
   config source 'reg_de'
           option adb_src 'https://easylist-downloads.adblockplus.org/easylistgermany+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on german ads plus generic easylist additions, daily updates, approx. 9.200 entries'
           option enabled '0'
   
   config source 'reg_id'
           option adb_src 'https://easylist-downloads.adblockplus.org/abpindo+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on indonesian ads plus generic easylist additions, weekly updates, approx. 9.600 entries'
           option enabled '0'
   
   config source 'reg_nl'
           option adb_src 'https://easylist-downloads.adblockplus.org/easylistdutch+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on dutch ads plus generic easylist additions, weekly updates, approx. 9.400 entries'
           option enabled '0'
   
   config source 'reg_pl'
           option adb_src 'http://adblocklist.org/adblock-pxf-polish.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on polish ads, daily updates, approx. 90 entries'
           option enabled '0'
   
   config source 'reg_ro'
           option adb_src 'https://easylist-downloads.adblockplus.org/rolist+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on romanian ads plus generic easylist additions, weekly updates, approx. 9.400 entries'
           option enabled '0'
   
   config source 'reg_ru'
           option adb_src 'https://easylist-downloads.adblockplus.org/ruadlist+easylist.txt'
           option adb_src_rset 'BEGIN{FS=\"[|^]\"}/^\|\|([[:alnum:]_-]+\.)+[[:alpha:]]+\^("\\\$third-party")?$/{print tolower(\$3)}'
           option adb_src_desc 'focus on russian ads plus generic easylist additions, weekly updates, approx. 14.500 entries'
           option enabled '0'
   
   config source 'shalla'
           option adb_src 'http://www.shallalist.de/Downloads/shallalist.tar.gz'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'huge blocklist archive subdivided in different categories, daily updates. Check http://www.shallalist.de/categories.html for more categories'
           list adb_src_cat 'adv'
           list adb_src_cat 'costtraps'
           list adb_src_cat 'spyware'
           list adb_src_cat 'tracker'
           list adb_src_cat 'warez'
           option enabled '0'
   
   config source 'spam404'
           option adb_src 'https://raw.githubusercontent.com/Dawsey21/Lists/master/main-blacklist.txt'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)+/{print tolower(\$1)}'
           option adb_src_desc 'generic blocklist, infrequent updates, approx. 6.000 entries'
           option enabled '1'
   
   config source 'sysctl'
           option adb_src 'http://sysctl.org/cameleon/hosts'
           option adb_src_rset '/^127\.0\.0\.1[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'broad blocklist, weekly updates, approx. 16.500 entries'
           option enabled '0'
   
   config source 'ut_capitole'
           option adb_src 'https://dsi.ut-capitole.fr/blacklists/download/blacklists.tar.gz'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'huge blocklist archive subdivided in different categories, daily updates. Check https://dsi.ut-capitole.fr/blacklists/index_en.php for more categories'
           list adb_src_cat 'publicite'
           list adb_src_cat 'cryptojacking'
           list adb_src_cat 'ddos'
           list adb_src_cat 'malware'
           list adb_src_cat 'phishing'
           list adb_src_cat 'warez'
           option enabled '0'
   
   config source 'whocares'
           option adb_src 'https://someonewhocares.org/hosts/hosts'
           option adb_src_rset '/^127\.0\.0\.1[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'broad blocklist, weekly updates, approx. 10.000 entries'
           option enabled '0'
   
   config source 'winspy'
           option adb_src 'https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt'
           option adb_src_rset '/^0\.0\.0\.0[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'focus on windows spy & telemetry domains, infrequent updates, approx. 300 entries'
           option enabled '0'
   
   config source 'winhelp'
           option adb_src 'http://winhelp2002.mvps.org/hosts.txt'
           option adb_src_rset '/^0\.0\.0\.0[[:space:]]+([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$2)}'
           option adb_src_desc 'broad blocklist, infrequent updates, approx. 13.000 entries'
           option enabled '0'
   
   config source 'yoyo'
           option adb_src 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=nohtml&showintro=0&mimetype=plaintext'
           option adb_src_rset '/^([[:alnum:]_-]+\.)+[[:alpha:]]+([[:space:]]|$)/{print tolower(\$1)}'
           option adb_src_desc 'focus on ad related domains, weekly updates, approx. 2.400 entries'
           option enabled '1'
   ```

   `option adb_enabled` 必須設置為`1`才能正常使用

3. 進入`/etc/adblock/`修改blacklist whitelist設定

   以下為我的設定

   ```console
   #/etc/adblock/adblock.whitelist
   
   android.clients.google.com
   1e100.net
   ctinets.com
   gvt1.com
   ggpht.com
   googleapis.com
   ```

   最主要加入`gvt1.com`以免google play不能更新app

4. 啟動Adblock

   ```bash
   #start adblock
   $ /etc/init.d/adblock restart
   
   #enable auto start
   $ /etc/init.d/adblock enable
   ```

   

## 檢查Adblock

* 檢查adblock狀態

  ```bash
  $ /etc/init.d/adblock status
  ```

  ouput

  ```console
  root@OpenWrt:/etc/adblock# /etc/init.d/adblock status
  ::: adblock runtime information
    + adblock_status  : enabled
    + adblock_version : 3.8.15
    + overall_domains : 97734
    + fetch_utility   : /bin/uclient-fetch (libustream-ssl)
    + dns_backend     : dnsmasq, /tmp
    + dns_variant     : nxdomain, false
    + backup_dir      : /tmp
    + last_rundate    : 08.02.2020 13:56:57
    + system_release  : TP-Link Archer C7 v5, OpenWrt 19.07.1 r10911-c155900f66
  ```

  adblock_status: 

  * `enable` : 正常工作中
  * `running`: 更新host中，請耐心等候
  * `error`: 錯誤，請檢驗以修正

* 檢查某域名攔截狀態

  ```bash
  $ /etc/init.d/adblock query <domain>
  ```

  eg.

  ```bash
  $ /etc/init.d/adblock query google.com
  ```

  output

  ```console
  root@OpenWrt:/etc/adblock# /etc/init.d/adblock query google.com
  :::
  ::: results for domain 'google.com' in active blocklist
  :::
    + ads.google.com
    + adservice.google.com
    + adservice.google.com.mt
    + adservice.google.com.tr
    + adservice.google.com.vn
    + ampcid.google.com
    + analytics.google.com
    + fundingchoices.google.com
    + gg.google.com
    + googleadapis.l.google.com
    + [...]
  
  :::
  ::: results for domain 'google.com' in backups and black-/whitelist
  :::
    + adb_list.adaway.gz            ads.google.com
    + adb_list.adaway.gz            adservice.google.com
    + adb_list.adaway.gz            ampcid.google.com
    + adb_list.adaway.gz            [...]
    + adb_list.adguard.gz           partnerad.l.google.com
    + adb_list.adguard.gz           googleadapis.l.google.com
    + adb_list.adguard.gz           ssl-google-analytics.l.google.com
    + adb_list.adguard.gz           [...]
    + adb_list.disconnect.gz        pagead.l.google.com
    + adb_list.disconnect.gz        partnerad.l.google.com
    + adb_list.disconnect.gz        video-stats.video.google.com
    + adb_list.disconnect.gz        [...]
    + adb_list.hphosts.gz           ads.google.com
    + adb_list.hphosts.gz           analytics.google.com
    + adb_list.hphosts.gz           gg.google.com
    + adb_list.hphosts.gz           [...]
    + adb_list.reg_cn.gz            googleadapis.l.google.com
    + adb_list.reg_cn.gz            gstaticadssl.l.google.com
    + adb_list.reg_cn.gz            mail-ads.google.com
    + adb_list.reg_cn.gz            [...]
    + adb_list.yoyo.gz              adservice.google.com
    + adb_list.yoyo.gz              adservice.google.com.mt
    + adb_list.yoyo.gz              analytics.google.com
    + adb_list.yoyo.gz              [...]
    + adblock.whitelist             android.clients.google.com 
  ```

  
