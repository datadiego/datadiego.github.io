---
title: Docker 101
description: Guia básica de Docker
date: 2025-05-08
scheduled: 2025-05-08
tags:
  - devops
  - coding
  - docker
layout: layouts/post.njk
---

Esta guía te enseñará los aspectos más básicos de Docker, desde la instalación hasta la creación de imágenes y contenedores.

## Instalación

Lo mejor es seguir la [guia Oficial](https://docs.docker.com/engine/install/ubuntu/) para instalar siempre la última versión de docker.

## Configuracion

Necesitarás iniciar el servicio de docker y añadir tu usuario al grupo de docker para poder ejecutar los comandos sin `sudo`:

```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## Hello World:

Comprueba que todo funciona correctamente ejecutando el siguiente comando:

```bash
docker run hello-world
```

>Si ves un mensaje de éxito, ya tienes docker instalado y funcionando correctamente.

## ¿Qué es Docker?

Docker resuelve un problema recurrente en el desarrollo de software: la portabilidad. Cuando desarrollas una aplicación en tu ordenador y puedes arrancarla sin problemas es porque tienes todas las dependencias necesarias instaladas. Pero cuando intentas ejecutar esa misma aplicación en otro ordenador, puede que no funcione porque faltan librerías o dependencias.

Esto es un problema común, vuelve el desarrollo de software un proceso tedioso en el que muchas personas pasan horas intentando resolver problemas de compatibilidad manteniendo multiples entornos con diferentes versiones de librerías y dependencias. Además, si tienes que desplegar tu aplicación en un servidor, puede que no funcione porque el servidor tiene una versión diferente de una librería o una configuración diferente.

Docker resuelve este problema creando un contenedor que incluye todo lo necesario para ejecutar la aplicación: el código, las librerías, las dependencias y el sistema operativo. De esta forma, puedes ejecutar la misma aplicación en cualquier ordenador que tenga Docker instalado, sin preocuparte por las diferencias entre los entornos de ejecución.

Algunos usos comunes de Docker son:
- Desarrollar aplicaciones en entornos aislados.
- Desplegar aplicaciones en servidores.
- Crear entornos de desarrollo y producción consistentes y reproducibles.
- Crear entornos de prueba para aplicaciones.
- Crear laboratorios de seguridad para practicar hacking ético.
- Lanzar aplicaciones en la nube o localmente de forma más simple y sin tener que aprender ecosistemas enteros de herramientas.

Para entender mejor cómo funciona Docker, es importante conocer dos conceptos clave: imágenes y contenedores.

### Imágenes

Una imagen es el resultado de empaquetar una aplicación y todas sus dependencias. A partir de esta imagen, Docker puede crear un contenedor. Las imágenes son inmutables, lo que significa que no puedes cambiar una imagen una vez que ha sido creada. Si necesitas hacer cambios en la aplicación, debes crear una nueva imagen.

La forma de crear una imagen es mediante un archivo llamado `Dockerfile`. Este archivo contiene una serie de instrucciones que Docker utiliza para construir la imagen. Por ejemplo, puedes especificar qué sistema operativo utilizar, qué librerías instalar y cómo ejecutar la aplicación.

Un ejemplo de un `Dockerfile` para una aplicación en NodeJS con Express podría ser el siguiente:

```dockerfile
# Usa la imagen oficial de Node.js como base
FROM node:14
# Establece el directorio de trabajo
WORKDIR /usr/src/app
# Copia el package.json y package-lock.json
COPY package*.json ./
# Instala las dependencias
RUN npm install
# Copia el resto del código de la aplicación
COPY . .
# Expone el puerto 3000
EXPOSE 3000
# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
```

Puedes crear una imagen a partir de un `Dockerfile` utilizando el siguiente comando:

```bash
docker build -t <nombre_imagen> .
```

> El `.` al final del comando indica que el `Dockerfile` se encuentra en el directorio actual. Puedes especificar una ruta diferente.
> El `-t` indica que quieres etiquetar la imagen con un nombre. 

Luego, puedes ver todas las imágenes que tienes en tu ordenador utilizando el siguiente comando:

```bash
docker images
```

### Contenedores

>Un contenedor es una *unidad de software que empaqueta codigo y dependencias* necesarias para ejecutar una aplicación. Un contenedor es un entorno aislado que incluye todo lo necesario para ejecutar la aplicación, incluyendo el sistema operativo, las librerías y las dependencias. 

Esto significa que puedes ejecutar la misma aplicación en cualquier ordenador que tenga Docker instalado, sin preocuparte por las diferencias entre los entornos de ejecución.

Puedes pensar en un contenedor como una pequeña máquina virtual a la que se le ha quitado todo hasta dejar lo necesario para ejecutar la aplicación. Esto hace que los contenedores sean mucho más ligeros y rápidos de arrancar que las máquinas virtuales, ya que no necesitan cargar un sistema operativo completo. Además, los contenedores son portables, lo que significa que puedes moverlos de un ordenador a otro sin problemas. Si tienes un contenedor que funciona en tu ordenador, también funcionará en el servidor, en la nube o en cualquier otro ordenador que tenga Docker instalado.

Puedes crear un contenedor a partir de una imagen utilizando el siguiente comando:

```bash
docker run -d -p 80:3000 <nombre_imagen>
```

> El `-d` indica que quieres ejecutar el contenedor en segundo plano (detached mode).
> El `-p` indica que quieres mapear el puerto 80 del host al puerto 3000 del contenedor. Esto significa que si accedes a `http://localhost`, estarás accediendo al puerto 3000 del contenedor.
> El `<nombre_imagen>` es el nombre de la imagen que quieres ejecutar.
> Si no especificas un nombre de imagen, Docker buscará una imagen llamada `latest` por defecto.

## Comprobar contenedores

Puedes ver los contenedores que estan en ejecución con:

```bash
docker ps
```
> Si quieres ver todos los contenedores, incluyendo los que están parados:
```bash
docker ps -a
```
> Si quieres parar un contenedor:
```bash
docker stop <nombre_contenedor>
```
> Si quieres iniciar un contenedor parado:
```bash
docker restart <nombre_contenedor>
```
> Si quieres reiniciar un contenedor en ejecución:
```bash
docker restart <nombre_contenedor>
```

## Eliminar imagenes

En algun momento necesitarás eliminar imagenes y contenedores que no usas o que no funcionan como esperabas. Para eliminar imagenes puedes usar el siguiente comando:

```bash
docker rmi <id_imagen>
```

> Si quieres eliminar todas las imagenes que no están siendo utilizadas por ningun contenedor, puedes utilizar el siguiente comando:
```bash
docker rmi $(docker images -f "dangling=true" -q)
```
> Si quieres eliminar todas las imagenes, puedes utilizar el siguiente comando:
```bash
docker rmi $(docker images -q)
```
> Puedes forzar la eliminación de una imagen utilizando el siguiente comando:
```bash
docker rmi -f <id_imagen>
```

## Eliminar contenedores

Para eliminar contenedores es muy similar:

```bash
docker rm <id_contenedor>
```

> Si quieres eliminar todos los contenedores, puedes utilizar el siguiente comando:
```bash
docker rm $(docker ps -a -q)
```
> Puedes forzar la eliminación de un contenedor utilizando el siguiente comando:
```bash
docker rm -f <id_contenedor>
```