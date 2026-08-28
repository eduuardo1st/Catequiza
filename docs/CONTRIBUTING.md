# 🤝 Contribuindo para o Catequiza

Acordos de trabalho da equipe: fluxo de branches, nomenclatura de commits e padrões de Pull Request.

---

## 🌿 Branches

Três branches protegidas, em ordem de maturidade:

```
main (produção)
  ↑
homolog (validação)
  ↑
dev (desenvolvimento ativo)
```

| Branch      | Finalidade                                          |
| ----------- | --------------------------------------------------- |
| `dev`       | Branch principal de desenvolvimento. Pushes disparam CI/CD e deploy automático no Render. |
| `homolog`   | Valização antes da produção. Recebe PRs apenas de `dev`. |
| `main`      | Produção. Recebe PRs apenas de `homolog`.           |

### Regra de origem dos PRs

Validada automaticamente pelo workflow `validate-pr-source.yml`:

- PR para `homolog` **deve** vir de `dev`.
- PR para `main` **deve** vir de `homolog`.

---

## 🏷 Nomenclatura de Branches

Padrão: `<tipo>/<descrição-curta>`

```
feat/adicionar-tela-de-chamada
fix/corrigir-calculo-de-frequencia
chore/atualizar-dependencias
docs/adicionar-adr-ci-cd
refactor/extrair-service-de-attendance
test/adicionar-testes-de-controller
```

**Tipos aceitos:**

| Prefixo     | Quando usar                                     |
| ----------- | ----------------------------------------------- |
| `feat/`     | Nova funcionalidade                             |
| `fix/`      | Correção de bug                                 |
| `chore/`    | Manutenção (dependências, configs, CI)          |
| `docs/`     | Documentação                                    |
| `refactor/` | Refatoração sem mudança de comportamento        |
| `test/`     | Adição ou ajuste de testes                      |

---

## ✍️ Commits — Conventional Commits

Todas as mensagens devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]
```

### Tipos

| Tipo       | Exemplo                                          |
| ---------- | ------------------------------------------------ |
| `feat`     | `feat(backend): adicionar endpoint de turmas`    |
| `fix`      | `fix(frontend): corrigir toggle de presença`     |
| `docs`     | `docs: adicionar ADR de CI/CD`                   |
| `chore`    | `chore: atualizar Spring Boot para 4.1.1`        |
| `refactor` | `refactor: extrair lógica de validação`          |
| `test`     | `test: adicionar teste unitário para UserController` |

### Regras

- Usar **imperativo** no início: "adicionar", não "adicionado".
- Máx. 72 caracteres na primeira linha.
- Escopo é opcional: `feat(backend)`, `fix(frontend)`.

---

## 📬 Pull Requests

### Título

Seguir o padrão de commit:

```
feat(backend): adicionar CRUD de turmas
fix(frontend): corrigir layout mobile na tela de consulta
```

### Regras

1. **Um PR = uma funcionalidade ou correção** — PRs grandes e multifuncionais dificultam a revisão.
2. **PRs para `dev`** são o ponto de entrada padrão.
3. **Mínimo 1 approval** antes de merge.
4. **Squash merge** recomendado para manter o histórico limpo.
