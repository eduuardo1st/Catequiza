# ADR 003: Shared Database Pattern — Dois Apps, um Banco de Dados Compartilhado

| Campo        | Valor                                      |
| ------------ | ------------------------------------------ |
| **Status**   | Aceito ✅                                  |
| **Data**     | 2026-09-05                                 |
| **Relacionadas** | [ADR 001](001-arquitetura-ci-cd.md) · [ADR 002](002-configuracao-externalizada-bd.md) |

---

## Contexto

O Catequiza começou como um monólito simples: um único backend Spring Boot e um único frontend estático. Com a evolução do produto, surgiram dois públicos com comportamentos de acesso muito diferentes:

1. **Secretaria e catequistas** — uso interno, baixo volume, sessões longas (chamadas, cadastros).
2. **Catequizandos/pais** — consulta pública de frequência, com **picos de acesso** (fins de semana, envio de comunicados, períodos de matrícula).

**Problema central:** em uma instância única e gratuita de hospedagem, um pico de acesso dos alunos pode degradar ou derrubar o painel administrativo, comprometendo a operação da secretaria.

**Restrições:**
- Orçamento zero (plano free do Render).
- Equipe pequena — baixa complexidade operacional.
- Dados fortemente relacionais (turma → catequizando → presença).

---

## Decisão

Adotar o **Shared Database Pattern**: duas aplicações Spring Boot independentes consumindo o **mesmo banco PostgreSQL**, com responsabilidades separadas:

| Aplicação            | Pasta                        | Público        | Porta | Papel                          |
| -------------------- | ---------------------------- | -------------- | ----- | ------------------------------ |
| `backend-admin`      | `app-catequista/backend-admin/`   | Secretaria     | 8080  | Chamada, cadastros, relatórios |
| `backend-aluno`      | `app-catequizando/backend-aluno/` | Catequizandos  | 8081  | Consulta pública de frequência |

Cada app possui seu próprio frontend estático (`frontend-admin` / `frontend-aluno`) e seu próprio ciclo de vida (build, deploy e escala independentes).

### Estrutura do Monorepo

```
catequiza/
├── app-catequista/
│   ├── backend-admin/          # Spring Boot (Porta 8080)
│   └── frontend-admin/         # Interface web dos catequistas
├── app-catequizando/
│   ├── backend-aluno/          # Spring Boot (Porta 8081)
│   └── frontend-aluno/         # Interface web pública
├── docs/                       # Documentação
└── .github/workflows/          # Pipelines por-app
```

### Estratégia de migração (delegação do Flyway)

**Regra crítica de negócio:** para evitar locks e conflitos de migração no banco compartilhado, o Flyway é executado **apenas** pelo `backend-admin`:

- `backend-admin` → `spring.flyway.enabled=true` (dono do schema, executa `db/migration`).
- `backend-aluno` → `spring.flyway.enabled=false` (obrigatório; não possui dependência Flyway no pom).

Ambos usam `spring.jpa.hibernate.ddl-auto=validate`, garantindo que as entidades espelhadas sempre coincidam com o schema versionado.

### Mapeamento espelhado das entidades

As entidades JPA (`Turma`, `Catequizando`, `Presenca`) são replicadas **de forma idêntica** nos dois back-ends, com as mesmas tabelas, colunas e constraints — o que permite que qualquer app leia/escreva o mesmo schema sem divergência.

---

## Por que essa escolha?

### Resiliência do painel administrativo

O principal motivador é o **isolamento de recursos e falhas**: o `backend-aluno` absorve os picos de acesso da consulta pública, enquanto o `backend-admin` permanece disponível para a secretaria. Em hospedagem gratuita, onde não há auto-scaling, a separação física dos apps impede que um pico de alunos derrube o sistema administrativo.

### Custo zero e simplicidade

Um único PostgreSQL free no Render atende aos dois apps, sem custo de réplica ou banco separado. A equipe mantém **um schema, um conjunto de migrações** — simplicidade operacional para uma equipe pequena.

### Alternativas descartadas

| Alternativa                 | Motivo da rejeição                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------- |
| **Database-per-service**    | Duplicaria dados e exigiria sincronização; inviável no plano free e para dados fortemente relacionais. |
| **Event-driven (filas)**    | Complexidade desnecessária; o domínio é CRUD síncrono e de baixa concorrência de escrita. |
| **Monólito único (status quo)** | Pico de alunos compromete a secretaria; deploy acoplado para os dois públicos.     |

### Por que delegar o Flyway a um único app?

Com dois processos migrando o mesmo banco, haveria **corrida por locks de DDL**, `flyway_schema_history` com estado inconsistente e deploys quebrando o outro app. A delegação ao `backend-admin` (app de menor frequência de deploy e maior controle) centraliza as migrações em um único ponto versionado.

---

## Consequências

**Positivas:**
- Isolamento de falhas: pico de alunos não derruba a secretaria.
- Deploys e escalas independentes por app.
- Um único schema/migrações para gerenciar.
- CI/CD dividido por app economiza tempo de execução (filtros de paths).

**Negativas:**
- Acoplamento de schema: mudanças de modelo precisam ser compatíveis com os dois apps ao mesmo tempo.
- Rollback de migração afeta os dois apps.
- As entidades precisam ser mantidas espelhadas manualmente (mitigado por `ddl-auto=validate` e pelos testes dos dois back-ends).
- Sem isolamento de performance: uma consulta pesada em um app pode impactar o outro no mesmo banco.

---

## Referências

- [ADR 001 — Arquitetura de CI/CD](001-arquitetura-ci-cd.md)
- [ADR 002 — Configuração Externalizada do Banco](002-configuracao-externalizada-bd.md)
- [Flyway — Documentation](https://documentation.red-gate.com/flyway)
- [Microservices — Shared Database Pattern](https://microservices.io/patterns/data/shared-database.html)
- [Spring Boot — Database Initialization (Flyway)](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization)