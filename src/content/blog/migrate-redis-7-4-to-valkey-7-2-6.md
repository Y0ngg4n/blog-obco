---
title: "Migrate Redis >7.4 to Valkey >7.2.6"
description: "I wanted to migrate my redis containers to valkey as redis is a evil company. Valkey has no official migration guide but i have found this comment on a github i"
translationKey: "migrate-redis-7-4-to-valkey-7-2-6"
language: "en-US"
date: 2025-09-18
---

I wanted to migrate my redis containers to valkey as redis is a evil company. Valkey has no official migration guide but i have found [this comment]("https://github.com/valkey-io/valkey/issues/845#issuecomment-2308270054") on a github issue.

There it mentions [librdb]("https://github.com/redis/librdb").

So what do to do? Follow this steps:

## Build librbd\'s tool rbd-cli

\

```bash
git clone https://github.com/redis/librdb.git cd librbd make PREFIX=$PWD/build
```

\

## Make a dumb

\

Inside your redis container execute this command:

\

```bash
redis-cli -a "$REDIS_PASSWORD" BGSAVE
```

\

Then check with redis-cli -a \"$REDIS\_PASSWORD\" INFO persistence that the variable `rdb_bgsave_in_progress` is `0`.

\

Copy the dump file in the same folder where you have cloned rbd-cli.

\

then execute

\

```bash
 ./bin/rdb-cli dump.rdb redis -h "$REDIS_HOST" -p 6379
```

\

i have tested it with redis 7.4.1 and valkey 8.1.3
