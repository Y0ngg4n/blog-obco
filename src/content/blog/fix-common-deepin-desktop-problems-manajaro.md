---
title: "Fix common Deepin Desktop Problems on Manjaro"
description: "This Fixes maybe also help on other Distributions, but are tested on Manjaro.\\n\\nBlack Background on Launcher and Logout Screen when using Custom Wallpaper\\nIf"
translationKey: "fix-common-deepin-desktop-problems-manajaro"
language: "en-US"
date: 2020-04-25
heroImage: "/images/ghost/2020/09/pc_banner_en_desk.jpg"
---

This Fixes maybe also help on other Distributions, but are tested on Manjaro.

## Black Background on Launcher and Logout Screen when using Custom Wallpaper

If you have this Problem, you have probably set a custom Wallpaper. According to this Manjaro Forum Post: [Deepin Custom Wallpaper results in Black Screen]("https://forum.manjaro.org/t/manjaro-deepin-custom-wallpaper-results-in-black-screen-on-launcher-and-logout-screen-solved/44883")

Props out to [**ChickenParmesan**]("https://forum.manjaro.org/u/ChickenParmesan")

To fix this problem follow this steps:

- Start two File Managers as root
- Navigate first File Manager to /usr/share/wallpapers/deepin
- Copy the preferred Wallpaper to your home directory by console (try to  avoid using Deepin File Manager, because Deepin File Manager maybe recognice it as new background image and will add it again)
- Navigate to your home directory
- Execute following command:

```
convert [image name] -filter Gaussian -blur 0x16 [image name]
```

\

Now the Image should be blurry.

- Navigate second File Manager to /var/cache/image-blur
- Search in /var/cache/image-blur for black or blank images
- Override black or blank image with your blurried image in home directory, but be aware to keep the File name of the black or blank image!
- Reboot

You should have now fixed the Problem. If not select your Wallpaper from Deepin Wallpaper selection again and reboot again.

## Multi Monitor Setup resetting on reboot

You may have tried to setup your Monitors by Deepin Custom Settings at Display section or by xorg.conf/xorg.conf.d Settings file. If you have the Problem that your xorg configuration is reset on reboot, you maybe checked your xorg settings and wondered about, because they are correct. So you maybe try using Nvidia Server Settings but this Menu also just writes a xorg config file.

So you may have recognized that the Deepin Display Manager seems to be loaded after the xorg config and scrumbles everything up. So you try to Fix this in the GUI by Deepin Custom Manager. But this Manager is not very precise.

There is a solution for this Problem. To fix this Problem follow this steps:

- Check that  your xorg.conf or xorg.conf.d at /etc/X11 are correct
- Open a terminal and login as your user (not root, because Deepin saves the config user specific)
- Navigate to /home/\[USERNAME\]/.config/deepin/startdde/
- Edit display.json
- Format it with a json formatter
- Change the values of each Display accordingly to your xorg config.
- Reboot

If the config is not loaded at boot, just use the Deepin Display Manager, don\'t change anything and just hit save. Recheck your display.json, that everything is correct.

If you changed your Monitor Setup, like unplugged a monitor, and want your settings back, use Deepin Display Manager. Open it, don\'t change anything and hit save. Your config should reset to your cofiguration in display.json.

## Can´t enable Window Effects in Settings

If you are in Settings and you can´t enable the Window Effects so you can switch the windows with ease and switch your virtual Desktop with this cool flow animations. There is this Slider Window Effects in the Settings, but you cant enable it? No Problem. Follow this Guide:

- Navigate to your home directory (/home/\[USERNAME\]/)
- Navigate to hidden folder .config/ in your home directory
- Edit the .kwinrc File
- Change this line:

```
OpenGLIsUnsafe=true
```

\

to this:

```
OpenGLIsUnsafe=false
```

\

- Reboot

You should now be able to activate the Window Effects.
