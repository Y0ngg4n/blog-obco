---
title: "Fix NeoBackup denied access to usage data on LineageOS"
description: "So i flashed LineageOS on my smartphone and wanted to restore my previous backup with NeoBackup. But there was one problem. I could not grant access to usage da"
translationKey: "fix-neobackup-denied-access-to-usage-data-on-lineageos-2"
language: "en-US"
date: 2024-12-14
---

So i flashed LineageOS on my smartphone and wanted to restore my previous backup with NeoBackup. But there was one problem. I could not grant access to usage data for NeoBackup, that is needed to restore the backup.

As my smartphone was already rooted i could use this command via **adb** to give access:

```
adb shell\nsu\npm grant com.machiav3lli.backup android.permission.PACKAGE_USAGE_STATS\n
```

\\n

That fixed the problem for me.
