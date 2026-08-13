---
title: "Video en rpi"
author: datadiego
draft: false
description: Automatizando la reproducción de videos para instalaciones artisticas
date: 2026-08-11
tags:
  - guia
layout: layouts/post.njk
---

Hace poco estuve colaborando con un amigo que queria proyectar varios videos utilizando *Raspberry Pi 3B+*.

Aunque reproducir video es una tarea simple, cuando tenemos que automatizarlo vamos a tener algunas cosas a tener en cuenta. Identifiqué varios problemas de cómo originalmente estaba creado este sistema:

- Cada *rpi* usaba **Raspberry Pi OS** con entorno de escritorio, haciendo que gran parte de la memoria se perdiera simplemente en esto.
- Para la exposición, debía dejar unas instrucciones para arrancar cada una.
- Si algo sale mal, debía ir en persona y arreglarlo.

## Preparando la rpi

Lo primero era sustituir el sistema operativo por algo más ligero.

Elegí **Raspberry Pi OS Lite**, misma distribución que estaba usando, pero sin ningún escritorio, no podemos bajar mucho más el consumo que usando una **tty**.

Grabamos la distro en una SD usando `dd`:

```bash
xzcat ~/Downloads/2026-06-18-raspios-trixie-arm64-lite.img.xz | sudo dd of=/dev/sda bs=4M status=progress conv=fsync
```

usando este OS tenemos los siguientes resultados de consumo:

### Consumo CPU

```bash
datadiego@raspberrypi:~ $ cat /proc/loadavg
0.10 0.35 0.17 1/155 885
```

Los tres primeros valores de `/proc/loadavg` son la carga de la cpu hace *1 minuto, 5 minutos y 15 minutos*

```bash
0.10   0.35   0.17
│      │      └─ últimos 15 minutos
│      └──────── últimos 5 minutos
└────────────── últimos 1 minuto
```

El valor se mide entre 0.0 y 1.0, un valor de 1.0 indica que hay un nucleo completo ocupado.

El valor `1/155` dice que hay un proceso activo que afecta al load average.

El valor `885` es el PID del ultimo proceso lanzado.

### RAM

```bash
datadiego@raspberrypi:~ $ free -h
               total        used        free      shared  buff/cache   available
Mem:           905Mi       172Mi       621Mi       3.9Mi       167Mi       732Mi
Swap:          904Mi          0B       904Mi
```

Aqui nos dice la **memoria total**, tenemos 1GB, tenemos en uso **172 MiB**, **621 MiB** disponibles, y **167 MiB** que se estan usando como caché.

Tenemos **904 MiB** de *swap*, pero no estamos usando nada ahora mismo.

### Resultado

Hemos reducido muchisimo el consumo de CPU y RAM. Ten en cuenta que estos resultados han sido obtenidos con **multiples servicios que estamos usando explicados mas adelante**, no con el sistema operativo recien instalado y en idle, en ese caso encontrarás un consumo mucho mas reducido.

## Acceso remoto

Primero, vamos a conectar nuestra **rpi** a internet para poder actualizar el sistema operativo y descargar varios paquetes:

```bash
sudo nmcli radio wifi on
sudo nmcli device wifi list
sudo nmcli device wifi connect "NOMBRE_WIFI" password "CONTRASEÑA"
```

> Esto es lo único que habrá que configurar una vez se mueva la obra al espacio fisico de la instalación.

Para el acceso remoto vamos a utilizar [Tailscale](https://tailscale.com/) para crear una VPN mesh, esto nos permitirá entrar por *ssh* una vez esté conectada a la red de la exposición si lo necesitamos.

Instalamos con:

```bash
sudo apt update
sudo apt upgrade
curl -fsSL https://tailscale.com/install.sh | sh
```

Activamos el servicio:

```bash
sudo systemctl enable --now tailscaled
```

Y conectamos a nuestra cuenta:

```bash
sudo tailscale up
```

Realizamos lo mismo en el dispositivo que queramos usar para acceder a la *rpi*.

Por ultimo, activamos el acceso ssh de tailscale en la *rpi*:

```bash
sudo tailscale set --ssh
```

Podemos ver nuestros dispositivos:

```bash
~ ❯ tailscale status
100.82.203.0   omarchy      datadiego@  linux  -
100.82.36.80   iphone-12    datadiego@  iOS    offline, last seen 2m ago
100.92.65.95   raspberrypi  datadiego@  linux  idle, tx 283808 rx 438560
```

Ahora podemos acceder desde el movil o nuestro laptop a la rpi, independientemente de si estamos en la misma red:

```bash
~ ❯ ssh raspberrypi
datadiego@raspberrypi:~ $
```

## Reproducción automática

Sólo falta reproducir el video en cuanto se inicia la *rpi*, para que nadie tenga que realizar ninguna acción con la misma.

Utilizaremos *systemd* para crear un servicio que reproduzca el video usando *mpv* como reproductor.

Primero instalamos *mpv*:

```bash
sudo apt install mpv
```

Y comprobamos que podemos reproducir el video:

```bash
mpv video.mp4
```

Deberiamos ver el video aparecer en pantalla.

### Creando el script para reproducir el video

Crearemos este script, en mi caso en `/home/datadiego/run.sh`:

```bash
#!/bin/bash
exec mpv --fs --loop=inf --input-terminal=no \
  /home/datadiego/video.mp4
```

Dale permisos de ejecucion:

```bash
chmod +x run.sh
```

Y comprueba que se ejecuta correctamente:

```bash
./run.sh
```

### Creando el servicio 

Ahora vamos a crear un servicio que lo ejecute al iniciar la *rpi*, lo crearemos en `/etc/systemd/system/`, en mi caso se llamará `video-init.service`, recuerda que tendras que usar `sudo` para escribir en el directorio.

El servicio luce asi:

```bash
[Unit]
Description=Reproducir video al arrancar
After=systemd-user-sessions.service
Before=getty@tty1.service

[Service]
Type=simple
ExecStart=/home/datadiego/run.sh
User=datadiego
TTYPath=/dev/tty1
StandardInput=tty
StandardOutput=tty
StandardError=tty
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Cambia `User` y la ruta donde está tu script creado anteriormente.

Solo te queda hacer:

```bash
sudo systemctl daemon-reload
sudo systemctl enable video-init.service
```

No deberias necesitar nada más, al reiniciar la *rpi* deberia iniciarse y reproducir el video.
