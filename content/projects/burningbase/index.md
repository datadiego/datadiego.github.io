---
title: "Burningbase"
draft: false
description: Herramienta de pentesting
repo: "https://github.com/datadiego/burningbase"
link: ""
---

Extrae todos los datos expuestos de manera automatizada en páginas que usen Firebase en su frontend, solo necesitas la url, burningbase buscará recursivamente el sitio en busca de las credenciales e intentará extraer por fuerza bruta los datos almacenados.

## La idea

La aplicación surgió por dos situaciones:

- Un alumno utilizaba continuamente herramientas de inteligencia artificial para sus proyectos, y el stack era siempre el mismo, *Firebase* para su base de datos, y *Vercel* para hostear los archivos.
- No dejaba de ver la misma combinación de tecnologías en foros de reddit sobre programación en aplicaciones *vibecodeadas*.

Si bien las aplicaciones del alumno funcionaban, tenían un grave problema de permisos, y por más que le demostraba que **Firebase no era problema**, que él era quien estaba dejando abierta su base de datos al resto del mundo, y regalando las claves de acceso en el frontend, seguía usandolas.

## Apuntando a objetivos fáciles

Cuando se realizan ataques a aplicaciones web, en muchos casos se busca la fruta que cuelga baja, son **objetivos fáciles o triviales de atacar**, que no presentan un reto, por encima de otros más protegidos y difíciles de realizar.

**Firebase** es una opción **muy atractiva** para un agente al que se le ha pedido que nuestra app necesita una base de datos sin darle más información.

- No necesita un backend.
- Todo va al front, con las credenciales expuestas.
- El usuario no tiene que hacer gran cosa salvo crear el proyecto dentro del dashboard de Firebase y dejar trabajar al agente.

Pero los permisos por defecto que se configuran en cualquier proyecto de firebase son **terriblemente inseguros**.

En cuanto probé con un par de aplicaciones de reddit el mismo proceso que con mi alumno, vi que *la mayoría de estas apps* dejaban la configuración por defecto, y que cualquiera podía acceder a **todo** lo que había almacenado.

No solo eso, la mayoría usan servicios como *netlify*, *vercel* o la propia *firebase* para hostear gratuitamente el proyecto, por lo que usar **google dorks** como estos:

```
site:vercel.app
site:netlify.app login
site:github.io dashboard
site:pages.dev admin
```

Volvía trivial el poder encontrar páginas que muy posiblemente usaran esta tecnología.

## La aplicación

`burningbase` es extremadamente simple de usar. Solo necesitas pasarle una URL y el modo de ataque que quieres realizar para que comience a buscar recursivamente en la página hasta encontrar un archivo `js` que haga uso de firebase.

También incluye un modo totalmente automatizado:

```bash
burningbase -m full-scan -u https://ejemplo.web.app
```

Una vez encuentre que el sitio usa Firebase, intentará autenticarse de manera anónima o mediante un email, y luego realizar un ataque de fuerza bruta mediante varios diccionarios incluidos en la propia aplicación, aunque se pueden proveer personalizados.

Si encuentra algo, puede extraer el *json* con los resultados en el directorio que especifiques.

## El resultado

Encontré más de 150 páginas vulnerables durante el desarrollo de la aplicación. 

Muchas eran simples MVPs o proyectos de demostración. Pero una gran cantidad eran **negocios reales**, con información que incluía **menores de edad**, y en algunos casos incluso **aplicaciones subvencionadas por el Gobierno de España y la Unión Europea** que exponían nombre, telefono, dirección, email y localización actual de sus usuarios.

Escribí ofreciendo ayuda a las aplicaciones que realmente exponían información sensible de los usuarios. En algunos casos pude ayudarles, en otros nunca hubo respuesta alguna.
