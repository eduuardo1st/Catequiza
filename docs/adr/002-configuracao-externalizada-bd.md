# ADR 002: Configuração Externalizada do Banco de Dados — Relaxed Binding

| Campo        | Valor                                      |
| ------------ | ------------------------------------------ |
| **Status**   | Aceito ✅                                  |
| **Data**     | 2026-08-25                                 |

---

## Contexto

O projeto utiliza PostgreSQL tanto em testes automatizados (CI/local) quanto em produção (Render). As duas APIs Spring Boot (`backend-admin` e `backend-aluno`) compartilham o **mesmo banco** (Shared Database Pattern — ver [ADR 003](003-shared-database-pattern.md)). As credenciais são completamente diferentes entre esses ambientes, e as credenciais de produção não podem ficar no repositório.

**Problema central:** Como configurar o banco de dados compartilhado de forma que funcione imediatamente em desenvolvimento e em produção, sem expor credenciais sensíveis.

---

## Decisão

Utilizar **configuração dual**:

1. **Localmente:** Valores fixos no `application.properties` para testes.
2. **Em produção:** Variáveis de ambiente via **Relaxed Binding** do Spring Boot.

### Configuração local (`application.properties`)

Ambos os back-ends usam a mesma base (diferindo em `server.port`: 8080 no admin, 8081 no aluno):

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:catequiza-test}
spring.datasource.username=${DB_USERNAME:catequiza}
spring.datasource.password=${DB_PASSWORD:catequiza}
spring.jpa.hibernate.ddl-auto=validate
```

> **Flyway:** `spring.flyway.enabled=true` apenas no `backend-admin` (dono do schema); no `backend-aluno` é **obrigatório** `spring.flyway.enabled=false` (ver [ADR 003](003-shared-database-pattern.md)).

### Variáveis de ambiente (Render)

| Variável de Ambiente            | Propriedade equivalente          |
| ------------------------------- | -------------------------------- |
| `SPRING_DATASOURCE_URL`         | `spring.datasource.url`          |
| `SPRING_DATASOURCE_USERNAME`    | `spring.datasource.username`     |
| `SPRING_DATASOURCE_PASSWORD`    | `spring.datasource.password`     |
| `DB_HOST` / `DB_PORT` / `DB_NAME` | Interpoladas dentro de `spring.datasource.url` |
| `DB_USERNAME` / `DB_PASSWORD`   | Interpoladas dentro de `spring.datasource.username/password` |
| `SPRING_FLYWAY_ENABLED`         | `spring.flyway.enabled` (true no admin, false no aluno) |

### Como funciona o Relaxed Binding

O Spring Boot converte automaticamente propriedades do `application.properties` em variáveis de ambiente:

```
spring.datasource.url  →  SPRING_DATASOURCE_URL
```

**Regra:** pontos viram underscores, tudo em caixa alta, com prefixo `SPRING_`.

**Precedência (maior → menor):**
1. Variáveis de ambiente ← **Produção**
2. Argumentos de linha de comando
3. Propriedades do sistema
4. `application.properties` ← **Local**

Quando a variável de ambiente existe, ela **sempre vence**. Quando não existe, o valor do arquivo é usado — garantindo que o dev local funcione sem configuração extra.

---

## Por que essa escolha?

### Alternativas descartadas

**Perfil `application-prod.properties`** — Exporia credenciais de produção no repositório.

**Arquivo `.env` com dotenv** — Requer dependência adicional e `.gitignore` rigoroso.

### Vantagens da escolha

- Credenciais de produção **nunca ficam no repositório**.
- Funcionamento imediato em dev local — sem variáveis extras.
- Padrão nativo do Spring Boot, sem dependências adicionais.
- Alinhado com a metodologia [12-Factor App](https://12factor.net/config).

---

## Consequências

**Positivas:**
- Zero configuração local para novos desenvolvedores.
- Deploy no Render é apenas preencher variáveis no painel.

**Negativas:**
- Variáveis de ambiente são invisíveis no código — mitigado pela documentação neste ADR e no README.

---

## Referências

- [Spring Boot — Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config)
- [Spring Boot — Relaxed Binding](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config.typesafe-configuration-properties.relaxed-binding)
- [Render — Environment Variables](https://render.com/docs/environment-variables)
