FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npx prisma generate && npm run build
RUN cp -f .env.prod .env && \
    npx prisma generate && \
    npm run build

EXPOSE 3000

CMD ["node", "dist/main"]