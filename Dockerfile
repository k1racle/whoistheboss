# Stage 1: Build
FROM node:22.19.0-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --global npm@11.17.0
RUN npm ci > /tmp/npm-ci.log 2>&1 \
  || { \
    tail -n 200 /tmp/npm-ci.log; \
    grep -Eqi "EBADENGINE|unsupported engine|node.js.*version" /tmp/npm-ci.log && exit 71; \
    grep -Eqi "EUSAGE|package.json.*package-lock|Missing:|Invalid:" /tmp/npm-ci.log && exit 72; \
    grep -Eqi "EAI_AGAIN|ENOTFOUND|ECONNRESET|ETIMEDOUT|network" /tmp/npm-ci.log && exit 73; \
    grep -Eqi "node-gyp|prebuild-install|ELIFECYCLE|postinstall|command failed" /tmp/npm-ci.log && exit 74; \
    grep -Eqi "ENOSPC|no space left" /tmp/npm-ci.log && exit 75; \
    grep -Eqi "EACCES|EPERM|permission denied" /tmp/npm-ci.log && exit 76; \
    exit 79; \
  }

COPY . .
RUN npx prisma generate
RUN echo "PORTAINER_NODE22_DIAGNOSTIC_2026-08-07_1" \
  && node --version \
  && npm --version \
  && npm run build > /tmp/build.log 2>&1 \
  || { \
    tail -n 200 /tmp/build.log; \
    grep -Eqi "heap out of memory|heap limit|allocation failed|killed" /tmp/build.log && exit 81; \
    grep -Eqi "ENOSPC|no space left" /tmp/build.log && exit 82; \
    grep -Eqi "illegal instruction|SIGILL|segmentation fault|bus error" /tmp/build.log && exit 83; \
    grep -Eqi "cannot find|could not resolve|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|command not found" /tmp/build.log && exit 84; \
    grep -Eqi "unsupported.*node|node.js.*version|EBADENGINE" /tmp/build.log && exit 85; \
    grep -q "Building Nuxt for production" /tmp/build.log && exit 87; \
    grep -q "> build:admin" /tmp/build.log && exit 86; \
    exit 89; \
  }

# Stage 2: Production
FROM node:22.19.0-bookworm-slim AS runner
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
