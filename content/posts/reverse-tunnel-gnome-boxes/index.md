+++
author = "datadiego"
draft = false
title = "Reverse Tunnel en Gnome Boxes"
description = "Como iniciar un tunel reverso dentro de Gnome Boxes"
date = "2026-07-05"
tags = ["hacking", "linux", "virtualización"]
+++

Me encanta usar Gnome Boxes, da igual la distro en la que esté, es una forma rápida de obtener una máquina virtual sin tener que descargar manualmente la iso, tienen portapapeles compartido con tu host, te permite crear snapshots, gestionar su consumo de memoria... y poco más.

Ese minimalismo está genial, hasta que ves que no te permite gestionar nada en cuanto a red y tienes que accederlas desde tu máquina host. Olvidate de poder cambiar el modo a Bridge o cualquier otro tipo como en `VirtualBox` o en otro software de virtualización.

Tus VM están completamente aisladas del sistema host, haciendo que no puedas accederlas por `SSH` de forma tradicional.

Aqui vemos la información relativa a mi tarjeta de red en el sistema host:

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether c8:6e:08:d7:0f:0a brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.169/24 metric 600 brd 192.168.1.255 scope global dynamic wlan0
       valid_lft 83662sec preferred_lft 83662sec
    inet6 2a0c:5a87:dc02:9600:ca6e:8ff:fed7:f0a/64 scope global mngtmpaddr noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::ca6e:8ff:fed7:f0a/64 scope link proto kernel_ll 
       valid_lft forever preferred_lft forever
```

Y aqui la de la máquina virtual:

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: enp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 52:54:00:e3:f9:c0 brd ff:ff:ff:ff:ff:ff
    altname enx525400e3f9c0
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic noprefixroute enp1s0
       valid_lft 85604sec preferred_lft 85604sec
    inet6 fec0::2dd:8223:6dc2:2175/64 scope site dynamic noprefixroute 
       valid_lft 86027sec preferred_lft 14027sec
    inet6 fe80::7cc:52c8:90f1:74ad/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

Como vemos, estamos en rangos completamente diferentes.

`ping` no consigue en ningun momento conectar desde el host a la maquina:

```bash
blog-nekoweb master ? ✗ ping 10.0.2.15
PING 10.0.2.15 (10.0.2.15) 56(84) bytes of data.
^C
--- 10.0.2.15 ping statistics ---
19 packets transmitted, 0 received, 100% packet loss, time 18432ms
```

Pero nuestra VM si que llega al host:

```bash
datadiego@fedora:~$ ping 192.168.1.169
PING 192.168.1.169 (192.168.1.169) 56(84) bytes de datos.
64 bytes desde 192.168.1.169: icmp_seq=1 ttl=255 tiempo=0.442 ms
64 bytes desde 192.168.1.169: icmp_seq=2 ttl=255 tiempo=0.629 ms
64 bytes desde 192.168.1.169: icmp_seq=3 ttl=255 tiempo=0.673 ms
```

En esta situación tenemos un escenario tipico para crear un **reverse ssh tunnel**, en el que una máquina que no es accesible desde fuera inicia una conexión a otra máquina, y esta última la usa para permitir conexiones en sentido contrario.

## Configurando el host

Antes de crear el tunel en si, necesitamos modificar `/etc/ssh/sshd_config` en nuestra máquina host con la siguiente opción:

```
AllowTcpForwarding yes
```

Luego, reinicia el servicio sshd:

```
sudo systemctl restart sshd
```

## Configurando la VM

No hay mucho que hacer, pero necesitamos el servicio sshd activo:

```bash
sudo systemctl start sshd
```

## Creando el tunel

Primero, creamos el tunel en la VM:

```bash
ssh -R 2222:localhost:22 USER@IP_HOST
```

En mi caso:

```bash
datadiego@fedora:~$ ssh -R 2222:localhost:22 datadiego@192.168.1.169
The authenticity of host '192.168.1.169 (192.168.1.169)' can't be established.
ED25519 key fingerprint is: SHA256:Yj/CSkCmUohFGorNG+5HedHMmvxpF48rjMDQ9FVaw4g
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.1.169' (ED25519) to the list of known hosts.
datadiego@192.168.1.169's password: 

~ ❯ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether c8:6e:08:d7:0f:0a brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.169/24 metric 600 brd 192.168.1.255 scope global dynamic wlan0
       valid_lft 82760sec preferred_lft 82760sec
    inet6 2a0c:5a87:dc02:9600:ca6e:8ff:fed7:f0a/64 scope global mngtmpaddr noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::ca6e:8ff:fed7:f0a/64 scope link proto kernel_ll 
       valid_lft forever preferred_lft forever
```

En tunel está creado, tenemos acceso por `ssh` a nuestro host.

Si queremos comprobarlo, usamos `ss` en el host:

```bash
~ ❯ ss -tulpn '( sport = :2222 )'
Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port Process
tcp    LISTEN  0       128          127.0.0.1:2222        0.0.0.0:*
tcp    LISTEN  0       128              [::1]:2222           [::]:*
```

Ahora, para iniciar una sesión desde nuestro host a la vm:

```bash
ssh -p 2222 usuario_vm@localhost
```

En mi caso:

```bash
~ ❯ ssh -p 2222 datadiego@localhost
The authenticity of host '[localhost]:2222 ([::1]:2222)' can't be established.
ED25519 key fingerprint is: SHA256:dvthsQ9LhB14k0QwPipY0auGEpnpyc5+WFgOGl81HIM
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[localhost]:2222' (ED25519) to the list of known hosts.
datadiego@localhost's password:
Activate the web console with: systemctl enable --now cockpit.socket

datadiego@fedora:~$
```

Listo! Ya tenemos nuestra sesión iniciada en la VM a través de nuestro host.


