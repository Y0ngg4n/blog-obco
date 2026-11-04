---
title: "Recursive bind mount ZFS Datasets to LXC container"
description: "I had a problem. My Proxmox snapshots did not work with normal mountpoint has a option to disable backups. But it seems like it does cause the LXC container to"
translationKey: "bind-mount-zfs-datasets-to-lxc-container"
language: "en-US"
date: 2023-03-09
---

I had a problem. My Proxmox snapshots did not work with normal mountpoint has a option to disable backups. But it seems like it does cause the LXC container to suspend, backup and resume.

You can read about the problem here: [https://forum.proxmox.com/threads/why-do-bind-mounts-prevent-snapshots.85495/]("https://forum.proxmox.com/threads/why-do-bind-mounts-prevent-snapshots.85495/")

So your usual bind mount looks like this:

```
mp0: /mnt/tank,mp=/mnt/tank,backup=0
```

\

but you have to add every dataset of your ZFS pool as extra bind mount... like this:

```
mp0: /mnt/tank/data1,mp=/mnt/tank/data1,backup=0 mp1: /mnt/tank/data2,mp=/mnt/tank/data2,backup=0 mp2: /mnt/tank/data3,mp=/mnt/tank/data3,backup=0 mp3: /mnt/tank/data4,mp=/mnt/tank/data4,backup=0
```

\

Very annoying!

But there is a solution to all this problems.

change mountpoints to lxc.mount.entry

Example:

```
lxc.mount.entry: /mnt/tank mnt/tank none bind,create=dir 0 0
```

\

> \
>
> Attention! in the second mount path you have to remove the first slash!  
> \ So it is totally correct to mount `mnt/tank` here and not `/mnt/tank`
>
> \

\

Ok so first problem solved. But how to solve the issue with the recursive datasets? Because now you will experience that you can not mount single datasets. It will always just mount the pool itself.

So how to solve this? Pretty easy! Just change _bind_ to _rbind_

```
lxc.mount.entry: /mnt/tank mnt/tank none rbind,create=dir 0 0
```

\

Now it will recursively mount every datasets below.
