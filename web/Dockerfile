# syntax=docker/dockerfile:1.6

FROM local/node-base:1 AS build
WORKDIR /app

# Reason; cache dependencies; avoid invalidating on source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Final runtime image; serve only static assets
FROM local/web-base:1 AS runtime

# Reason; remove default site; use our minimal config; avoid accidental exposure.
RUN rm -rf /usr/share/nginx/html/*

# Reason; static assets only; no node_modules; smallest possible runtime.
COPY --from=build /app/dist /usr/share/nginx/html

# Minimal health endpoint for static server
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1