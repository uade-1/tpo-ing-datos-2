FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Remove devDependencies after build
RUN bun install --frozen-lockfile --production

EXPOSE 3000

CMD ["bun", "run", "start"]
