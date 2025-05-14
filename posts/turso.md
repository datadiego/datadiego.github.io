---
title: Turso 101
description: Guia para empezar a usar Turso y comunicarla mediante Python
date: 2025-05-14
scheduled: 2025-05-14
tags:
  - devops
  - coding
  - bases de datos
layout: layouts/post.njk
---

Turso es un servicio de base de datos en la nube, te permite crear bases de datos SQL en la nube sin tener que preocuparte por la infraestructura de servidor.

Turso está basado en [LibSQL](https://github.com/tursodatabase/libsql), un fork del conocido [SQLite](https://www.sqlite.org/), lo que significa que puedes usar SQLite para empezar el desarrollo localmente y luego desplegarlo en Turso, facilitando la migración de tu aplicación a la nube.

Aunque puedes usar la [documentación oficial](https://docs.turso.tech/quickstart) para empezar a usar Turso, aquí tienes una guía rápida para comenzar.

## Instalación

Crea una cuenta e [inicia sesión](https://app.turso.tech/login) en Turso.

Lanza el siguiente comando para instalar la herramienta de línea de comandos de Turso:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

Prueba a lanzar `turso` en la terminal para ver si se instaló correctamente y los comandos disponibles:

```bash
datadiego@~ turso
Turso CLI

Usage:
  turso [command]

Available Commands:
  auth         Authenticate with Turso
  config       Manage your CLI configuration
  db           Manage databases
  dev          starts a local development server for Turso
  group        Manage your database groups
  help         Help about any command
  org          Manage your organizations
  plan         Manage your organization plan
  quickstart   New to Turso? Start here!
  relax        Sometimes you feel like you're working too hard... relax!
  update       Update the CLI to the latest version

Flags:
  -c, --config-path string   Path to the directory with config file
  -h, --help                 help for turso
  -v, --version              version for turso

Use "turso [command] --help" for more information about a command.
```
## Iniciar sesión

Vamos a iniciar sesión en Turso desde la línea de comandos. Ejecuta el siguiente comando:

```bash
turso auth login
```

Se abrirá una ventana del navegador donde podrás iniciar sesión en tu cuenta de Turso. Una vez que hayas iniciado sesión, vuelve a la terminal y verás un mensaje de éxito:

```bash
Unable to detect profile file location. Please add the following to your profile file:

export PATH="/home/datadiego/.turso:$PATH"

Turso CLI installed!

If you are a new user, you can sign up with turso auth signup.

If you already have an account, please login with turso auth login.

Already signed up as datadiego

You can disable automatic updates with turso config set autoupdate off
```

Podemos añadir el `PATH` a nuestro archivo de perfil para que la herramienta de línea de comandos de Turso esté disponible en cualquier lugar. Abre el archivo `~/.bashrc` o `~/.zshrc` y añade la siguiente línea al final del archivo:

```bash
export PATH="/home/datadiego/.turso:$PATH"
```

> Asegúrate de usar **tu** ruta de instalación de Turso, que puede ser diferente a la mía.

## Crear una base de datos

Usamos el comando `turso db create <nombre>` para crear una nueva base de datos:

```bash
datadiego@~ turso db create datatest
Created database datatest at group testing in 624ms.

Start an interactive SQL shell with:

   turso db shell datatest

To see information about the database, including a connection URL, run:

   turso db show datatest

To get an authentication token for the database, run:

   turso db tokens create datatest
```

Nos da tres opciones para interactuar con la base de datos:
- Abrir una consola SQL interactiva con `turso db shell <nombre>`. Esto nos permite ejecutar consultas SQL directamente en la base de datos.
- Ver información sobre la base de datos con `turso db show <nombre>`. Esto nos da información sobre la base de datos, incluyendo la URL de conexión.
- Crear un token de autenticación con `turso db tokens create <nombre>`. Esto es necesario para conectarnos a la base de datos desde nuestra aplicación, pero para interactuar directamente desde la línea de comandos no es necesario.

## Información de la base de datos

Si lanzas `db show <nombre>` verás algo similar a esto:

```bash
datadiego@~ turso db show datatest
Name:               datatest
URL:                libsql://datatest-datadiego.aws-eu-west-1.turso.io
ID:                 853e12c4-a30c-4086-9418-a9549cba052d
Group:              testing
Version:            tech-preview
Locations:          aws-eu-west-1
Size:               0 B
Archived:           No
Bytes Synced:       0 B
Is Schema:          No
Delete Protection:  No

Database Instances:
NAME              TYPE        LOCATION      
aws-eu-west-1     primary     aws-eu-west-1  
```

Algunos campos importantes a tener en cuenta:

- **Name**: Nombre de la base de datos.
- **URL**: URL de conexión a la base de datos. Esta es la URL que usaremos para conectarnos a la base de datos desde nuestra aplicación.
- **ID**: ID de la base de datos.
- **Group**: Grupo al que pertenece la base de datos. Los grupos son una forma de organizar tus bases de datos en Turso.
- **Locations**: Ubicación de la base de datos. Esto es importante para la latencia y el rendimiento de la base de datos.

## Crear una base de tabla

Iniciamos una shell de SQL con `turso db shell <nombre>`:

```bash
turso db shell datatest
```

Y mandamos nuestra primera query de SQL:

```sql
CREATE TABLE users (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  points INTEGER DEFAULT 0
);
```

Ahora podemos ver la tabla creada con el comando `.tables`:

```bash
datadiego@~ turso db shell datatest
Connected to datatest at libsql://datatest-datadiego.aws-eu-west-1.turso.io

Welcome to Turso SQL shell!

Type ".quit" to exit the shell and ".help" to list all available commands.

→  CREATE TABLE users (
...   ID INTEGER PRIMARY KEY AUTOINCREMENT,
...   name TEXT NOT NULL,
...   points INTEGER DEFAULT 0
... );
→  .tables
users 
```

Si introducimos `.schema` veremos la definición de la tabla:

```sql
→  .schema
CREATE TABLE users (                      
ID INTEGER PRIMARY KEY AUTOINCREMENT,     
name TEXT NOT NULL,                       
points INTEGER DEFAULT 0                  
);  
```

Podemos insertar datos en la tabla con el comando `INSERT`:

```sql
INSERT INTO users (name, points) VALUES ('test1', NULL);
INSERT INTO users (name, points) VALUES ('test2', 10);
```

Y consultar los datos con `SELECT`:

```sql
→  select * from users;
ID     NAME      POINTS 
1      test2     10         
2      test1     NULL 
```

## Salir de la shell
Para salir de la shell de SQL, simplemente escribe `.quit` y presiona `Enter`:

```sql
→  .quit
datadiego@~ 
```

## Conectar Turso a tu aplicación
Para conectarte a Turso desde tu aplicación, necesitas el token de autenticación. Puedes crear un token con el siguiente comando:

```bash
turso db tokens create <nombre>
```

> Sustituye `<nombre>` por el nombre de tu base de datos.

Necesitarás también la URL de conexión, puedes verla con `turso db show --url <nombre>`:

```bash
datadiego@~ turso db tokens create datatest
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDcyMjE4NTQsImlkIjoiODUzZTEyYzQtYTMwYy00MDg2LTk0MTgtYTk1NDljYmEwNTJkIiwicmlkIjoiM2ZlZWFlZWUtMjRmOC00OGFlLWI0YmMtMGI0Y2VlOTVlZWI1In0.OtyHJK4zXzStfyD2h-3KVaS9xuEiSL7nvGxZSTh07rdnWlKQsjpR_z04d3yCGqeo60hb6X9VPBhu8dMlSwFMDQ
datadiego@~ turso db show --url datatest
libsql://datatest-datadiego.aws-eu-west-1.turso.io
```

Guardaremos el token y la URL de conexión en un archivo `.env` para usarlos en nuestra aplicación:

```bash
TURSO_DATABASE_URL=libsql://datatest-datadiego.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDcyMjE4NTQsImlkIjoiODUzZTEyYzQtYTMwYy00MDg2LTk0MTgtYTk1NDljYmEwNTJkIiwicmlkIjoiM2ZlZWFlZWUtMjRmOC00OGFlLWI0YmMtMGI0Y2VlOTVlZWI1In0.OtyHJK4zXzStfyD2h-3KVaS9xuEiSL7nvGxZSTh07rdnWlKQsjpR_z04d3yCGqeo60hb6X9VPBhu8dMlSwFMDQ
```

> Asegúrate de no subir este archivo a tu repositorio ni de compartir el token con nadie.

Teniendo nuestro `.env` listo, vamos a usar `Python` para conectarnos.

Iniciamos un entorno virtual con `uv` o `venv`, lo activamos y descargamos las dependencias necesarias:

```bash
datadiego@~/codebase/guias/tursotest uv venv
Using CPython 3.12.3 interpreter at: /usr/bin/python3
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate
datadiego@~/codebase/guias/tursotest source .venv/bin/activate
(tursotest) datadiego@~/codebase/guias/tursotest uv pip install libsql-experimental
Resolved 1 package in 440ms
Prepared 1 package in 590ms
Installed 1 package in 3ms
 + libsql-experimental==0.0.50
(tursotest) datadiego@~/codebase/guias/tursotest uv pip 
install dotenv
Resolved 2 packages in 193ms
Prepared 2 packages in 23ms
Installed 2 packages in 6ms
 + dotenv==0.9.9
 + python-dotenv==1.1.0
```

Crea `main.py` y añade el siguiente código:

```python
import libsql_experimental as libsql
import os
import dotenv
dotenv.load_dotenv()
url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

conn = libsql.connect("hello.db", sync_url=url, auth_token=auth_token)
conn.sync()
#select all from users;
users = conn.execute("select * from users").fetchall()
print(users)
```

Ejecuta el script y verás los datos de la tabla `users`:

```bash
(tursotest) datadiego@~/codebase/guias/tursotest python main.py
[(1, 'test2', 10), (2, 'test1', None)]
```

Puedes ver como conectarte a Turso usando otros SDKs en la [documentación oficial](https://docs.turso.tech/sdk/introduction)

Si no hay un SDK disponible de forma oficial o de la comunidad, puedes usarlo directamente con [peticiones HTTP](https://docs.turso.tech/sdk/http/quickstart).

## Revocar tokens

Puedes eliminar los tokens de autenticación de la base de datos con `turso db tokens invalidate <nombre>`:

```bash
datadiego@~ turso db tokens invalidate datatest
To invalidate datatest database tokens, all its replicas must be restarted.
All your active connections to the DB will be dropped and there will be a short downtime.

Are you sure you want to do this? [y/n]: y
✔  Success! Tokens invalidated successfully. 
Run turso db tokens create <database-name> [flags] to get a new one!
```

## Destruir la base de datos

Si ya no necesitas la base de datos, puedes eliminarla con `turso db destroy <nombre>`:

```bash
datadiego@~ turso db destroy datatest                    
Database datatest and all its data will be destroyed.
Are you sure you want to do this? [y/n]: y
Destroyed database datatest in 1.037s.
```