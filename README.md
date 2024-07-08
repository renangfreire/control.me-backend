# My.Financials - BackEnd

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

<br>

## 🚀 Tecnologias

Esse projeto está sendo desenvolvido com as seguintes tecnologias:

- Typescript
- Node.js
- Fastify
- Zod
- Vitest
- PostgreSQL
- Prisma

## 💻 Projeto

O Control.me é um projeto que tem como finalidade ser um controle de financias pessoais para usuário. Segue abaixo os Requesitos que a aplicação deve cumprir.

### RFs (Requisitos funcionais)

- [] Deve ser possível se cadastrar;
- [] Deve ser possível se autenticar;
- [] Deve ser possível realizar um CRUD em uma Entrada/Saída de dinheiro
- [] Deve ser possível realizar um CRUD em uma compra parcelada que será adicionada fracionada
- [] Deve ser possível realizar um CRUD em categorias de compra (saídas)
- [] Deve ser possível realizar um CRUD em categorias de recebimento de money (entradas)
- [] Deve ser possível realizar um CRUD em formas de pagamento diferente e que será vinculada a saída
- [] Deve ser possível realizar um CRUD em despesas fixas que serão adicionadas aos proximos meses automaticamente
- [] Deve ser possível visualizar as compras do mês
- [] Deve ser possível visualizar quando as movimentações foram feitas
- [] Deve ser possível visualizar as metricas -> Valor total gasto, Valor total recebido, separado por categórias: Graphs

EXTRAS after MVP:
- Visões de investimentos
- Visualização de Contas pagas/não pagas -> Com base em quando seu cartão vira
- Relatórios
- Metas

### RNs (Regras de negócio)

- [] O usuário não deve poder se cadastrar com um e-mail duplicado
- [] O usuário só pode ver suas movimentações/categorias/metricas

### RNFs (Requisitos não-funcionais)

- [] A senha do usuário precisa ser criptografada;
- [] A senha do usuário deverá ter um tamanho mínimo de 7 caracteres;
- [] Os dados da aplicação	precisam ser persistidos no PostgreSQL
- [] Todas as listas de dados precisam estar paginadas com 20 itens por pag;
- [] O usuário deve ser identificado por um JWT;

###  Entity Relationship Diagram
Diagrama é atualizado conforme o schema do Prisma é atualizado!

![ERD Image]

[ERD Image]: prisma/ERD.svg