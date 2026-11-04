---
title: "Github Actions instead of Dockerhub automated builds"
description: "As you may heared Dockerhub has cancelled automated builds for free Accounts.\\nThey described the reasons in this Blog Post\\n[https://www.docker.com/blog/change"
translationKey: "github-actions-instead-of-dockerhub-automated-builds"
language: "en-US"
date: 2021-07-29
heroImage: "/images/ghost/2021/07/actions-workflow.svg"
---

As you may heared Dockerhub has cancelled automated builds for free Accounts. They described the reasons in [this Blog Post]("https://www.docker.com/blog/changes-to-docker-hub-autobuilds/"):

Mostly they had problems with People abusing their automated build system for mining cryptocurrencies.

I loved the automated builds, because they made it very easy to deploy applications fast. But now i have to use something else because i don´t use the Dockerhub Premium Functions as much as it would be worth it.

So what are the alternatives? This is a short list of alternatives you have:

- **Build with Github Actions and push to Dockerhub**
- Use your own CI and push to Dockerhub
- Use CI and push it to your own Repository Managment System
- ...

And as the title allready uncovered whe will cover the first point today. So how to set this up?

- First, of cause, create a Repository on Github
- Push your Code to this Repository

Now create a Dockerfile in your Repository. You can use the [Dockerfile Reference]("https://docs.docker.com/engine/reference/builder/") to build your Dockerfile.

Add it to your Repository:

```bash
git add . git commit -m "Add Dockerfile"
```

\

Head over to Dockerhub and open your _Account Settings._

Go to Security and create a new _Access Token._ But Attention! On free Plan you can only create one Access Token so make sure to save this for future projects.

Head over to Github and open your Repository.

Go to -> Setting -> Secrets

![]("https://blog.obco.pro/content/images/2021/07/image.png")

Secrets Managment

And add following Secrets:

> \
>
> Name: `DOCKER_HUB_USERNAME`  
> \ Content: Your Dockerhub username
>
> \

\

> \
>
> Name: `DOCKER_HUB_ACCESS_TOKEN`  
> \ Content: The previosly generated _Access Token_
>
> \

\

Now go back to your Repository and create at your project root following folder structure:

\ - .github\
\ - workflows\
\ - dockerhub.yaml
\ \
\ \
\

\

![]("https://blog.obco.pro/content/images/2021/07/image-1.png")

Example Structure

And in the dockerhub.yaml add following:

```yaml
# Name of the Workflow name: Push to Dockerhub # Only push for commits on master branch # Remove this if you want to publish on every branch on:   push:     branches: [ master ] jobs:  push-to-dockerhub:     # You can change this if you want to build on an other image     runs-on: ubuntu-latest     steps:       - name: Login to DockerHub         uses: docker/login-action@v1         with:           username: ${{ secrets.DOCKER_HUB_USERNAME }}           password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}       - uses: actions/checkout@v2       - name: Build and push         id: docker_build         uses: docker/build-push-action@v2         with:           context: ./         # Change filename here if Dockerfile is other than Dockerfile           file: ./Dockerfile           push: true         # Change this to the Dockerhub repo you want to push your image to           tags: username/repo:latest         # Can be removed if digest not needed       - name: Image digest         run: echo ${{ steps.docker_build.outputs.digest }}
```

\

Now commit everything:

```bash
git add . git commit -m "Add Push to Dockerhub workflow"
```

\

Head over to your Github Repo and go to _Actions_ Tab.

Here you will see now a new Action that was created and is building now. If everything worked correctly you should be now able to head over to Dockerhub and check if your docker image was pushed correctly.
