---
title: "dotfiles"
draft: false
repo: "https://github.com/datadiego/dotfiles-noctalia"
---

Configuración automatizada de sistemas para desarrollo, devops y ciberseguridad en Linux.

Desde que empecé a usar Linux, me encantó lo fácil que es poder automatizar la instalación y configuración del propio sistema. 

Esto me permitía experimentar más fácilmente con otras distros, manteniendo la configuración que deseaba entre aplicaciones. Lo que me ha llevado a escribir *múltiples* repositorios con dotfiles en diferentes distros y con distintos propósitos.

Durante mi época en educación, también me sirvió para que mis alumnos pudieran tener acceso rápido a un sistema completamente configurado, normalmente:

1. El primer trimestre el alumno instala y configura todo a mano, aprende como hacerlo por su cuenta.
2. A partir del segundo trimestre esa máquina virtual se elimina, y en una nueva instalamos unos dotfiles, para que comprueben que pueden automatizar toda la tarea que hicieron de forma manual y que pueden actualizar sus propios dotfiles con la configuración que ellos prefieran.
3. En un taller separado que se daba en horas extras, se les enseñaba a como se pueden adaptar estas automatizaciones a otras distros, y como testearlas adecuadamente.

Generalmente estos proyectos los divido en:

1. **Instalación de dependencias comunes**, aqui se instala el entorno de escritorio que deseamos, y todas las herramientas y paquetes que sabemos que vamos a necesitar **si o si** en nuestro sistema.
2. **Herramientas de desarrollo**: Todos los paquetes que usaremos para desarrollar software.
3. **Herramientas de ciberseguridad**: Paquetes para pentesting y seguridad.
4. **Gestión de configuraciones**: Generalmente con [stow](https://www.gnu.org/software/stow/) para poder mantener tu propio repositorio y que no tengas que andar copiando configuraciones al mismo.

Cada uno de los sets de herramientas se puede instalar de manera individual, de forma que podamos tener un equipo dedicado exclusivamente a ciberseguridad o pentesting, otro a desarrollo, o usar ambos, manteniendo el mismo tipo de escritorio y configuración del mismo.


