---
title: Despliegue con HTTPS y Caddy
description: Guia de como implementar un servidor web con HTTPS utilizando Caddy.
date: 2025-05-09
scheduled: 2025-05-09
tags:
  - devops
layout: layouts/post.njk
---

Añadir un certificado SSL/TLS puede hacerse de varias formas, en esta vamos a utilizar Caddy para añadir https a cualquier servidor web que tengamos funcionando.

Necesitarás:

- Un servidor web, este puede ser un repositorio, un contenedor de docker, una aplicación que hemos instalado y lanzado, etc.
- Un dominio, esto es necesario para solicitar un certificado SSL/TLS.
- Un VPS en cualquier plataforma como linode o digitalocean.

## Configuración VPS

Necesitaremos los puertos `80` y `443` abiertos en el firewall de nuestro VPS.

Si estás usando `ufw` puedes abrirlos con los siguientes comandos:

```bash
sudo ufw enable # opcional si ya lo tienes activo
sudo ufw allow 22 # si no abres tambien el puerto 22, perderás el acceso SSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw reload
sudo ufw status # comprueba que los puertos están abiertos
```

## Configuración DNS

Lo primero es configurar nuestro servidor DNS para que apunte al VPS.

Ve a tu proveedor de dominio y añade un registro "a" que apunte a la dirección IP de tu servidor.

Comprueba la [propagación de dns](https://dnschecker.org/) para saber si ya es está redirigiendo.

## Configuración Caddy

Hay [guias](https://caddyserver.com/docs/install) para las diferentes formas de instalación de Caddy.

En nuestro caso, con ubuntu:

```bash
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Vamos a utilizar Caddy como un proxy reverso, este escuchará primero en el puerto 80 para solicitar los certificados SSL/TLS, si el DNS esta apuntando correctamente, el proceso debería ser exitoso y Caddy empezará a escuchar solicitudes HTTP en el puerto 443 utilizando HTTPS, y se comunicará localmente con tu servidor funcionando en el puerto que configures.

Caddy funciona mediante archivos de configuración llamados `Caddyfile`:

```
cyberbunny.online {
    reverse_proxy localhost:8000
}
```

Donde `cyberbunny.online` es el dominio, `reverse_proxy` el modo en el que queremos que actue Caddy y `localhost:8000` la dirección y puerto donde tenemos nuestro servidor web funcionando.

Edita el archivo en `/etc/caddy/Caddyfile`.

Caddy no usará la configuración hasta que lo reinicies con `sudo systemctl restart caddy`

Cuando lo reinicies, comprueba el estado de la obtención del certificado con `sudo systemctl status caddy`, si ves algo como esto, es que ha funcionado correctamente:

> Si la obtención del certificado falló, puede que debas esperar un poco hasta que el DNS se propague, además, Caddy espera varios minutos antes de volver a intentar la obtención del certificado, así que si no funciona a la primera, no te preocupes, espera un poco y vuelve a consultar el estado mas tarde mientras verificas que tu DNS está apuntando correctamente y tu configuración es correcta.

> Mientras también puedes arrancar tu servidor web si no lo has hecho ya, Caddy no necesita que el servidor web esté funcionando para obtener el certificado, pero si lo necesitas para comprobar que al final funciona correctamente.

