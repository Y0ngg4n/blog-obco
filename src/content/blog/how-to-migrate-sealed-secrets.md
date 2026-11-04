---
title: "How to migrate Sealed Secrets from a k8s cluster to another"
description: "This is a short blog post about, how to migrate sealed secrets when using Flux to another cluster."
translationKey: "how-to-migrate-sealed-secrets"
language: "en-US"
date: 2023-06-24
---

I have created [sealed secrets with Flux]("https://fluxcd.io/flux/guides/sealed-secrets/"). And i wanted to migrate them to a new cluster. The process is quite simple if you know how. **You need access to the old cluster!**

On your old cluster:

```bash
kubectl get secret -n flux-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > keys.secret\n
```

\\n

On your new cluster:

```
kubectl apply -f keys.secret\n
```

\\n

Save this file somewhere save! If you loose it you will not be able to decrypt the secrets again. Also it seems like you have to make this backup regularly as it seems like sealed secrets are adding things to this secrets sometimes.
