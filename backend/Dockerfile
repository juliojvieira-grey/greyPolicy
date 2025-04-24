# Etapa base
FROM node:22.1.0-alpine3.18 AS base
WORKDIR /app
ENV NODE_ENV=production

# Etapa para instalar dependências (usada no build)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Etapa de build da aplicação
FROM deps AS build
COPY . .
RUN node ace build

# Fase final - produção
FROM node:22-alpine AS final
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/build /app
COPY --from=build /app/node_modules /app/node_modules

COPY scripts/wait-for-postgres.sh /scripts/wait-for-it.sh
RUN chmod +x /scripts/wait-for-it.sh

EXPOSE 3333

CMD ["node", "bin/server.js"]
