# Guia de Arquitetura — Catequiza

> Documento orientado a novos desenvolvedores. Ele explica **como o projeto está organizado**, **por que escolhemos essa forma**, e **o que cada aplicação faz** no ecossistema atual.

---

## Visão geral

O Catequiza saiu de um monólito simples e hoje roda como **duas aplicações Spring Boot independentes** que compartilham o **mesmo banco de dados PostgreSQL** hospedado no Render:

- **backend-admin** (`app-catequista/backend-admin`) — painel da secretaria, porta `8080`.
- **backend-aluno** (`app-catequizando/backend-aluno`) — portal público dos alunos, porta `8081`.

Os front-ends são estáticos e já estão publicados na Vercel (ver seção [Ambientes de Produção] do README). Os back-ends ficam no Render como serviços web.

A decisão exata, incluindo a delegação do Flyway ao `backend-admin`, está registrada na [ADR 003 — Shared Database Pattern](docs/adr/003-shared-database-pattern.md).

---

## Estrutura do monorepo

```
Catequiza-dev/
├── app-catequista/
│   ├── backend-admin/
│   │   ├── src/main/java/com/catequiza/admin/
│   │   │   ├── CatequizaAdminApplication.java
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── security/
│   │   │   └── domain/
│   │   │       ├── Catequizando.java
│   │   │       ├── Presenca.java
│   │   │       └── Turma.java
│   │   └── src/main/resources/
│   │       ├── application.properties
│   │       └── db/migration/
│   │           └── V1__init.sql
│   └── frontend-admin/
├── app-catequizando/
│   ├── backend-aluno/
│   │   ├── src/main/java/com/catequiza/aluno/
│   │   │   ├── CatequizaAlunoApplication.java
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── domain/
│   │   │       ├── Catequizando.java
│   │   │       ├── Presenca.java
│   │   │       └── Turma.java
│   │   └── src/main/resources/
│   │       └── application.properties
│   └── frontend-aluno/
└── docs/
```

Cada aplicação Spring Boot tem seu próprio `pom.xml`, seu próprio pacote base (`com.catequiza.admin` / `com.catequiza.aluno`) e seu próprio `application.properties`. O `docs/` fica na raiz e centraliza ADR, contribuição e este guia.

---

## Por que duas aplicações conectadas ao mesmo banco?

Escolhemos o **Shared Database Pattern** porque ele resolve os problemas reais do projeto sem custo extra. Abaixo os três benefícios que mais importam para nós.

### Resiliência e Isolamento

Os alunos acessam muito mais que a secretaria, especialmente nos horários de chamada de presença. Quando separamos o tráfego dos alunos no `backend-aluno`, os picos de requisição **não competem com a CPU/RAM do painel administrativo**. Um surto de acesso no portal público não deixa o secretário travando ao abrir o cadastro de uma turma.

### Segurança Estrutural

O banco é compartilhado, mas **só o backend-admin executa Flyway**. As migrações ficam restritas a uma aplicação, o que evita:

- dois processos tentando migrar ao mesmo tempo;
- locks e conflitos de schema;
- aplicações read-only acionando irreversivelmente alterações no banco.

A regra é simples e auditável: `spring.flyway.enabled=true` no admin; `spring.flyway.enabled=false` no aluno. Quem pode mudar o schema é apenas o processo da secretaria.

### Custo Zero Sustentável

Com duas instâncias gratuitas do Render (uma por backend) e os front-ends na Vercel, maximizamos o que a nuvem gratuita oferece sem concentrar toda a carga em um único processo. Dois serviços pequenos são mais previsíveis que um único serviço grande que acumula as duas responsabilidades.

---

## O que cada backend entende por "entidades espelhadas"

Os dois back-ends replicam o mapeamento das entidades JPA de forma idêntica (`Turma`, `Catequizando`, `Presenca`). A diferença prática é a **capability**, não o modelo:

- **backend-admin** — leitura, escrita e **migrações**.
- **backend-aluno** — leitura/gravação apenas, sem controle de schema.

Se você precisa adicionar ou alterar uma entidade, reflita a mudança nos dois domínios. A consistência mútua é deliberada: os dois lados conversam com as mesmas tabelas.

---

## Como usar este repositório

- Leia a árvore acima para saber **onde** cada coisa vive.
- Leia a seção "Por que duas aplicações..." para saber **por que** ela existe.
- Leia a [ADR 003](docs/adr/003-shared-database-pattern.md) para a decisão formal e a razão da delegação do Flyway.
- Leia o [README.md](../README.md) para os **ambientes de produção reais**, variáveis de ambiente eCI/CD.
