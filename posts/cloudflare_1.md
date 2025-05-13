---
title: Cloudflare I: Conectar tu dominio
description: Guia para conectar tu dominio a Cloudflare
date: 2025-05-13
scheduled: 2025-05-13
tags:
  - devops
  - cybsec
layout: layouts/post.njk
---

Cloudflare es un servicio de CDN (Content Delivery Network) con varias funcionalidades como protección DDoS, WAF, DNS, etc.

Necesitarás un dominio para usar Cloudflare en tu proveedor de hosting. Puedes comprar un dominio en cualquier proveedor de dominios, como Namecheap, GoDaddy, Porkbun, etc.

## Configuración de Cloudflare

1. Crea una cuenta en [Cloudflare](https://www.cloudflare.com/).
2. Agrega tu dominio a Cloudflare.
3. Cloudflare escaneará automáticamente los registros DNS de tu dominio. Revisa que estén correctos y haz clic en "Continuar".
4. Selecciona el plan que deseas usar. Puedes empezar con el plan gratuito.
5. Cloudflare te proporcionará dos `nameservers`. Copia ambos y configura tu dominio para usarlos. Tendrás que hacerlo en el panel de control de tu proveedor de dominios.

En `namecheap` debes cambiar tus nameservers a la opcion `Custom DNS` y añadirlos:
![imagen](/img/nameservers.png)

> **Nota**: La propagación de los cambios en los `nameservers` puede tardar algo de tiempo, así que ten paciencia. Puedes usar herramientas como [WhatsMyDNS](https://www.whatsmydns.net/) para verificar si los cambios se han propagado correctamente.

6. Una vez configurado, en Cloudflare verás el estado del proxy de tu dominio pasando a color naranja, lo que significa que el tráfico de tu dominio pasará a través de Cloudflare.

![](/img/cloudflare.png)