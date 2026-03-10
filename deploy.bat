@echo off
:: =============================================================================
:: deploy.bat — Deploy para Oracle Always Free (rode no Windows)
:: Uso: deploy.bat
:: =============================================================================

set SSH_KEY=C:\Users\wcaco\Downloads\ssh-key-2026-03-05.key
set SERVER=ubuntu@204.216.170.224
set APP_DIR=/home/ubuntu/app

echo.
echo ==================================================
echo  Enviando arquivos para o servidor...
echo ==================================================

:: Sincroniza o projeto para o servidor (excluindo node_modules e .git)
scp -i "%SSH_KEY%" -r ^
  src ^
  public ^
  package.json ^
  Dockerfile ^
  docker-compose.yml ^
  .dockerignore ^
  %SERVER%:%APP_DIR%/

:: Envia o .env separadamente (contém secrets)
scp -i "%SSH_KEY%" .env %SERVER%:%APP_DIR%/.env

:: Envia o script de deploy para o servidor
scp -i "%SSH_KEY%" scripts/deploy.sh %SERVER%:%APP_DIR%/deploy.sh

echo.
echo ==================================================
echo  Executando deploy no servidor...
echo ==================================================

:: Torna o script executável e roda no servidor
ssh -i "%SSH_KEY%" %SERVER% "chmod +x %APP_DIR%/deploy.sh && %APP_DIR%/deploy.sh"

echo.
echo ==================================================
echo  Pronto! Verifique os URLs acima.
echo ==================================================
pause
