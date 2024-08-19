FROM node:20-alpine
ENV NODE_ENV=development

WORKDIR /usr/app/
COPY build/ .
COPY package*.json ./
RUN npm install

ENV NODE_ENV production

EXPOSE 5056
CMD ["node", "index.js"]