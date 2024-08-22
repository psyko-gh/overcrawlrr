# Use a build image
FROM node:lts-alpine as BUILD_IMAGE
WORKDIR /app/
COPY . ./
RUN npm ci
RUN npm run build

# Build live image
FROM node:lts-alpine

WORKDIR /app/
COPY package.json package-lock.json ./
COPY .husky/install.mjs ./.husky/install.mjs
COPY schema ./schema/
COPY --from=BUILD_IMAGE /app/build ./
RUN npm ci --omit=dev

RUN apk add --no-cache dumb-init

USER node

CMD ["dumb-init", "node", "index.js"]
EXPOSE 5056
