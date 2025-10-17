

FROM node:20-alpine 
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ARG DB_FILE_NAME
ENV DATABASE_URL=${DB_FILE_NAME}
RUN pnpm drizzle-kit migrate
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]