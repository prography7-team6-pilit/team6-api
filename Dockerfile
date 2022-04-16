FROM node:16-alpine3.14
LABEL version="0.0.1"

# COPY repository
COPY . .
WORKDIR server

# build
RUN pnpm install
RUN pnpm build

# Start
ENTRYPOINT [ "pnpm", "start:prod" ]
