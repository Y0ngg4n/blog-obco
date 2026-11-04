---
title: 'Fix Wordpress Redis Docker/Kubernetes: "ERR unknown command ''FLUSHDB''"'
description: "If you use for example redis bitnami helm chart with Replication, FLUSHDB is not possible. To fix this you can make follow this guide.\\n\\nAdjust your wp-config."
translationKey: "fix-wordpress-redis-docker-kubernetes-err-unknown-command-flushdb"
language: "en-US"
date: 2025-09-06
---

If you use for example redis bitnami helm chart with Replication, FLUSHDB is not possible. To fix this you can make follow this guide.

Adjust your wp-config.php in this style:

```php
define('WP_REDIS_CLIENT', 'phpredis'); define('WP_REDIS_HOST', 'redis'); define('WP_REDIS_PORT', 6379); define('WP_REDIS_PASSWORD', getenv_docker('REDIS_PASSWORD', 'not_defined')); define('WP_REDIS_PREFIX', 'wordpress:');
```

\

And then enter the cli-container and execute

```bash
wp config set WP_CACHE true --raw --allow-root wp eval "copy(WP_CONTENT_DIR . '/plugins/redis-cache/includes/object-cache.php', WP_CONTENT_DIR . '/object-cache.php');" --allow-root wp redis status --allow-root
```

\
