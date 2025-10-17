

FROM node:20-alpine AS build-env
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build


FROM node:20-alpine AS production-env
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY drizzle.config.ts ./
COPY drizzle/ ./drizzle
COPY db/ ./drizzle
RUN pnpm install --prod

COPY --from=build-env /app/build ./build 
COPY --from=build-env /app/node_modules ./node_modules 


COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

EXPOSE 3000


ENTRYPOINT ["./entrypoint.sh"]