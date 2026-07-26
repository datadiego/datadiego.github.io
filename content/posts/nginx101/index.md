+++
author = "datadiego"
title = "Nginx 101"
draft = false
date = "2026-05-18"
description = "Como empezar a usar y configurar tu servidor nginx"
tags = ["coding"]

+++

Nginx es de mis servidores http favoritos, es muy rápido de configurar y te servirá tanto para desarrollo como despliegue en servidores.

Vamos a ver como podemos usarlo en Fedora, aunque será muy similar en otros como *Debian* o *Ubuntu*.

## Instalación

Bastante simple:

```bash
sudo dnf install nginx
```

## Arrancando el servidor

Utilizaremos `systemd` para esto:

```bash
datadiego$~ sudo systemctl start nginx

datadiego$~ sudo systemctl status nginx.service
● nginx.service - The nginx HTTP and reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; preset: disabled)
    Drop-In: /usr/lib/systemd/system/service.d
             └─10-timeout-abort.conf
     Active: active (running) since Sun 2026-06-21 00:07:41 CEST; 6min ago
 Invocation: 7854761ffdbf4e3fbc46d42d672d4765
    Process: 35784 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)
    Process: 35786 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)
    Process: 35788 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
   Main PID: 35789 (nginx)
      Tasks: 5 (limit: 18961)
     Memory: 5.1M (peak: 5.6M)
        CPU: 89ms
     CGroup: /system.slice/nginx.service
             ├─35789 "nginx: master process /usr/sbin/nginx"
             ├─35790 "nginx: worker process"
             ├─35791 "nginx: worker process"
             ├─35792 "nginx: worker process"
             └─35793 "nginx: worker process"

jun 21 00:07:41 fedora systemd[1]: Starting nginx.service - The nginx HTTP and reverse proxy server...
jun 21 00:07:41 fedora nginx[35786]: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
jun 21 00:07:41 fedora nginx[35786]: nginx: configuration file /etc/nginx/nginx.conf test is successful
jun 21 00:07:41 fedora systemd[1]: Started nginx.service - The nginx HTTP and reverse proxy server.
```

Está funcionando!

Prueba a abrir el navegador y entrar en `localhost`, deberías ver la página por defecto de nginx.

## Configuración

Como tal, si es para desarrollo, no necesitamos configurar nada más, pero tendremos que comprobar el archivo `/etc/nginx/nginx.conf` y por lo menos comprobar la opcion `root`:

```
   server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;
        include /etc/nginx/default.d/*.conf;
    }
```

Con esta configurción el servidor queda funcionando en el puerto `80`, y los archivos `html` se deben situar en `/usr/share/nginx/html/`

## Editando la página

Primero, para simplificar el interactuar con el servidor y mover archivos a la ruta, podemos empezar por crear una *variable de entorno* con el path al mismo:

```bash
echo "export NGINX_PATH=/usr/share/nginx/html" >> ~/.bashrc
source ~/.bashrc
```

Ahora podemos acceder rápidamente a la ruta con `$NGINX_PATH`:

```bash
echo $NGINX_PATH
```

Ahora lo tenemos muy facil para crear páginas:

```bash
datadiego  /tmp/web  ♥ 00:32  cat index.html
<h1>Hola mundo</h1>

datadiego  /tmp/web  ♥ 00:32  cat about.html
<h1>About</h1>

datadiego  /tmp/web  ♥ 00:32  sudo cp * $NGINX_PATH

datadiego  /tmp/web  ♥ 00:32  curl localhost:80
<h1>Hola mundo</h1>

datadiego  /tmp/web  ♥ 00:33  curl localhost:80/about.html
<h1>About</h1>
```


