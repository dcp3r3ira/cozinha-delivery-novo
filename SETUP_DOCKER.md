# 🐳 Dockerização - Cozinha Delivery

## ✅ Arquivos Criados

1. **Dockerfile** - Build de produção otimizado
2. **Dockerfile.dev** - Build para desenvolvimento com hot reload
3. **docker-compose.yml** - Orquestração para produção
4. **docker-compose.dev.yml** - Orquestração para desenvolvimento
5. **.dockerignore** - Arquivos ignorados durante build
6. **docker-build.sh** - Script auxiliar para build
7. **DOCKER.md** - Documentação detalhada
8. **DOCKER_COMMANDS.sh** - Comandos de referência rápida

## 🚀 Início Rápido

### Opção 1: Docker Compose (Recomendado)

```bash
# Produção
docker-compose up --build

# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up
```

### Opção 2: Comando Manual

```bash
# Build
docker build -t cozinha-delivery:latest .

# Run
docker run -p 3000:3000 cozinha-delivery:latest
```

### Opção 3: Script Auxiliar

```bash
./docker-build.sh
```

## 🌐 Acessar a Aplicação

- **Produção**: http://localhost:3000
- **Desenvolvimento**: http://localhost:5173

## 📝 Variáveis de Ambiente

Se usar variáveis Firebase, certifique-se de:

1. Criar arquivo `.env` na raiz do projeto:
```
VITE_FIREBASE_API_KEY=seu_valor
VITE_FIREBASE_AUTH_DOMAIN=seu_valor
VITE_FIREBASE_PROJECT_ID=seu_valor
# ... outras variáveis
```

2. Passar para Docker:
```bash
docker run --env-file .env -p 3000:3000 cozinha-delivery:latest
```

## 📊 Informações da Imagem

- **Base**: Node 20 Alpine (leve e seguro)
- **Tamanho Final**: ~150MB
- **Multi-stage Build**: Otimizado para produção
- **Ports**: 
  - 3000 (produção com serve)
  - 5173 (desenvolvimento com Vite)

## 🧪 Testes

```bash
# Verificar se está rodando
curl http://localhost:3000

# Ver logs
docker logs cozinha-delivery-app

# Acessar bash no container
docker exec -it cozinha-delivery-app sh
```

## 🔧 Troubleshooting

### Erro de permissão
```bash
sudo docker ps
```

### Porta em uso
```bash
# Usar porta diferente
docker run -p 8000:3000 cozinha-delivery:latest
```

### Limpar tudo
```bash
docker-compose down -v
docker system prune -a
```

## 📚 Próximos Passos (Opcional)

- [ ] Publicar imagem no Docker Hub
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar health checks
- [ ] Configurar logging centralizado
- [ ] Adicionar nginx como reverse proxy

## 💡 Dicas

- Use `docker-compose.dev.yml` para desenvolvimento local
- Use `docker-compose.yml` para simular produção
- As variáveis de ambiente do Firebase devem estar configuradas antes do build
- O hot reload funciona apenas com `Dockerfile.dev`
