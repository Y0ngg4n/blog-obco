---
title: "Kubernetes: Remove stuck namespace in Terminating state"
description: "Original Source: \\nhttps://bobcares.com/blog/remove-kubernetes-namespace-stuck-in-terminating/\\n\\nTo fix that you have to get the schema of the namespace as jso"
translationKey: "kubernetes-remove-hanging"
language: "en-US"
date: 2022-09-03
---

Original Source: [https://bobcares.com/blog/remove-kubernetes-namespace-stuck-in-terminating/]("https://bobcares.com/blog/remove-kubernetes-namespace-stuck-in-terminating/")

To fix that you have to get the schema of the namespace as json File:

`kubectl get ns <NAMESPACE_NAME> -o json > namespace.json`

\\n

This command created a namespace.json file in your current directory.

Edit it with your favorite Text editor and search for this occurency:

```json
"spec": {\n        "finalizers": [\n            "kubernetes"\n        ]\n},\n
```

\\n

Now just remove the \\"kubernetes\\" line from the file.

Now it looks like this:

```json
"spec": {\n        "finalizers": [\n          \n        ]\n},\n
```

\\n

Save the file and exit your editor.

Now execute this command:

`kubectl replace --raw "/api/v1/namespaces/<NAMESPACE_NAME>/finalize" -f namespace.json`

\\n

Now your namespace got terminated and you are ready to move forward.

Have a nice day :)

\`
