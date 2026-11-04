---
title: "Docker connect 2 containers with network_mode: service:..."
description: "Inspiration: \\nhttps://stackoverflow.com/questions/51305397/docker-compose-network-modeservice-2-containers-cant-talk-to-each-other\\n\\nIf you have 2 container t"
translationKey: "access"
language: "en-US"
date: 2022-09-07
---

Inspiration: [https://stackoverflow.com/questions/51305397/docker-compose-network-modeservice-2-containers-cant-talk-to-each-other]("https://stackoverflow.com/questions/51305397/docker-compose-network-modeservice-2-containers-cant-talk-to-each-other")

If you have 2 container that is using another container as network\_mode in docker this container gets the same IP as the service container. So for example you have this setup:

```yaml
--- version: "2.1" services:    gateway:     ...     cap_add:       - NET_ADMIN     devices:       - /dev/net/tun:/dev/net/tun     ports:       - 1001:1001 # container a       - 2001:2001 # container b     a:     ...     network_mode: service:gateway    b:     network_mode: service:gluetun
```

\

Now you want to _curl_ container **b** from container **a** for example.

You can easily access container b with a curl by using **localhost.**

Example:

```
curl http://localhost:2001/api
```

\

I know this sounds absurd. But it works.
