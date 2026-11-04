---
title: "Fix NFS Client Freeze"
description: "Sometimes if you mount a NFS Share it is possible that your client freezes if\\nyou cd into the directory. I have searched long for an answer how to fix that\\nPr"
translationKey: "nfs-sync-fix"
language: "en-US"
date: 2022-09-03
---

Sometimes if you mount a NFS Share it is possible that your client freezes if you cd into the directory. I have searched long for an answer how to fix that Problem until i found this entry at the Arch Linux Wiki:

> \
>
> Intermittent client freezes when copying large files  
> \ If you copy large files from your client machine to the NFS server, the transfer speed is very fast, but after some seconds the speed drops and your client machine intermittently locks up completely for some time until the transfer is finished.  
> \ Try adding sync as a mount option on the client (e.g. in /etc/fstab) to fix this problem.
>
> \

\

As stated in the docs this can be easily be fixed by adding the sync mount option to your fstab file.

\

Edit the fstab file:  
\ `nano /etc/fstab`  
\ Your fstab entry should look like this:  
\ `<SERVER>:<SHARE> <MOUNTPOINT> nfs defaults,_netdev,sync 0 0`

\

Now it should be fixed.

Have a nice day :)
