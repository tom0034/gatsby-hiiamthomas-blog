---
id: "080220201506"
title: "[OpenWrt] 使用外置usb增加空間"
date: 2020-08-21T11:58:50.891Z
description: 使用外置usb增加OpenWrt空間!
tags:
  - OpenWrt
templateKey: blog-post
---

路由器為TP-Link Archer C7 v5，OpenWrt版本19.07.1

```console
C:\Users\User>ssh root@192.168.1.1
root@192.168.1.1's password:


BusyBox v1.30.1 () built-in shell (ash)

  _______                     ________        __
 |       |.-----.-----.-----.|  |  |  |.----.|  |_
 |   -   ||  _  |  -__|     ||  |  |  ||   _||   _|
 |_______||   __|_____|__|__||________||__|  |____|
          |__| W I R E L E S S   F R E E D O M
 -----------------------------------------------------
 OpenWrt 19.07.1, r10911-c155900f66
 -----------------------------------------------------
root@OpenWrt:~# 
```


&nbsp;
# 前置作業

&nbsp;
## 安裝usb驅動

1. ssh 進去你的路由器

   ```bash
   $ ssh root@192.168.1.1
   ```

2. 安裝所需驅動

   ```bash
   #refresh software packages
   $ opkg update
   
   #install usb drives
   $ opkg install kmod-usb-storage
   $ opkg install kmod-usb-storage-uas
   $ opkg install usbutils
   ```

3. 檢查usb是否被成功檢測

   ```bash
   $ lsusb -t
   ```

   output

   ```console
   root@OpenWrt:~# lsusb -t
   /:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=ehci-platform/1p, 480M
       |__ Port 1: Dev 2, If 0, Class=Mass Storage, Driver=usb-storage, 480M
   ```

   看見`Driver=usb-storage`就代表已檢測到你的usb裝置

&nbsp;
## 檢查OpenWrt能否辨別你的usb裝置

1. 確認你已插上usb裝置

2. 輸入

   ```bash
   $ ls -l /dev/sd*
   ```

   output

   ```console
   root@OpenWrt:~# ls -l /dev/sd*
   brw-------    1 root     root        8,   0 Jan  1  1970 /dev/sda
   brw-------    1 root     root        8,   1 Jan  1  1970 /dev/sda1
   brw-------    1 root     root        8,   5 Jan  1  1970 /dev/sda5
   brw-------    1 root     root        8,   6 Jan  1  1970 /dev/sda6
   brw-------    1 root     root        8,   7 Jan  1  1970 /dev/sda7
   ```

   註：`sda5`, `sda6`, `sda7`為我的usb裝置

3. 安裝`block`工具查看詳細資料

   ```bash
   $ opkg install block-mount
   ```

4. 使用`block`工具

   ```bash
   $ block info | grep "/dev/sd"
   ```

   output

   ```console
   root@OpenWrt:~# block info | grep "/dev/sd"
   /dev/sda5: VERSION="1" TYPE="swap"
   /dev/sda6: UUID="c79e3fb7-e7ea-4855-87fa-30e1b769678f" VERSION="1.0" MOUNT="/overlay" TYPE="ext4"
   /dev/sda7: UUID="e7bd5e85-552a-4d0c-af38-720291d6d2c4" VERSION="1.0" MOUNT="/data" TYPE="ext4"
   ```

   如你的usb裝置已格式化分區，那則會顯示出來，如上面的`/dev/sda5`, `/dev/sda6`, `/dev/sda7`


&nbsp;
# 實作設置

&nbsp;
## 建立分區

因我的usb裝置建立好分區已經是一年前的事了，忘了怎樣做，故現貼上官方教學，有機會再攝寫實戰教學

Create a partition on the USB disk

if the previous chapter did not list any existing partitions (like “/dev/sda1”, “/dev/sda2”, “/dev/sdb1”…), you have to create a partition first for further storage usage.

1. To do so, install **gdisk**:

   ```bash
   $ opkg install gdisk
   ```

2. Start **gdisk** with the disk name identified in the previous chapter:

   ```bash
   $ gdisk /dev/sda
   ```

3. In the interactive gdisk menu, create a partition with gdisk command

   ```bash
   $ n
   ```

   This triggers an interactive dialogue: Use the suggested defaults for the partition creation (number, starting sector, size, Hex code)

4. When done, confirm the changes with gdisk interactive command

   ```bash
   $ w
   ```

   and then confirm your choice with

   ```bash
   $ Y
   ```

5. Keep a note of the created partition name for the next step

Refer to the gdisk help text (write “?”) in case you need additional help. Stick to a single partition, to stay aligned to the following HowTo.

&nbsp;
## 格式化分區

* usb hard disk -> ext4

  ```bash
  $ opkg install e2fsprogs
  $ opkg install kmod-fs-ext4
  #please edit /dev/sda* to desire partitions, eg. /dev/sda5
  $ mkfs.ext4 /dev/sda*
  ```

* SSD drives and thumb drives -> F2FS

  ```bash
  $ opkg install f2fs-tools
  $ opkg install kmod-fs-f2fs
  #please edit /dev/sda* to desire partitions, eg. /dev/sda5
  $ mkfs.f2fs /dev/sda*
  ```


&nbsp;
## 自動掛載

* data: 顧名思義，放data專用，如bt下載回來的檔案。容量最大
* swap: 類似虛擬記憶體的概念。大約1GB就十分足夠
* overlay: 插件儲存位置。大約1GB就十分足夠

data 和 swap分區校易設置

1. 安裝nano (雖然內置vi但很難用)

   ```bash
   #refresh package list and install nano
   $ opkg update && opkg install nano
   ```

2. 更改fstab設置 (我不想用uci逐一設置，太麻煩了)

   按照你的usb裝置進行修改，然後使用nano編輯`/etc/config/fstab`

   ```console
   #/etc/config/fstab
   
   config global
           option anon_swap '0'
           option anon_mount '0'
           option auto_swap '1'
           option auto_mount '1'
           option delay_root '5'
           option check_fs '0'
   
   config mount
           option enabled '1'
           option target '/data'
           option uuid 'e7bd5e85-552a-4d0c-af38-720291d6d2c4'
   
   config swap
           option enabled '1'
           option device '/dev/sda5'
   ```

3. 將`fstab`服務設為開機自啟動

   ```bash
   $ /etc/init.d/fstab boot
   
   # or
   # in this case , I use the following
   $ /etc/init.d/fstab enable
   
   # or
   $ service fstab boot
   
   # or 
   $ service fstab enable
   ```

   

4. 儲存後重啟

   ```bash
   $ reboot
   ```

設置`/overlay`分區

1. 增加`/etc/config/fstab`設置

   ```console
   config mount 'overlay'
           option uuid 'f112c97c-1b84-a949-989f-3cd15c226e2e'
           option target '/overlay'
           option enabled '1'
   ```

2. 轉移原`/overlay`數據至外置usb

   ```bash
   #/dev/sd* is your usb device/partition
   $ mount /dev/sda* /mnt
   $ cp -a -f /overlay/. /mnt
   $ umount /mnt
   ```

3. 重啟路由器

   ```bash
   $ reboot
   ```

4. 檢查效果

   ```bash
   $ df
   ```

   output

   ```console
   root@OpenWrt:/etc/config# df
   Filesystem           1K-blocks      Used Available Use% Mounted on
   /dev/root                 2816      2816         0 100% /rom
   tmpfs                    62260      4084     58176   7% /tmp
   /dev/sda6              1011384     14220    928572   2% /overlay
   overlayfs:/overlay     1011384     14220    928572   2% /
   tmpfs                      512         0       512   0% /dev
   /dev/sda7            304547896     77212 288930820   0% /data
   ```

   註意未掛載並use% 是42%，掛載後為2%

ps: 這裡其可不重新啟動路由器，手動掛載`mount /dev/sd* /overlay`，但為確保設置正常運作，`reboot`一次確認自動掛載機能正常運作。

&nbsp;
## (Optional) 在沒有任何讀寫行為時將usb硬盤設為閒置模式

1. **hdparm**: 使用commandl line 管理

   ```bash
   $ opkg update && opkg install hdparm
   
   #setting harddisk idle
   #/dev/sda* is your harddisk/partition, eg. /dev/sda5
   hdparm -S 240 /dev/sda*
   ```

2. **hd-idle (With LuCi integration)**: 使Luci圖形介面設置

   ```bash
   $ opkg update && opkg install luci-app-hd-idle
   ```

   進入luci， service -> hd-idle