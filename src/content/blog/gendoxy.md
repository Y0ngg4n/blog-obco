---
title: "Automatically Generate Doxygen Documentation for all Repositories"
description: "If you code, you often need to understand code written by others. \\nUnderstanding Code can be more easy if you have some Documentation. \\nBut you really don't"
translationKey: "gendoxy"
language: "en-US"
date: 2020-01-23
heroImage: "/images/ghost/2020/09/doxygen.png"
---

If you code, you often need to understand code written by others.  
Understanding Code can be more easy if you have some Documentation.  
But you really don\'t want to write some txt Files for Documenting your code.  
If you code in Java you may now Javadocs.

But what is with other Programming Languages?  
Often there is no official Documentation Tool. But there is a solution to generate Documentations for almost every Programming Language. It is called Doxygen.  
If you don\'t know it yet, check it out: [http://www.doxygen.nl]("http://www.doxygen.nl")

But if you work with Doxygen you will fast recognize Doxygen generates every time a new Documentation for every single Project.  
A solution is to take all your Projects in one main Project. But that´s not really clean. There are options to load custom Headers and other fancy stuff.  
But it was not the option I have searched for.

---

![]("https://blog.obco.pro/content/images/2020/09/GenDoxy.svg")

So I wrote a Generator call GenDoxy that connects to your VCS and generates Documentations for all Repositories. A Python Script is neat, but a self-updating Docker Container is neater. To customize the Documentation just edit the Dockerfile and build the image your-self.

So ok, now I have 500 different Documentation Folders with their own Website. Thats not really a Documentation System Right?    
So why don\'t have some small PHP Pages that lead you to the Documentation Pages you want?  
Guess what, i wrote them.

The Installation of this Documentation Pipeline is super easy and can be done in round about 30 Minutes.

---

For the complete Setup you have 2 Steps to take:

- Docker Container Setup
- PHP Page Setup

**Feel free to fork, modify and create Pull-Requests.**

---

## Docker Container Setup

[

Y0ngg4n/GenDoxyDockerImage

The Files to Build the Docker Image for GenDoxy. Contribute to Y0ngg4n/GenDoxyDockerImage development by creating an account on GitHub.

![]("https://github.githubassets.com/favicon.ico")GitHubY0ngg4n

![]("https://avatars2.githubusercontent.com/u/30302975?s=400&v=4")

]("https://github.com/Y0ngg4n/GenDoxyDockerImage")

- Using prebuild Docker Image: Follow Instructions on GitHub

or

- Build the Image your own:

```bash
git clone https://github.com/Y0ngg4n/GenDoxyDockerImage.git cd GenDoxyDockerImage docker build . -t gendoxy
```

\

---

## PHP Page Setup

[

Y0ngg4n/GenDoxyWebsite

A lightweight Php Website to organize all Documentations - Y0ngg4n/GenDoxyWebsite

![]("https://github.githubassets.com/favicon.ico")GitHubY0ngg4n

![]("https://avatars2.githubusercontent.com/u/30302975?s=400&v=4")

]("https://github.com/Y0ngg4n/GenDoxyWebsite.git")

```bash
git clone https://github.com/Y0ngg4n/GenDoxyWebsite.git /var/www/gendoxy chown www-data:www-data /var/www/gendoxy -R
```

\

- Edit _/var/www/gendoxy/index.php_ file and change _docPath_ variable to the mount path of your Docker Container.
- Add PHP Configuration to your Webserver to serve the _/var/www/gendoxy_ directory. A sample tutorial for nginx configuration: [https://www.linode.com/docs/web-servers/nginx/serve-php-php-fpm-and-nginx/]("https://www.linode.com/docs/web-servers/nginx/serve-php-php-fpm-and-nginx/")

---

## Modification

[

Y0ngg4n/GenDoxyPython

The Python scripts for GenDoxy. Contribute to Y0ngg4n/GenDoxyPython development by creating an account on GitHub.

![]("https://github.githubassets.com/favicon.ico")GitHubY0ngg4n

![]("https://avatars2.githubusercontent.com/u/30302975?s=400&v=4")

]("https://github.com/Y0ngg4n/GenDoxyPython.git")

- To modify the Generator you can checkout the Repository and edit the Python Scripts to your wishes.  
  Then just edit the Docker Image and build your customized Image.  
  Don´t forget to publish your Python code to Github and edit _start.sh_ in Docker Image to your Repository URL.
- To Modify the style of the generated Documentation edit the _style.css_ file in the Docker Image.
- To Modify the style of the Gendoxy PHP Website just edit the _css/main.css_ file.
- To Modify how Doxygen generates the Documentation just edit the _Doxyfile_ file in the Docker Image.
