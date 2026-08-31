---
title: "Problemas remotos"
author: datadiego
draft: true
description: Como solucionar problemas con repositorios remotos
date: 2026-08-31
# la fecha va en formato año-mes-dia
tags:
  - git
layout: layouts/post.njk
---

En este post vamos a crear un laboratorio que te servirá para practicar diferentes situaciones en repositorios remotos.

También veremos como solucionar conflictos en un repositorio, de forma manual y también con ayuda de `lazygit`.

## Lazygit

Si has seguido los posts sobre git, ahora mismo estarás controlando git mediante comandos.

Hay multiples **GUIs** que puedes usar para interactuar con git y tus repositorios remotos como [Github Desktop](https://desktop.github.com/download/) o [GitKraken](https://gitkraken.com/).

En mi caso, uso [LazyGit](https://github.com/jesseduffield/lazygit) prácticamente a diario. Es una herramienta TUI, asi que toda la interfaz está renderizada en terminal, funciona mediante comandos y es **muy rápido** de usar, además es muy completo, no le faltará nada que hagan el resto de herramientas.

![lazygit](./lazygit.png)

La interfaz con la que interactuamos queda a la izquierda, donde tenemos 5 paneles identificados por numeros. Puedes usar el teclado para moverte entre ellos pulsando 1-5.

### 1. Status

Nos da información general del repositorio, en la imagen nos muestra en que rama estamos trabajando (master) y que hay un cambio al que podemos hacer *push* al repositorio remoto.

### 2. Files - Worktrees - Submodules

![files](./files.png)

Es la sección que más usarás, en concreto la sección Files, que es donde podemos añadir archivos al area de stage.

En la imagen ves como en el repositorio hay 5 cambios, se añadieron 4 imagenes al area de stage, mientras que `index.md` sigue solo en el area de trabajo.

Para añadir un archivo o directorio al area de *stage* situate encima y pulsa *Espacio*, tambien puedes pulsar `a` para añadir **todos** los cambios actuales. El equivalente a `git add .`

Con `c` puedes hacer commit:

![commit](./lazygit.png)

Para hacer *push* pulsas `P`, y *pull* con `p`.

Para descartar cambios puedes pulsar `d`.

> Una vez te acosumbras, se vuelve **muy rapido** subir cambios a un repositorio, pero si olvidas los comandos, con ? tienes una ayuda.
> Ademas, en la parte inferior aparecen los comandos más usados en la sección que estás situado.

### 3. Branches - Remotes

![remotes](./remotes.png)

Nos da informacion de nuestras ramas y diferentes remotos.

Para el blog trabajo normalmente en *master* para escribir posts. Asi que no veremos nada especial.

En remotos sin embargo, tengo dos, el repositorio de github, y otro en una raspberry pi como backup y *hidden service* de tor.

*Lazygit* te permite crear, borrar y editar remotos y ramas.

### 4. Commits

Aqui puedes ver el log de commits actual, realizar `amends`, editar commits y checkout a un punto concreto de la historia del repositorio.
