# CustomMenu-Frontend

Este repositório contém o frontend do projeto **CustomMenu** para a Pousada Mamaloo. O objetivo é fornecer uma interface amigável e intuitiva para gerenciar menus personalizados.

## Funcionalidades

- Visualização de menus personalizados.
- Edição e criação de novos itens de menu.
- Integração com o backend para persistência de dados.

## Tecnologias Utilizadas


## 🧪 Rodando no ambiente de desenvolvimento

Este Frontend é orquestrado via `docker-compose.dev.yml` que se encontra dentro do mesmo repositório.

1. Clone o repositório 

2.  execute:

```bash
docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build
```
3. Acesse:
- front: http://localhost:5173
