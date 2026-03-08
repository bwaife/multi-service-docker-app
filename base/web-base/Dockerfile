FROM nginx:1.27-alpine

# Reason; consistent hardening and utilities; curl useful for local debugging and healthchecks if needed.
RUN apk add --no-cache curl

# Reason; default Nginx image already uses a non-root-friendly setup; keep it minimal.