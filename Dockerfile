FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro (cache de camadas Docker)
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --production

# Copia o restante do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "src/app.js"]
