---
author: "datadiego"
draft: true
title: "Gestionando dotfiles"
description: "Guia de como usar tus dotfiles en otras máquinas y automatizar la instalación de tu entorno"
date: "2025-09-10"
tags: ["guia", "linux"]
---

Linux es famoso por la alta personalización que ofrece, puedes instalar diferentes escritorios, configurarlos a tu gusto y todo queda en archivos de texto que son fáciles y portables. 

La primera vez que configuré un *Desktop Environment* en Linux en el que me sentía cómodo fué una sensación genial, ir configurando en archivos de texto como queria que mi `i3` actuara era simple y rápido de modificar, sin embargo, hubo una idea que ya me estaba rondando la cabeza conforme lo estaba configurando:

> ¿Voy a tener que hacer todo esto de nuevo si el dia de mañana tengo que formatear? ¿Y si quiero usar este mismo entorno en otra máquina o VM?

La idea de linux de que *todo sea un archivo de texto* facilitaba esta tarea, pero no dejaba de ser algo un poco tedioso. Mientras iba configurando, iba pensando en ir creando un *bash script* para esto, la parte de instalar paquetes era fácil no era mas que un monton de `sudo apt install` con lo que necesitaba, pero la de mover todos los archivos de configuración necesitaba más trabajo y era más delicado.

Acabé creando mi script, pero se volvió bastante insostenible hacerlo **entero** solo con bash.

La realidad es que podemos usar un par de herramientas que nos van a facilitar **muchísimo** esta tarea. Solo necesitarás usar `stow`, un `Makefile` y varios `bash scripts`. Esto además nos va a permitir adaptar más fácilmente nuestros `dotfiles` a diferentes distros y desktop environments.

## Las bases

Vamos a hacer un desglose de las herramientas y conceptos que usaremos y que función cumplen dentro del proyecto.

### dotfiles

Son nuestros archivos de configuración, lo que define nuestro sistema, generalmente están en `~/.config`, aunque otros como nuestro `.bashrc` viven directamente en nuestro home. Son los archivos que queremos que se muevan a nuestro nuevo sistema tras instalar las dependencias necesarias.

### stow

Un software que **crea enlaces simbólicos** y situa nuestros *dotfiles* donde corresponde. De forma que podamos tenerlos todos organizados en un repositorio y mover **todos** con un solo comando.

Al usar enlaces simbólicos, cuando editemos un *dotfile*, bien sea desde el repositorio o directamente en la ruta establecida, este se actualizará automáticamente, esto nos evita tener que estar copiando nuestros dotfiles con los cambios, o tener un script que gestione que dotfiles debemos actualizar.

### bash scripts

Nos permiten crear scripts con los **comandos que ya conoces** de tu shell en linux.

Se van a usar para automatizar la instalación de todas las dependencias que necesitemos.

### Makefile

Permite crear instrucciones y automatizar que scripts se lanzan dependiendo de que sistema deseamos.

Un ejemplo de mi Makefile:

```bash
dotfiles master ❯ make
     __     __  ____ __
 ___/ /__  / /_/ _(_) /__ ___
/ _  / _ \/ __/ _/ / / -_|_-<
\_,_/\___/\__/_//_/_/\__/___/

  fedora-common   Configuración básica fedora + gnome
  fedora-hyprland Configuración básica fedora + hyprland
  fedora-dms      Configuración básica fedora + dank material shell
  fedora-i3       Configuración básica fedora + i3
  fedora-hacking  Herramientas de hacking y ciberseguridad para fedora
  debian-hacking  Herramientas de hacking y ciberseguridad para debian
  unstow          Unstow todos los paquetes
  generate        Genera configs desde templates
  clean           Limpia archivos generados
```

Gracias a esto, podemos lanzar `make fedora-hyprland` si queremos un escritorio con un hyprland básico, `make fedora-i3` para un entorno i3, ambos con las herramientas que siempre uso.

Si necesito hacer alguna tarea de pentesting, con `make fedora-hacking` instalaré todas las herramientas de hacking y ciberseguridad que más uso.

Lo mejor es que puedes crear diferentes scripts para diferentes distros, los `dotfiles` no cambian entre ellas, asi que son compatibles.

## Preparar un entorno

