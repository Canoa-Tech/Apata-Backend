# API do Projeto APATA

Documentação simples. O servidor roda em `http://localhost:3000`.
JSON padrão, upload usa `multipart/form-data`. Token JWT obrigatório em rotas protegidas (header `Authorization: Bearer <token>`).
---
## Usuários

**Criar usuário**
- `POST /usuarios` – body JSON com `email`, `name`, `password` (todos obrigatórios).
- Resposta 201 = objeto sem senha; 500 em erro.

**Login**
- `POST /login` – body com `email` e `password`.
- Resposta 200 = `{ message, token, user }`.
- 404 se não existe, 401 senha errada.

**Renovar token**
- `POST /atualizatoken` – header com token.
- Retorna 200 + novo token. 401 se inválido.

**Logout**
- `POST /logout` – apenas retorna mensagem.

**Listar usuários**
- `GET /usuarios` – retorna array de usuários.
- 500 em erro.

**Obter por ID**
- `GET /usuarios/:id` – retorna usuário ou 404.

**Atualizar**
- `PUT /usuarios/:id` – body com `email` e/ou `name`.
- Retorna objeto atualizado, 500 se falha.

**Deletar**
- `DELETE /usuarios/:id` – retorna mensagem sucesso.

---

## Pets

**Listar todos**
- `GET /pets` – sem filtro, retorna tudo (array vazio se nenhum).

**Buscar por ID**
- `GET /pets/:id` – retorna objeto ou 404.

**Criar pet**
- `POST /pets` (autenticado)
- `multipart/form-data` com campos:
  `nome`, `especie`, `porte`, `sexo`, `descricao` (todos obrigatórios);
  `tutelado`, `adotado` (opcionais booleanos como strings);
  `file` (imagem opcional).
- O servidor coloca `aprovado: true` automaticamente.
- Resposta 201 com objeto; 403 se usuário tiver ≥5 pets; 500 em erro.

**Atualizar pet**
- `PUT /pets/:id` (autenticado)
- Envie qualquer campo (JSON) ou form-data com nova foto.
- Resposta 200 = objeto atualizado; 404 se não existir.

**Deletar pet**
- `DELETE /pets/:id` (autenticado)
- Faz soft delete e remove foto.
- Resposta 200 com mensagem; 404 se não encontrado.

---

## Erros comuns

- 4xx: problema na requisição (usuario não encontrado, token inválido etc).
- 5xx: erro de servidor.
Leia o campo `error`/`message` no corpo para detalhes.

---

*Data: 28/02/2026*
#### Resposta de sucesso (201)
Retorna o objeto `Pet` recém-criado.

#### Possíveis erros
- `403` - limite de 5 pets por usuário atingido.
- `500` - erro geral ao cadastrar (ex: falha na nuvem ou no banco).

---

### 4. Atualizar Pet

- **Objetivo:** alterar dados de um pet já cadastrado.
- **Método:** `PUT`
- **Endpoint:** `/pets/:id`
- **Autenticação:** **Sim**

#### Body (JSON ou form-data se houver nova foto)
Qualquer campo que queira modificar. Se enviar `file`, o servidor fará upload e substituirá a antiga imagem.

#### Resposta (200)
Objeto atualizado.

#### Erros
- `404` - pet não encontrado.
- `500` - erro interno.

---

### 5. Deletar Pet (soft delete)

- **Objetivo:** remover um pet (registra `deleted_at` e exclui foto do Cloudinary).
- **Método:** `DELETE`
- **Endpoint:** `/pets/:id`
- **Autenticação:** **Sim**

#### Resposta (200)
```json
{ "message": "Animal e imagem removidos com sucesso!" }
```

#### Erros
- `404` - pet não encontrado.
- `500` - erro interno.

---

## ⚠️ Tratamento de erros

- Sempre verifique o código HTTP.
- Em `5xx` o problema é do servidor; tente novamente ou notifique o back-end.
- Em `4xx` o erro normalmente tem um `error` ou `message` explicativo.
- Para rotas autenticadas, sempre renove o token antes de expirar usando `/atualizatoken`.

---

## 💡 Dicas para o Front-End

1. Salve o `token` no `localStorage` ou `sessionStorage`.
2. Atualize o cabeçalho antes de toda chamada autenticada.
3. Use `FormData` para uploads de imagem; evite enviar JSON junto com arquivos.
4. Utilize o endpoint `GET /pets` para preencher lists; aplique filtros no cliente se precisar.
5. Ao criar/atualizar pets, cheque se há limite de 5 antes de submetê-los (pode contar no front com `/pets?owner=<id>` se quiser).

---

**Docs geradas em 28/02/2026** — valide com o time de backend se algo mudar.
