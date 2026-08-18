# Multi-Stage Production Dockerfile for Coolify
# Stage 1: Build Vite React App
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Copia código fonte e gera build de produção
COPY . .
RUN npm run build

# Stage 2: Servidor Web Nginx de Alta Performance
FROM nginx:alpine

# Configuração customizada do Nginx com SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
