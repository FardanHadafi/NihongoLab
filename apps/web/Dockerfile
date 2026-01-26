FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm turbo

# --------------------
# PRUNE
# --------------------
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @nihongolab/api --docker

# --------------------
# INSTALL + BUILD
# --------------------
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

# 🔑 THIS IS THE CRITICAL LINE
RUN pnpm turbo run build --filter=@nihongolab/api...

# --------------------
# RUNTIME
# --------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/api/dist ./apps/api/dist
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/node_modules ./node_modules

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/index.js"]
