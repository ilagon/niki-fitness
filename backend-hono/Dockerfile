FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

RUN npx prisma generate

COPY . .

CMD ["npm", "start"]