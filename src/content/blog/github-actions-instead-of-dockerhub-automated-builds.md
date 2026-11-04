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
git add .\ngit commit -m "Add Dockerfile"\n
```

\\n

Head over to Dockerhub and open your _Account Settings._

Go to Security and create a new _Access Token._ But Attention! On free Plan you can only create one Access Token so make sure to save this for future projects.

Head over to Github and open your Repository.

Go to -> Setting -> Secrets

![]("https://blog.obco.pro/content/images/2021/07/image.png")

Secrets Managment

And add following Secrets:

> \\n
>
> Name: `DOCKER_HUB_USERNAME`  
> \\nContent: Your Dockerhub username
>
> \\n

\\n

> \\n
>
> Name: `DOCKER_HUB_ACCESS_TOKEN`  
> \\nContent: The previosly generated _Access Token_
>
> \\n

\\n

Now go back to your Repository and create at your project root following folder structure:

\\n- .github\\n
\\n- workflows\\n
\\n- dockerhub.yaml
\\n\\n
\\n\\n
\\n

\\n

![]("https://blog.obco.pro/content/images/2021/07/image-1.png")

Example Structure

And in the dockerhub.yaml add following:

```yaml
# Name of the Workflow\nname: Push to Dockerhub\n# Only push for commits on master branch\n# Remove this if you want to publish on every branch\non:\n  push:\n    branches: [ master ]\njobs:\n push-to-dockerhub:\n    # You can change this if you want to build on an other image\n    runs-on: ubuntu-latest\n    steps:\n      - name: Login to DockerHub\n        uses: docker/login-action@v1\n        with:\n          username: ${{ secrets.DOCKER_HUB_USERNAME }}\n          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}\n      - uses: actions/checkout@v2\n      - name: Build and push\n        id: docker_build\n        uses: docker/build-push-action@v2\n        with:\n          context: ./\n        # Change filename here if Dockerfile is other than Dockerfile\n          file: ./Dockerfile\n          push: true\n        # Change this to the Dockerhub repo you want to push your image to\n          tags: username/repo:latest\n        # Can be removed if digest not needed\n      - name: Image digest\n        run: echo ${{ steps.docker_build.outputs.digest }}\n
```

\\n

Now commit everything:

```bash
git add .\ngit commit -m "Add Push to Dockerhub workflow"\n
```

\\n

Head over to your Github Repo and go to _Actions_ Tab.

Here you will see now a new Action that was created and is building now. If everything worked correctly you should be now able to head over to Dockerhub and check if your docker image was pushed correctly.
