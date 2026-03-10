# API de Gerenciamento de Pedidos

API RESTful para gerenciamento de pedidos desenvolvida com **Node.js**, **Express** e **MongoDB**.

> Desafio Técnico — Jitterbit

---

## Stack

- **Node.js** + **Express** — servidor e rotas
- **MongoDB** + **Mongoose** — banco de dados
- **JWT** + **bcrypt** — autenticação segura
- **Swagger UI** — documentação interativa
- **Docker** + **Docker Compose** — containerização

---

## Rodando localmente

**Pré-requisito:** Docker instalado.

```bash
# 1. Clone o repositório
git clone <repo-url>
cd desafio-tecnico-jitterbit

# 2. Configure o ambiente
cp .env.example .env
# Edite o .env com seus valores

# 3. Suba os containers
docker compose up -d --build
```

| Serviço | URL |
| --- | --- |
| API + Frontend | <http://localhost:3000> |
| Swagger Docs | <http://localhost:3000/api-docs> |
| Mongo Express | <http://localhost:8081> |

```bash
# Parar
docker compose down

# Parar e remover dados
docker compose down -v
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/orders_db
JWT_SECRET=sua_chave_secreta_forte_aqui
NODE_ENV=production
```

> O `.env` nunca é commitado — apenas o `.env.example` fica no repositório.

---

## Autenticação

Todas as rotas de pedidos exigem token JWT. Para obter um:

```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Use o token retornado no header de todas as requisições:

```http
Authorization: Bearer <token>
```

---

## Endpoints

| Método | Rota | Descrição | Auth |
| --- | --- | --- | :---: |
| `POST` | `/auth/token` | Gera token JWT | — |
| `POST` | `/order` | Cria pedido | ✓ |
| `GET` | `/order/list` | Lista todos os pedidos | ✓ |
| `GET` | `/order/:id` | Busca pedido por ID | ✓ |
| `PUT` | `/order/:id` | Atualiza pedido | ✓ |
| `DELETE` | `/order/:id` | Remove pedido | ✓ |
| `GET` | `/health` | Health check | — |

### Exemplo — Criar pedido

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
    ]
  }'
```

---

## Mapeamento de dados

A API recebe os dados em português e salva em inglês:

| Entrada (PT-BR) | Banco (EN) |
| --- | --- |
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `idItem` | `productId` |
| `quantidadeItem` | `quantity` |
| `valorItem` | `price` |

---

## Deploy

A aplicação roda em uma instância **Oracle Always Free** via Docker Compose.

```bash
# Primeira vez — instala Docker e configura firewall no servidor
ssh -i "chave.key" ubuntu@<ip> 'bash -s' < scripts/server-setup.sh

# Deploy — envia o código e reinicia os containers
deploy.bat
```

---

## Estrutura

```text
├── src/
│   ├── app.js                  # Entry point
│   ├── config/database.js      # Conexão MongoDB
│   ├── controllers/            # Lógica de negócio
│   ├── middlewares/            # Auth JWT e error handler
│   ├── models/Order.js         # Schema Mongoose
│   ├── routes/                 # Rotas da API
│   ├── swagger/                # Configuração Swagger
│   └── utils/mapper.js         # Mapeamento PT-BR → EN
├── public/                     # Frontend estático
├── docs/                       # GitHub Pages
├── scripts/                    # Scripts de deploy
├── .env.example                # Modelo de variáveis de ambiente
├── docker-compose.yml
└── Dockerfile
```

---

## Requisitos atendidos

- [x] CRUD completo de pedidos
- [x] Mapeamento PT-BR → EN dos dados
- [x] Banco de dados MongoDB
- [x] Tratamento de erros e respostas HTTP adequadas
- [x] Autenticação JWT com bcrypt
- [x] Documentação Swagger
- [x] Frontend web
- [x] Docker Compose
- [x] Deploy em cloud (Oracle Always Free)
