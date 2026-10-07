---
title: "Noontide"
author: datadiego
draft: false
description: Maquina vulnerable noontide
date: 2025-03-04
# la fecha va en formato año-mes-dia
tags:
  - pentesting
layout: layouts/post.njk
---

Puedes descargarla [aqui](https://www.vulnhub.com/entry/sunset-noontide,531/)
## IPs

- Host:   192.168.0.20
- Atacante:     192.168.0.16
- Objetivo: 192.168.0.28

## Reconocimiento

Encontramos los siguientes servicios con nmap:

```
Not shown: 65532 closed tcp ports (conn-refused)
PORT     STATE SERVICE REASON  VERSION
6667/tcp open  irc     syn-ack UnrealIRCd (Admin email example@example.com)
6697/tcp open  irc     syn-ack UnrealIRCd (Admin email example@example.com)
8067/tcp open  irc     syn-ack UnrealIRCd
Service Info: Host: irc.foonet.com
```

Si buscamos en metasploit encontramos el siguiente exploit:

```
0  exploit/unix/irc/unreal_ircd_3281_backdoor  2010-06-12       excellent  No     UnrealIRCD 3.2.8.1 Backdoor Command Execution
```

Lo lanzamos y obtenermos root!
