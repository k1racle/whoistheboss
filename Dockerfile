# Stage 1: Build
FROM node:24.19.0-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN echo "PORTAINER_NODE24_BUNDLED_NPM_2026-08-07_1" \
  && node --version \
  && npm --version \
  && npm ci > /tmp/npm-ci.log 2>&1 \
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
RUN echo "PORTAINER_NODE24_MINIMAL_MODULES_2026-08-07_1" \
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
    grep -Eqi "native binding|sharp|resvg|dlopen|GLIBC|GLIBCXX|wrong ELF|Exec format" /tmp/build.log && exit 88; \
    grep -Eqi "fetch failed|EAI_AGAIN|ENOTFOUND|ECONNRESET|ETIMEDOUT" /tmp/build.log && exit 90; \
    grep -Eqi "@prisma|prisma client|prisma schema" /tmp/build.log && exit 91; \
    grep -Eqi "RollupError|RolldownError|@rolldown|@rollup|rollup-linux|rolldown-binding" /tmp/build.log && exit 101; \
    grep -Eqi "Tailwind|@tailwindcss|CssSyntaxError|PostCSS|unknown utility" /tmp/build.log && exit 102; \
    grep -Eqi "VueCompilerError|@vue/compiler-sfc|vite:vue|Single File Component" /tmp/build.log && exit 103; \
    grep -Eqi "ENOENT|no such file or directory|case-sensitive" /tmp/build.log && exit 104; \
    grep -Eqi "TypeError|ReferenceError|SyntaxError" /tmp/build.log && exit 106; \
    grep -Eq "ERR_[A-Z_]+" /tmp/build.log && exit 107; \
    grep -Eq "Building Nitro Server|Server built" /tmp/build.log && exit 94; \
    grep -q "Building server" /tmp/build.log && exit 93; \
    grep -q "Client built" /tmp/build.log && exit 96; \
    grep -q "Building client" /tmp/build.log && exit 92; \
    grep -q "Building Nuxt for production" /tmp/build.log && exit 95; \
    grep -q "> build:admin" /tmp/build.log && exit 86; \
    exit 99; \
  }

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
