---
title: Entorno Docker + MySQL
description: Como crear un entorno de desarrollo con Docker y MySQL
date: 2025-05-12
scheduled: 2025-05-12
tags:
  - coding
  - docker
layout: layouts/post.njk
---

MySQL es uno de los sistemas de gestión de bases de datos más populares y ampliamente utilizados en el mundo. Sin embargo, a veces puede ser complicado configurar un entorno de desarrollo para trabajar con MySQL. Afortunadamente, Docker hace que sea mucho más fácil crear y gestionar entornos de desarrollo.

Usar Docker para crear un entorno de desarrollo con MySQL tiene varias ventajas:

- **Aislamiento**: Cada contenedor de Docker es independiente, lo que significa que puedes tener múltiples versiones de MySQL en tu máquina sin conflictos.
- **Portabilidad**: Puedes compartir tu entorno de desarrollo con otros desarrolladores simplemente compartiendo el archivo `docker-compose.yml` o el `Dockerfile` que usaste para crear el contenedor.
- **Facilidad de uso**: Docker simplifica la instalación y configuración de MySQL, evitarás tener que lidiar con dependencias y configuraciones complicadas en una máquina local.
- **Reproducibilidad**: Puedes crear un entorno de desarrollo idéntico en cualquier máquina que tenga Docker instalado, lo que facilita la colaboración entre desarrolladores.
- **Despliegue**: Puedes usar el mismo contenedor de Docker para desplegar tu aplicación en producción, lo que facilita la transición de desarrollo a producción.

## Estructura del entorno

Este entorno tiene una estructura bastante simple:

```bash
.
├── Dockerfile
├── launch.sh
├── mysqld.cnf
└── paneldb_dump.sql
```

- **Dockerfile**: Este archivo contiene las instrucciones para construir la imagen de Docker que se usará para crear el contenedor de MySQL.
- **launch.sh**: Este script se encarga de iniciar el contenedor de MySQL y ejecutar el script de volcado de la base de datos, es opcional, pero puede ayudar a automatizar el proceso de configuración.
- **mysqld.cnf**: Este archivo contiene la configuración de MySQL que se usará al iniciar el contenedor.
- **paneldb_dump.sql**: Este archivo contiene el volcado de la base de datos que se usará para inicializar la base de datos en el contenedor de MySQL. Puedes usar un volcado de tu propia base de datos o crear uno nuevo desde cero.

## Dockerfile

```dockerfile
FROM mysql:latest

# Variables de entorno (ajústalas a tu gusto)
ENV MYSQL_ROOT_PASSWORD=pass1234
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=diego
ENV MYSQL_PASSWORD=secret1234

# Copia el script de inicialización al directorio de entrada de MySQL
COPY init.sql /docker-entrypoint-initdb.d/

# Copia el archivo de configuración personalizado
COPY mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf

# Exponer el puerto 3306
EXPOSE 3306
```

> **Nota**: Asegúrate de ajustar las variables de entorno a tus necesidades. `MYSQL_ROOT_PASSWORD` es la contraseña del usuario root, `MYSQL_DATABASE` es el nombre de la base de datos que se creará al iniciar el contenedor, `MYSQL_USER` y `MYSQL_PASSWORD` son el nombre de usuario y la contraseña del usuario que se creará.
> Por defecto busca el archivo en `mysql.conf.d`, puedes cambiarlo a tu gusto para aplicar la configuración que necesites.
> Tambien busca el archivo `init.sql` en el directorio de trabajo, este archivo creará la base de datos y las tablas necesarias al iniciar el contenedor. Puedes usar un volcado de tu propia base de datos o crear uno nuevo desde cero.

## mysqld.cnf

```
[mysqld]
bind-address = 0.0.0.0
```

> **Nota**: Este archivo de configuración es muy básico y solo establece la dirección de enlace para que MySQL escuche en todas las interfaces de red. Puedes agregar más configuraciones según tus necesidades.

## init.sql

Archivo de inicialización de la base de datos. Puedes usar un volcado de tu propia base de datos o crear uno nuevo desde cero.

```sql
CREATE DATABASE IF NOT EXISTS CTF;
USE CTF;


CREATE TABLE CTF.Usuarios (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

INSERT INTO CTF.Usuarios (nombre, telefono, correo)
VALUES 
('Ana Martínez', '644123456', 'ana.martinez@email.com'),
('Carlos Gómez', '622987654', 'carlos.gomez@email.com'),
('Lucía Rodríguez', '699112233', 'lucia.rodriguez@email.com'),
('Miguel Torres', '655334455', 'miguel.torres@email.com'),
('Laura Fernández', '677889900', 'laura.fernandez@email.com'),
('Pablo Ramírez', '611223344', 'pablo.ramirez@email.com'),
('Sofía Herrera', '633445566', 'sofia.herrera@email.com'),
('Javier Morales', '644556677', 'javier.morales@email.com'),
('Isabel Cruz', '655667788', 'isabel.cruz@email.com'),
('David Navarro', '666778899', 'david.navarro@email.com'),
('María López', '611889900', 'maria.lopez@email.com'),
('Alejandro Pérez', '622334455', 'alejandro.perez@email.com'),
('Carmen Sánchez', '633112233', 'carmen.sanchez@email.com'),
('Daniel Ortega', '644223344', 'daniel.ortega@email.com'),
('Patricia Ramos', '655334466', 'patricia.ramos@email.com'),
('Andrés Gutiérrez', '666445577', 'andres.gutierrez@email.com'),
('Elena Castro', '611556677', 'elena.castro@email.com'),
('Luis Mendoza', '622667788', 'luis.mendoza@email.com'),
('Natalia Vega', '633778899', 'natalia.vega@email.com'),
('Fernando Ruiz', '644889900', 'fernando.ruiz@email.com'),
('Sara Domínguez', '655990011', 'sara.dominguez@email.com'),
('Roberto Álvarez', '666112233', 'roberto.alvarez@email.com'),
('Claudia Serrano', '611223355', 'claudia.serrano@email.com'),
('Iván Pacheco', '622334466', 'ivan.pacheco@email.com'),
('Beatriz León', '633445577', 'beatriz.leon@email.com'),
('Manuel Iglesias', '644556688', 'manuel.iglesias@email.com'),
('Victoria Silva', '655667799', 'victoria.silva@email.com'),
('Francisco Rojas', '666778800', 'francisco.rojas@email.com'),
('Julia Muñoz', '611889911', 'julia.munoz@email.com'),
('Alberto Flores', '622990022', 'alberto.flores@email.com');

-- SHOW DATABASES;
-- USE Almacen;
-- SHOW TABLES;
```

## Contstrucción de la imagen

Para construir la imagen, haz un `docker build` en la carpeta donde se encuentra el `Dockerfile`:

```bash
docker build -t mysql-test .
```

## Ejecución del contenedor
Para ejecutar el contenedor, puedes usar el siguiente comando:

```bash
docker run -d --name mysql-test -p 3306:3306 mysql-test
```

Esto iniciará el contenedor en segundo plano (`-d` significa "detached") y mapeará el puerto 3306 del contenedor al puerto 3306 de tu máquina local. Puedes cambiar el nombre del contenedor y el puerto según tus necesidades.

Puedes lanzar `docker exec -it <container_id> mysql -u root -p` para acceder a la consola de MySQL dentro del contenedor. Te pedirá la contraseña que configuraste en el `Dockerfile` (en este caso, `pass1234`).