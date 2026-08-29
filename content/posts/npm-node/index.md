+++
author = "datadiego"
draft = false
title = "nvm + npm + pnpm + Node.js 101"
description = "Guia básica de nvm + npm y Node.js"
date = "2025-01-01"
tags = ["coding", "javascript"]
+++


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

### Crear un proyecto

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

### Instalar dependencias

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

### Ejecutar scripts

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

## pnpm

`pnpm` (performant npm) es un gestor de paquetes para Node.js que se ha vuelto muy popular por ser **más rápido** y **más eficiente** que npm. Además, tras los múltiples ataques que ha sufrido npm a lo largo de los años, este gestor es el que se recomienda para desarrollo en este ecosistema.

Su principal diferencia es que **no duplica** las dependencias. En lugar de copiar cada paquete dentro de la carpeta `node_modules` de cada proyecto, `pnpm` guarda todos los paquetes en un **almacén global** (store) y crea **enlaces simbólicos** hacia ellos. Esto hace que:

- Ocupes **mucho menos espacio** en disco: si varias proyectos usan la misma versión de una librería, solo se descarga una vez.
- Las instalaciones sean **más rápidas**, porque no hay que volver a copiar todo en cada proyecto.
- La estructura de `node_modules` sea más **correcta y estricta**, evitando problemas de dependencias "fantasma".

### Instalar pnpm

La forma recomendada de instalarlo es a través de npm o `corepack`:

```bash
npm install -g pnpm
```

### ¿Cómo se usa?

La mayoría de comandos son iguales que npm, solo que con `pnpm`:

```bash
pnpm init -y
pnpm add <nombre_dependencia>
pnpm add <nombre_dependencia> --save-dev
pnpm install
pnpm run dev
```

Como ves, los comandos son muy parecidos, así que si ya conoces npm, te resultará muy natural.

## ¿Por qué pnpm es más seguro que npm?

Más allá de la velocidad y el espacio, pnpm tiene ventajas de **seguridad** importantes. La más destacada está en cómo organiza la carpeta `node_modules`.

### El problema de las dependencias fantasma

Con **npm**, al instalar un paquete, todas sus dependencias transitivas se "aplanan" y se colocan directamente en `node_modules`. Es decir, si instalas `A` y `A` depende de `B`, npm coloca tanto `A` como `B` en la raíz de `node_modules`.

El problema es que tu código (o cualquier paquete) puede **importar `B` directamente**, aunque tú solo declaraste `A` en tu `package.json`. Esto se llama **dependencia fantasma** (ghost dependency). Puede funcionar por casualidad hoy, pero si `A` se actualiza y deja de usar `B`, tu código se romperá sin avisar. Además, es poco seguro porque dependes de paquetes que no has declarado explícitamente.

### La estructura estricta de pnpm

`pnpm` **no aplana** las dependencias. Con `pnpm`, `node_modules` tiene una estructura más estricta y solo los paquetes que **declaras directamente** en tu `package.json` aparecen en la raíz.

```text
node_modules/
└── A/          # solo tus dependencias directas
    └── node_modules/
        └── B/  # las transitivas quedan anidadas dentro de cada paquete
```

Esto significa que **no puedes importar un paquete que no hayas declarado**. Si intentas hacer `import B from 'B'` sin haberlo instalado, Node.js lanzará un error claro de "módulo no encontrado". Esto es más seguro porque:

- **Elimina las dependencias fantasma**: estarás seguro de que lo que importas está realmente declarado en tu proyecto.
- **Evita fallos inesperados** cuando una dependencia transitiva cambia o desaparece.
- **Fuerza buenas prácticas**: todos los paquetes que usas quedan registrados explícitamente en `package.json`.

### Menos superficie de ataque en `node_modules`

Al no copiar cada paquete dentro de cada proyecto, y al enlazar contra un almacén de solo lectura global, pnpm también reduce el riesgo de que un paquete malicioso o comprometido se propague o se modifique fácilmente dentro de un proyecto concreto.

Además, la instalación **no ejecuta scripts de dependencias transitivas por defecto** con tanta permisividad como npm, lo que limita vectores de ataque típicos del ecosistema (como paquetes que ejecutan código malicioso durante la instalación).

