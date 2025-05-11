---
title: nvm + npm + Node.js 101
description: Guia básica de nvm + npm y Node.js
date: 2025-05-11
scheduled: 2025-05-11
tags:
  - coding
layout: layouts/post.njk
---

Nodejs y npm son herramientas muy potentes para el desarrollo de aplicaciones web. 

Este ecosistema es muy amplio y tiene **muchas** librerias y frameworks modernos para desarrollar aplicaciones web.

## nodejs

Node.js es un **entorno de ejecución** para JavaScript que permite ejecutar código JavaScript en el servidor. Esto significa que puedes usar JavaScript para crear aplicaciones del lado del servidor, lo que antes solo era posible con lenguajes como PHP o Ruby.

Es una herramienta muy popular y usada por muchas empresas y desarrolladores para crear aplicaciones web, APIs y servicios en la nube.

Para instalarla, puedes usar `nvm` (Node Version Manager) que es una herramienta que te permite instalar y gestionar diferentes versiones de Node.js en tu máquina.

## nvm

`nvm` es una herramienta que te permite instalar y gestionar diferentes versiones de Node.js en tu máquina. Esto es útil porque algunas aplicaciones pueden requerir versiones específicas de Node.js para funcionar correctamente.

En el [repositorio oficial de nvm](https://github.com/nvm-sh/nvm) puedes encontrar la documentación oficial y las instrucciones de instalación.

Puedes lanzar el siguiente comando para instalar la version `0.40.3` de nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Luego, puedes instalar versiones y usarlas asi:

```bash
nvm install 22.12
nvm use 22.12
node -v
```

Puedes ver todas las versiones instaladas con el siguiente comando:
```bash
nvm ls
```

## npm

npm es el gestor de paquetes para Node.js. Te permite instalar y gestionar librerías y dependencias para tus aplicaciones. Es similar a `pip` en Python o `composer` en PHP.

npm es la **mayor fuente de librerías y codigo** abierto en el mundo. Puedes encontrar librerías para casi cualquier cosa, desde frameworks completos como React o Angular, hasta pequeñas utilidades para hacer tareas específicas.

Puedes instalarlo y actualizarlo con los siguientes comandos:

```bash
apt install npm  # instala la version de npm que viene con tu distribucion
npm install -g npm  # actualiza npm a la ultima version
```

## Crear un proyecto

Para crear un nuevo proyecto con npm, puedes usar el siguiente comando:

```bash
npm init -y
```

Esto creará un archivo `package.json` en tu directorio actual. Este archivo contiene información sobre tu proyecto y sus dependencias.

### package.json

Este archivo contiene la configuración de tu proyecto, asi como sus dependencias y otros metadatos.

```json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```

Este es el archivo base que crea `npm init -y`. Dentro podemos encontrar:

- `name`: el nombre de tu proyecto.
- `version`: la version de tu proyecto.
- `description`: una breve descripcion de tu proyecto.
- `main`: el archivo principal de ejecucion de tu proyecto.
- `scripts`: una serie de scripts que puedes ejecutar con npm.
- `keywords`: palabras clave relacionadas con tu proyecto.
- `author`: el autor de tu proyecto.
- `license`: la licencia de tu proyecto.
- `type`: el tipo de modulo que usas en tu proyecto. Puede ser `commonjs` o `module`. Si usas `module`, puedes usar la sintaxis de importacion de ES6.
- `dependencies`: las dependencias de tu proyecto. Este campo se llena automaticamente cuando instalas una dependencia.

## Instalar dependencias

Para instalar una dependencia, puedes usar el siguiente comando:

```bash
npm install <nombre_dependencia>
```

Esto instalará la dependencia y la añadirá al archivo `package.json` en la sección de `dependencies`. Si quieres instalar una dependencia solo para desarrollo, puedes usar el siguiente comando:

```bash
npm install <nombre_dependencia> --save-dev
```

Si quieres instalar una dependencia de forma global, puedes usar el siguiente comando:

```bash
npm install <nombre_dependencia> -g
```

Esto instalará la dependencia en el directorio global de npm, lo que significa que estará disponible para todos los proyectos en tu máquina. Esto es útil para herramientas de línea de comandos como `nodemon`:

```bash
npm install -g nodemon
```

## Ejecutar scripts

Puedes ejecutar scripts definidos en el archivo `package.json` con el siguiente comando:

```bash
npm run <nombre_script>
```

Un script muy comun es `dev`, que se usa para ejecutar el proyecto en modo desarrollo. Puedes definirlo en el archivo `package.json` de la siguiente manera:

```json
"scripts": {
  "dev": "nodemon -e js,html,css,njk index.js"
}
```

Luego, puedes ejecutar el script con el siguiente comando:

```bash
npm run dev
```
