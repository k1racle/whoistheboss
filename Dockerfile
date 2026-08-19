# Stage 1: Build
FROM node:24.19.0-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN echo "PORTAINER_NODE24_BUILD_2026-08-07_3" \
  && node --version \
  && npm --version \
  && npm ci --include=optional \
  && node -e "const sharp = require('sharp'); console.log('Sharp/libvips:', sharp.versions.sharp, sharp.versions.vips)"

COPY . .
RUN npx prisma generate

RUN echo "PORTAINER_ADMIN_BUILD_2026-08-07_2" \
  && npm run build:admin

RUN echo "PORTAINER_NUXT_BUILD_2026-08-07_3" \
  && npm exec -- nuxt build

# Stage 2: Production
FROM node:24.19.0-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"

ENTRYPOINT ["dumb-init", "--", "./scripts/docker-entrypoint.sh"]
