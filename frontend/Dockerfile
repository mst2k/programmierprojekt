FROM node:18-alpine3.17 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine3.17
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
ENV VITE_PORT=5174
ENV VITE_ORIGIN=http://localhost
EXPOSE $VITE_PORT
CMD [ "serve", "-s", "dist", "-l", "tcp://0.0.0.0:5174" ]