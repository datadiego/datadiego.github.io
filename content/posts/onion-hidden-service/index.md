---
title: "Tor y red onion #2: Servicios ocultos .onion"
author: datadiego
draft: false
description: Como crear una web .onion
date: 2026-08-23
# la fecha va en formato año-mes-dia
tags:
  - privacy
layout: layouts/post.njk
---

En el [anterior post sobre tor] hablé sobre como navegar usando Tor para mantener nuestro anonimato y comentamos acerca de los sitios web `.onion` a los que solo podemos acceder si estamos en esta red.

En este post voy a mostrar como podemos utilizar tor para desplegar una página web, de forma similar a como puedes acceder a este blog desde tor usando [este enlace](http://rogueo7ciqckck2yhf2dqmqxsrav3ydsobcxkun7f5dmysskcxyfgead.onion/).

## Acerca de los .onion

Ya hemos hablado de aspectos mas generales de estos sitios en el post anterior, pero vamos a profundizar un momento en algunos aspectos que nos importan para desplegar un servicio a través de el.

### Sobre la URL

Las urls son **largas**, no están pensadas para que las recuerdes, un usuario debe tener la url o no podrá acceder de fácilmente.

Ten en cuenta que están compuestas por 56 caracteres aleatorios, pero podemos usar software para encontrar algo de orden en ese caos y que empiecen por alguna palabra identificativa. Este blog usa:

```
rogueo7ciqckck2yhf2dqmqxsrav3ydsobcxkun7f5dmysskcxyfgead.onion
```

La primera palabra `rogue` fue calculada intencionalmente para identificarla más fácilmente.

### NAT Punching

En un VPS, para poder exponer tu servidor web http tendrás que abrir el puerto 80 para que los clientes puedan realizarle peticiones.

Un hidden service de onion **no necesita nada de esto**, viaja a través de la red tor directamente.

### HTTPS y onion

Un sitio web onion no necesita HTTPS para asegurar que el contenido enviado y recibido esté encriptado, el propio protocolo ya oculta estos datos. No necesitas obtener un certificado para esto.

## Creando el hidden service

Partimos de la base que ya tienes instalado tor como en el último post.

Usaremos [mpk224o](https://github.com/cathugger/mkp224o) para generar una dirección onion válida, si tienes `docker`, simplemente lanza:

```bash
docker run --rm -it -v $PWD:/keys ghcr.io/cathugger/mkp224o:master -d /keys neko
```

Sustituye `neko` por la palabra que quieras al principio de tu dirección, por ejemplo:

```bash
/tmp/onions ❯ docker run --rm -it -v $PWD:/keys ghcr.io/cathugger/mkp224o:master -d /keys rogue
set workdir: /keys/
sorting filters... done.
filters:
	rogue
in total, 1 filter
using 14 threads
roguevxx56b7wy7geeweyad252xmefcrnvf34dv4chgcq4ejarkmm4qd.onion
rogue7jve2zbk2pwqgllfotmj6ka6ckq5p3snmp75c7gjkito6ymkuyd.onion
rogueulqd2dkg3dnwxmtblohmbka7wbmx24wrluuf5hj5j7bnuenmoyd.onion
```

Nos ha generado tres direcciones que empiezan por `rogue` en el directorio donde estamos operando:

```bash
/tmp/onions ❯ ls
Permissions Size User Date Modified Name
drwx------     - root 23 Aug 14:34   rogue7jve2zbk2pwqgllfotmj6ka6ckq5p3snmp75c7gjkito6ymkuyd.onion
drwx------     - root 23 Aug 14:34   rogueulqd2dkg3dnwxmtblohmbka7wbmx24wrluuf5hj5j7bnuenmoyd.onion
drwx------     - root 23 Aug 14:34   roguevxx56b7wy7geeweyad252xmefcrnvf34dv4chgcq4ejarkmm4qd.onion
```

Lo siguiente es mover la carpeta que ha generado a `/var/lib/tor/hidden`, cambia `hidden` por el nombre que prefieras.

En mi caso:

```bash
sudo cp -r rogue7jve2zbk2pwqgllfotmj6ka6ckq5p3snmp75c7gjkito6ymkuyd.onion/ /var/lib/tor/rogue
```

Vamos a configurar nuestro servicio en `/etc/tor/torrc`:

```
HiddenServiceDir /var/lib/tor/rogue/
HiddenServicePort 80 127.0.0.1:80
```

Cambia `rogue` por el directorio en el que copiases tu dirección onion creada antes.

Por ultimo, cambiamos los permisos y el propietario del directorio al usuario tor:

```bash
sudo chown -R tor: /var/lib/tor/rogue
sudo chmod -R u+rwX,og-rwx /var/lib/tor/rogue
```

> En algunas distribuciones, el usuario es diferente, por ejemplo, en debian suele ser `debian-tor`, compruebalo antes de proceder

Solo te queda reiniciar tor con `sudo systemctl restart tor` y tu página estará disponible.

## Probando el servicio oculto

Para comprobar que todo va bien:

```bash
mkdir /tmp/web
cd /tmp/web
echo "hola mundo" > index.html
sudo python3 -m http.server 80
```

Luego, abre tu navegador, activa tu proxy y entra a la dirección onion que creaste, deberías ver un hola mundo a través de tu servicio oculto, cualquier persona con la dirección podrá visitarla.

> No uses el servidor de python de forma permanente, con `nginx` o `apache` mucho mejor.

Es sorpendentemente fácil desplegar estos servicios, mucho más que en un VPS con HTTPS.
