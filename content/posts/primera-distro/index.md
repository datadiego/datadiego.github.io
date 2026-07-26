---
title: "Tu primera distro da igual"
author: datadiego
draft: false
description: Intentar recomendar distros para un usuario nuevo en Linux es una causa perdida
date: 2026-07-10
tags:
  - hacking
layout: layouts/post.njk
---

Estoy en varias comunidades sobre Linux, tanto hispanohablantes como en inglés. Es raro el día en que no se ven usuarios que quieren empezar a usar Linux pero buscan primero una *recomendación de distro* para alguien que se inicia en estos sistemas operativos.

Es normal, [la paradoja de la elección](https://es.wikipedia.org/wiki/La_paradoja_de_la_elecci%C3%B3n) cuando vamos a cambiar a Linux en usuarios nuevos es un efecto común, y en algunos usuarios es fuente de frustraciones.

Creo que hay una forma de introducir a usuarios nuevos en Linux que evita esto, aunque no sirve **para todo el mundo**. Pero en una gran parte de los usuarios que tienen interés en entrar al mundo de Linux, funciona muy bien.

## Las distros user-friendly

Muchos usuarios buscan en Linux un sustituto a *Windows o Mac*, algo que puedan instalar y usar directamente como sustituto en sus equipos.

Durante muchos años, muchos usuarios de Linux han hecho crecer esta idea, con hilos donde hablan de las *mejores distros para gente que se inicia*, o directamente *diseñadas para usuarios nuevos*. Estas distros además han ido **cambiando con el tiempo**.

Si el usuario va a hacer un uso **muy básico del sistema**, algo similar a:

- Leer y escribir emails.
- Escribir documentos de texto.
- Visitar páginas web.
- Leer y crear PDFs.

Prácticamente cualquier distro actual va a lograr el propósito de ser un reemplazo directo de windows/mac. Tendrá que aprender a instalar paquetes y actualizar el sistema, pero puede utilizar la interfaz gráfica que la mayoría de distros incluyen.

El problema llega con el usuario medio y alto, que usa bastante más software y es más fácil que se frustre si busca un reemplazo directo de su sistema actual.

## Compatibilidad entre sistemas y software

Si el usuario depende de software concreto para su trabajo, o bien ha invertido **muchas horas** en aprender uno que no tiene disponible en Linux, el cambio va a ser frustrante, hablo de software como:

- Microsoft Office
- Cualquier software de Adobe
- Editores de video como Sony Vegas
- DAWs como FL Studio o Ableton

Todos estos van a ser difíciles de ejecutar en su sistema Linux. ¿Hay alternativas? Claro, y en algunas ocasiones, muchos usuarios descubren que incluso tras cientos de horas invertidas en programas como *Adobe Premiere* o *Photoshop*, hay alternativas con ciertas mejoras a lo que ya sabían usar.

Pero si una persona **trabaja** en equipo con otros, comenzará a tener problemas, tus archivos *.psd* de pronto no son del todo compatibles con *Photoshop* y pueden presentar pequeños artefactos o diferencias que en un ámbito profesional van a terminar por hacerte volver a Windows.

Pasa algo similar con el paquete de Office, aunque disponemos de *LibreOffice* y de los servicios de *Google Docs* o *Google Sheets*, en cuanto los vamos a compartir con alguien que usa *Word* o *Excel*, presentarán pequeñas inconsistencias que pueden arruinar el trabajo previo.

En cuanto a la gente que produce música, en Linux pueden encontrar alternativas como *Reaper* o *Bitwig*, e incluso software mucho más experimental que es más fácil de lanzar en Linux que en Windows, pero suelen ser usuarios que han invertido muchas horas en un flujo de trabajo concreto, que dependen de muchos VSTs difíciles de sustituir, y que no pueden ser fácilmente ejecutados sin bastantes horas por nuestra parte.

Me encantaría decir que hay una distro general que podamos recomendar, pero Linux viene acompañado de varios cambios de filosofía de cómo un sistema operativo debe funcionar, algo que muchos usuarios no esperan y que puede crear fricción en un primer momento. Además, cada usuario tiene necesidades específicas que hará que una distro pueda no cumplir *lo que él espera*.

A pesar de todo, la respuesta a *¿qué distro es mejor para empezar?* es **mucho más simple**.

## Tu distro da igual

Todos estos problemas pueden eliminarse rápidamente si cambiamos *lo que esperamos de un sistema con Linux*.

Nuestra mentalidad no debería ser *quiero cambiar mi sistema operativo por Linux*. Más bien, *quiero ver cómo funciona y aprender a usarlo*.

Idealmente, deberías buscar un portátil viejo, instalar una distro que te llame la atención o, literalmente, la primera que consigas hacer que arranque, para empezar a aprender cómo funciona, igual que la primera vez que empezaste a usar un ordenador.

> Recomiendo usar un portátil viejo en lugar de una máquina virtual. La experiencia sobre hardware real es mucho mejor, y tener la VM abierta sobre tu sistema operativo habitual hace que mucha gente simplemente la cierre y vuelva a lo de siempre.

La distro **da igual**, tus primeras semanas en Linux **no dependen de ella**, porque vas a aprender cosas que **todas las distros comparten**:

- Cómo es la estructura de archivos del sistema.
- Cómo navegar, crear y gestionar archivos y directorios.
- El sistema de usuarios y permisos de Linux.
- Cuándo utilizar `root` o `sudo`.
- Comandos básicos de la terminal.
- Cómo instalar y actualizar programas con el gestor de paquetes.
- Alternativas para instalar paquetes, repositorios de terceros, Flatpak e instalación manual.
- Cómo leer la documentación (man y --help).
- Redirecciones, tuberías y pequeños scripts de Bash para automatizar tareas.
- Crear un script de post instalación para los paquetes que quieres siempre en tu distro.

Una vez tienes estos conceptos claros, cambiar de distro es **muy fácil**. Prácticamente el único cambio que notarás será que tu gestor de paquetes es otro, pero cumple el mismo propósito y en muchos casos, el uso es prácticamente igual.

## La libertad tiene un precio

Linux es **muy versátil**, te abre un mundo de posibilidades y personalización, no solo en cuanto al aspecto visual, sino a cómo funciona, prácticamente cualquier sistema de un usuario con buenas bases de Linux es ligeramente diferente en cómo se usa y qué puede hacer, porque cada usuario puede personalizarlo **como él prefiere**.

Esta libertad **tiene un precio**, deberás cambiar la forma en la que piensas y utilizas tu sistema. Por más que una distro pueda ser más amigable, si quieres ser un usuario que realmente exprima el sistema, tendrás que aprender las bases y mantener una mentalidad abierta.

Windows y Mac, como producto, ocultan esta complejidad. Linux **no puede permitirse hacerlo**, expone esta complejidad, pero también la documenta y explica para que el usuario pueda entenderla y gestionarla.

## Adaptarse tras aprender las bases

Todo esto suena a **demasiado trabajo para usar un ordenador**, y creo que está bien ser honesto con la gente que no quiere hacer de su sistema un hobby.

Cambiar a otro sistema operativo siempre presenta varios cambios en cómo debemos hacer muchas cosas, pero la curva de dificultad para hacerlo en Linux es más pronunciada para la gran mayoría de usuarios.

Aun así, lo cierto es que si lo usas a diario, en una semana tendrás todos esos conceptos bien asentados como para empezar a saber si Linux realmente es una buena alternativa a tu sistema operativo actual.

Algunos programas que ya usabas los podrás encontrar directamente en los repositorios oficiales. Otros pueden requerir algo más de trabajo que un `sudo apt install <programa>`, y otros directamente comprobarás que **no están** o dependes de algún apaño creado por la comunidad, que puede funcionar con más o menos éxito.

Deberás mantener una actitud abierta a probar alternativas, en muchos casos te sorprenderá que muchas herramientas son iguales o mejores, y que en cuanto las usas unos cuantos días no hay *tanta fricción* como pensabas.

> El hábito de usar un software concreto durante años es difícil de eliminar. Pero muchas veces encontramos que un flujo de trabajo nuevo puede también ser beneficioso. En algunos casos, además, puedes añadir a tu CV un nuevo software que se usa dentro de tu sector, y demostrar que eres versátil y sabes adaptarte a software nuevo.

## Tras el golpe inicial

Una vez lleves uno o dos meses usando Linux, te resultará mucho más fácil saber si la libertad y el control que ofrece compensan en tu día a día. Quizá descubras que, por motivos de trabajo, un sistema más cerrado pero con mejor soporte para las herramientas que utilizas te resulta más práctico. O puede que prefieras usar Linux en tu ordenador personal y otro sistema operativo para trabajar. También es posible que simplemente decidas seguir con tu sistema anterior.

Una de las ventajas de Linux es que cambiar de opinión suele ser sencillo. En la mayoría de distribuciones no necesitas vincular el sistema a una cuenta de un fabricante para empezar a usarlo, ni dependes de servicios concretos para configurarlo. Tú decides qué software utilizar y qué servicios integrar. No tendrás que hacer mucho más aparte de formatear e instalar Windows de nuevo.

Si por el contrario, cada cosa de las que has ido aprendiendo las has visto como algo que, si bien es diferente a lo que estabas acostumbrado, te va a permitir trabajar de una manera más minimalista y en la que tú tienes total control sobre tu sistema, quédate en Linux, prueba más distros, experimenta con esa libertad y ten en cuenta que, si lo rompes, siempre fue error tuyo y podrás aprender algo nuevo sobre tu sistema :)

