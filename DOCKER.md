# Docker - Cozinha Delivery

## 📦 Imagens Docker Disponíveis

### Produção
- **Dockerfile**: Build otimizado com multi-stage (production-ready)
- Usa Alpine Linux para menor tamanho
- Utiliza `serve` para servir arquivos estáticos

### Desenvolvimento
- **Dockerfile.dev**: Para desenvolvimento com hot reload
- Expõe porta 5173 (Vite dev server)
- Volume mounted para código-fonte

## 🚀 Como Usar

### Build e Run da Produção

```bash
# Build
docker build -t cozinha-delivery:latest .

# Run
docker run -p 3000:3000 cozinha-delivery:latest
```

### Usando Docker Compose (Produção)

```bash
docker-compose up --build
```

Acesse: http://localhost:3000

### Desenvolvimento com Docker Compose

```bash
docker-compose -f docker-compose.dev.yml up
```

Acesse: http://localhost:5173

### Usando o Script de Build

```bash
chmod +x docker-build.sh
./docker-build.sh
```

## 📋 Variáveis de Ambiente

A aplicação utiliza variáveis de ambiente do Firebase. Configure no seu host:

```bash
export VITE_FIREBASE_API_KEY=sua_api_key
export VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
export VITE_FIREBASE_PROJECT_ID=seu_project_id
# etc...
```

Ou crie um arquivo `.env` na raiz do projeto.

## 🔍 Verificar Containers

```bash
# Listar containers rodando
docker ps

# Ver logs
docker logs cozinha-delivery-app

# Acessar bash no container
docker exec -it cozinha-delivery-app sh
```

## 🧹 Limpar

```bash
# Remover container
docker-compose down

# Remover image
docker rmi cozinha-delivery:latest

# Remover tudo (containers + volumes)
docker-compose down -v
```

## 📊 Tamanho da Imagem

A imagem final de produção usa multi-stage para manter o tamanho pequeno:
- Stage 1: Node full (build)
- Stage 2: Node Alpine (runtime) - ~200MB

## ✨ Características

- ✅ Multi-stage build (otimizado para produção)
- ✅ Alpine Linux (imagem pequena e segura)
- ✅ Hot reload em desenvolvimento
- ✅ Docker Compose para orquestração
- ✅ .dockerignore para exclusão de arquivos desnecessários
- ✅ Suporte a variáveis de ambiente
