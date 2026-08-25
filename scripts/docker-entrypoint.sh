#!/bin/sh
set -e

legacy_nitro_cache_dir="/app/public/uploads/.cache/nitro"
if [ "$legacy_nitro_cache_dir" != "/app/public/uploads/.cache/nitro" ]; then
  echo "Refusing to remove an unexpected cache directory: $legacy_nitro_cache_dir" >&2
  exit 1
fi

if [ -d "$legacy_nitro_cache_dir" ]; then
  echo "Removing legacy persistent Nitro cache..."
  rm -rf -- "$legacy_nitro_cache_dir"
fi

mkdir -p /app/public/uploads /app/public/uploads/.cache /app/.data/nitro-cache /home/app
chown -R app:app /app/public/uploads /app/.data /home/app

if [ "${MIGRATE_ON_START:-true}" = "true" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
fi

echo "Starting application..."
exec gosu app:app node .output/server/index.mjs
