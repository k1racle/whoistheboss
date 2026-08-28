# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24.19.0-bookworm-slim

# Build the admin client and the standalone Nitro server.
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  echo "PORTAINER_NODE24_BUILD_2026-08-28_1" \
  && node --version \
  && npm --version \
  && npm ci --include=optional --ignore-scripts

# Prisma changes no longer invalidate the expensive npm dependency layer.
COPY prisma ./prisma
RUN npm exec -- prisma generate \
  && node -e "const sharp = require('sharp'); console.log('Sharp/libvips:', sharp.versions.sharp, sharp.versions.vips)"

COPY --link . .

RUN echo "PORTAINER_ADMIN_BUILD_2026-08-28_1" \
  && npm run build:admin

RUN echo "PORTAINER_NUXT_BUILD_2026-08-28_1" \
  && npm exec -- nuxt build

# Keep the migration CLI isolated from the much larger build dependency tree.
FROM ${NODE_IMAGE} AS prisma-cli
WORKDIR /opt/prisma-cli

COPY docker/prisma-cli/package*.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
  npm ci --omit=dev --include=optional

# Production image: Nitro already places runtime dependencies in
# .output/server/node_modules, so the builder's full node_modules is unnecessary.
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV MIGRATE_ON_START=true

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends dumb-init ca-certificates gosu

RUN groupadd --gid 10001 app \
  && useradd --uid 10001 --gid app --create-home --home-dir /home/app --shell /usr/sbin/nologin app \
  && mkdir -p /app/public/uploads/.cache /app/.data/nitro-cache /home/app \
  && chown app:app /app /app/public /app/public/uploads /app/public/uploads/.cache /app/.data /app/.data/nitro-cache /home/app

COPY --link --chown=10001:10001 --from=builder /app/.output ./.output
COPY --link --chown=10001:10001 --from=builder /app/prisma ./prisma
COPY --link --chown=10001:10001 --chmod=755 --from=builder /app/scripts ./scripts
COPY --link --chown=10001:10001 --from=prisma-cli /opt/prisma-cli/node_modules /opt/prisma-cli/node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"

ENTRYPOINT ["dumb-init", "--", "./scripts/docker-entrypoint.sh"]
