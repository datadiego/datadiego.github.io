#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-.}"
mkdir -p "$DEST" && cd "$DEST"

gh repo list --limit 1000 --json nameWithOwner -q '.[].nameWithOwner' |
while read -r repo; do
    dir="${repo##*/}"
    [ -d "$dir" ] && echo "SKIP: $repo" && continue
    gh repo clone "$repo" "$dir" -- --bare 2>&1 && echo "OK: $repo" || { echo "FALLO: $repo" >&2; continue; }
    git -C "$dir" remote add github "https://github.com/$repo.git" 2>/dev/null || true
    echo "REMOTE: github -> $repo"
done
