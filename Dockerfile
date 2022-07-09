FROM node:16-alpine3.14
LABEL version="0.0.1"

ENV TZ=Asia/Seoul
RUN npm install -g pnpm@^6

# COPY repository
COPY . .

# build
RUN pnpm install
RUN pnpm build

# Start
ENTRYPOINT [ "pnpm", "start:prod" ]
