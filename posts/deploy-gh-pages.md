---
title: Deploy GitHub Pages
description: Guia para hacer deploy de un proyecto en GitHub Pages
date: 2025-05-12
scheduled: 2025-05-12
tags:
  - devops
  - coding
layout: layouts/post.njk
---

Github Pages es una herramienta que permite alojar sitios web estáticos directamente desde un repositorio en GitHub totalmente gratis.

## Repositorio

Tendrás que crear un repositorio en GitHub que tenga el siguiente nombre:

```
<username>.github.io
```

Donde `<username>` es tu nombre de usuario de GitHub.

### Workflow

Este proyecto necesitará un workflow de GitHub Actions para hacer el deploy automáticamente cada vez que hagas un push a la rama `main` del repositorio. Puedes crear un archivo `.github/workflows/deploy.yml` con el siguiente contenido:

```yaml
name: Deploy 11ty to GitHub Pages

on:
  push:
    branches:
      - main  # Cambia a "master" si usas ese nombre

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build the site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          {% raw %}github_token: ${{ secrets.GITHUB_TOKEN }}{% endraw %}
          publish_dir: ./_site  # Cambia esto si tu build genera otra carpeta
```

> Este workflow está configurado para ejecutarse cada vez que hagas un push a la rama `master`. Si usas otra rama, asegúrate de cambiar el nombre en la sección `on` del archivo.

> El workflow se encargará de instalar las dependencias necesarias, construir el sitio y desplegarlo en GitHub Pages.

> El proyecto está configurado para usar Node.js 18, pero puedes cambiar la versión si es necesario. En caso de que uses otro lenguaje o framework, asegúrate de ajustar el workflow para que se adapte a tus necesidades.

> El workflow utiliza la acción `peaceiris/actions-gh-pages` para desplegar el sitio. Esta acción es muy popular y fácil de usar, pero hay otras opciones disponibles si prefieres usar otra.

> Asegúrate de que la carpeta `_site` es la que genera tu build. Si usas otro nombre, cámbialo en la sección `publish_dir`.

## Configuración de GitHub Pages

Una vez tengas tu repositorio y el workflow configurado, tendrás que habilitar GitHub Pages en la configuración del repositorio.
1. Antes de nada, crea una rama llamada `gh-pages` en GitHub.
2. Ve a la pestaña "Settings" de tu repositorio.
3. Ve a la sección "Pages" en el menú de la izquierda.
4. Busca la sección `Build and deployment`.
5. En la opción `Source`, selecciona `Deploy from a branch`.
6. En la opción `Branch`, selecciona `gh-pages` y `/(root)`.
7. Haz clic en `Save`.

## Mandar cambios

Una vez tengas todo configurado, cada vez que hagas un push a la rama `main` del repositorio, el workflow se ejecutará automáticamente y desplegará los cambios en GitHub Pages.

## Repositorio de ejemplo

Este blog está alojado en Github Pages, puedes ver el repositorio y como funciona [aqui](https://github.com/datadiego/datadiego.github.io)