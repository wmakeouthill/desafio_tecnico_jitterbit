# 📦 API de Gerenciamento de Pedidos

API RESTful para gerenciamento de pedidos desenvolvida em **Node.js** com **Express** e **MongoDB**.

> Desafio Técnico - Jitterbit

---

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Subindo a aplicação

```bash
docker-compose up --build
```

A aplicação estará disponível em:

| Serviço | URL |
|---------|-----|
| **API** | <http://localhost:3000> |
| **Frontend** | <http://localhost:3000> |
| **Swagger (Docs)** | <http://localhost:3000/api-docs> |
| **Mongo Express** | <http://localhost:8081> |

### Parando a aplicação

```bash
docker-compose down
```

Para remover também os dados do banco:

```bash
docker-compose down -v
```

---

## 🔐 Autenticação (JWT)

A API utiliza autenticação via token JWT. Para obter um token:

```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Use o token retornado no header `Authorization: Bearer <token>` em todas as requisições.

---

## 📡 Endpoints

### Criar Pedido (Obrigatório)

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Obter Pedido por ID (Obrigatório)

```bash
curl http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Listar Todos os Pedidos (Opcional)

```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Atualizar Pedido (Opcional)

```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 7500
      }
    ]
  }'
```

### Deletar Pedido (Opcional)

```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🗂️ Estrutura do Projeto

```
├── docker-compose.yml          # Orquestração dos containers
├── Dockerfile                  # Build da imagem da API
├── package.json                # Dependências do projeto
├── public/
│   └── index.html              # Frontend (interface web)
├── src/
│   ├── app.js                  # Entry point da aplicação
│   ├── config/
│   │   └── database.js         # Conexão com MongoDB
│   ├── controllers/
│   │   └── orderController.js  # Lógica dos endpoints
│   ├── middlewares/
│   │   ├── auth.js             # Middleware JWT
│   │   └── errorHandler.js     # Tratamento global de erros
│   ├── models/
│   │   └── Order.js            # Schema Mongoose
│   ├── routes/
│   │   ├── authRoutes.js       # Rotas de autenticação
│   │   └── orderRoutes.js      # Rotas de pedidos
│   ├── swagger/
│   │   └── swaggerConfig.js    # Configuração Swagger
│   └── utils/
│       └── mapper.js           # Mapeamento PT-BR → EN
└── README.md
```

---

## 🔄 Mapeamento de Dados

A API recebe dados em português e transforma para inglês antes de salvar:

| Entrada (PT-BR) | Banco (EN) |
|------------------|------------|
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `idItem` | `productId` |
| `quantidadeItem` | `quantity` |
| `valorItem` | `price` |

---

## 🛠️ Tecnologias

- **Node.js** + **Express** - Backend
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Docker** + **Docker Compose** - Containerização
- **Mongo Express** - Interface de administração do MongoDB

---

## ✅ Requisitos Atendidos

- [x] CRUD completo de pedidos
- [x] Transformação/mapeamento dos dados
- [x] Banco de dados MongoDB
- [x] Código organizado e comentado
- [x] Tratamento de erros robusto
- [x] Respostas HTTP adequadas
- [x] Autenticação JWT (recurso adicional)
- [x] Documentação Swagger (recurso adicional)
- [x] Frontend web (recurso adicional)
- [x] Docker Compose
