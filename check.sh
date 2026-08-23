#!/usr/bin/env bash
set -euo pipefail

git fetch github --quiet
git fetch rpi --quiet

github=$(git rev-parse github/master)
rpi=$(git rev-parse rpi/master)

if [ "$github" = "$rpi" ]; then
    echo "✓ master en sync: ${github:0:7} (github = rpi)"
else
    read -r g_only r_only < <(git rev-list --left-right --count github/master...rpi/master)
    echo "✗ master desincronizado: github tiene $g_only commit(s) que rpi no, rpi tiene $r_only que github no"
    echo "  github/master: $github"
    echo "  rpi/master:    $rpi"
    exit 1
fi
