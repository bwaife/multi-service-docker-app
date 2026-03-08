# syntax=docker/dockerfile:1.6

FROM local/node-base:1 AS deps
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM local/node-base:1 AS runtime
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp
USER nodeusr

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]
