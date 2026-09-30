#!/usr/bin/env bash
# Deploy on the server: pull the latest code, build it, and swap it into dist/.
# nginx serves <this repo>/dist, so visitors never see a half-built site.
#
#   ./scripts/deploy.sh
#
# The previous build is kept in .dist-prev/ for a quick rollback:
#   mv dist .dist-bad && mv .dist-prev dist
set -euo pipefail
cd "$(dirname "$0")/.."

# Use the Node version pinned in .nvmrc when nvm is installed.
# (nvm's own scripts don't tolerate `set -eu`, so relax it while they run.)
if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  set +eu
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use >/dev/null || nvm install || exit 1
  set -eu
fi

git pull --ff-only
npm ci --no-audit --no-fund
npm run build -- --outDir .dist-next

rm -rf .dist-prev
if [ -d dist ]; then mv dist .dist-prev; fi
mv .dist-next dist

echo "Deployed $(git rev-parse --short HEAD) to $(pwd)/dist"
