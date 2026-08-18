---
title: "Repositorios bare en git"
author: datadiego
draft: false
description: Uso de repositorios bare en servidores privados
date: 2026-08-18
# la fecha va en formato año-mes-dia
tags:
  - coding
layout: layouts/post.njk
---

Este post viene de la mano de este video de Tsoding:

{{< youtube iuIdBfjL62s >}}

Me pareció interesante y mucha gente quizá se puede perder entre el idioma y la rapidez al explicar, pero vamos a ver como **no necesitamos Github** para gestionar nuestros repositorios remotos.

Basta con una máquina a la que tenemos acceso por SSH para poder gestionarlos, aunque necesitaremos un **bare repo** para esto.

## Repo normal vs Bare repo

Normalmente estamos acostumbrados a hacer esto para iniciar un repositorio:

```bash
/tmp ❯ mkdir prueba

/tmp ❯ cd prueba/

/tmp/prueba ❯ git init
Initialized empty Git repository in /tmp/prueba/.git/

prueba master ❯ ls -la
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 18 Aug 12:34   .git

prueba master ❯ echo "hola mundo" > miarchivo

prueba master ? ❯ ls -la
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 18 Aug 12:34   .git
.rw-r--r--    11 datadiego 18 Aug 12:35  󰡯 miarchivo

prueba master ? ❯ git add miarchivo 

prueba master ❯ git commit -m "creo un archivo"
[master (root-commit) 6fae141] creo un archivo
 1 file changed, 1 insertion(+)
 create mode 100644 miarchivo

prueba master ❯ git log
commit 6fae141d0c018944dcb09f1441ce877d2881b77f (HEAD -> master)
Author: Juan Diego Mariscal <juandiegomariscal@gmail.com>
Date:   Tue Aug 18 12:35:28 2026 +0200

    creo un archivo

prueba master ❯ ls .git/
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 18 Aug 12:34   hooks
drwxr-xr-x     - datadiego 18 Aug 12:34   info
drwxr-xr-x     - datadiego 18 Aug 12:35   logs
drwxr-xr-x     - datadiego 18 Aug 12:35   objects
drwxr-xr-x     - datadiego 18 Aug 12:34   refs
drwxr-xr-x     - datadiego 18 Aug 12:35   rr-cache
.rw-r--r--    16 datadiego 18 Aug 12:35  󰊢 COMMIT_EDITMSG
.rw-r--r--    92 datadiego 18 Aug 12:34  󱁻 config
.rw-r--r--    73 datadiego 18 Aug 12:34  󰡯 description
.rw-r--r--    23 datadiego 18 Aug 12:34  󰡯 HEAD
.rw-r--r--   137 datadiego 18 Aug 12:35  󰡯 index
.rw-r--r--     0 datadiego 18 Aug 12:35  󰡯 MERGE_RR
```

Sabemos que tenemos por un lado nuestro *Working directory*, que contiene nuestros archivos, y por otro la carpeta `.git`, que contiene la información del repositorio y los cambios que commiteamos.

Vamos a comparar que sucede cuando creamos un repositorio *bare*:

```bash

/tmp ❯ mkdir prueba-bare

/tmp ❯ cd prueba-bare/

/tmp/prueba-bare ❯ git init --bare
Initialized empty Git repository in /tmp/prueba-bare/

/tmp/prueba-bare master ❯ ls -la
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 18 Aug 12:37   hooks
drwxr-xr-x     - datadiego 18 Aug 12:37   info
drwxr-xr-x     - datadiego 18 Aug 12:37   objects
drwxr-xr-x     - datadiego 18 Aug 12:37   refs
.rw-r--r--    66 datadiego 18 Aug 12:37  󱁻 config
.rw-r--r--    73 datadiego 18 Aug 12:37  󰡯 description
.rw-r--r--    23 datadiego 18 Aug 12:37  󰡯 HEAD
```

En este repositorio **no tenemos working directory**, sino la carpeta `.git` a la que estamos acostumbrados directamente en la raiz del proyecto.

El repositorio bare aun asi contiene todo lo necesario para que trabajemos como estamos acostumbrados en github, gitlab o gitea.

## Creando nuestro laboratorio

Vamos a usar una raspberrypi y nuestro laptop como laboratorio de como podemos montar un servidor.

Accederemos a la *rpi* usando *Tailscale*, aunque puedes usar un servidor SSH común, luego crearemos un repo bare:

```bash
~ ❯ ssh raspberrypi
datadiego@raspberrypi:~ $ git init prueba-repo --bare
Initialized empty Git repository in /home/datadiego/prueba-repo/
datadiego@raspberrypi:~ $ cd prueba-repo/
datadiego@raspberrypi:~/prueba-repo $ ls
HEAD  branches  config  description  hooks  info  objects  refs
```

Podemos clonar el repositorio mediante `ssh <user>@<ip>:ruta-al-repo`.

Vamos a probarl en nuestro laptop, clonamos el repo y realizamos unos cambios:

```bash
/tmp ❯ git clone raspberrypi:prueba-repo
Cloning into 'prueba-repo'...
warning: You appear to have cloned an empty repository.

/tmp ❯ cd pru
prueba/   ...-bare/ ...-repo/ 

/tmp ❯ cd prueba-repo/

prueba-repo master ❯ echo "hola mundo" > hola.txt

prueba-repo master ? ❯ git add .

prueba-repo master ❯ git commit -m "creamos un archivo"
[master (root-commit) dd64987] creamos un archivo
 1 file changed, 1 insertion(+)
 create mode 100644 hola.txt

prueba-repo master ❯ git push origin master
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 237 bytes | 237.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To raspberrypi:prueba-repo
 * [new branch]      master -> master
```

Comprobamos en nuestra rpi si hay cambios en el repo:

```bash
datadiego@raspberrypi:~/prueba-repo $ git log
commit dd64987ebcc8f709a71657c1418823d18a56782d (HEAD -> master)
Author: Juan Diego Mariscal <juandiegomariscal@gmail.com>
Date:   Tue Aug 18 13:49:04 2026 +0200

    creamos un archivo
```

## Por qué esto es útil

Como con cualquier servicio en la nube, somos dependientes de sus servidores, github ha sido criticada duramente por los tiempos que ha tenido últimamente con caidas en sus servicios, como se muestran en páginas como [esta](https://mrshu.github.io/github-statuses/).

La opción `self hosted` siempre es interesante, añade una capa de privacidad que es **muy atractiva** y barata.

Si bien tenemos opciones como [gitea](https://about.gitea.com/) que nos ofrecen una experiencia muy completa que podemos hostear por nosotros mismos, esta solución es lo suficientemente sólida y cómoda como para usarla si dispones de una rpi o un minipc, con *Tailscale* o *WireGuard* dispondrás de todos tus repositorios en cualquier lugar sin tener que configurar nada extra.

Por último, demuestra lo potente que es `git` de base, y lo flexible que es.

## Migrando nuestros repositorios a bare repos

Si esto te ha gustado quizá quieras migrar tus repositorios a tu propio servidor.

Si estás en github y tienes `gh` instalado:

```bash
#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-.}"
mkdir -p "$DEST" && cd "$DEST"

gh repo list --limit 1000 --json nameWithOwner -q '.[].nameWithOwner' |
while read -r repo; do
    dir="${repo##*/}"
    [ -d "$dir" ] && echo "SKIP: $repo" && continue
    gh repo clone "$repo" "$dir" -- --bare 2>&1 && echo "OK: $repo" || echo "FALLO: $repo" >&2
done
```

Esto descargará todos tus repos en formato *bare* en el directorio que le indiques:

```bash
./clone.sh /media/ssd0/repos
```

Si no le indicas directorio, lo descargará donde esté el script.

Dejalo un buen rato (dependiendo de cuantos repos tengas) y en nada podrás gestionar todo lo que tenias directamente en tu servidor privado.
