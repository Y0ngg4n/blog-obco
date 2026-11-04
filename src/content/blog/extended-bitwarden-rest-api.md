---
title: "Extended Bitwarden REST API"
description: "Bitwarden [https://bitwarden.com] is a great Password Vault. It has nice\\nFeatures, a good structured Passw0rd access and integrations for almost every\\ndevice "
translationKey: "extended-bitwarden-rest-api"
language: "en-US"
date: 2021-04-06
heroImage: "/images/ghost/2021/04/social-banner.png"
---

[Bitwarden]("https://bitwarden.com") is a great Password Vault. It has nice Features, a good structured Passw0rd access and integrations for almost every device or browser. It also has the abilities to share Passwords with e.g. your family or by the new feature _[Bitwarden Send]("https://bitwarden.com/products/send/"), like a paste of code._

For Developers Bitwarden provides a public [API]("https://bitwarden.com/help/article/public-api/") that can be used to fetch metadata of your vault. But it does not let you fetch password entries or secure notes, neither adding things to your vault. For the most cases this is totally fine. Its also good that you can only fetch metadata because it adds an extra layer of security. You don´t transfer sensitive data accross the internet.

But for my usecase this was not enough. We needed the access to all data in the vault, but not only fetch it, also the creation und editing of items was important.

So i created the [Extended Bitwarden REST API]("https://github.com/Y0ngg4n/Extended-Bitwarden-REST-API"). A extension for the allready existing Bitwarden REST API allready mentioned. It uses the [Bitwarden CLI]("https://bitwarden.com/help/article/cli/") and [Docker]("https://www.docker.com"), managed by a [Node.js Express]("https://expressjs.com") REST API. To provide sessions for multiple users, it encapsulates a Bitwarden CLI in a Docker container for each user. In this docker container the user can then login and fetch, create or edit his own vault. On each restart all old Docker container get removed and cleaned up.

To explain this principle better i created this diagram:

![]("https://blog.obco.pro/content/images/2021/04/Untitled-Diagram.png")

Diagram

You can also use you custom or self-hosted Bitwarden instance with the REST API.

The different requests are partially listed in the swagger documentation.

If you have any questions, you can contact me on discord, matrix or write an issue at the github project.

Github Project: [https://github.com/Y0ngg4n/Extended-Bitwarden-REST-API]("https://github.com/Y0ngg4n/Extended-Bitwarden-REST-API")

Discord: Yonggan#8420
