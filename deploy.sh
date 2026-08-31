#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: $0 <servidor>" >&2
  exit 1
fi

server=$1

if ! command -v hugo >/dev/null 2>&1; then
  echo "Error: hugo no está instalado." >&2
  exit 1
fi

if ! git remote | grep -qx github; then
  echo "Error: no existe el remoto 'github'." >&2
  exit 1
fi

hugo build --baseURL="http://rogueo7ciqckck2yhf2dqmqxsrav3ydsobcxkun7f5dmysskcxyfgead.onion"
git push github master
git push $server master
sudo scp -r public/* $server:/var/www/html
