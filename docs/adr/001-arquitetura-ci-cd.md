# ADR 001: Arquitetura de CI/CD — GitHub Actions + Docker Hub + Render

| Campo        | Valor                                      |
| ------------ | ------------------------------------------ |
| **Status**   | Aceito ✅                                  |
| **Data**     | 2026-08-25                                 |
| **Decisor**  | Eduardo (Tech Lead)                        |

---

## Contexto

O projeto Catequiza precisa de uma esteira de CI/CD que:
1. Valide o código automaticamente (lint, testes) antes de ser incorporado.
2. Build e publique imagens Docker.
3. Faça deploy automático no ambiente de hospedagem.
4. Funcione integrada ao fluxo Git (branches `dev`, `homolog`, `main`).

**Restrições:**
- Orçamento limitado.
- Equipe familiarizada com GitHub.
- Baixa complexidade operacional.

---

## Decisão

| Camada             | Tecnologia                          |
| ------------------ | ----------------------------------- |
| CI Engine          | GitHub Actions                      |
| Container Registry | Docker Hub                          |
| Hospedagem         | Render (Web Service + Managed DB)   |

### Workflows implementados

#### `lint-backend.yml` — Análise estática

- **Trigger:** PR ou push em `dev` (quando `backend/` é alterado).
- **Ação:** `mvn validate process-classes`

#### `test-backend.yml` — Testes automatizados

- **Trigger:** PR que altera `backend/`.
- **Ação:** Sobe PostgreSQL 16 como *service container* do GitHub Actions e executa `mvn test`.

#### `deploy-backend-dev.yml` — Build e deploy

- **Trigger:** Push em `dev`.
- **Ações:**
  1. Build da imagem Docker (multi-stage: Maven → JRE).
  2. Push para Docker Hub com tag `dev`.
  3. Dispara o **Deploy Hook** do Render via `curl`.

#### `validate-pr-source.yml` — Validação de origem

- **Trigger:** PR para `homolog` ou `main`.
- **Validação:**
  - PR para `homolog` deve vir de `dev`.
  - PR para `main` deve vir de `homolog`.

### Fluxo visual

```
feat/minha-feature (branch local)
        │
        ▼
   PR → dev
        │
   ┌────┴─────────────────────────────────┐
   │  ✅ lint-backend.yml                 │
   │  ✅ test-backend.yml                 │
   └────┬─────────────────────────────────┘
        │
   Merge em dev
        │
        ▼
   deploy-backend-dev.yml
   ┌──────────────────────────────────────┐
   │  🐳 Docker build → Docker Hub       │
   │  🔗 Deploy Hook → Render            │
   └──────────────────────────────────────┘
        │
        ▼
   Render: baixa nova imagem e reinicia o serviço
```

---

## Por que essa escolha?

### GitHub Actions

- Gratuito para repositórios públicos.
- Integração nativa com GitHub — zero configuração externa.
- Suporta *service containers* (PostgreSQL para testes).

**Alternativa descartada:** Jenkins (exige infraestrutura self-hosted, complexidade desnecessária).

### Docker Hub

- Gratuito no plano básico.
- Render faz pull direto do Docker Hub — sem configuração intermediária.

### Render

- Plano Free disponível para Web Service e PostgreSQL.
- Suporta **Deploy Hook** — o GitHub Actions dispara o deploy via `POST` em uma URL secreta.
- Imagem Docker aceita nativamente.

**Alternativas descartadas:** Railway (sem plano free permanente), Fly.io (mais complexo), Heroku (plano free descontinuado).

---

## Consequências

**Positivas:**
- Deploy automático a cada push em `dev`.
- Pipeline única dentro do GitHub, sem ferramentas externas.
- Custo zero no plano free.

**Negativas:**
- Render entra em *sleep* após 15 min de inatividade (~30s de cold start).
- Docker Hub tem rate limit de pulls no plano free.

---

## Referências

- [GitHub Actions](https://docs.github.com/en/actions)
- [Render — Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Docker Hub — Rate Limits](https://docs.docker.com/docker-hub/download-rate-limit/)
