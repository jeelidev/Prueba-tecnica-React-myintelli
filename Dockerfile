

FROM node:20-alpine AS build-env

RUN npm install -g pnpm

WORKDIR /app


COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ARG DB_FILE_NAME

ENV DATABASE_URL=${DB_FILE_NAME}


RUN pnpm drizzle-kit migrate


RUN pnpm build



FROM node:20-alpine AS production-env


RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./


RUN pnpm install --prod


COPY --from=build-env /app/build ./build

COPY --from=build-env /app/db ./db

EXPOSE 3000

CMD ["pnpm", "start"]