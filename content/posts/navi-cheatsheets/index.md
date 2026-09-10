---
title: "Cheatsheets en Linux"
author: datadiego
draft: true
description: Como no volver a olvidar comandos en tu distro
date: 2026-09-10
tags:
  - linux
layout: layouts/post.njk
---

Da igual si eres nuevo en Linux o llevar usándolo años, los comandos se olvidan.

A base de usar a diario el sistema y tirar de terminal vas a saber los más comunes y que siempre usas, con esos no tendrás problema. Pero muchos son **largos**, en ocasiones con varios pipes, y además **no se usan a diario**.

La mayoría de usuarios tenemos algun directorio en nuestro sistema con varios archivos *Markdown* donde escribimos nuestras guias y comandos. Buscar entre ellos no es difícil, pero no es lo mejor.

En este post vamos a tratar como recordar comandos, que herramientas tenemos en linux para aliviar esta tarea, y como usarlas en nuestro dia a dia.

Primero empezaremos por recordar las formas más comunes de informarnos sobre comandos:

## man

La herramienta `man` viene incluida en cualquier distro, su uso es simple `man <comando>`:

```bash
man mkdir
```

Esta nos mostrará el manual completo del comando que necesitamos, junto a una explicación de sus *flags* y opciones disponibles.

No es una opción rápida, pero en muchas ocasiones tendremos muy buena información aqui.

## --help

Esta es una opción disponible en muchos comandos, similar a `man`, nos mostrará que podemos hacer con el comando, y que opciones podemos usar, de manera mucho más resumida que `man`.

```bash
grep --help
```

Aún así, no esperes ejemplos en la mayoría de casos, pero es la opción más rápida si necesitas saber que flags tienes disponibles y que hace cada una.

## history | grep "comando"

Si mandaste un comando hace un tiempo y solo recuerdas una parte del mismo, puedes utilizar el comando previo para buscar en el historial de comandos y filtrar por una palabra clave:

```bash
❯ history | grep netstat
  488  netstat -putan | grep 1234
  496  netstat -putan | grep 1234
  500  netstat -putan | grep 1234
  505  history | grep netstat
```

Durante mucho tiempo, cuando quería *anotar* algún comando que sabia que iba a querer guardar en mis notas más tarde o accederlo de esta forma hacia esto:

```bash
comando #IMPORTANTE
```

De forma que luego podia hacer:

```bash
history | grep "#IMPORTANTE"
```


