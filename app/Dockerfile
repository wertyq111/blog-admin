# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM node:16.20.0-alpine3.17 AS development

RUN mkdir /project
WORKDIR /project

COPY . .
RUN npm config set strict-ssl false && npm install -g cnpm@7.1.0 --registry=https://registry.npm.taobao.org
RUN npm install global  @vue/cli
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn install --pure-lockfile
ENV HOST=0.0.0.0
CMD ["npm", "run", "serve"]

FROM development as dev-envs
RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD ["npm", "run", "serve"]
