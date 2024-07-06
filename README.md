# App

personal finances style app

## RFs (Requisitos funcionais)

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
Visões de investimentos
Visualização de Contas pagas/não pagas
Relatórios
Metas

## RNs (Regras de negócio)

- [] O usuário não deve poder se cadastrar com um e-mail e/ou cpf duplicado
- [] O usuário só pode ver suas movimentações/categorias/metricas

## RNFs (Requisitos não-funcionais)

- [] A senha do usuário precisa ser criptografada;
- [] Os dados da aplicação	precisam ser persistidos no PostgreSQL
- [] Todas as listas de dados precisam estar paginadas com 20 itens por pag;
- [] O usuário deve ser identificado por um JWT;