#!/bin/bash
# =============================================================================
# deploy.sh — Script de deploy executado NO SERVIDOR
# Apenas pull da imagem + restart dos containers (build feito localmente)
# =============================================================================

set -e

APP_DIR="/home/ubuntu/app"
IMAGE="wmakeouthill/jitterbit-api:latest"

echo ""
echo "=================================================="
echo " Deploy - $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="

cd "$APP_DIR"

echo ""
echo "==> Baixando imagem mais recente..."
docker pull "$IMAGE"

echo ""
echo "==> Parando containers existentes..."
docker compose down --remove-orphans 2>/dev/null || true

echo ""
echo "==> Subindo containers com nova imagem..."
docker compose up -d

echo ""
echo "==> Limpando imagens antigas e não utilizadas..."
docker image prune -af 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
docker builder prune -af 2>/dev/null || true

echo ""
echo "==> Espaço em disco após limpeza:"
df -h / | tail -1

echo ""
echo "==> Aguardando serviços ficarem prontos..."
sleep 8

echo ""
echo "==> Status dos containers:"
docker compose ps

echo ""
echo "==> Logs recentes da API:"
docker compose logs --tail=20 api

echo ""
echo "=================================================="
echo " Deploy concluído!"
echo " API:           http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):3000"
echo " Swagger:       http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):3000/api-docs"
echo " Mongo Express: http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):8081"
echo "=================================================="
