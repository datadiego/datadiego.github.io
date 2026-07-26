---
title: "Glitch Art #3: Audio"
author: datadiego
draft: true
description: Generar glitches sonoros desde cualquier fuente
date: 2026-07-17
tags:
  - hacking
  - glitch
layout: layouts/post.njk
---

Hasta ahora hemos tratado imagen en todos los posts sobre `glitch art`. Hoy vamos a hablar de audio, y como podemos generar glitches rápidamente.

## Glitch como género

En música electrónica existe un género entero dedicado al `glitch`, muy de la mano del `noise` y la música experimental.

Artistas que pueden darnos una buena muestra sobre el género serían **Alva Noto** donde los samples rotos y los clicks son la base de la música:

{{< youtube 5DnaT6z0S8o >}}

**Ryoji Ikeda** y su uso constante del databending con datos externos:

{{< youtube cywFvcRR-QI >}}

O **Autechre** en temas como `Gantz Graf`:

{{< youtube ev3vENli7wQ >}}

Pero podemos encontrar estas técnicas en muchísimos otros géneros, como el `breakcore`, donde el procesado y velocidad de los temas dejan irreconocibles *breakbeats* clásicos del jungle, el `noise` donde se pierde por completo cualquier muestra de ritmo y se centra solo en el sonido bruto, o `bass music y dubstep` moderno en el que el diseño de sonido permiten este tipo de sonidos abrasivos.

## Generar glitches sonoros

Hay **demasiados** métodos para tratarlos todos en un mismo post. El procesamiento de audio y los vst y plugins disponibles para convertir un sonido en otro son tantos, que es imposible cubrir todo.

Aqui hablaremos sobre todo de como hacer `databending` para convertir datos cualquiera en audio.

Ya hemos hablado de [Audacity](https://www.audacityteam.org/) y lo hemos usado para [procesar imagenes]() como si fueran audio.

En todo momento hemos tenido un boton de play con el que podemos *escuchar* nuestra imagen una vez la importamos al editor. Sin embargo, las imágenes no son una fuente demasiado interesante, suelen incluir demasiado *ruido blanco* y no es demasiado interesante.

Hablaremos de como utilizar Audacity, pero explicaremos conceptos básicos de audio que necesitaremos entender con otro software, **sox (Sound Exchange)**.

## sox

El desarrollador de [sox](https://github.com/rbouqueau/SoX) describe el programa como la *navaja suiza del procesamiento de sonidos*.

Su utilidad es convertir audio, cambiar su *bitrate*, *profundidad de bits*, recortarlos... es algo similar a `ffmpeg` para audio en lugar de video.

Por desgracia, este programa solo está disponible para sistemas *Unix*, necesitarás *Mac* o *Linux* para utilizarlo, pero muchas de las opciones que trataremos con el **también se aplican a audacity**, sox simplemente nos dejará probarlas de una manera mucho más rápida.

>Si no tienes Mac, montar una máquina virtual con Linux no te llevará mucho tiempo, y tendrás mucho más software experimental de audio que te puede interesar :)

### Antes de empezar

Por lo que más quieras, baja el volumen antes de reproducir cualquier glitch, es común que se produzcan picos altos de volumen que pueden producir daño a tu equipo, e incluso a tus oidos.

Tanto `sox` como `audacity` tienen controles de volumen y compresores que evitarán esto.

Recopila bastantes fuentes distintas de datos:

```
/tmp/glitch ❯ ls
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 18 Jul 10:43   sqlite_dbs
.rwxr-xr-x   14M datadiego 18 Jul 10:21  󰡯 audacity
.rw-r--r--  289M datadiego 18 Jul 10:30   CorePlus-current.iso
.rw-r--r--   12M datadiego 18 Jul 10:29   dune-trailer.webm
.rw-r--r--  145M datadiego 18 Jul 10:41   hobbyconsolas.pdf
```

Aqui tengo:

- [Estas bases de datos](https://github.com/davidjamesknight/SQLite_databases_for_learning_data_science.git) en SQLite
- El binario ejecutable del programa `Audacity`
- La `.iso` de [TinyCore](http://www.tinycorelinux.net/downloads.html)
- El trailer de [Dune](https://www.youtube.com/watch?v=mSY_NbSmaUI)
- Un pdf del primer numero de [hobby consolas](https://ia801403.us.archive.org/34/items/hobby-consolas-ganadores-concurso-mangas-videojuegos/Hobby%20Consolas%20001.pdf) escaneado.

### Datos a audio

Podemos convertir cualquier archivo y datos a audio con:

```bash
sox -t raw -r 8000 -e unsigned-integer -b 8 <tu_archivo> -d gain -30
```

Cada una de las `flags` que podemos pasar a `sox` es un parámetro que también usaremos en `Audacity`, vamos a comentarlos:

#### Tipo de archivo

Con `-t raw` indicamos que vamos a importar archivos en bruto y que debe ignorar el `header` para detectar que tipo de formato usa.

En audacity es el equivalente a `File > Import > Raw Data`

#### Bitrate

La opción de `-r` o `--bitrate` es el *sample rate* del audio, o cuantas *muestras por segundo* se utilizan por muestra, a más `rate`, más `rápido` y `corto` es el resultado final.

En audacity, al importar nuestro archivo podemos modificar este valor.

#### Bytes

La opción `-b` o o `--bytes` define cuantos *bytes por muestra* se usan.

En audacity los bytes se indican según el encoding elegido.

#### Encoding

Que algoritmo usamos para interpretar los datos, esto modifica **mucho** el resultado final, en `sox` podemos usar:

- signed-integer
- unsigned-integer
- floating-point
- ms-adpcm
- ima-adpcm
- oki-adpcm
- gsm-full-rate
- u-law
- mu-law
- a-law

En la pantalla de importación de Audacity hay varios más.

#### Gain

Esto es para evitar volumenes excesivos, podriamos usar un compresor o un controlador de volumen.
