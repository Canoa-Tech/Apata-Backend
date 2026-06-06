# 🐾 APATA API - Backend

API REST desenvolvida para gerenciar o sistema de adoção de animais da APATA.

A aplicação é responsável pela autenticação de usuários, gerenciamento dos animais cadastrados, upload de imagens para o Cloudinary e persistência dos dados utilizando MongoDB com Prisma ORM.

---

## 📋 Sobre o Projeto

Esta API fornece todos os recursos necessários para o funcionamento da plataforma APATA.

Entre suas responsabilidades estão:

- Cadastro e autenticação de usuários
- Gerenciamento de animais disponíveis para adoção
- Upload e armazenamento de imagens
- Controle de permissões através de JWT
- Soft Delete para preservação dos registros
- Integração com banco MongoDB

---

## 🚀 Funcionalidades

### Usuários

- Cadastro de usuários
- Login com autenticação JWT
- Renovação de token
- Logout
- Listagem de usuários
- Atualização de dados
- Exclusão de usuários

### Animais

- Cadastro de animais
- Upload de imagem para Cloudinary
- Listagem de todos os animais
- Busca por ID
- Busca por nome
- Atualização de dados
- Alteração de imagem
- Exclusão lógica (Soft Delete)

### Segurança

- Middleware de autenticação JWT
- Proteção de rotas privadas
- Senhas criptografadas com Bcrypt

---

## 🛠 Tecnologias Utilizadas

### Back-End

- Node.js
- Express
- Prisma ORM
- MongoDB
- JWT (Json Web Token)
- Bcrypt
- Multer
- Cloudinary

### Ferramentas

- TypeScript Runtime (TSX)
- Dotenv
- Git
- GitHub

---

## 📁 Estrutura do Projeto

```text
src/
│
├── controllers/
│   ├── PetController.js
│   └── UserController.js
│
├── routes/
│   ├── petRoutes.js
│   └── userRoutes.js
│
├── middlewares/
│   └── auth.js
│
├── services/
│   └── cloudinary.js
│
├── config/
│   └── multer.js
│
└── server.js

prisma/
│
└── schema.prisma
```

---

## 🗄 Banco de Dados

O projeto utiliza MongoDB através do Prisma ORM.

### Modelo User

```text
User
├── id
├── email
├── name
├── password
└── pets
```

### Modelo Pet

```text
Pet
├── id
├── nome
├── especie
├── porte
├── sexo
├── descricao
├── contato
├── foto
├── public_idfoto
├── adotado
├── aprovado
├── tutelado
├── deleted_at
├── createdAt
├── updatedAt
└── ownerId
```

---

## 🔒 Autenticação

A autenticação é realizada utilizando JWT.

Após o login, a API retorna:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "id",
    "name": "nome",
    "email": "email"
  }
}
```

Para acessar rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

---

## ☁ Upload de Imagens

As imagens dos animais são armazenadas no Cloudinary.

Fluxo:

1. Upload realizado via Multer
2. Arquivo enviado ao Cloudinary
3. URL salva no MongoDB
4. Em atualizações, a imagem antiga pode ser removida automaticamente

---

## 🔗 Principais Endpoints

### Usuários

```http
POST   /register
POST   /login
POST   /renew-token
POST   /logout

GET    /users
GET    /users/:id

PUT    /users/:id
DELETE /users/:id
```

### Animais

```http
POST   /pets

GET    /pets
GET    /pets/:id
GET    /pets/search?nome=

PUT    /pets/:id
DELETE /pets/:id
```

---

## ⚙️ Instalação

Clone o projeto:

```bash
git clone https://github.com/seu-usuario/apata-backend.git
```

Entre na pasta:

```bash
cd apata-backend
```

Instale as dependências:

```bash
npm install
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/apata"

JWT_SECRET="sua_chave_jwt"

CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

---

## ▶️ Executando o Projeto

Gerar o cliente Prisma:

```bash
npx prisma generate
```

Executar servidor:

```bash
npm start
```

Servidor disponível em:

```text
http://localhost:5000
```

---

## 📚 Conceitos Aplicados

Durante o desenvolvimento foram utilizados conceitos como:

- Arquitetura MVC
- API REST
- Autenticação JWT
- Middleware de autorização
- Upload de arquivos
- Criptografia de senhas
- ORM com Prisma
- MongoDB
- Soft Delete
- Integração com serviços externos
- Tratamento de erros

---

## 💡 Melhorias Futuras

- Refresh Token
- Rate Limiting
- Logs centralizados
- Testes automatizados
- Swagger/OpenAPI
- Paginação de resultados
- Filtros avançados para animais
- Sistema de aprovação administrativa
- Recuperação de senha por e-mail

---

## 👨‍💻 Autores

Fernando Macedo e William Queiroz

Desenvolvedores Full Stack.

API desenvolvida para dar suporte à plataforma APATA, auxiliando na divulgação e adoção responsável de animais.
