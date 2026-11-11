# Server image (dev/guides/backend.md §2). Build from the repo root, since the server needs the
# @sonha/types workspace package:
#   docker build -f apps/server/Dockerfile -t nha-minh-server .

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json packages/types/
COPY apps/server/package.json apps/server/

# Everything but the mobile app, whose React Native tree is large and unused here.
FROM base AS build
RUN pnpm install --frozen-lockfile --ignore-scripts --filter "!@sonha/mobile"
COPY tsconfig.base.json ./
COPY packages/types packages/types
COPY apps/server apps/server
RUN pnpm --filter @sonha/types build && pnpm --filter @sonha/server build

FROM base AS runtime
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --ignore-scripts --prod --filter "!@sonha/mobile"
COPY --from=build /app/packages/types/dist packages/types/dist
COPY --from=build /app/apps/server/dist apps/server/dist
USER node
EXPOSE 8080
ENV PORT=8080
CMD ["node", "apps/server/dist/index.js"]
