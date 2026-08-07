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
RUN echo "PORTAINER_ADMIN_BUILD_2026-08-07_1" \
  && npm run build:admin

RUN echo "PORTAINER_NUXT_BUILD_2026-08-07_1" \
  && node --version \
  && npm --version \
  && npm exec -- nuxt build > /tmp/nuxt-build.log 2>&1 \
  || { \
    tail -n 200 /tmp/nuxt-build.log; \
    grep -Eqi "heap out of memory|heap limit|allocation failed|killed" /tmp/nuxt-build.log && exit 81; \
    grep -Eqi "ENOSPC|no space left" /tmp/nuxt-build.log && exit 82; \
    grep -Eqi "illegal instruction|SIGILL|segmentation fault|bus error" /tmp/nuxt-build.log && exit 83; \
    grep -Eqi "unsupported.*node|node.js.*version|EBADENGINE" /tmp/nuxt-build.log && exit 85; \
    grep -Eqi "fetch failed|EAI_AGAIN|ENOTFOUND|ECONNRESET|ETIMEDOUT" /tmp/nuxt-build.log && exit 90; \
    grep -Eqi "@prisma|prisma client|prisma schema" /tmp/nuxt-build.log && exit 91; \
    grep -Eqi "native binding|sharp|resvg|dlopen|GLIBC|GLIBCXX|wrong ELF|Exec format" /tmp/nuxt-build.log && exit 88; \
    grep -Eqi "Tailwind|@tailwindcss|CssSyntaxError|PostCSS|unknown utility" /tmp/nuxt-build.log && exit 102; \
    grep -Eqi "Element is missing end tag|Missing end tag" /tmp/nuxt-build.log && exit 121; \
    grep -Eqi "Invalid end tag|Unexpected closing tag|no matching end tag" /tmp/nuxt-build.log && exit 122; \
    grep -Eqi "Error parsing JavaScript expression|Error parsing interpolation|Error parsing template expression" /tmp/nuxt-build.log && exit 123; \
    grep -Eqi "Duplicate attribute" /tmp/nuxt-build.log && exit 124; \
    grep -Eqi "v-else.*no adjacent v-if|v-else-if.*no adjacent v-if|v-for.*has no expression|v-if.*has no expression" /tmp/nuxt-build.log && exit 125; \
    grep -Eqi "Codegen node is missing|unhandled node type" /tmp/nuxt-build.log && exit 126; \
    grep -Eqi "Failed to resolve type|Unresolvable type|Failed to resolve extends base type" /tmp/nuxt-build.log && exit 127; \
    grep -Eqi "At least one <template>|Single file component can contain only one|Duplicate <script|Duplicate <template" /tmp/nuxt-build.log && exit 128; \
    grep -Eqi "sh:.*vite.*not found|vite:.*not found|vite.*command not found" /tmp/nuxt-build.log && exit 108; \
    grep -Eqi "failed to resolve import|Rollup failed to resolve import|Could not load .*imported by" /tmp/nuxt-build.log && exit 110; \
    grep -Eqi "RollupError|RolldownError|@rolldown|@rollup|rollup-linux|rolldown-binding" /tmp/nuxt-build.log && exit 101; \
    grep -Eqi "ENOENT|no such file or directory|case-sensitive" /tmp/nuxt-build.log && exit 104; \
    grep -Eqi "Cannot find module|Cannot find package|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND" /tmp/nuxt-build.log && exit 109; \
    grep -Eqi "TypeError|ReferenceError|SyntaxError" /tmp/nuxt-build.log && exit 106; \
    grep -Eq "ERR_[A-Z_]+" /tmp/nuxt-build.log && exit 107; \
    grep -Eqi "cannot find|could not resolve|command not found" /tmp/nuxt-build.log && exit 84; \
    about_line="$(grep -Eo 'LandingAboutSection\.vue:[0-9]+:[0-9]+' /tmp/nuxt-build.log | head -n 1 | cut -d: -f2)"; \
    if [ -n "$about_line" ] && [ "$about_line" -le 100 ]; then exit $((150 + about_line)); fi; \
    grep -q "LandingAboutSection.vue" /tmp/nuxt-build.log && exit 131; \
    grep -q "LandingFeaturedHeroSection.vue" /tmp/nuxt-build.log && exit 132; \
    grep -q "LandingAudienceSection.vue" /tmp/nuxt-build.log && exit 133; \
    grep -q "LandingPlaceCard.vue" /tmp/nuxt-build.log && exit 134; \
    grep -q "app/features/landing" /tmp/nuxt-build.log && exit 135; \
    grep -q "app/pages" /tmp/nuxt-build.log && exit 136; \
    grep -q "app/shared" /tmp/nuxt-build.log && exit 137; \
    grep -q "app/features" /tmp/nuxt-build.log && exit 138; \
    grep -q "\.nuxt/" /tmp/nuxt-build.log && exit 139; \
    grep -Eqi "VueCompilerError|@vue/compiler-sfc|vite:vue|Single File Component" /tmp/nuxt-build.log && exit 103; \
    grep -Eq "Building Nitro Server|Server built" /tmp/nuxt-build.log && exit 94; \
    grep -q "Building server" /tmp/nuxt-build.log && exit 93; \
    grep -q "Client built" /tmp/nuxt-build.log && exit 96; \
    grep -q "Building client" /tmp/nuxt-build.log && exit 92; \
    grep -q "Building Nuxt for production" /tmp/nuxt-build.log && exit 95; \
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
