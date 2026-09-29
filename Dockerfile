# ============================================================
#  Imagen de producción de la tienda Taller Creativo EK (Next.js)
#  Build: docker build -t taller-creativo-ek .
#  Run:   docker run -p 3000:3000 --env-file .env taller-creativo-ek
# ============================================================

# ── 1. Dependencias ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate

# ── 2. Build de producción ───────────────────────────────────
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# ── 3. Imagen final (runtime) ────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/package.json ./
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"]
