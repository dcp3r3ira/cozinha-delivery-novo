#!/bin/bash

# Script para construir e executar o Docker

set -e

echo "🐳 Construindo imagem Docker..."
docker build -t cozinha-delivery:latest .

echo "✅ Imagem construída com sucesso!"
echo ""
echo "Para executar o container:"
echo "  docker run -p 3000:3000 cozinha-delivery:latest"
echo ""
echo "Ou use docker-compose:"
echo "  docker-compose up"
echo ""
echo "Para desenvolvimento:"
echo "  docker-compose -f docker-compose.dev.yml up"
