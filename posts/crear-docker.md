---
title: Dockerfile a fondo
description: Guia para crear imagenes de docker a partir de un Dockerfile
date: 2025-05-12
scheduled: 2025-05-12
tags:
  - devops
  - coding
  - docker
layout: layouts/post.njk
---

Los `Dockerfile` son los archivos básicos usados para crear imágenes de Docker.

Un `Dockerfile` no es mas que un archivo de texto que contiene las instrucciones necesarias para crear un servicio o aplicación. Estas instrucciones son leídas por Docker y se ejecutan en el orden en que aparecen en el archivo.

## Creando un Dockerfile básico

Vamos a crear un contenedor básico que use `Ubuntu` como base:

```
# Usa la imagen oficial de Ubuntu como base
FROM ubuntu:latest
# Establece el directorio de trabajo
WORKDIR /cyber
# devuelve una terminal
CMD ["/bin/bash"]
```

Construye tu imagen con `docker build -t test .`

Luego, ejecuta el contenedor con `docker run -it test`

Esto te devolverá una terminal dentro del contenedor, puedes usarla como si fuera un sistema operativo normal, instalar paquetes, crear archivos, etc.

## Instrucciones básicas

Partiendo del ejemplo anterior, vamos a ver las instrucciones más comunes que encontrarás en un `Dockerfile`:

### FROM

La instrucción `FROM` se usa para especificar que imagen se usa como base para crear nuestra imagen.

Algunos ejemplos de imágenes base:

```
FROM ubuntu:latest
FROM python:latest
FROM node:latest
FROM mysql:latest
FROM ctfd:latest
FROM datadiego/ejemplo:latest
```

Esta instrucción es obligatoria y debe ser la primera en el `Dockerfile`.

### WORKDIR

La instrucción `WORKDIR` se usa para establecer el directorio de trabajo dentro del contenedor. Este directorio es donde se ejecutarán las instrucciones siguientes.

Si accedes al contenedor, el directorio de trabajo será el que hayas especificado en esta instrucción.

### CMD

La instrucción `CMD` se usa para especificar el comando que se ejecutará cuando se inicie el contenedor. Este comando se ejecutará en el directorio de trabajo especificado por la instrucción `WORKDIR`.

**SOLO** se ejecutará al crear el contenedor, si quieres ejecutar un comando cada vez que inicies el contenedor, usa la instrucción `ENTRYPOINT` en su lugar.

Algunos ejemplos de comandos utiles para Docker:

```
CMD ["python", "app.py"] # ejecutar un script de python
CMD ["node", "app.js"] # ejecutar un script de node
CMD ["nginx", "-g", "daemon off;"] # ejecutar nginx
CMD ["/bin/bash"] # abrir una terminal
CMD ["python3", "-m", "http.server"] # ejecutar un servidor web en python
```

### RUN

La instrucción `RUN` se usa para ejecutar un comando en el contenedor durante la construcción de la imagen. Este comando se ejecutará en el directorio de trabajo especificado por la instrucción `WORKDIR`.

Es útil para instalar paquetes o ejecutar scripts que son necesarios para la aplicación.

Vamos a añadir un par de instrucciones `RUN` al `Dockerfile` que creamos al principio:

```
FROM ubuntu:latest
WORKDIR /cyber
RUN apt-get update
RUN apt-get install -y figlet
RUN figlet "Hola Mundo" > test.txt
CMD ["/bin/bash"]
```

Vuelve a construir la imagen y ejecutar el contenedor. Deberías ver un archivo llamado `test.txt` en tu directorio de trabajo con el siguiente contenido:

```
datadiego@/tmp/test docker run -it testdocker
root@737d06c77b19:/cyber# ls
test.txt
root@737d06c77b19:/cyber# cat test.txt 
 _   _       _         __  __                 _       
| | | | ___ | | __ _  |  \/  |_   _ _ __   __| | ___  
| |_| |/ _ \| |/ _` | | |\/| | | | | '_ \ / _` |/ _ \ 
|  _  | (_) | | (_| | | |  | | |_| | | | | (_| | (_) |
|_| |_|\___/|_|\__,_| |_|  |_|\__,_|_| |_|\__,_|\___/ 
                                                      
root@737d06c77b19:/cyber# 
```

## COPY

La instrucción `COPY` se usa para copiar archivos o directorios desde el host al contenedor. Esta instrucción se ejecutará en el directorio de trabajo especificado por la instrucción `WORKDIR`.

```
COPY <fuente> <destino>
```

Crea un archivo `prueba.txt` en el mismo directorio que el `Dockerfile` y añade el siguiente contenido:

```
COPY prueba.txt /cyber
```

Al construir la imagen y ejecutar el contenedor, deberías ver un archivo llamado `prueba.txt` en tu directorio de trabajo con el contenido que hayas escrito en el archivo.

## ENV
La instrucción `ENV` se usa para establecer variables de entorno dentro del contenedor. Estas variables estarán disponibles para cualquier comando que se ejecute en el contenedor.

```
ENV <nombre_variable> <valor_variable>
ENV NODE_ENV=production
ENV PORT=3000
```

En algunos casos, puedes ver que se usa la instrucción `ENV` para declarar variables sensibles como contraseñas o tokens de acceso. Evita hacer esto, en su lugar, usa la instrucción `ARG`.

## ARG

La instrucción `ARG` se usa para declarar variables que se pueden pasar al contenedor durante la construcción de la imagen. Estas variables no estarán disponibles en el contenedor, pero se pueden usar para personalizar la construcción de la imagen. Por ejemplo:

```
ARG PORT
ARG NODE_ENV=production
```

El primer argumento `PORT` no tiene valor por defecto, por lo que tendrás que pasarlo al construir la imagen. El segundo argumento `NODE_ENV` tiene un valor por defecto de `production`, pero puedes cambiarlo al construir la imagen, por ejemplo:

```
docker build --build-arg PORT=3000 --build-arg NODE_ENV=development -t test .
```

Esto pasará los argumentos al contenedor y podrás usarlos en el `Dockerfile` como variables de entorno de forma segura.

## EXPOSE

Por defecto, los contenedores de Docker no exponen puertos al host por seguridad. Si necesitas disponer de un puerto para accederlo desde el host que ejecuta el contenedor, tendrás que usar la instrucción `EXPOSE` para exponer el puerto al host.

```
FROM node:latest
WORKDIR /cyber
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
```

Este `Dockerfile` parte de la imagen oficial de `node`, establece un directorio de trabajo, copia todo el contenido del directorio actual al contenedor, instala npm y expone el puerto 3000 al host. Luego, ejecuta el comando `node app.js` para iniciar la aplicación.

