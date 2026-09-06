# ⛪ Catequiza

Sistema de gestão de registros de paróquia e catequese — secretaria, catequistas e alunos.

O **Catequiza** está em fase inicial de desenvolvimento. O projeto segue a arquitetura **Shared Database Pattern**: duas APIs Spring Boot independentes compartilhando o mesmo banco PostgreSQL, com isolamento de recursos entre o painel administrativo (secretaria/catequistas) e a consulta pública dos catequizandos (ver [ADR 003](docs/adr/003-shared-database-pattern.md)).

---

## 🛠 Stack

| Camada        | Tecnologia                                   |
| ------------- | -------------------------------------------- |
| Backends      | Java 21, Spring Boot 3.3.2, Maven            |
| ORM           | Spring Data JPA + Hibernate                  |
| Migrações     | Flyway (somente no backend-admin)            |
| Banco         | PostgreSQL 16 (compartilhado entre os apps)  |
| Frontends     | HTML/CSS/JS estático + Nginx Alpine          |
| Containers    | Docker (multi-stage build)                   |
| CI/CD         | GitHub Actions                               |
| Hospedagem    | Render (Web Service + Managed PostgreSQL)    |
| Registros     | Docker Hub                                   |

---

## 📁 Estrutura do Monorepo

```
catequiza/
├── app-catequista/                # Aplicativo da secretaria/catequistas
│   ├── backend-admin/             # Spring Boot — Porta 8080
│   │   └── src/main/resources/db/migration/   # Migrações Flyway (única origem)
│   └── frontend-admin/            # Interface web dos catequistas (Nginx)
├── app-catequizando/              # Aplicativo público dos alunos
│   ├── backend-aluno/             # Spring Boot — Porta 8081 (Flyway desabilitado)
│   └── frontend-aluno/            # Interface web pública de consulta (Nginx)
├── .github/workflows/             # Pipelines por-app com filtros de paths
│   ├── lint-backend-admin.yml
│   ├── lint-backend-aluno.yml
│   ├── test-backend-admin.yml
│   ├── test-backend-aluno.yml
│   ├── deploy-backend-admin-dev.yml
│   ├── deploy-backend-aluno-dev.yml
│   └── validate-pr-source.yml
├── docs/                          # Documentação (ADRs, diagramas, logos)
└── README.md
```

---

## ✅ Pré-requisitos

- **Java 21** (JDK) — [Eclipse Temurin](https://adoptium.net/)
- **Docker** — [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git**

---

## 🚀 Primeiros Passos

### 1. Clone o repositório

```bash
git clone https://github.com/seu-org/catequiza.git
cd catequiza
git checkout dev
```

### 2. Suba o banco de dados (PostgreSQL via Docker)

```bash
docker run -d \
  --name catequiza-db \
  -e POSTGRES_DB=catequiza-test \
  -e POSTGRES_USER=catequiza \
  -e POSTGRES_PASSWORD=catequiza \
  -p 5432:5432 \
  postgres:16-alpine
```

> O schema é criado pelo **Flyway** (somente o `backend-admin` executa migrações). O Hibernate opera com `ddl-auto=validate` nos dois apps.

### 3. Rode o Backend da secretaria (Porta 8080)

```bash
cd app-catequista/backend-admin
./mvnw spring-boot:run
```

Disponível em **http://localhost:8080**.

### 4. Rode o Backend público dos alunos (Porta 8081)

```bash
cd app-catequizando/backend-aluno
./mvnw spring-boot:run
```

Disponível em **http://localhost:8081**.

### 5. Rode os Frontends (Nginx)

```bash
cd app-catequista/frontend-admin
docker run -d --name catequiza-frontend-admin -p 3000:80 nginx:alpine

cd app-catequizando/frontend-aluno
docker run -d --name catequiza-frontend-aluno -p 3001:80 nginx:alpine
```

---

## 🔑 Variáveis de Ambiente

Em **produção** (Render), o Spring Boot lê variáveis de ambiente via **Relaxed Binding**, sobrescrevendo os valores definidos no `application.properties`.

| Variável                          | Descrição                                        |
| --------------------------------- | ------------------------------------------------ |
| `SPRING_DATASOURCE_URL`           | URL de conexão com o PostgreSQL compartilhado    |
| `SPRING_DATASOURCE_USERNAME`      | Usuário do banco de dados                        |
| `SPRING_DATASOURCE_PASSWORD`      | Senha do banco de dados                          |
| `SPRING_FLYWAY_ENABLED`           | `true` no backend-admin / `false` no backend-aluno |
| `DOCKER_USERNAME`                 | Usuário Docker Hub (GitHub Actions)              |
| `DOCKER_PASSWORD`                 | Senha Docker Hub (GitHub Actions)                |
| `RENDER_DEPLOY_HOOK_URL_BACKEND_ADMIN` | Deploy Hook do Render (backend-admin)       |
| `RENDER_DEPLOY_HOOK_URL_BACKEND_ALUNO`  | Deploy Hook do Render (backend-aluno)       |

> **Por que funciona sem alterar código?** Localmente, o `application.properties` usa `DB_HOST=localhost`, `DB_PORT=5432`, `DB_NAME=catequiza-test` e credenciais fixas para testes. No Render, as variáveis `SPRING_DATASOURCE_*` são definidas no painel e o Spring Boot as prioriza automaticamente.

---

## 🔄 CI/CD

| Workflow                       | Trigger                          | O que faz                                              |
| ------------------------------ | -------------------------------- | ------------------------------------------------------ |
| `lint-backend-admin.yml`       | PR ou push em `dev` (path `app-catequista/backend-admin/**`) | `mvn validate process-classes`        |
| `lint-backend-aluno.yml`       | PR ou push em `dev` (path `app-catequizando/backend-aluno/**`) | `mvn validate process-classes`     |
| `test-backend-admin.yml`       | PR (path `app-catequista/backend-admin/**`) | PostgreSQL 16 + `mvn test` (Flyway valida migrações) |
| `test-backend-aluno.yml`       | PR (path `app-catequizando/backend-aluno/**`) | PostgreSQL 16 + `mvn test`          |
| `deploy-backend-admin-dev.yml` | Push em `dev` (path `app-catequista/backend-admin/**`) | Docker Hub (`catequiza-backend-admin:dev`) → Render |
| `deploy-backend-aluno-dev.yml` | Push em `dev` (path `app-catequizando/backend-aluno/**`) | Docker Hub (`catequiza-backend-aluno:dev`) → Render |
| `validate-pr-source.yml`       | PR para `homolog` ou `main`      | Valida origem do PR (fluxo `dev→homolog→main`)          |

> Os filtros de `paths` garantem que uma alteração no app do catequizando **não** dispare as pipelines do app do catequista (e vice-versa).

---

## 🌿 Estratégia de Git

```
main (produção)
  ↑
homolog (validação)
  ↑
dev (desenvolvimento)
```

Mensagens de commit seguem **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
feat(backend-admin): adicionar CRUD de turmas
fix(frontend-aluno): corrigir layout da consulta pública
chore: configurar pipeline de CI/CD
docs: adicionar ADR 003 (Shared Database Pattern)
```

---

## 👥 Equipe

| Nome              |
| ----------------- |
| Eduardo           |
| Davi Albernaz     |
| Davi Castro       |
| Arthur Vieira     |

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE).