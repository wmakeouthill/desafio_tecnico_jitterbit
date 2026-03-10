#!/bin/bash
# =============================================================================
# server-setup.sh — Configuração inicial do servidor Oracle Always Free
# Execute UMA VEZ com:
#   ssh -i "C:\Users\wcaco\Downloads\ssh-key-2026-03-05.key" ubuntu@204.216.170.224 'bash -s' < scripts/server-setup.sh
# =============================================================================

set -e

echo "==> Atualizando pacotes..."
sudo apt-get update -y

echo "==> Instalando dependências..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release

echo "==> Adicionando repositório Docker..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --no-tty --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "==> Instalando Docker e Docker Compose..."
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Adicionando usuário ubuntu ao grupo docker..."
sudo usermod -aG docker ubuntu

echo "==> Habilitando Docker no boot..."
sudo systemctl enable docker
sudo systemctl start docker

echo "==> Criando diretório da aplicação..."
mkdir -p /home/ubuntu/app

# -----------------------------------------------------------------------
# Oracle Always Free: abrir portas no iptables (além do Security List)
# -----------------------------------------------------------------------
echo "==> Abrindo portas no firewall (Oracle iptables)..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8081 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80   -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443  -j ACCEPT

echo "==> Salvando regras do iptables..."
sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

echo ""
echo "====================================================="
echo " Setup concluído!"
echo " Lembre-se de abrir as portas 3000 e 8081 no"
echo " Security List da Oracle (VCN > Subnet > Ingress Rules)"
echo "====================================================="
