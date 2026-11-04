---
title: "Fix operation not permitted error in LXC"
description: "Sometimes it can happen that you get a \"Operation not permitted error\" when\\nchanging uids in LXC.\\n\\nQuick fix for that:\\n\\n * Change LXC to privileged\\n * C"
translationKey: "fix-operation-not-permitted-error-in-lxc"
language: "en-US"
date: 2023-01-19
---

Sometimes it can happen that you get a \"Operation not permitted error\" when changing uids in LXC.

Quick fix for that:

- Change LXC to privileged
- Change permissions with chmod
- Change LXC to unprivileged again
