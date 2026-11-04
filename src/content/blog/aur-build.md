---
title: "AUR automated Build System Pipeline with Drone CI"
description: "AUR is cool. It is very cool. Almost any user can upload packages to it and if\\nthey gain popularity they can also be moved to the official repositories. But\\nt"
translationKey: "aur-build"
language: "en-US"
date: 2021-04-07
heroImage: "/images/ghost/2021/04/archlogo-1.png"
---

AUR is cool. It is very cool. Almost any user can upload packages to it and if they gain popularity they can also be moved to the official repositories. But there are several problems with AUR.

If you want to integrate AUR Packages into your custom [archiso]("https://wiki.archlinux.org/index.php/archiso") build you have to host a repository for them yourself. But hosting them yourself has the problem that you may miss out updates of the packages and your self-hosted repository will be outdated very soon if you don´t update it manually by hand.

There are several approaches to solve the problem of automated builds for AUR Packages. A list of emamples:

- [https://github.com/Chizi123/arch-autobuild-repo]("https://github.com/Chizi123/arch-autobuild-repo")
- [https://git.joelg.net/joeleg/Arch-autobuild-repo/src/commit/c2997f94adf992b56cd41eaf41ca32dcd050bd53]("https://git.joelg.net/joeleg/Arch-autobuild-repo/src/commit/c2997f94adf992b56cd41eaf41ca32dcd050bd53")

But it was not that i was searching for. I wanted something automated. Something that i can schedule every week or every day, to push the newest images to my repository.

I already used [Drone CI]("https://www.drone.io/") so i sticked with it and built a pipeline generator for it. It\'s a bash script that can be used to generate the .drone.yml. But lets start first with the things you will need to build this pipeline yourself:

- A installed [Sonatype Nexus Repository]("https://www.sonatype.com/products/repository-oss?topnav=true")
- A working Drone CI instance
- A Git Server or Gitlab Repository (Github is not recommended because of the file upload limitations)

---

1.  Fork the [Github Repository]("https://github.com/Y0ngg4n/AUR-autobuild-drone-ci.git")
2.  Connect Drone CI with your Git Repository and activate it
3.  Clone your Repository
4.  Remove ananicy package from the repository (it is just a example package)
5.  Add the packages you want

```
git submodule add https://aur.archlinux.org/timeshift.git timeshift
```

\

6\. Register the Packages you want in the _packages.txt_. You can add commands that should be executed first, before building the package with an ^. So for example if you want to install nano before installing timeshift register the package like this in the _packages.txt_ (every package in a single line).

```
timeshift^pacman -Sy --noconfirm nano
```

\

7\. Change the variables in the _buildDrone.sh_. For example the volumepath describes where the shared volume for all pipeline steps is mounted. This is important because this i later the name you add into your _pamac.conf_. Also change the _apiurl_ to the API URL of your Nexus Instance.

8\. Change _buildjob.txt_ to your needs. So for example change the environemt variables to your Nexus instance and change the mountpoint in the commands to your repo name.

9\. run _buildDrone.sh_ and push the changes to your repository.

10\. Change timeout of the Drone Repository, because it may take longer than 60 minutes to build your packages.

11\. Add anonymous role in your Nexus Repository so your raw Nexus Repository can be read by anybody.

The pipeline should build your packages and pushs the packages to your Nexus Raw Repository.
