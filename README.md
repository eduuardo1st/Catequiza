# ⛪ Catequiza

Sistema de gestão de registros de paróquia e catequese — secretaria, catequistas e alunos.

O **Catequiza** está em fase inicial de desenvolvimento. Hoje o projeto conta com a infraestrutura completa (backend, frontend, CI/CD e hospedagem) pronta para receber a implementação das funcionalidades.

---

## 🛠 Stack

| Camada        | Tecnologia                                   |
| ------------- | -------------------------------------------- |
| Backend       | Java 21, Spring Boot 4.1.1, Maven            |
| ORM           | Spring Data JPA + Hibernate                  |
| Banco         | PostgreSQL 16                                |
| Frontend      | HTML/CSS/JS estático + Nginx Alpine          |
| Containers    | Docker (multi-stage build)                   |
| CI/CD         | GitHub Actions                               |
| Hospedagem    | Render (Web Service + Managed PostgreSQL)    |
| Registros     | Docker Hub                                   |

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

O Hibernate cria e atualiza as tabelas automaticamente (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Rode o Backend

```bash
cd backend
./mvnw spring-boot:run
```

Disponível em **http://localhost:8080**.

### 4. Rode o Frontend

```bash
cd frontend
docker run -d --name catequiza-frontend -p 3000:80 nginx:alpine
```

Disponível em **http://localhost:3000**.

---

## 🔑 Variáveis de Ambiente

Em **produção** (Render), o Spring Boot lê variáveis de ambiente via **Relaxed Binding**, sobrescrevendo os valores definidos no `application.properties`.

| Variável                          | Descrição                                  |
| --------------------------------- | ------------------------------------------ |
| `SPRING_DATASOURCE_URL`           | URL de conexão com o PostgreSQL            |
| `SPRING_DATASOURCE_USERNAME`      | Usuário do banco de dados                  |
| `SPRING_DATASOURCE_PASSWORD`      | Senha do banco de dados                    |
| `DOCKER_USERNAME`                 | Usuário Docker Hub (GitHub Actions)        |
| `DOCKER_PASSWORD`                 | Senha Docker Hub (GitHub Actions)          |
| `RENDER_DEPLOY_HOOK_URL_BACKEND`  | URL do Deploy Hook do Render (Actions)     |

> **Por que funciona sem alterar código?**
> Localmente, o `application.properties` aponta para `localhost:5432` com credenciais fixas para testes. No Render, as variáveis `SPRING_DATASOURCE_*` são definidas no painel e o Spring Boot as prioriza automaticamente sobre o arquivo.

---

## 📁 Estrutura do Monorepo

```
catequiza/
├── .github/workflows/      # Pipelines de CI/CD
│   ├── deploy-backend-dev.yml
│   ├── lint-backend.yml
│   ├── test-backend.yml
│   └── validate-pr-source.yml
├── backend/                 # Java 21 + Spring Boot (esqueleto)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── frontend/                # HTML estático + Nginx
│   ├── Dockerfile
│   └── index.html
├── docs/                    # Documentação do projeto
├── LICENSE
└── README.md
```

---

## 🔄 CI/CD

| Workflow                | Trigger                          | O que faz                                          |
| ----------------------- | -------------------------------- | -------------------------------------------------- |
| `lint-backend.yml`      | PR ou push em `dev`              | `mvn validate process-classes`                     |
| `test-backend.yml`      | PR que altera `backend/`         | Sobe PostgreSQL 16 e roda `mvn test`               |
| `deploy-backend-dev.yml`| Push em `dev`                    | Build Docker → Docker Hub → Deploy Hook no Render  |
| `validate-pr-source.yml`| PR para `homolog` ou `main`      | Valida origem do PR (fluxo `dev→homolog→main`)      |

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
feat: adicionar esqueleto do projeto Spring Boot
chore: configurar pipeline de CI/CD
docs: adicionar documentação inicial
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
