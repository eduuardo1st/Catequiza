FROM node:24-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve@14.2
EXPOSE 5173
CMD ["sh", "-c", "serve -s dist -l ${FRONTEND_PORT:-5173}"]