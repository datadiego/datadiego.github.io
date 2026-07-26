---
title: "Ejemplo de post"
author: datadiego
draft: true
description: Un ejemplo de una publicacion
date: 2026-07-09
# la fecha va en formato año-mes-dia
tags:
  - hacking
layout: layouts/post.njk
---

No necesitamos poner el titulo.

Si queremos poner imagenes, se hace asi:

![alt](./imagen_en_el_directorio.png)

Para poner un video de youtube:

{{< youtube nXdiXjnCPDA >}}

Para referenciar otro post del blog:

[Post sobre DNS]({{< relref "posts/dns101" >}})

