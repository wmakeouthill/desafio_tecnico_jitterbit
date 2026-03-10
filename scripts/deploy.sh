#!/bin/bash
# =============================================================================
# deploy.sh — Script de deploy executado NO SERVIDOR
# Disparado pelo deploy.bat local via SSH
# =============================================================================

set -e

APP_DIR="/home/ubuntu/app"

echo ""
echo "=================================================="
echo " Deploy - $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="

cd "$APP_DIR"

echo ""
echo "==> Parando e removendo containers existentes..."
docker compose down --remove-orphans 2>/dev/null || true

echo ""
echo "==> Removendo imagens antigas da aplicação..."
docker image prune -f 2>/dev/null || true

echo ""
echo "==> Construindo e subindo containers..."
docker compose up -d --build

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
echo " API:          http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):3000"
echo " Swagger:      http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):3000/api-docs"
echo " Mongo Express: http://$(curl -s ifconfig.me 2>/dev/null || echo 'SERVER_IP'):8081"
echo "=================================================="
