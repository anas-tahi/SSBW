# ============================================================
# Tienda Prado — Dockerfile
# Tarea 13: SSBW — Universidad de Granada
# ============================================================

FROM node:24-alpine AS base

LABEL maintainer="Anas Tahir"
LABEL description="Tienda Prado — Express MPA (SSBW)"

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV LOG_LEVEL=production
ENV PORT=3000
ENV POSTGRES_HOST=db

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Run migrations + seed + start app
CMD npx prisma migrate deploy && npx tsx prisma/seed.ts && npx tsx index.ts
