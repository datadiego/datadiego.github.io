---
author: "datadiego"
draft: false
title: "Gestionando dotfiles"
description: "Guia de como usar tus dotfiles en otras máquinas y automatizar la instalación de tu entorno"
date: "2025-09-10"
tags: ["linux"]
---

Linux es conocido por la altísima configuración que ofrece. Uno de los aspectos que más sorprende a quien llega de primeras a este sistema operativo es la capacidad de poder cambiar tu escritorio por completo e incluso poder tener multiples para cambiar la experiencia de usuario que prefieres en cada momento.

Otra característica que a mi me vendió muy rápido el pasar mis dispositivos a distros de Linux era poder automatizar la instalación de software que necesito en mi entorno.

Una parte que mucha gente encuentra inicialmente como _un paso atrás_ respecto a Windows o Mac es tener que editar archivos de texto para configurar tu sistema. Estamos acostumbrados a que la interfaz gráfica ha sido un avance (y en parte, lo es) pero los los archivos de texto para configurar tienen una clara ventaja que no es fácil de apreciar de primeras.

## La situación típica

Has instalado Linux hace poco, configuraste tu sistema como prefieres, instalaste desktop environments nuevos, una terminal que te gusta más que la original, un editor de texto como nvim, configuraste todo este software en los archivos que necesitabas. Y aunque estás contento es normal que mientras estás haciendo todo esto te preguntes:

> ¿Como voy a volver a hacer todo esto el dia de mañana en otra maquina? Voy a perder varios dias en hacer todo esto.

La respuesta corta es: **No vas a hacerlo!**

La respuesta larga viene en el resto del post, vamos a aprender a como automatizar todo esto fácilmente y tener tu entorno listo en minutos.

Para ello, agruparemos nuestras configuraciones (conocidas como `dotfiles`) en un directorio que sincronizaremos con el resto de nuestro sistema. Además, aprenderás a usar los `dotfiles` de otros usuarios e integrarlos en tu sistema para que puedas copiar las configuraciones ya hechas de otros, ahorrandote aún más tiempo.

## Estructura

Vamos a separar el como recrear tu entorno de Linux en otros dispositivos en varias partes, cada una te aporta una automatización en diferentes aspectos de tu sistema:

- **Automatización de la instalación de paquetes**: La más simple, dejar instalado todo lo que vas a usar para no tener que estar instalando manualmente.
- **Gestión de dotfiles**: Como mover tus configuraciones donde deben estar para no editar a mano esos archivos.
- **Automatizar todo**: Por ultimo, como integrar todo para que con un solo comando tu sistema quede listo en unos minutos.

Antes de empezar, necesitarás conocer cómo usar **git** y alguna plataforma cómo **github** para tener tu repositorio disponible más fácilmente.

Comienza por crear un directorio llamado `dotfiles`, puedes llamarlo como quieras, pero se suele llamar así al directorio donde vas a almacenar todo esto y compartirlo.

El directorio tendrá una estructura como esta:

```
.
├── bash
├── btop
├── hyprland
├── Makefile
├── noctalia
├── nvim
├── alacritty
├── scripts
│   ├── cybsec-tools-fedora.sh
│   ├── common.sh
│   ├── dev-tools.sh
│   └── git-config.sh
└── user-scripts
    ├── launch-terminal
    └── terminal-cwd
```

Los directorios y archivos son:

- **Makefile**: El archivo que automatizará la instalación y gestion de dotfiles de forma automática.
- **scripts**: Directorio donde crearemos scripts para instalar paquetes.
- **user-scripts**: Diferentes scripts y utilidades que usamos directamente en la terminal.
- **El resto de directorios**: Contienen los `dotfiles` y configuraciones de cada aplicación que necesitemos configurar. Por ejemplo, `bash` contiene nuestro `.bashrc` con la configuración de nuestro entorno de terminal, `nvim` para nuestro editor de texto y `hyprland` la configuración del entorno de escritorio.

Antes de empezar a crearlo, si vas a empezar *desde cero*, es buena idea usar **timeshift** o **snapshots** si estas en una VM para comprobar si tu proyecto recrea correctamente bien el entorno.

### Automatizar la instalación de dependencias

Esta parte es bien simple, crearemos un directorio llamado `scripts` donde vamos a automatizar todo el proceso con varios `bash scripts`.

Ya estarás acostumbrado a instalar mediante la terminal tus programas, muchos desde tu gestor de paquetes, y otros mediante `flatpaks`, `appimages` o bash scripts que te dan los desarrolladores de apps.

En realidad no tienes que hacer gran cosa, considera que cuando ejecutas esto en la terminal:

```bash
sudo dnf install <paquete>
```

También puedes escribirlo en un archivo y ejecutarlo:

```bash
❯ cat scripts/common.sh
# utilidades
sudo dnf install pipx unzip xclip yq jq fzf stow eza tldr fastfetch micro stow btop brightnessctl fd -y

# editor
sudo dnf install neovim -y

# video
sudo dnf install yt-dlp kdenlive -y

❯ chmod +x scripts/common.sh

❯ ./scripts/common.sh
```

La flag `-y` o `--yes` evita que nos pregunte si queremos instalar el paquete y tener que confirmarlo a mano.

Es importante que independientemente de que método de instalación estés usando, siempre consigas que se ejecute sin tener que interactuar tu. La idea es que simplemente lo dejes instalando todo y te despreocupes.

#### Separando responsabilidades

Utilizar estos scripts te permite separar diferentes paquetes según propósitos, por ejemplo:

```
scripts/
├── cybsec-tools-fedora.sh
├── common.sh
├── gaming.sh
├── dev-tools.sh
└── git-config.sh
```

En este caso:

- `cybsec-tools-fedora.sh` solo instala paquetes para hacking, pentesting y demás propósitos.
- `common.sh` son los paquetes que **siempre** vas a querer en cualquier máquina, los básicos que hacen que tu sistema funcione como quieres.
- `gaming.sh` instala las plataformas y juegos que usas.
- `dev-tools.sh` lenguajes, LSPs, herramientas para desarrollar software en general.

Puedes tener archivos que configuren parte de tu sistema, por ejemplo, `git-config.sh`:

```bash
# Configurar git
read -p "Introduce tu nombre para Git: " git_name
read -p "Introduce tu email para Git: " git_email

git config --global user.name "$git_name"
git config --global user.email "$git_email"
```

Pregunta el nombre y email del usuario y los deja ya configurados, puedes meter más comandos de configuración aqui.

Esto podría hacerse mediante `dotfiles`, pero al hacerlo mediante el script evitas que tu nombre y correo estén en un repositorio público, y que un usuario que quiera usar tu configuración acabe firmando commits en tu nombre.

### Gestionando dotfiles

Vamos a aprender como funcionan los archivos de configuración de tu sistema.

La mayoría de estos archivos se encuentran en el directorio *home* de tu usuario, en el directorio `.config`:

```bash
~
❯ tree .config/ -L 1
.config/
├── alacritty
├── btop -> ../.dotfiles/btop/.config/btop
├── dconf
├── evolution
├── gh
├── go
├── goa-1.0
├── gtk-3.0
├── gtk-4.0
├── hypr -> ../.dotfiles/hyprland/.config/hypr
├── ibus
├── lazydocker
├── lazygit
├── mozilla
├── nautilus
├── noctalia -> ../.dotfiles/noctalia/.config/noctalia
├── nvim -> ../.dotfiles/nvim/.config/nvim
├── opencode -> ../.dotfiles/opencode/.config/opencode
├── pulse
├── qt5ct
├── qt6ct
├── QtProject.conf
├── starship.toml
└── uv
```

Aqui ya puedes apreciar cual es la clave de gestionar los dotfiles de aplicaciones en las que queremos conservar su configuracion:

```
├── nvim -> ../.dotfiles/nvim/.config/nvim
```

Esto no es un directorio, es un **symlink** o **enlace simbólico**, que apunta al directorio de dotfiles donde estamos trabajando.

#### Entendiendo los symlinks

Un enlace simbólico es similar a un **acceso directo** en windows, nos permite hacer una **copia** de un archivo en otro sitio, y esta es simplemente una *referencia* al mismo, si editamos el archivo original o el symlink, se modifican ambos:

```bash
/tmp/test-symlinks
❯ mkdir dirA

/tmp/test-symlinks
❯ mkdir dirB

/tmp/test-symlinks
❯ echo "hola mundo" > dirA/mi-archivo.txt

/tmp/test-symlinks
❯ ln -s ../dirA/mi-archivo.txt dirB/mi-archivo.txt

/tmp/test-symlinks
❯ cat dirA/mi-archivo.txt
hola mundo

/tmp/test-symlinks
❯ cat dirB/mi-archivo.txt
hola mundo

/tmp/test-symlinks
❯ echo "edit 1" > dirB/mi-archivo.txt

/tmp/test-symlinks
❯ cat dirA/mi-archivo.txt
edit 1

/tmp/test-symlinks
❯ echo "edit 2" > dirA/mi-archivo.txt

/tmp/test-symlinks
❯ cat dirB/mi-archivo.txt
edit 2
```

Como ves, al crear el enlace tenemos que poner una ruta o bien relativa al directorio que estamos usando como en el ejemplo, o una absoluta, como seria `/tmp/test-symlinks/dirA/mi-archivo.txt`.

`dirB/mi-archivo.txt` solo es una referencia al primer archivo creado, por eso, si cambiamos tanto en el original como en el enlace simbólico su contenido, ambos se modifican.

### Usando stow para resolver los enlaces

Podrias crear tu propio script para crear los enlaces simbolicos de tus dotfiles, pero por suerte, no tienes que hacer nada de eso, en su lugar usaremos `stow`, una herramienta que nos ayudará a simplificar esta tarea mucho.

#### Como funciona stow

`stow` creará symlinks en tu `home`, solo necesitas indicarle el directorio donde estas almacenando los dotfiles de algun programa en concreto. El directorio de tus dotfiles debe tener una estructura determinada que explicaremos más adelante.

Para entender qué hace y como hace `stow` para saber **donde** debe situar tus archivos, veamos este ejemplo:

```bash
~
❯ pwd
/home/datadiego

~
❯ mkdir prueba-stow

~
❯ cd prueba-stow/

~/prueba-stow
❯ mkdir -p test/mi-prueba/

~/prueba-stow
❯ echo "hola mundo" > test/mi-prueba/mi-archivo.txt

~/prueba-stow
❯ tree .
.
└── test
    └── mi-prueba
        └── mi-archivo.txt

3 directories, 1 file
```

Hemos creado un directorio en nuestro `home`, llamado `prueba-stow`, luego hemos creado un directorio llamado `test`.

`test` es el nombre **clave** que usará stow para que puedas decirle qué quieres mover. El resto de rutas dentro de esa carpeta se crearan en tu `home`, en este caso, acabaremos con `~/mi-prueba/mi-archivo.txt`

```bash
~/prueba-stow
❯ ls ~
drwxr-xr-x@ - datadiego 26 ago 10:00 Descargas
drwxr-xr-x@ - datadiego 25 ago 13:03 Documentos
drwxr-xr-x@ - datadiego 25 ago 09:18 Escritorio
drwxr-xr-x@ - datadiego 25 ago 12:37 Imágenes
drwxr-xr-x@ - datadiego 25 ago 09:18 Música
drwxr-xr-x@ - datadiego 25 ago 13:26 notas
drwxr-xr-x@ - datadiego 27 ago 14:07 Pictures
drwxr-xr-x@ - datadiego 28 ago 23:41 prueba-stow
drwxr-xr-x@ - datadiego 25 ago 09:18 Vídeos

~/prueba-stow
❯ stow test/

~/prueba-stow
❯ ls ~
drwxr-xr-x@ - datadiego 26 ago 10:00 Descargas
drwxr-xr-x@ - datadiego 25 ago 13:03 Documentos
drwxr-xr-x@ - datadiego 25 ago 09:18 Escritorio
drwxr-xr-x@ - datadiego 25 ago 12:37 Imágenes
lrwxrwxrwx@ - datadiego 28 ago 23:42 mi-prueba -> prueba-stow/test/mi-prueba
drwxr-xr-x@ - datadiego 25 ago 09:18 Música
drwxr-xr-x@ - datadiego 25 ago 13:26 notas
drwxr-xr-x@ - datadiego 27 ago 14:07 Pictures
drwxr-xr-x@ - datadiego 28 ago 23:41 prueba-stow
drwxr-xr-x@ - datadiego 25 ago 09:18 Vídeos

~/prueba-stow
❯ cat ~/mi-prueba/mi-archivo.txt
hola mundo
```

Como ves, `stow test` ha creado el enlace `~/mi-prueba/` con todos los archivos que habia en su interior.

#### Empezando a gestionar nuestros dotfiles

Vamos a empezar por gestionar nuestro `~/.bashrc`, este archivo está directamente en nuestro `home`, asi que en nuestro directorio de `dotfiles` crearemos esta estructura:

```bash
.
├── bash
│   ├── .bashrc
│   └── .bashrc.d
│       ├── env.sh
│       ├── git.sh
│       ├── hello.sh
│       ├── open.sh
│       └── search-text.sh
└── scripts
    ├── cybsec-tools.sh
    ├── dependencies.sh
    ├── dev-tools.sh
    └── git-config.sh
```

El directorio `bash` contiene nuestro `.bashrc`, copia el archivo directamente de tu `home` a ese directorio.

El directorio `.bashrc.d` es opcional, pero es buena idea que separes la configuración de tu bash en archivos separados.

Ahora puedes hacer `stow bash` para que tu archivo `.bashrc` apunte al de tus dotfiles:

```bash
datadiego@fedora:~/dotfiles$ mkdir bash
datadiego@fedora:~/dotfiles$ cp ~/.bashrc bash/
datadiego@fedora:~/dotfiles$ stow bash
WARNING! stowing bash would cause conflicts:
  * cannot stow dotfiles/bash/.bashrc over existing target .bashrc since neither a link nor a directory and --adopt not specified
All operations aborted.
```

Como ves, si el archivo ya existía previamente, dará error, tendrás que borrar el original para que `stow` lo sustituya:

```bash
datadiego@fedora:~/dotfiles$ rm ~/.bashrc 
datadiego@fedora:~/dotfiles$ stow bash
datadiego@fedora:~/dotfiles$ ls -la ~/.bashrc
lrwxrwxrwx. 1 datadiego datadiego 21 ago 29 01:34 /home/datadiego/.bashrc -> dotfiles/bash/.bashrc
```

Ahora nuestro `.bashrc` esta enlazado a nuestra carpeta dotfiles.

#### Otro ejemplo

Vamos a crear el dotfile de `alacritty`, la terminal que suelo usar, en este caso, su configuración está en `.config/alacritty/alacritty.toml`, la mayoría de aplicaciones tienen una ruta similar, para crearla y hacer `stow`:

```bash
datadiego@fedora:~/dotfiles$ mkdir alacritty/.config/alacritty -p
datadiego@fedora:~/dotfiles$ nano alacritty/.config/alacritty/alacritty.toml
datadiego@fedora:~/dotfiles$ stow alacritty
```

`stow` no tiene mucho más que explicar, es un paquete muy sencillo una vez entiendes como usarlo.

Tienes otros gestores como [chezmoi](https://www.chezmoi.io/) con muchas más funcionalidades, como la creación de plantillas que permiten configurar diferencias entre diferentes máquinas.

### Automatizando todo

Con esto ya tenemos todo bastante automatizado, el proceso normalmente es:

```bash
git clone <repo a tus dotfiles>
cd dotfiles
./scripts/common.sh
./scripts/dev-tools.sh
stow <herramienta>
stow <otra herramienta>
```

Y si, evidentemente podríamos crear un `.sh` que haga todos estos pasos para no tener que ir ejecutando cada script y `stow`, pero tenemos una mejor opcion, crear un `Makefile`.

#### Ejemplo de Makefile

Un `Makefile` nos permite automatizar ejecuciones de scripts y comandos de forma más sencilla y versátil que un `bash` script.

La idea es la siguiente, una vez tienes un `Makefile` listo, tendrás algo como esto:

```bash
dotfiles on  master [!]
❯ make
       __      __  _____ __
  ____/ /___  / /_/ __(_) /__  _____
 / __  / __ \/ __/ /_/ / / _ \/ ___/
/ /_/ / /_/ / /_/ __/ / /  __(__  )
\__,_/\____/\__/_/ /_/_/\___/____/

  install         Instalar dependencias y dotfiles
  hacking         Herramientas de hacking y pentesting
  unstow          Unstow todos los paquetes
  clean           Limpia archivos generados
```

A partir de ahi, puedes ejecutar `make install` para que se instalen las dependencias comunes y tus dotfiles. Si necesitas herramientas de pentesting puedes hacer `make hacking`.

Vamos a analizar la estructura de este `Makefile`:

```Makefile
SHELL := /bin/bash

PACKAGES := hyprland niri bash nvim noctalia btop opencode ruby

.PHONY: help install install-dependencies fedora-hacking git-config stow post-install stow-% unstow unstow-% clean

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: git-config install-dependencies stow post-install clean ## Instalar dependencias y dotfiles

install-dependencies:
	@bash scripts/dependencies.sh

hacking: ## Herramientas de hacking y ciberseguridad para fedora
	@bash scripts/cybsec-tools-fedora.sh

git-config:
	@bash scripts/git-config.sh

stow:
	@rm -f ~/.bashrc
	@rm -rf ~/.config/nvim
	@rm -rf ~/.config/noctalia
	@for pkg in $(PACKAGES); do \
		echo "Stowing $$pkg..."; \
		stow -S "$$pkg"; \
	done

post-install:
	@sudo cp ./user-scripts/launch-terminal /usr/local/bin/
	@sudo cp ./user-scripts/terminal-cwd /usr/local/bin/

stow-%:
	@echo "Stowing $*..."
	@stow -v "$*"

unstow:  ## Unstow todos los paquetes
	@for pkg in $(PACKAGES); do \
		echo "Unstowing $$pkg..."; \
		stow -v -D "$$pkg"; \
	done

unstow-%:  ## Unstow un paquete específico (ej: make unstow-alacritty)
	@echo "Unstowing $*..."
	@stow -v -D "$*"

clean:  ## Limpia archivos generados
	@rm -f *.zip
	@echo "Archivos generados eliminados"

```

Un `Makefile` se ejecuta con el comando `make` y funciona definiendo **objetivos** (targets) que representan tareas que queremos ejecutar. Cada objetivo puede tener comandos asociados que se ejecutan en orden.

**Variables**

```Makefile
SHELL := /bin/bash
PACKAGES := hyprland niri bash nvim noctalia btop opencode ruby
```

- `SHELL`: Define el shell que se usará para ejecutar los comandos. Es buena práctica usar `/bin/bash` para asegurar compatibilidad.
- `PACKAGES`: Una variable que contiene la lista de todos los paquetes que gestiona `stow`.

**Objetivos y dependencias**

Los objetivos se definen con `nombre:`, es donde definimos los **comandos** que ejecutaremos.

```Makefile
install: git-config install-dependencies stow post-install clean
```

Cuando ejecutas `make install`, se ejecutan en orden: `git-config`, `install-dependencies`, `stow`, `post-install` y `clean`.

**Comandos**

Los comandos dentro de cada objetivo se escriben indentados con tabulaciones. El prefijo `@` evita que `make` imprima el comando antes de ejecutarlo, manteniendo la salida limpia.

```Makefile
stow:
	@rm -f ~/.bashrc
	@rm -rf ~/.config/nvim
	@rm -rf ~/.config/noctalia
	@for pkg in $(PACKAGES); do \
		echo "Stowing $$pkg..."; \
		stow -S "$$pkg"; \
	done
```

Este comando borrará los archivos para que `stow` no falle al crear los enlaces, y luego hará stow de cada uno de los directorios definidos en la lista `PACKAGES`.

**Comentario automático**

La línea `## Texto` después de un objetivo es un comentario que el objetivo `help` extrae automáticamente para generar la ayuda:

```Makefile
help:
@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
```

Esto significa que cualquier objetivo que incluya `## Descripción` aparecerá automáticamente en la ayuda cuando ejecutes `make` sin argumentos.

**Objetivos con patrón**

```Makefile
stow-%:
	@echo "Stowing $*..."
	@stow -v "$*"
```

El `%` es un comodín que coincide con cualquier nombre. Si ejecutas `make stow-nvim`, la variable `$*` tomará el valor `nvim`, permitiéndote ejecutar `stow` para un paquete específico sin tener que definir un objetivo para cada uno.

Puedes prácticamente copiar este `Makefile`, solo debes modificar los `PACKAGES` que usas en tus dotfiles, añadir que scripts estás lanzando para hacer `install` y el comando `stow` para borrar los directorios que necesites si `stow` falla.

### Mas allá de tus dotfiles

En cuanto eches una tarde con esto lo tendrás más que listo para llevartelo a otro sistema, poder gestionar tus dotfiles te abre muchas posibilidades para probar otras distros sin miedo, adaptar tu script de instalación de dependencias a otro gestor de paquetes es trivial, lo podrás hacer en la mayoría de casos mediante una sustitución de `sudo dnf` por `sudo apt` (o el comando del gestor de esa distro) en tu editor, o mediante el comando `sed`.

Además, encontrarás múltiples repositorios de otros usuarios que ya te dan sus `dotfiles` listos para usar, probarlos es rápido, y es una forma estupenda de ver que otros flujos de trabajo y configuraciones usan otros, luego puedes quedarte con los aspectos que más te gusten de cada uno, y añadirlos a los tuyos o modificarlos según prefieras.

Si el tema de reproducibilidad en diferentes sistemas te gusta, quizá deberías probar [NixOS](https://nixos.org/), una distribución **declarativa**, en la que en lugar de instalar paquetes lanzando comandos, los defines en un archivo junto a su configuración. Es una distribución **muy potente**, con su propio lenguaje para recrear entornos, y aunque consume bastante tiempo y supone un cambio de filosofía muy grande, si vas a instalar en múltiples sistemas el mismo, merece mucho la pena.
