---
title: "Fix messed up NordVPN resolv.conf on Linux"
description: "If you are using the NordVPN Linux Version you maybe experienced that NordVPN is\\noverwriting the resolv.conf when you connect to a VPN. For me it happened when"
translationKey: "fix-nordvpn-resolv-conf"
language: "en-US"
date: 2021-12-01
heroImage: "/images/ghost/2021/12/Download.png"
---

If you are using the NordVPN Linux Version you maybe experienced that NordVPN is overwriting the resolv.conf when you connect to a VPN. For me it happened when i used the [nordvpn-bin]("https://aur.archlinux.org/packages/nordvpn-bin/") from the AUR. So after i disconnected from my VPN i have realised that i can´t connect to the Internet. So i have checked my [resolv.conf]("https://wiki.archlinux.de/title/Resolv.conf") to check what happened. And there where entries generated from NordVPN in there. So i thought just edit the config and change it to [dns.watch]("https://dns.watch/") again. So i tried to edit it. But it said that i hadn´t the permissions herefore. I was root. Why don´t i have permissions herefore. I am root.

So i searched across the Internet and found a simple solution i want to share with you.

First get permissions back:

```bash
sudo chattr -i /etc/resolv.conf
```

\

Then edit the `/etc/resolv.conf` or delete it and create it new:

\

```bash
sudo rm -rf /etc/resolv.conf
```

\

After that, add your nameservers. I am using [dns.watch]("https://dns.watch/") nameservers but you can use whatever you want.

```bash
sudo echo "nameserver 84.200.69.80" >> /etc/resolv.conf sudo echo "nameserver 84.200.70.40" >> /etc/resolv.conf
```

\

Tada! Fixed :)

If you want to make a script of it you can use the following:

```bash
#!/bin/bash sudo chattr -i /etc/resolv.conf sudo rm -rf /etc/resolv.conf sudo echo "nameserver 84.200.69.80" >> /etc/resolv.conf sudo echo "nameserver 84.200.70.40" >> /etc/resolv.conf
```

\
