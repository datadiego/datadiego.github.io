---
title: Despliegue WordPress en Linode
description: Guia para configurar y desplegar un servidor de WordPress
date: 2025-05-14
scheduled: 2025-05-14
tags:
  - devops
layout: layouts/post.njk
---

Vamos a crear un servidor de WordPress en Linode. Esta plataforma nos deja usar su "One-Click App" para crear un servidor de WordPress rápidamente.

## Eligiendo nuestra imagen base

1. Entra a tu cuenta y entra a la sección de "Linodes".
2. Da click en "Create Linode".
3. Selecciona "Marketplace" y busca "WordPress".
4. Selecciona la imagen de WordPress.

## Configurando el servidor

Para desplegar la aplicación, debemos rellenar los siguientes campos:

- **Email address**: Escribe tu correo electrónico. Necesario para conseguir credenciales SSL/TLS y disponer de HTTPS.
- **Stack**: Selecciona "LAMP" (Linux, Apache, MySQL y PHP).
- **Website title**: Escribe el nombre que quieras darle a tu wordpress.
- **Wordpress Admin username**: Escribe el nombre de usuario que quieras usar para acceder a tu WordPress como administrador.
- **Wordpress database user**: Escribe el nombre de usuario que quieras usar para acceder a tu base de datos de WordPress.
- **Wordpress database name**: Escribe el nombre de la base de datos que quieras usar para tu WordPress, cualquiera está bien.
- **Limited sudo user**: Nombre de usuario con creado en el servidor.
- **Linode API token**: Se usa para los registros DNS, puedes escribir uno cualquiera o dejarlo vacío.
- **Add Prometheus data exporter**: Usa `mysqld_exporter`.
- **Region**: Pais y ciudad donde quieres tu servidor. Elige `Madrid`.
- **Linode Plan**: La pagina no tendra mucho tráfico, y wordpress no consume muchos recursos, asi que puedes elegir el plan `Nanode 1GB` dentro de la sección `Shared CPU`, es el plan más barato en la actualidad.
- **Linode Label**: Escribe un nombre para tu servidor, por ejemplo `wordpress`.
- **Root password**: Escribe una contraseña para el usuario root. Asegúrate de que sea segura.

Estos campos son los más importantes, el resto puedes dejarlos en sus valores por defecto.

## Entrando al VPS

Si vuelves a entrar a la seccion de `Linodes` verás el servidor que acabas de crear. Puedes entrar mediante SSH con el siguiente comando:

```bash
ssh root@<IP del servidor>
```

Una vez entres, puedes comprobar como va el proceso de instalación con `tail -f /var/log/stackscript.log`. Este proceso puede tardar un poco, así que ten paciencia. Cuando termine, deberás tener tus credenciales de acceso a WordPress en `/home/<usuario>/.credentials`

## Acceder a WordPress

Accede a tu WordPress desde el navegador con la dirección `http://<IP del servidor>`. Si esto da problemas, busca tu *Reverse DNS* en la sección de `Networking` de tu servidor, deberías ver uno que sigue un patrón similar a `172-233-121-90.ip.linodeusercontent.com`

> Asegúrate de usar las credenciales que te han dado en el archivo `.credentials`, si no lo encuentras, lanza `find / -name ".credentials" 2> /dev/null` para buscarlo.

## Migración de WordPress

Si quieres migrar tu WordPress a otro servidor, puedes usar el plugin `All-in-One WP Migration`. Este plugin te permite exportar tu WordPress a un archivo `.wpress`, que puedes importar en otro servidor con el mismo plugin. Puedes instalarlo desde la sección de plugins de tu WordPress.