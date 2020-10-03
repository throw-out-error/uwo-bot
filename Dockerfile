FROM creepinson/alpine-pnpm

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]