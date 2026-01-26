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
RUN turbo prune @nihongolab/web --docker

# --------------------
# INSTALL + BUILD
# --------------------
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm turbo run build --filter=@nihongolab/web

# Final stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and its production node_modules
COPY --from=installer /app/apps/web/build ./apps/web/build
COPY --from=installer /app/apps/web/package.json ./apps/web/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/node_modules ./apps/web/node_modules

EXPOSE 5173
ENV ORIGIN=http://localhost:5173
CMD ["node", "apps/web/build/index.js"]
