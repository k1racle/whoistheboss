#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node .output/server/index.mjs
