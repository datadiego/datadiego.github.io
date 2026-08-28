---
title: Editores de texto en Linux
author: datadiego
draft: true
description: Encuentra el editor de texto que más se ajusta a ti
date: 2026-08-19
# la fecha va en formato año-mes-dia
tags:
  - coding
  - linux
layout: layouts/post.njk
---

Tanto si estas programando como si usas Linux a nivel básico, necesitarás un buen editor de texto para trabajar cómodo.

Hay **demasiados** editores de texto como para tratar todos en un mismo post, pero comentaré cuales he ido usando a lo largo del tiempo, sus ventajas e inconvenientes, y cuales se ajustan según que tipo de desarrollador seas.

## nano

Es el editor que suelen incluir la mayoría de distribuciones, funciona directamente en terminal, asi que podrás usarlo sin problema en un servidor con tty.

![nano](nano.png)

Es muy ligero, no tiene resaltado de sintaxis ni ayudas, y aunque en la parte inferior aparecen los comandos que tenemos disponibles, no son los que estarás acostumbrado, lo que puede incomodar. Aun asi, recomiendo que aprendas a usarlo _mínimamente_, con saber cambiar algo y guardar el archivo basta, ya que muchos servidores tendrán este editor y será el que uses para configurarlos.

## vi

Otro editor que viene incluido en muchas distribuciones, es un editor muy minimalista de tipo **modal**, por lo que tendrás que moverte entre los modos _normal_ para moverte en el texto, _visual_ para seleccionar e _insertar_ para escribir, te permite editar texto de forma **muy efectiva** y rápida, pero tiene una curva de dificultad considerable que no todo el mundo está dispuesto a superar.

![vi](./vim.png)

No lo recomiendo si acabas de empezar a programar o empiezas en Linux, pero tenlo **muy en cuenta** cuando veas que necesitas editar texto más rápido y has dejado de pelearte con la sintaxis de los lenguajes.

## micro

Este editor está disponible para instalar en cualquier distro que uses, es el que suelo recomendar a cualquier usuario que comience a usar Linux y ya sepa usar minimamente nano, pero quiera tener atajos de teclado clásicos.

Visualmente es bastante más atractivo, también tiene resaltado de sintaxis y puede ser más que suficiente para editar código en tu día a día:

![micro](./micro.png)

Al funcionar en terminal, podrás usarlo directamente en tus servidores sin problema.

## vim/neovim

Vim y Neovim son versiones más modernas de vi, siguen siendo modales, pero permiten instalar plugins y personalizarlos como prefieras.

La gran ventaja frente a los que hemos visto hasta ahora es que disponen de **LSP**, por lo que ya no tendrás que preocuparte de recordar la sintaxis de un lenguaje concreto, el propio editor te ayudará a escribir mucho más rápido, también te permite usar snippets de código, editar múltiples archivos a la vez y gestionar repositorios.

![neovim](./neovim.png)

Actualmente utilizo neovim en mi dia a dia, una vez aprendes a editar modalmente es dificil de volver a un editor clásico, y opciones como poder usar comandos de regex para buscar y editar texto hacen que seas **muy eficiente** escribiendo código.

Debes probarlo tarde o temprano, y darle una buena oportunidad durante dos o tres dias hasta sentirte cómodo.

## Visual Studio Code

Prácticamente el estandar para muchos, es el editor que suelo recomendar a algumnos y gente que empieza a programar.

Dispone de **muchisimos** plugins para personalizarlo como quieras, será raro que no encuentres uno para lo que necesites.

![code](./code.png)

Por contra, es un editor gráfico, no puedes usarlo directamente en un servidor, y tiene **muchisima telemetria** de Microsoft. Consume muchos más recursos que cualquiera de los anteriores, en equipos modestos recomendaria cualquiera de los anteriores siempre.

## druk

Editor muy sencillo para terminal, pero que incluye **LSP**, y gestor para tu repositorio, es más que suficiente para tu dia a dia, y muy buena opción como entorno minimalista.
