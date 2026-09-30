#!/usr/bin/env bash
# Publish from this machine: build dist/ here, upload it, and swap it in on the
# server. Use this when the server has no Node (the case on robinsong.top).
#
#   ./scripts/publish.sh
#
# Override the target with DEPLOY_HOST, DEPLOY_KEY and DEPLOY_DIR.
# The previous build stays in .dist-prev/ on the server for a quick rollback.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-ubuntu@43.133.3.229}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/43.133.3.229.pem}"
DIR="${DEPLOY_DIR:-/home/ubuntu/myhomepage}"
SSH=(ssh -i "$KEY" -o IdentitiesOnly=yes)

# Only publish what is on origin/main, so the live site always matches the repo.
git fetch -q origin main
if [ -n "$(git status --porcelain --untracked-files=no)" ] || [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  echo "Check out an up-to-date, clean main before publishing." >&2
  exit 1
fi

npm run build
rsync -az --delete -e "${SSH[*]}" dist/ "$HOST:$DIR/.dist-next/"

# Sync the server checkout (certbot's webroot and the chat's botdata.json live
# there), swap the new build in, and restart the chat if its knowledge changed.
"${SSH[@]}" "$HOST" "set -e; cd '$DIR'
  before=\$(git rev-parse HEAD)
  git pull --ff-only -q
  rm -rf .dist-prev
  if [ -d dist ]; then mv dist .dist-prev; fi
  mv .dist-next dist
  if ! git diff --quiet \"\$before\" HEAD -- public/files/botdata.json; then
    sudo systemctl restart portfolio-chat && echo 'Chat knowledge base changed: restarted portfolio-chat'
  fi"

echo "Published $(git rev-parse --short HEAD) to $HOST:$DIR/dist"
