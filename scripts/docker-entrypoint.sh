#!/bin/sh
set -e

mkdir -p /app/public/uploads /app/public/uploads/.cache
chown -R app:app /app/public/uploads /home/app

if [ "${MIGRATE_ON_START:-true}" = "true" ]; then
  echo "Applying database migrations..."
  npx prisma migrate deploy
fi

echo "Starting application..."
exec gosu app:app node .output/server/index.mjs
