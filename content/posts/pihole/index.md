---
title: "Ejemplo de post"
author: datadiego
draft: true
description: Un ejemplo de una publicacion
date: 2026-07-09
# la fecha va en formato año-mes-dia
tags:
  - hacking
layout: layouts/post.njk
---

## Configurando nuestra tarjeta de red

Necesitamos tener una IP estática, podemos hacerlo con:

```bash
sudo nmcli connection modify "MiWifi" \
    ipv4.method manual \
    ipv4.addresses 192.168.1.157/24 \
    ipv4.gateway 192.168.1.1 \
    ipv4.dns "192.168.1.1 1.1.1.1"
```

Sustituye `MiWifi` por SSID de tu router, `192.168.1.1` por tu gateway, si no sabes cual es, puedes comprobarlo con `ip route`, también puedes cambiar `192.168.1.157/24` por la ip que prefieras que tenga tu pihole.

Luego, necesitarás reiniciar la conexión con:

```bash
sudo nmcli connection modify "MiWifi"
sudo nmcli device reapply wlan0
```

Recuerda cambiar `MiWifi` por tu SSID y `wlan0` por el nombre de tu tarjeta de red.

Si estás conectado por ssh a la rpi, tu conexión se interrumpirá, puedes reiniciarla y al entrar de nuevo tendrás ya la ip fija.
