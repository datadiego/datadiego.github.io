---
title: Dockerfile a fondo
description: Guia para crear imagenes de docker a partir de un Dockerfile
date: 2025-05-08
scheduled: 2025-05-08
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

```Dockerfile
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

```Dockerfile
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

```Dockerfile
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

```Dockerfile
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

```Dockerfile
COPY <fuente> <destino>
```

Crea un archivo `prueba.txt` en el mismo directorio que el `Dockerfile` y añade el siguiente contenido:

```
COPY prueba.txt /cyber
```

Al construir la imagen y ejecutar el contenedor, deberías ver un archivo llamado `prueba.txt` en tu directorio de trabajo con el contenido que hayas escrito en el archivo.