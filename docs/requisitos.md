# 📋 Documento de Requisitos - Sistema Catequiza

Este documento detalha o escopo do projeto, definindo os atores, requisitos e regras de negócio para os módulos de Administração (Secretaria/Catequistas) e Portal Público (Alunos), operando sob a arquitetura de *Shared Database Pattern*.

## 👥 Atores do Sistema
* **Catequista / Secretaria (Admin):** Usuário com privilégios elevados. Gerencia os dados da paróquia, turmas e alunos.
* **Catequizando (Aluno):** Usuário restrito. Acessa apenas o portal público para autoatendimento e validação de presença.
* **Sistema (Automático):** Responsável por validações de segurança, expiração de tokens e controle de concorrência.

---

## ⚙️ Requisitos Funcionais (RF)

### Módulo Admin (`backend-admin`)
* **RF-01:** O sistema deve permitir o CRUD (Criar, Ler, Atualizar, Deletar) de Catequizandos.
* **RF-02:** O sistema deve permitir o CRUD de Turmas, incluindo a atribuição de catequistas responsáveis.
* **RF-03:** O sistema deve permitir matricular e transferir Catequizandos entre Turmas.
* **RF-04:** O sistema deve permitir o registro e a edição manual de Presenças/Faltas por parte do catequista.
* **RF-05:** O sistema deve gerar um PIN ou código de sessão único para habilitar a chamada do dia.
* **RF-06:** O sistema deve emitir relatórios de frequência detalhados por turma e por aluno.
* **RF-07:** O sistema deve realizar a autenticação e autorização de administradores via login e senha.

### Módulo Aluno (`backend-aluno`)
* **RF-08:** O sistema deve permitir que o Catequizando registre sua presença validando o PIN gerado pelo catequista.
* **RF-09:** O sistema deve permitir que o aluno consulte seu histórico individual de presenças e faltas.
* **RF-10:** O sistema deve exibir os dados básicos da turma do aluno (horário e local).

---

## 🏗️ Requisitos Não Funcionais (RNF)

* **RNF-01 (Arquitetura):** O sistema deve operar sob o padrão *Shared Database*, com serviços isolados.
* **RNF-02 (Desempenho):** Picos de requisições no portal do aluno (ex: todos registrando presença simultaneamente) não devem degradar a performance do painel administrativo.
* **RNF-03 (Segurança):** As APIs do administrador devem ser protegidas pelo *Spring Security* utilizando tokens JWT (JSON Web Token).
* **RNF-04 (Persistência):** O gerenciamento estrutural do banco PostgreSQL (DML/DDL) deve ser feito exclusivamente pelo `backend-admin` através do *Flyway*.
* **RNF-05 (DevOps):** O processo de *deploy* deve ser automatizado via *GitHub Actions* para as instâncias de produção.

---

## 📜 Regras de Negócio (RN)

* **RN-01:** O registro de presença via PIN no app do aluno só é válido se a sessão de chamada correspondente estiver com o status "Ativa" no painel do catequista.
* **RN-02:** Um Catequizando não pode ser excluído permanentemente (exclusão física) do banco de dados caso possua um histórico de presenças vinculado; deve-se utilizar exclusão lógica (status inativo).
* **RN-03:** Um aluno só pode computar presença para a Turma na qual está ativamente matriculado.