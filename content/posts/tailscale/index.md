---
title: "Tailscale"
author: datadiego
draft: true
description: Creando una vpn privada para acceder a tus dispositivos
date: 2026-10-23
tags:
  - hacking
layout: layouts/post.njk
---

Si alguna vez has necesitado acceder de forma remota a uno de tus dispositivos, o has empezado a montar tu homelab en casa con servidores, habrás visto **muchas** soluciones y herramientas para poder hacerlo.

[Tailscale](https://tailscale.com/) suele ser la opción que suelo recomendar de manera general, es rápido de instalar, y en practicamente 5 minutos tienes los dispositivos que necesitas conectados entre si.

## Sobre la seguridad con VPNs privadas

Antes de ver como usarlo, vamos a entender los riesgos de este tipo de tecnología.

Vamos a partir de la base que usar una VPN privada es **más inseguro que no usarla en absoluto**, por el simple hecho de que expones más dispositivos a ser atacados. Si uno de los dispositivos es comprometido, será más facil que otros que estén en la misma tailnet también sean atacados.

Tailscale en concreto ofrece bastantes mecanismos para evitar situaciones como estas, pero no deja de **depender de ti** gran parte de que tu red sea segura.

Puedes tener dudas acerca de usar un servicio de una empresa centralizada para acceder, esta publica sus auditorias con los certificados que verifican que **todo esta encriptado** y hablan de como [no te usan como producto](https://tailscale.com/blog/free-plan) incluso en su tier gratuito.

Si aun así prefieres tener el control total, puedes usar [headscale](https://github.com/juanfont/headscale), una version que puedes hostear tu mismo, esto por defecto **no es más seguro**, de nuevo, depende enteramente de como lo uses.

## Como Tailscale

Es bastante simple, 
