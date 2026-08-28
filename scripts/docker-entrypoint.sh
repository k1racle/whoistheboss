#!/bin/sh
set -e

upload_dir="/app/public/uploads"
upload_cache_dir="$upload_dir/.cache"
nitro_cache_dir="/app/.data/nitro-cache"
legacy_nitro_cache_dir="/app/public/uploads/.cache/nitro"

if [ "$legacy_nitro_cache_dir" != "/app/public/uploads/.cache/nitro" ]; then
  echo "Refusing to remove an unexpected cache directory: $legacy_nitro_cache_dir" >&2
  exit 1
fi

if [ -d "$legacy_nitro_cache_dir" ]; then
  echo "Removing legacy persistent Nitro cache..."
  rm -rf -- "$legacy_nitro_cache_dir"
fi

mkdir -p "$upload_dir" "$upload_cache_dir" "$nitro_cache_dir" /home/app
chown app:app "$upload_dir" "$upload_cache_dir" /app/.data "$nitro_cache_dir" /home/app

# Existing files are created by the app user and do not need to be traversed on
# every deploy. Enable this only for a restored volume with incorrect owners.
if [ "${FIX_UPLOAD_PERMISSIONS:-false}" = "true" ]; then
  echo "Repairing upload volume permissions recursively..."
  chown -R app:app "$upload_dir"
fi

if [ "${MIGRATE_ON_START:-true}" = "true" ]; then
  echo "Applying database migrations..."
  gosu app:app env HOME=/home/app node /opt/prisma-cli/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma
fi

echo "Starting application..."
exec gosu app:app env HOME=/home/app node .output/server/index.mjs
