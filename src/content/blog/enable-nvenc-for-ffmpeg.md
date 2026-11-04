---
title: "Enable NVENC for FFMPEG"
description: "Based on this Article: \\nhttps://www.cyberciti.biz/faq/how-to-install-ffmpeg-with-nvidia-gpu-acceleration-on-linux/\\n\\nTo enable NVENC to use the h264_nvenc enc"
translationKey: "enable-nvenc-for-ffmpeg"
language: "en-US"
date: 2022-09-07
---

Based on this Article: [https://www.cyberciti.biz/faq/how-to-install-ffmpeg-with-nvidia-gpu-acceleration-on-linux/]("https://www.cyberciti.biz/faq/how-to-install-ffmpeg-with-nvidia-gpu-acceleration-on-linux/")

To enable NVENC to use the h264\_nvenc encoder for example you have to compile ffmpeg yourself.

Requirements: You have installed the standard Nvidia drivers.

Use nvidia-detect to find the right driver for you.

If you want cuda support aswell install the `nvidia-cuda-toolkit`

Create a compilation directory:

```bash
mkdir ~/nvidia/ && cd ~/nvidia/\ngit clone https://git.videolan.org/git/ffmpeg/nv-codec-headers.git\n
```

\\n

Compile the missing headers (ffnvcodec):

```bash
cd nv-codec-headers && sudo make install\n
```

\\n

Download FFMPEG Source Code:

```bash
cd ~/nvidia/\ngit clone https://git.ffmpeg.org/ffmpeg.git ffmpeg/`\n
```

\\n

Install the compilation tools:

```bash
sudo apt install build-essential yasm cmake libtool libc6 libc6-dev unzip wget libnuma1 libnuma-dev`\n
```

\\n

Configure FFMPEG to compile with nvenc and cuda enabled. (You can remove the cuda flags if you only need nvenc):

```bash
PKG_CONFIG_PATH="~/nvidia/nv-codec-headers" ./configure --enable-nonfree --enable-cuda-nvcc --enable-cuda-llvm --enable-nvenc --enable-libnpp --extra-cflags=-I/usr/local/cuda/include --extra-ldflags=-L/usr/local/cuda/lib64 \n
```

\\n

Compile FFMPEG:

```
make -j $(nproc)\n
```

\\n

Now there should be a executeable created:

```
ls -l ffmpels -l ffmpe`g\n./ffmpeg\n
```

\\n

If you want you can install this executable:

```bash
make install\n
```

\\n

Now you can use cuda hardware acceleration and the nvenc codec

Update:

Or just grab the latest release from Jellyfin ffmpeg:

[

Releases · jellyfin/jellyfin-ffmpeg

FFmpeg for Jellyfin. Contribute to jellyfin/jellyfin-ffmpeg development by creating an account on GitHub.

![\\"\\"]("https://github.com/fluidicon.png")GitHubjellyfin

![\\"\\"]("https://opengraph.githubassets.com/14b7cf8ef320a9a7924d3116811d1d4a1514843aa267b441359f19f308a49151/jellyfin/jellyfin-ffmpeg")

](\"https://github.com/jellyfin/jellyfin-ffmpeg/releases\")
