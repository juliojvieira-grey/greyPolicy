# Etapa base
FROM node:20.14.0-alpine3.19 AS base
WORKDIR /app

# Etapa de dependências
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Etapa de build com variável de ambiente
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_URL
ENV VITE_APP_URL=$VITE_APP_URL

RUN npm run build

# Etapa de produção
FROM node:20.14.0-alpine3.19 AS prod
RUN addgroup -g 1001 app && adduser -D -G app -u 1001 app
WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/dist ./dist
USER app

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://localhost:4173 || exit 1

CMD ["serve", "-s", "dist", "-l", "4173"]
