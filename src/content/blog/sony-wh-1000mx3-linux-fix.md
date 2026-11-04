---
title: "Sony WH-1000xm3 - Bluetooth fix Sound on Linux"
description: "I have the Sony WH-1000xm3\\n[https://electronics.sony.com/audio/headphones/headband/p/wh1000xm3-b]. I bought\\nthem a couple of years ago and they are great. I r"
translationKey: "sony-wh-1000mx3-linux-fix"
language: "en-US"
date: 2021-06-20
heroImage: "/images/ghost/2021/06/pexels-olenka-sergienko-3541365.jpg"
---

I have the [Sony WH-1000xm3]("https://electronics.sony.com/audio/headphones/headband/p/wh1000xm3-b"). I bought them a couple of years ago and they are great. I really love them. The Noise Canceling was fantastic years ago. Maybe its currently outdated, but i love them either.

But there where some Problems on Windows i had two devices one for Music and one for audio calls with lower audio quality. But they connected and they worked. Not perfect but they worked.

But i changed to Linux and faced completely different problems. I neither got the headset connected via Bluetooth. Via aux i had no problems. Audio and microphone worked fine. But via Bluetooth i had many problems.

In this article i am describing my story of how i got them to work. If some points are useless just go ahead and contact me and i will remove them.

## Preperation

Make shure you have **Pipewire** installed. I am currently on Arch so i head over to [Pipewire docs]("https://wiki.archlinux.org/title/PipeWire") and installed it.

```
sudo pacman -S pipewire pipewire-pulse
```

Arch

```bash
sudo apt install pipewire pipewire-pulse
```

Debian

Install **bluez** if not allready installed:

```
sudo pacman -S bluez bluez-utils
```

Arch

```
sudo apt install bluez bluez-utils
```

Debian

## Connect the Headphone

First i thought: _\\"Yeah just connect them and i am ready\\"_. That was a sweet dream...

So to connect them it took me several steps. I have them from this [Forum Post]("https://forums.archlinux.fr/viewtopic.php?f=15&t=21588&p=172016#p172016")

```
sudo systemctl start bluetooth\nsudo systemctl status bluetooth\nbluetoothctl list\nbluetoothctl devices\nsudo systemctl enable bluetooth
```

Then reboot....

Maybe they are not correct but for me they worked.

After the reboot you should be able to connect with the Headphones.

If not you can connect them manually (Commands from [Arch Docs]("https://wiki.archlinux.org/title/Bluetooth")):

```
bluetoothctl\ndefault-agent\npower on\nscan on
```

Wait until your Headphones appear and copy their address.

Then enter following commands:

```
pair [ADDRESS]\nconnect [ADDRESS]
```

Your Headphones should be now connected.

Now go ahead and test them. In my case the sound was very muddy. This is because your headphones are now in the \\"Microphone-enabled -shitty-sound-mode\\" as i call it. To get the clear sound we all want you have to check the config of **Pipewire**. It took me some time to figure this out. But go ahead to the new **Pipewire** config location:

```
cd /usr/share/pipewire\nls -la
```

you will see some configuration for **Pipewire**. Here you can change the general behaviour of **Pipewire**. But we just want to change the **bluez** behaviour so we go ahead to the _media-session.d_ directory:

```
cd media-session.d\n
```

then we go ahead and edit the _bluez-monitor.conf_ file:

```
nano bluez-monitor.conf
```

nano

```
micro bluez-monitor.conf
```

micro

_**Enable msbc-support:**_

Under _properties_ change this line

```
bluez5.msbc-support   = false
```

before

to the following:

```
bluez5.msbc-support   = true
```

after

_**Optional: Enable scx-xq-support**_

If you want you can enable the _scx-xq-support_ aswell. Change this line

```
bluez5.sbc-xq-support = false
```

to the following:

```
bluez5.sbc-xq-support = true
```

**Set Headset roles:**

Below this line

```
#bluez5.headset-roles = [ hsp_hs hsp_ag hfp_hf hfp_ag ]
```

insert the following

```
bluez5.headset-roles = [hsp_hs hsp_ag hfp_hf]
```

And reboot again...

**Now you should be able to connect your Headset and have crystal clear sound on your nice Linux PC.**
