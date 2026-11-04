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
---\nversion: "2.1"\nservices:\n\n  gateway:\n    ...\n    cap_add:\n      - NET_ADMIN\n    devices:\n      - /dev/net/tun:/dev/net/tun\n    ports:\n      - 1001:1001 # container a\n      - 2001:2001 # container b\n\n\n  a:\n    ...\n    network_mode: service:gateway\n\n  b:\n    network_mode: service:gluetun\n
```

\\n

Now you want to _curl_ container **b** from container **a** for example.

You can easily access container b with a curl by using **localhost.**

Example:

```
curl http://localhost:2001/api\n
```

\\n

I know this sounds absurd. But it works.
