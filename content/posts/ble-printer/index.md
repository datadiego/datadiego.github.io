+++
author = "datadiego"
title = "Hack a una impresora termica"
draft = true
date = "2026-05-10"
description = "Como usar una impresora termica bluetooth propietaria"
tags = ["guia", "hacking"]

+++

Hace tiempo compré en Aliexpress una impresora térmica:

![](link)

La impresora funciona mediante una aplicación de smartphone, va bastante bien, pero tener que depender de una aplicación cerrada es bastante limitante, y sobre todo *aburrido*.

Esta impresora funciona mediante BLE (Bluetooth Low Energy), esta tecnología de comunicación es interesante, la tenemos disponible en muchísimos dispositivos, muchos de ellos expuestos.

## Sobre la impresora térmica

El dispositivo con el que vamos a intentar comunicarnos es una *impresora térmica*. Similar a la que usan en tiendas para imprimir tickets y facturas.

No necesita tinta, en su lugar, tiene un cabezal estático que se calienta en diferentes puntos, el papel avanza a través del mismo mientras el cabezal va calentando en el papel los diferentes puntos a pintar.

Son baratas y los rollos de papel también, el problema es que la mayoría tienen un software privado, y no disponemos de información acerca del hardware.

## Sobre BLE

BLE es una tecnología y protocolo de comunicación de corto alcance, permite la transmisión de datos entre dispositivos, su principal diferencia con el *Bluetooth* tradicional es el consumo del mismo, muy reducido, perfecto para dispositivos que necesitan consumir poco.

Para entender como podemos comunicarnos con uno, podemos entender cualquier dispositivo BLE siguiendo esta estructura:

```
Dispositivo BLE
│
├── Servicio A
│   ├── Característica A1
│   ├── Característica A2
│   └── Característica A3
│
├── Servicio B
│   ├── Característica B1
│   └── Característica B2
│
└── Servicio C
    └── Característica C1
```

Un **servicio** es una agrupación de funcionalidades relacionadas entre si.

Dentro del servicio encontramos diferentes **características**, estos son los datos que podemos leer y escribir por parte del dispositivo.

Cada característica tiene diferentes **propiedades**, estas pueden ser:

- `read`: Para leer datos.
- `write`: Para escribir delatos. El dispositivo confirmará que se han recibido.
- `write-without-response`: Para escribir datos sin obtener confirmación.
- `read-without-response`: Para leer datos sin obtener confirmación.
- `notify`: Para hacer streaming de datos, en lugar de leer continuamente, el dispositivo retransmite los datos cuando cambian.
- `indicate`: Como notify, pero añadiendo una confirmación.

## Comunicandonos con el dispositivo

### Encontrando dispositivos y MAC

Vamos a comenzar por algo simple, escanear los dispositivos cercanos y obtener sus nombres y direcciones `MAC` para poder conectarnos a ellos.

Sabemos por haber usado la impresora desde la app original, que el dispositivo aparece con el nombre *MX10*, lo que nos facilitará distinguirlo identificarlo con facilidad.

Para este script necesitarás instalar la libreria *bleak*, que nos deja comunicarnos por bluetooth en **python**:

```python
from bleak import BleakScanner, BleakClient
import asyncio


async def main():
    for d in await BleakScanner.discover(timeout=1.0):
        print(d.name, d.address)
asyncio.run(main())
```

Esto nos devolverá los dispositivos cercanos y sus direcciones *MAC*:

```
None 32:24:A9:BB:D1:FE
DV2_90380CE1E5D2 90:38:0C:E1:E5:D2
None 59:A6:13:59:5E:D7
[TV] Samsung 8 Series (65) A4:30:7A:9A:E4:87
[AV] Samsung Soundbar Q800A 80:8A:BD:89:3F:13
None 41:91:05:99:EC:C2
TY D8:D6:68:55:AB:2D
None F5:F4:01:A2:B6:83
MX10 7C:09:09:18:44:FD
```

Podemos ver múltiples dispositivos, incluida la impresora.

### Enumerando servicios, características y propiedades

Sabiendo que nuestro dispositivo se llama `MX10`:

```python
from bleak import BleakScanner, BleakClient
import asyncio


async def main():
    for d in await BleakScanner.discover(timeout=0.5):
        # print(d.name, d.address)
        if (d.name == "MX10"):
            addr = d.address
            async with BleakClient(addr) as c:
                services = c.services
                for s in services:
                    print(f"{s.uuid}: {s.description}")
                    for char in s.characteristics:
                        print("   ", char.uuid, char.properties)

asyncio.run(main())
```

Una vez obtenemos la dirección, usamos el cliente para obtener tanto los servicios como sus caracteristicas y propiedades, y el uuid que identifica cada uno:

```
0000ae3a-0000-1000-8000-00805f9b34fb: Vendor specific
    0000ae3b-0000-1000-8000-00805f9b34fb ['write-without-response']
    0000ae3c-0000-1000-8000-00805f9b34fb ['notify']
00001800-0000-1000-8000-00805f9b34fb: Generic Access Profile
    00002a00-0000-1000-8000-00805f9b34fb ['read', 'write']
0000ae30-0000-1000-8000-00805f9b34fb: Vendor specific
    0000ae01-0000-1000-8000-00805f9b34fb ['write-without-response']
    0000ae02-0000-1000-8000-00805f9b34fb ['notify']
    0000ae10-0000-1000-8000-00805f9b34fb ['read', 'write']
    0000ae03-0000-1000-8000-00805f9b34fb ['write-without-response']
    0000ae04-0000-1000-8000-00805f9b34fb ['notify']
    0000ae05-0000-1000-8000-00805f9b34fb ['indicate']
```

Tenemos tres servicios:

- `AE3A`, con la propiedad `AE3B` que es `write-without-response` y `AE3C`, que es `notify`.
- `1800`, con la propiedad `2A00`, que es `read` y `write`.
- `AE30`, que es la que más propiedades tiene:
  - `AE01`: `write-without-response`.
  - `AE02`: `notify`.
  - `AE10`: `read` y `write`.
  - `AE03`: `read-without-response`.
  - `AE04`: `notify`.
  - `AE05`: `indicate`.

Nos interesan sobre todo `AE01` y `AE03`, que son las que permiten escribir datos y mandarselos a la impresora.

### Leer caracteristicas

Podemos leer la característica `2A00`, este es un estándar del protocolo `BLE`, es donde encontraremos el nombre del dispositivo.

En cuanto al `AE10`, es una característica propietaria, solo el fabricante sabe que podemos leer aquí.

Podemos leer ambas así:

```python
from bleak import BleakScanner, BleakClient
import asyncio


async def main():
    addr = None

    for d in await BleakScanner.discover(timeout=1.0):
        if d.name == "MX10":
            addr = d.address
            break

    if addr is None:
        print("No se encontró la impresora MX10")
        return

    print(f"Conectando a {addr}")

    async with BleakClient(addr) as client:
        data = await client.read_gatt_char("00002a00-0000-1000-8000-00805f9b34fb")

        print("2A00:")
        print("  Raw:", data)
        print("  Texto:", data.decode(errors="ignore"))

        data = await client.read_gatt_char("0000ae10-0000-1000-8000-00805f9b34fb")

        print("AE10:")
        print("  Hex:", data.hex())
        print("  Raw:", data)


asyncio.run(main())
```

Al ejecutarlo obtenemos:

```
Conectando a 7C:09:09:18:44:FD
2A00:
  Raw: bytearray(b'MX10')
  Texto: MX10
AE10:
  Hex: 00000000
  Raw: bytearray(b'\x00\x00\x00\x00')
```

Obtenemos el nombre como esperabamos, y cuatro bytes a cero.

Estos bytes quizá cambian si el estado de la impresora cambia, por ejemplo, mientras imprime, o si abrimos la tapa.

Ya tenemos lo básico, servicios, características y permisos, hemos probado a leer datos y funciona. Leer datos es muy simple, solo necesitamos saber la **dirección de la característica**.

Pero lo que más nos interesa en realidad es poder mandarle datos para que imprima, y sin el protocolo de comunicación, es decir, que bytes debemos enviar para que la impresora imprima, no podremos hacerlo.

Intentar averiguarlo por ensayo y error va a llevarnos demasiado e incluso podría dañar algún componente si no tenemos cuidado, asi que vamos a analizar la app original para esto.

Podriamos intentar hacer sniffing de BLE, pero es más práctico descompilar la `apk` y buscar en su código fuente.

## Descompilando la aplicación

Encontramos la app `fun print` original, en formato `.xapk`, intentamos descompilar usando `jadx`:

```bash
…/Downloads/funprint ❯ jadx com.fun.mxw-8.07.03.xapk
INFO  - loading ...
INFO  - processing ...
ERROR - finished with errors, count: 42

…/funprint/com.fun.mxw-8.07.03 ❯ ls
Permissions Size User      Date Modified Name
drwxr-xr-x     - datadiego 14 Jul 10:10   resources
drwxr-xr-x     - datadiego 14 Jul 10:11   sources
```

Obtenemos el código fuente listo para buscar.

## Buscando en la aplicación

Vamos a buscar los siguientes términos con `grep -r`:

- `AE03`: No da resultados.
- `AE01`: Referenciado en `sources/com/wtx/ytbbleplugin/ytbBleFastV2Module.java`
- `aa00`: Referenciado en `sources/com/wtx/ytbbleplugin/ytbBleFastV2Module.java`
- `aa01`: Referenciado en `sources/com/wtx/ytbbleplugin/ytbBleFastV2Module.java`

Vamos a analizar el resultado de `grep -r "AE01"`:

```
…/com.fun.mxw-8.07.03/sources ❯ grep -r AE01
com/wtx/ytbbleplugin/ytbBleFastV2Module.java:                if (TextUtils.equals("aa01", hexString) || TextUtils.equals("5178ae0101001070ff", hexString) || TextUtils.equals("2221a800010020e0ff", hexString) || TextUtils.equals("2221ae0101001070ff", hexString) || TextUtils.equals("2221ae0001000000", hexString) || TextUtils.equals("5178AE01001070FF", hexString)) {
com/wtx/ytbbleplugin/ytbBleFastV2Module.java:                } else if (TextUtils.equals("aa00", hexString) || TextUtils.equals("5178ae0101000000ff", hexString) || TextUtils.equals("2221a80001003090ff", hexString) || TextUtils.equals("2221ae0101000000ff", hexString) || TextUtils.equals("2221ae0001001000", hexString) || TextUtils.equals("5178AE01000000FF", hexString)) {
com/wtx/ytbbleplugin/ytbBleFastModule.java:                if (TextUtils.equals("aa01", hexString) || TextUtils.equals("5178ae0101001070ff", hexString) || TextUtils.equals("2221a800010020e0ff", hexString) || TextUtils.equals("2221ae0101001070ff", hexString) || TextUtils.equals("2221ae0001000000", hexString) || "5178AE01001070FF".equalsIgnoreCase(hexString) || "5688A70101000107FF".equalsIgnoreCase(hexString)) {
com/wtx/ytbbleplugin/ytbBleFastModule.java:                } else if (TextUtils.equals("aa00", hexString) || TextUtils.equals("5178ae0101000000ff", hexString) || TextUtils.equals("2221a80001003090ff", hexString) || TextUtils.equals("2221ae0101000000ff", hexString) || TextUtils.equals("2221ae0001001000", hexString) || "5178AE01000000FF".equalsIgnoreCase(hexString) || "5688A70101000000FF".equalsIgnoreCase(hexString)) {
com/wtx/ytbbleplugin/ytbBleFastV3Module.java:        if (TextUtils.equals("aa01", hexString) || TextUtils.equals("5178ae0101001070ff", hexString) || TextUtils.equals("2221a800010020e0ff", hexString) || TextUtils.equals("2221ae0101001070ff", hexString) || TextUtils.equals("2221ae0001000000", hexString) || "5178AE01001070FF".equalsIgnoreCase(hexString) || "5688A70101000107FF".equalsIgnoreCase(hexString)) {
com/wtx/ytbbleplugin/ytbBleFastV3Module.java:        } else if (TextUtils.equals("aa00", hexString) || TextUtils.equals("5178ae0101000000ff", hexString) || TextUtils.equals("2221a80001003090ff", hexString) || TextUtils.equals("2221ae0101000000ff", hexString) || TextUtils.equals("2221ae0001001000", hexString) || "5178AE01000000FF".equalsIgnoreCase(hexString) || "5688A70101000000FF".equalsIgnoreCase(hexString)) {
```

Encontramos strings que empiezan por `5578`, `2221` y `5688` antes de los terminos que buscamos. Estos deben ser `headers` que usa el protocolo.

Seguimos buscando por esos patrones, y aunque encontramos más archivos, no damos con mucha mas información.

Pedimos ayuda a un agente de IA para que analice el resto del código y nos devuelve información sobre como funciona completamente, en concreto, mediante un archivo llamado `V5g.java` que es el que contiene información acerca de todo el protocolo.

Dar con este archivo por un humano habría costado bastante, y requeriría de bastante tiempo. Pero ahora tenemos toda esta información recopilada por el agente:

```
Todos los comandos usan esta estructura:
51 78 [comando] [longitud_hi] [longitud_lo] 00 [datos...] [crc8] FF
- 51 78 = Header mágico (todos los comandos V5g)
- FF = Terminador
- El CRC8 se calcula sobre los bytes de datos
Comandos esenciales
Iniciar impresión (modo imagen):
51 78 C2 00 01 00 00 00 FF
Calidad (1-5):
51 78 A4 00 01 00 31 [crc8] FF  (calidad 1)
51 78 A4 00 01 00 35 [crc8] FF  (calidad 5)
Energía/calor (controla oscuridad):
51 78 B1 00 02 00 [energy_hi] [energy_lo] [crc8] FF
- MX02 usa 20000 (0x4E20)
- GT01 usa 12000 (0x2EE0)
Avance de papel (al finalizar):
51 78 A1 00 02 00 30 00 [crc8] FF  (200dpi, 48 líneas)
51 78 A1 00 02 00 48 00 [crc8] FF  (300dpi, 72 líneas)
Finalizar impresión:
51 78 A6 00 15 00 AA 55 17 00 00 00 00 00 00 00 17 11 FF
Datos de imagen (por línea)
Para impresora de 384px (MX10):
51 78 A2 00 30 00 [48 bytes de píxeles] [crc8] FF
Cada byte contiene 8 píxeles (1 = negro, 0 = blanco), MSB primero.
Ejemplo: píxeles 11111111 = 0xFF, píxeles 10101010 = 0xAA
Flujo completo para imprimir
1. 51 78 C2 00 01 00 00 00 FF          ← Iniciar modo imagen
2. 51 78 A4 00 01 00 35 [crc] FF       ← Calidad 5
3. 51 78 B1 00 02 00 4E 20 [crc] FF    ← Energía 20000
4. 51 78 A2 00 30 00 [pixels...] [crc] FF  ← Línea 1
5. 51 78 A2 00 30 00 [pixels...] [crc] FF  ← Línea 2
... (repetir por cada línea)
6. 51 78 A1 00 02 00 30 00 [crc] FF    ← Avanzar papel
7. 51 78 A6 00 15 00 AA 55... FF       ← Finalizar
Control de flujo (BLE)
La impresora envía por la characteristic AE02:
- aa01 = "para, estoy ocupada"
- aa00 = "sigo, puedes enviar más"
Tú debes esperar a recibir aa00 antes de enviar el siguiente chunk.
Para enviar por BLE
1. Conectar a la impresora MX10
2. Escribir en characteristic AE01 (comandos) o AE03 (datos)
3. Enviar en chunks de 20 bytes (o MTU-3)
4. Esperar notificación aa00 entre chunks si la impresora lo solicita
CRC8 personalizado
Usa una tabla de lookup de 256 entradas. No es estándar, está implementado en ConvertUtils.java.
```

Es bastante información, vamos a explicarla un poco.

## Entendiendo el protocolo de comunicación

Como ya vimos en nuestro código de Python, a la impresora simplemente le enviamos cadenas en *hexadecimal*.

En el ejemplo, simplemente **leimos** el valor de una característica. Esto solo necesita conocer su referencia, pero para escribir y mandar datos, necesitaremos un `magic header`, unos bytes al principio de la cadena que harán que la impresora identifique que formato o protocolo debe usar.

> Vas a encontrar `magic headers` en cualquier formato, convierte a hexadecimal varios `png` o `zip` y comprobarás que todos empiezan por los mismos dos bytes, esto los identifica como ese formato, incluso si su extension es diferente.

El agente comenta que podemos descomponer un mensaje a la impresora de la siguiente forma:

```
51 78 [comando] [longitud_hi] [longitud_lo] 00 [datos...] [crc8] FF
```

- 51 78 = Header mágico, le dice el protocolo que usará
- FF = Terminador, donde acaba el mensaje

Sabemos que justo despues del header viene el comando a ejecutar por la impresora, imprimir una imagen conlleva varios comandos, según la información que antes nos dió el agente:

- `C2`: Vamos a imprimir algo
- `A4`: Voy a especificar en que calidad quiero la impresión
- `B1`: Cuanto calor vamos a aplicar
- `A2`: Datos para una linea
- `A1`: Avanzar el papel

> Evidentemente, tendremos que mandar múltiples comandos `A2` para imprimir una imagen entera.

La `longitud_hi` y `longitud_lo` son dos bytes que definen **cuantos bytes de datos** hay tras el comando. Esto es importante, debe coincidir con cuantos pixeles puede reproducir nuestra impresora cuando usemos el comando `A2`.

Vamos a verlo con algunos ejemplos:

```
51 78 A4 00 01 00 35 [crc8] FF
       │  │  │
       │  │  └── longitud_lo = 01 (1 byte de datos)
       │  └───── longitud_hi = 00 
       └──────── comando A4 (calidad)
```

Otro ejemplo con más datos:

```
51 78 B1 00 02 00 4E 20 [crc8] FF
       │  │  │
       │  │  └── longitud_lo = 02 (2 bytes de datos)
       │  └───── longitud_hi = 00
       └──────── comando B1 (energía)
```


### Entendiendo como genera la impresora el crc8

Piensa en el crc8 como en un `hash` que se calcula con los datos anteriores, su función es verificar la **integridad** de los datos.

Necesitaremos encontrar el código que genera este `crc8`. El agente identifica que el archivo que nos interesa es `ConvertUtils.java`:

```java
private static final byte[] CHECKSUM_TABLE = {0, 7, 14, 9, 28, 27, ...};

public static byte calcCrc8(byte[] data, int offset, int len, byte preval) {
    for (int i = offset; i < offset + len; i++) {
        preval = CHECKSUM_TABLE[(preval ^ data[i]) & 255];
    }
    return preval;
}
```

El algoritmo funciona en base a `una tabla de busqueda` y haciendo operaciones `xor`.

Imagina que vamos a enviar los valores `[48, 0]`, en hexadecimal serian `[0x30, 0x00]`.

El primer paso es calcular `48`, el valor de `preval` inicia en 0.

`0 ^ 48 = 48`, asi que buscamos en la tabla el valor de `CHECKSUM_TABLE[48]`, en este caso es `-112`


## Primera meta: Avanzar el papel

Antes de meternos en imprimir, vamos a comprobar que todo lo anterior es correcto haciendo un script que simplemente avance el papel de la impresora.

Vamos a enviar el siguiente comando:

```
51    78    A1    00    02    00    30    00    F9    FF
│     │     │     │     │     │     │     │     │     │
│     │     │     │     │     │     │     │     │     └── Terminador
│     │     │     │     │     │     │     │     └──────── CRC8
│     │     │     │     │     │     │     └────────────── Dato 2
│     │     │     │     │     │     └──────────────────── Dato 1 (0x30 = 48)
│     │     │     │     │     └────────────────────────── Byte fijo
│     │     │     │     └──────────────────────────────── Longitud_lo (02)
│     │     │     └────────────────────────────────────── Longitud_hi (00)
│     │     └──────────────────────────────────────────── Comando (A1)
│     └────────────────────────────────────────────────── Magic Header (78)
└──────────────────────────────────────────────────────── Magic Header (51)
```




