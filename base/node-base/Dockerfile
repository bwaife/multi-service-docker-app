FROM node:20-alpine

# Reason; tini properly handles PID 1 and child processes; prevents zombie processes in containers.
RUN apk add --no-cache tini curl

# Reason; use tini as init for correct signal handling and clean shutdown.
ENTRYPOINT ["/sbin/tini", "--"]

# Reason; run from /app consistently across services; reduces variability.
WORKDIR /app