---
title: "Fix Shutdown/Reboot Issues with Framework 16 Laptop"
description: "I had issues with my Framework 16 Laptop that it wont power of.\\n\\nI tried the following:\\n\\nreboot now\\nshutdown now\\nsystemctl reboot\\nsystemctl shutdown\\n\\n\\"
translationKey: "fix-shutdown-reboot-issues-with-framework-16"
language: "en-US"
date: 2024-05-28
---

I had issues with my Framework 16 Laptop that it wont power of.

I tried the following:

```shell
reboot now\nshutdown now\nsystemctl reboot\nsystemctl shutdown\n
```

\\n

And i also tried pressing the power button.

Thanks to this forum post: [https://community.frame.work/t/solved-cannot-shutdown-sleep-and-restart-on-arch-linux/33211]("https://community.frame.work/t/solved-cannot-shutdown-sleep-and-restart-on-arch-linux/33211")

I was on Linux Kernel 6.1 and i could fix the issue by switching to Linux zen Kernel. Don´t know if it is specific to Kernel 6.1 but after switching the Kernel it worked flawlessly for me.

Have fun with you Framework Laptop!
