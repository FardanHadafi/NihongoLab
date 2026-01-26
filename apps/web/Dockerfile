FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @nihongolab/web --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

# Build arguments for public env vars
ARG PUBLIC_API_URL=http://localhost:3001
ENV PUBLIC_API_URL=$PUBLIC_API_URL

RUN pnpm turbo run build --filter=@nihongolab/web

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer /app/apps/web/build ./apps/web/build
COPY --from=installer /app/apps/web/package.json ./apps/web/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/node_modules ./apps/web/node_modules

EXPOSE 3000

CMD ["node", "apps/web/build"]