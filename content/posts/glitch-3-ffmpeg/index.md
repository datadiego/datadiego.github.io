---
title: "Glitch Art #3: Video con ffmpeg"
author: datadiego
draft: false
description: Manipulación de archivos en bruto con ffmpeg
date: 2026-07-09
tags:
  - glitch
  - multimedia
layout: layouts/post.njk
---

Seguimos con las publicaciones sobre Glitch Art.

En esta ocasión vamos a crear **video**, cómo hemos estado haciendo hasta ahora, vamos a usar *databending* para reinterpretar datos y convertirlos a video.

Es un post corto, la base es bastante fácil, pero puedes extenderla mucho con varias flags de `ffmpeg` y experimentación de los datos de entrada que uses.

## Software

No necesitamos *mucho*, porque [ffmpeg](https://www.ffmpeg.org/) es una navaja suiza para manipulación de vídeo. Te permite hacer prácticamente cualquier tipo de edición de video con la terminal y automatizas tareas.

En nuestro caso, simplemente vamos a decirle que genere video a partir de datos binarios.

## Generando video a partir de datos binarios

Nuestro comando es bastante sencillo:

```bash
ffmpeg -f rawvideo -pixel_format rgb24 -video_size 320x240 -framerate 30 -i "$1" salida.mp4
```

La clave aqui es `-f rawvideo`, que nos permite interpretar cualquier dato que le pasemos

Puedes ver que valores puedes pasar a `-pixel_format` con `ffmpeg -pix_fmts` o `ffprobe -pix_fmts`.

`-video_size` es nuestro tamaño de salida, `-framerate` nuestros frames por segundo y finalmente `-i` nuestro archivo de entrada.

En mi caso, lo tengo en un `bash script` para poderlo ejecutar más cómodo, pasandole mi archivo binario en `$1`.

## Datos binarios ejecutables

Vamos a crear un binario con **todos** los archivos ejecutables que tenemos en `/usr/bin/`:

```bash
/tmp/glitch-ffmpeg ❯ sudo cat /usr/bin/* > binario
[sudo] password for datadiego:
cat: /usr/bin/core_perl: Is a directory
cat: /usr/bin/db5.3: Is a directory
cat: /usr/bin/javah: No such file or directory
cat: /usr/bin/orbd: No such file or directory
cat: /usr/bin/pack200: No such file or directory
cat: /usr/bin/rmic: No such file or directory
cat: /usr/bin/rmid: No such file or directory
cat: /usr/bin/schemagen: No such file or directory
cat: /usr/bin/servertool: No such file or directory
cat: /usr/bin/site_perl: Is a directory
cat: /usr/bin/tnameserv: No such file or directory
cat: /usr/bin/unpack200: No such file or directory
cat: /usr/bin/vendor_perl: Is a directory
cat: /usr/bin/wsgen: No such file or directory
cat: /usr/bin/wsimport: No such file or directory
cat: /usr/bin/xjc: No such file or directory

/tmp/glitch-ffmpeg ✗ wc binario
   6990796   47692342 2005118592 binario
```

Es un archivo bastante grande, ejecuto mi script sobre este:

```bash
tmp/glitch-ffmpeg ❯ ./rawvideo.sh binario
```

Y obtenemos el siguiente resultado:

{{< youtube tyctADz07zc >}}

Vamos a renderizarlo esta vez en *1080x720*:

{{< youtube DH8OCUw1_jM >}}

## Probando otros formatos de pixeles

Por ahora solo hemos usado `-pixel_format rgb24`, vamos a probar otros formatos para obtener diferentes resultados.

Con *yuv444p10msbbe*:

{{< youtube H14joYxSqJU >}}

Con *bayer_bggr16le*:

{{< youtube cJnaDH_896o >}}

Con *gbrp*:

{{< youtube 05YkWBDc7Vs >}}

## Mas allá

En el post anterior vimos como **diferentes datos** producian diferentes resultados, la base para generar video a partir de datros en brutos ya la tienes, solo te queda experimentar con otras fuentes de datos que interpretar.

`ffmpeg` ofrece **muchas** más flags con las que experimentar, quizá en un post futuro exploremos otros resultados, pero con esto tienes suficiente para comenzar a crear.
