1. Exploración inicial del árbol de archivos
Usé la herramienta task con un agente explore que:
- Listó la estructura de directorios de ~/Downloads/funprint/com.fun.mxw-8.07.03/sources/
- Identificó archivos relevantes por nombre (archivos con "Ble", "Print", "V5g", "image" en el nombre)
2. Búsqueda por contenido (grep)
Busqué strings específicos que ya conocías del post:
- grep -r "AE01" → Encontró las referencias en ytbBleFast*.java
- grep -r "5178" → Encontró el header mágico del protocolo
- grep -r "aa01", "aa00" → Encontró el control de flujo
3. Lectura de archivos clave
Identifiqué estos archivos por nombre y contenido:
Archivo	Qué contiene
V5g.java	Comandos de impresión (calidad, energía, imagen)
V5gCMD.java	Comandos predefinidos
ConvertUtils.java	Cálculo CRC8
ytbBleFastModule.java	Envío BLE por chunks
OpencvUtilsWXModule.java	Procesamiento de imagen
FlowWrite.java	Control de flujo BLE
PrinterModel.java	Configuración por modelo (DPI, ancho)
4. Flujo de lectura
┌─────────────────────────────────────────────────────────┐
│ 1. grep por strings conocidos (AE01, 5178, aa01)       │
│    → Encontré archivos que los usaban                   │
├─────────────────────────────────────────────────────────┤
│ 2. Leí los archivos encontrados                         │
│    → ytbBleFastModule.java mencionaba FlowWrite         │
│    → V5g.java mencionaba ConvertUtils                   │
├─────────────────────────────────────────────────────────┤
│ 3. Seguí las referencias (como un detective)            │
│    → FlowWrite.java tenía la lógica de chunking         │
│    → ConvertUtils.java tenía el CRC8                    │
├─────────────────────────────────────────────────────────┤
│ 4. Busqué cómo se generaban los comandos de imagen      │
│    → OpencvUtilsWXModule.java tenía el pipeline         │
│    → ImageUtils.java tenía la conversión de píxeles     │
└─────────────────────────────────────────────────────────┘
5. Resolución de dudas
Cuando encontraba algo que no entendía (como por qué había múltiples headers: 5178, 2221, 5688), busqué en PrinterModel.java y vi que cada modelo usaba un protocolo diferente.
En resumen: Fue un proceso de "seguir el hilo" - cada archivo relevante llevaba a otro. Empecé por lo que ya sabías del post (AE01) y fui descendiendo hasta encontrar el protocolo completo.
¿Quieres que documente este proceso de reverse engineering en el post también? Podría ser interesante mostrar cómo se investiga una app descompilada.

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

