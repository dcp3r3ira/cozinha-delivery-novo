#!/bin/bash

# Comandos rápidos para Docker - Cozinha Delivery

# ==============================================
# PRODUÇÃO
# ==============================================

# 1. Build
docker build -t cozinha-delivery:latest .

# 2. Run
docker run -p 3000:3000 cozinha-delivery:latest

# 3. Com Docker Compose
docker-compose up --build

# ==============================================
# DESENVOLVIMENTO
# ==============================================

# 1. Com Docker Compose (hot reload)
docker-compose -f docker-compose.dev.yml up

# 2. Acesso ao container
docker exec -it cozinha-delivery-dev sh

# ==============================================
# GERENCIAMENTO
# ==============================================

# Ver containers rodando
docker ps

# Ver logs
docker logs cozinha-delivery-app

# Parar container
docker stop cozinha-delivery-app

# Remover container
docker rm cozinha-delivery-app

# Remover image
docker rmi cozinha-delivery:latest

# Limpar tudo
docker-compose down -v

# ==============================================
# BUILD COM VARIÁVEIS DE AMBIENTE
# ==============================================

# Build com args (se necessário)
docker build --build-arg NODE_ENV=production -t cozinha-delivery:latest .

# Run com arquivo .env
docker run --env-file .env -p 3000:3000 cozinha-delivery:latest
