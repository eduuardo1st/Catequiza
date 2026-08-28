# ADR 002: Configuração Externalizada do Banco de Dados — Relaxed Binding

| Campo        | Valor                                      |
| ------------ | ------------------------------------------ |
| **Status**   | Aceito ✅                                  |
| **Data**     | 2026-08-25                                 |

---

## Contexto

O projeto utiliza PostgreSQL tanto em testes automatizados (CI/local) quanto em produção (Render). As credenciais são completamente diferentes entre esses ambientes, e as credenciais de produção não podem ficar no repositório.

**Problema central:** Como configurar o banco de dados de forma que funcione imediatamente em desenvolvimento e em produção, sem expor credenciais sensíveis.

---

## Decisão

Utilizar **configuração dual**:

1. **Localmente:** Valores fixos no `application.properties` para testes.
2. **Em produção:** Variáveis de ambiente via **Relaxed Binding** do Spring Boot.

### Configuração local (`application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/catequiza-test
spring.datasource.username=catequiza
spring.datasource.password=catequiza
spring.jpa.hibernate.ddl-auto=update
```

### Variáveis de ambiente (Render)

| Variável de Ambiente            | Propriedade equivalente          |
| ------------------------------- | -------------------------------- |
| `SPRING_DATASOURCE_URL`         | `spring.datasource.url`          |
| `SPRING_DATASOURCE_USERNAME`    | `spring.datasource.username`     |
| `SPRING_DATASOURCE_PASSWORD`    | `spring.datasource.password`     |

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
