@echo off
:: =============================================================================
:: deploy.bat — Deploy para Oracle Always Free (rode no Windows)
:: Fluxo: build local -> push Docker Hub -> servidor pull + up
:: =============================================================================

set SSH_KEY=C:\Users\wcaco\Downloads\jitterbit.key
set SERVER=ubuntu@134.65.250.48
set APP_DIR=/home/ubuntu/app
set IMAGE=wmakeouthill/jitterbit-api:latest

echo.
echo ==================================================
echo  [1/4] Construindo imagem Docker localmente...
echo ==================================================
docker build -t %IMAGE% .
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir a imagem!
    pause
    exit /b 1
)

echo.
echo ==================================================
echo  [2/4] Autenticando no Docker Hub...
echo ==================================================
docker login
if %errorlevel% neq 0 (
    echo ERRO: Falha no login do Docker Hub!
    pause
    exit /b 1
)

echo.
echo ==================================================
echo  [3/5] Enviando imagem para Docker Hub...
echo ==================================================
docker push %IMAGE%
if %errorlevel% neq 0 (
    echo ERRO: Falha ao enviar imagem!
    echo Certifique-se de que o repositorio existe em: https://hub.docker.com
    pause
    exit /b 1
)

echo.
echo ==================================================
echo  [4/5] Enviando configs para o servidor...
echo ==================================================
scp -i "%SSH_KEY%" docker-compose.prod.yml %SERVER%:%APP_DIR%/docker-compose.yml
scp -i "%SSH_KEY%" .env %SERVER%:%APP_DIR%/.env
scp -i "%SSH_KEY%" scripts/deploy.sh %SERVER%:%APP_DIR%/deploy.sh

echo.
echo ==================================================
echo  [5/5] Executando deploy no servidor...
echo ==================================================
ssh -i "%SSH_KEY%" %SERVER% "sed -i 's/\r$//' %APP_DIR%/deploy.sh && chmod +x %APP_DIR%/deploy.sh && %APP_DIR%/deploy.sh"

echo.
echo ==================================================
echo  Deploy finalizado!
echo ==================================================
pause
