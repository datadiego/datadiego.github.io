---
title: Git 101
description: Guia básica de Git en local
date: 2025-05-10
scheduled: 2025-05-10
tags:
  - coding
layout: layouts/post.njk
---

Git es la **más importante** que no estás usando. Sin ella, no podrás colaborar en proyectos grandes, y te arriesgas a perder tu trabajo o romperlo tu mismo.

## ¿Qué es Git?

Git soluciona un problema básico en el desarrollo de software: la gestión de versiones. Cuando trabajas en un proyecto, es probable que hagas cambios en el código pero luego no quedes satisfecho con los resultados. ¿Que haces entonces? Si fuiste precavido y guardaste una copia de seguridad, puedes volver a esa versión anterior. Pero si no lo hiciste, tendrás que editar manualmente el código hasta su estado anterior, esto es tedioso, y en ocasiones, imposible.

Git te evita este problema, puedes guardar diferentes versiones de tu código y volver a ellas cuando necesitas. Te permite crear copias de seguridad de tu trabajo y colaborar con otras personas en el mismo proyecto sin miedo a perder tu trabajo o romperlo con cambios de otros.

## Instalación

Para instalar Git, puedes usar el siguiente comando:

```bash
sudo apt install git
```

## Configuración

Una vez instalado, es importante configurarlo con tu nombre y correo electrónico. Esto es importante porque Git utiliza esta información para identificar quién hizo qué cambios en el código.

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "Tu Correo"
```

Puedes comprobar que la configuración se ha guardado correctamente con el siguiente comando:

```bash
git config --list
```

## Crear un repositorio local

Para crear un repositorio en la carpeta actual, puedes usar el siguiente comando:

```bash
git init
```

Esto creará una carpeta oculta llamada `.git` en la carpeta actual. Esta carpeta contiene toda la información necesaria para gestionar el repositorio, incluyendo el historial de cambios y las versiones del código.

No tendrás que preocuparte por esta carpeta, Git la gestionará por ti.

## Áreas de trabajo en git

Git tiene tres áreas de trabajo:

- **Working Directory**: Es la carpeta donde tienes tu código. Aquí es donde haces los cambios en el código.
- **Staging Area**: Es una zona intermedia donde puedes preparar los cambios que quieres guardar en el repositorio. Aquí es donde decides qué cambios quieres incluir en el próximo commit.
- **Repository**: Es la carpeta oculta `.git` donde Git guarda toda la información sobre el repositorio, incluyendo el historial de cambios y las versiones del código.

Puedes comprobar el estado de tu repositorio con el siguiente comando:

```bash
git status
```

Esto te mostrará qué archivos han sido modificados, cuáles están en la Staging Area y cuáles no están siendo rastreados por Git.

## Añadir archivos al repositorio

Para añadir archivos al repositorio, puedes usar el siguiente comando:

```bash
git add <nombre_archivo>
```

Esto añadirá el archivo a la Staging Area. Si quieres añadir todos los archivos, puedes usar el siguiente comando:

```bash
git add .
```

## Confirmar cambios

Para confirmar los cambios y guardarlos en el repositorio, puedes usar el siguiente comando:

```bash
git commit -m "Mensaje de confirmación"
```

Es **muy** importante que escribas un mensaje de confirmación claro y conciso con el cambio que has realizado. En especial si estas trabajando en un proyecto con otras personas. Esto ayudará a los demás a entender qué cambios has realizado y por qué.

No hacer esto puede llevar a confusiones o incluso cancelar tus cambios en el repositorio.

## Ver el historial de cambios

Para ver el historial de cambios en el repositorio, puedes usar el siguiente comando:

```bash
git log
```

## Deshacer ultimo commit

Si quieres deshacer el último commit para arreglar algo, puedes usar el siguiente comando:

```bash
git amend <nombre_archivo>
```

Esto deshará el último commit y te permitirá hacer cambios en el código antes de volver a confirmarlo. Esto es útil si te das cuenta de que has cometido un error en el último commit o si quieres añadir más cambios antes de confirmar.
