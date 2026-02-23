FROM node:20-alpine 
RUN apk add --no-cache tini curl 
ENTRYPOINT [ "/sbin/tini", "--" ]
WORKDIR /app 

FROM nginx:1.27-alpine
RUN apk add --no-cache curl

