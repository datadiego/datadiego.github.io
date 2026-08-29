---
title: "Primeros pasos en Linux"
author: datadiego
draft: false
description: Que deberias conocer si acabas de empezar en Linux
date: 2025-02-10
tags:
  - linux
layout: layouts/post.njk
---

Si acabas de arrancar por primera vez en Linux, hay varias cosas que deberías conocer antes de usarlo como prefieras.

Tener una buena base de estos conceptos te ayudará a evitar dolores de cabeza a largo plazo, y no son *tantos* como mucha gente piensa.

## Conoce tu gestor de paquetes

El gestor de paquetes es el encargado de **instalar, borrar y actualizar** el software de tu sistema.

Instala un par de paquetes sencillos, como `figlet` o `lolcat`, comprueba que funcionan y prueba a desinstalarlos.

Cada distro tiene su propio gestor de paquetes, los comandos varían pero casi siempre harás lo mismo con ellos, una vez aprendes uno, los demás son casi iguales.

## Aprende a actualizar tu sistema

Va de la mano del anterior punto, pero merece su propia sección.

Aunque acabes de instalar Linux, lo más seguro es que tengas que actualizar bastantes paquetes del sistema.

Dependiendo de tu distro, esto lo harás de diferentes formas:

```bash
# Debian/Ubuntu
sudo apt update && sudo apt upgrade
# Fedora
sudo dnf upgrade --refresh
# Arch
sudo pacman -Syu
```

Recuerda actualizar con frecuencia, obtendrás actualizaciones de seguridad y funcionalidades, pero también acceso a nuevos paquetes publicados.


## Domina comandos básicos

Da igual que distro uses, siempre tendrás disponibles los mismos comandos básicos.

Puedes visitar el post
