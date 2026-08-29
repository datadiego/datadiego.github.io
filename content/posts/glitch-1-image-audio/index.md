---
title: "Glitch Art #1: Databending de imágenes como audio"
author: datadiego
draft: false
description: Editando imágenes como audio en audacity
date: 2026-07-16
tags:
  - glitch
  - multimedia
layout: layouts/post.njk
---

Ya hemos aprendido a cómo editar nuestras imágenes en un editor de texto, y cómo es el flujo de trabajo típico cuando estamos experimentando con este tipo de edición. Además, también hemos aprendido conceptos que nos siguen acompañando en esta publicación, como los `headers` de nuestras fuentes de datos.

Vamos a continuar aplicando técnicas de *databending*, en esta ocasión, en lugar de tratar la imágen como texto, vamos a procesarla en un **editor de audio**.

## Software

No necesitas mucho, te basta con [Audacity](https://www.audacityteam.org/), es gratis, de código abierto, y está disponible en Windows/Mac/Linux.

## Flujo de trabajo

Mantendremos las mismas ideas de preservar nuestro archivo original y trabajar en un directorio separado.

En este caso, vamos a utilizar el formato `bmp`, siendo este un formato **sin compresión**, con los datos en bruto.

Vamos a entender primero que pasos seguiremos para procesar la imágen sin romperla, y luego pasaremos a los efectos que podemos aplicar.

### Importar datos

Una vez tengas tu imagen en `.bmp`, abre audacity y ve a `File > Import > Raw Data`. Esta opción nos deja importar **cualquier tipo de archivo** al editor.

Es importante que utilices los siguientes parametros a la hora de importar tus datos:

![import](./import.png)

### Procesar

Una vez la tenemos cargada, veremos la forma de onda que produce nuestra imagen.

![process](./processing.png)

La procesaremos mediante diferentes efectos de audio, respetando siempre **la zona inicial de la onda**, ya que el `header` sigue estando ahí.

Para evitar destruir nuestro `header`, debemos seleccionar parte de la onda con la herramienta de selección:

![seleccion](./tool.png)

Una vez activa, hacemos clic y arrastramos a lo largo de la onda para seleccionar donde queremos aplicar el efecto:

![selection](./selection.png)

Luego seleccionaremos y aplicaremos los efectos o generadores que queramos aplicar.

### Exportar

Una vez esté lista, la exportaremos de nuevo.

Al igual que al importar, debemos ser cuidadosos con cómo lo hacemos o **corromperemos totalmente el archivo de salida**.

Ve a `File > Export Audio` y usa los siguientes parámetros:

![export](./export.png)

Una vez se haya exportado, renombra el archivo de `.raw` a `.bmp`, y podrás ver el efecto que produciste.

## Efectos

Hay bastantes formas de procesar la imagen, en *Effects* encontraremos diferentes efectos y en *Generate* podemos generar audio.

### Echo

Lo encontrarás en `Effect > Delay and Reverb > Echo`

![echo](./echo.png)

Aplicando el efecto con un `decay factor` de 0.1:

![echo0](./echo0.png)

### Delay

Lo encontrarás en `Effect > Delay and Reverb > Delay`

Aplicando los valores por defecto:

![delay](./delay.png)

### Reverb

Lo encontrarás en `Effect > Delay and Reverb > Reverb`.

En este encontrarás bastantes `presets` que puedes usar para probar:

![reverb presets](./reverb_presets.png)

Con el preset `clean`:

![clean reverb](./clean.png)

Con el preset `dance vocal`:

![dance](./dance.png)

Con el preset `cathedral`:

![cathedral](./cathedral.png)

### Distorsion

Los efectos de distorsión también incluyen bastantes presets:

Con el preset full rectifier:

![full rect](./full_rectifier.png)

Con el preset fuzzybox:

![fuzzybox](./fuzzybox.png)

Y creando nosotros una distorsión custom:

![custom dist](./custom_dist.png)

### Phaser

Con los valores por defecto:

![phaser default](./phaser_default.png)

Con un lfo más lento:

![phaser slow lfo](./phaser_slow.png)

### EQ y Filtros

Disponemos de filtros lowpass, highpass, notch y shelf, además de un `EQ` que podemos configurar como queramos:

![eq 1](./eq.png)

El resultado de este filtro aplicado:

![eq 2](./eq2.png)

### Generadores

En la sección de `Generate` podemos generar tonos, ritmos y otros sonidos o silencio.

#### DTMF Tones

Genera varios tonos de onda cuadrada, el resultado:

![tones](./tones.png)

### Mixed media

Podemos empezar a mezclar diferentes fuentes, como audio con nuestra imagen.

Importamos un audio mediante `File > Import > Audio`, una vez la importes tendrás algo similar a esto:

![song 1](./song1.png)

Nuestra imagen original tiene un solo canal, sin embargo, la canción importada tiene dos canales (estereo).

Tenemos que convertirla a mono para poderla copiar y pegar a nuestra imagen haciendo clic aqui:

![song 2](./song2.png)

Y seleccionando la opción `Split Stereo to Mono`, obteniendo ahora dos tracks separados:

![song 3](./song3.png)

Podemos borrar uno de ellos si queremos, solo necesitamos un track.

Seleccionamos parte de la canción y la copiamos:

![song 4](./song4.png)

Volvemos de nuevo a nuestra imagen, hacemos clic donde queremos insertar el audio y lo pegamos:

![song 5](./song5.png)

Por ultimo, eliminamos o muteamos los tracks de la canción antes de exportar nuestra imagen final:

![song 6](./song_output.png)

### Todo a la vez en todas partes

Los efectos aislados sirven para entender que podemos lograr, y tampoco se ha entrado demasiado en la cantidad de variaciones que podemos obtener, cada efecto tiene diferentes parametros que pueden cambiar por completo el resultado final.

Combinar multiples de estos efectos a lo largo de la imagen suele aportar resultados más interesantes que a toda la imagen:

![all](./all.png)

### Una última configuración

Antes de terminar, hay una configuración que te dará más libertad a la hora de hacer glitch en audacity, muchos efectos necesitan poder añadir más tiempo a tu track, es un comportamiento que **no está activo por defecto**. Para activarlo ve a `Edit > Preferences > Tracks > Tracks Behaviours` y activa la opción `Editing a clip can move other clips`.

Esto te permitirá aplicar efectos que antes daban error, y también te permitirá copiar/cortar partes de tu imagen y pegarlas en otro lado :)
